import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";

const source = readFileSync(
  new URL("../automation/visibility-check-access/Code.gs", import.meta.url),
  "utf8",
);
const headers = [
  "Requested at",
  "First name",
  "Email",
  "Organisation",
  "Tally response ID",
  "Token",
  "Token status",
  "Draft created at",
  "Sent at",
  "Redeemed at",
  "Expires at",
  "Notes",
];
const secret = "a".repeat(64);
const accessPage = "https://waia.co.uk/workplace-ai-visibility-check/access/";

function harness() {
  const rows = [headers];
  const drafts = [];
  let nextUuid = 0;
  const sheet = {
    getLastRow: () => rows.length,
    getRange(row, column, height = 1, width = 1) {
      return {
        getValues: () =>
          rows
            .slice(row - 1, row - 1 + height)
            .map((values) => values.slice(column - 1, column - 1 + width)),
        setValue: (value) => {
          rows[row - 1][column - 1] = value;
        },
      };
    },
    appendRow: (row) => rows.push(row),
  };
  const properties = {
    SHEET_ID: "test-sheet",
    WEBHOOK_SECRET: secret,
    TALLY_FORM_ID: "form123",
  };
  const context = vm.createContext({
    PropertiesService: {
      getScriptProperties: () => ({
        getProperties: () => properties,
        getProperty: (key) => properties[key],
      }),
    },
    SpreadsheetApp: {
      openById: (id) => {
        assert.equal(id, "test-sheet");
        return {
          getSheetByName: (name) => (name === "Requests" ? sheet : null),
        };
      },
    },
    GmailApp: {
      getDrafts: () => drafts,
      createDraft: (...args) => drafts.push(args),
    },
    Utilities: {
      getUuid: () => {
        nextUuid += 1;
        return `${nextUuid.toString(16).padStart(8, "0")}-aaaa-4aaa-8aaa-aaaaaaaaaaaa`;
      },
    },
    LockService: {
      getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }),
    },
    ContentService: {
      MimeType: { JAVASCRIPT: "javascript" },
      createTextOutput: (text) => ({
        text,
        setMimeType() {
          return this;
        },
      }),
    },
    HtmlService: {
      createHtmlOutput: (html) => ({
        html,
        text: html,
        setTitle() {
          return this;
        },
      }),
    },
  });
  vm.runInContext(source, context);
  return { context, rows, drafts, properties };
}

function submission(responseId = "response123", email = "Ada@Example.com") {
  return JSON.stringify({
    eventType: "FORM_RESPONSE",
    data: {
      formId: "form123",
      responseId,
      fields: [
        { label: "First name", value: "Ada" },
        { label: "Work email", value: email },
        { label: "Organisation", value: "Example Ltd" },
      ],
    },
  });
}

function event(body, key = secret) {
  return {
    parameter: { webhook_key: key },
    postData: {
      type: "application/json",
      contents: body,
    },
  };
}

test("valid Tally request makes one ledger row and a Gmail draft, never sends", () => {
  const { context, rows, drafts } = harness();
  assert.equal(
    context.doPost(event(submission())).text,
    "Recorded; draft created",
  );
  assert.equal(rows.length, 2);
  assert.equal(rows[1][2], "ada@example.com");
  assert.equal(rows[1][6], "unused");
  assert.match(rows[1][5], /^[0-9a-f]{96}$/);
  assert.equal(drafts.length, 1);
  assert.equal(drafts[0][0], "ada@example.com");
  assert.match(drafts[0][2], /^Hi Ada,/);
  assert.ok(drafts[0][2].includes(`${accessPage}?token=${rows[1][5]}`));
  assert.ok(!drafts[0][2].includes("script.google.com"));
  assert.ok(!drafts[0][2].includes("Ada@Example.com"));
  assert.ok(Date.parse(rows[1][10]) - Date.parse(rows[1][0]) === 7 * 86400000);
});

test("Apps Script contains no recipient-facing access page", () => {
  assert.doesNotMatch(source, /Your Workplace AI Visibility Check is ready/);
  assert.doesNotMatch(source, /Continue to the Visibility Check/);
  assert.match(source, /ContentService\.MimeType\.JAVASCRIPT/);
});

test("unauthorised, malformed, wrong-form and invalid-field requests add nothing", () => {
  const { context, rows, drafts } = harness();
  assert.equal(
    context.doPost(event(submission(), "wrong")).text,
    "Request rejected",
  );
  assert.equal(context.doPost(event("{")).text, "Invalid payload");
  const wrongForm = JSON.parse(submission());
  wrongForm.data.formId = "another";
  assert.equal(
    context.doPost(event(JSON.stringify(wrongForm))).text,
    "Invalid payload",
  );
  assert.equal(
    context.doPost(event(submission("r2", "fake"))).text,
    "Invalid payload",
  );
  assert.equal(rows.length, 1);
  assert.equal(drafts.length, 0);
});

test("Tally retries and duplicate active email do not create more drafts", () => {
  const { context, rows, drafts } = harness();
  context.doPost(event(submission()));
  assert.equal(context.doPost(event(submission())).text, "Already recorded");
  assert.equal(
    context.doPost(event(submission("response456"))).text,
    "Active request already exists",
  );
  assert.equal(rows.length, 2);
  assert.equal(drafts.length, 1);
});

test("backend redemption callback works once and does not expose personal data", () => {
  const { context, rows } = harness();
  context.doPost(event(submission()));
  const token = rows[1][5];
  assert.equal(rows[1][6], "unused");
  assert.equal(
    context.doGet({
      parameter: { token, callback: "waiaVisibilityAccessCallback" },
    }).text,
    'waiaVisibilityAccessCallback({"ok":false});',
  );
  assert.equal(rows[1][6], "unused");
  const first = context.doGet({
    parameter: {
      action: "redeem",
      token,
      callback: "waiaVisibilityAccessCallback",
    },
  });
  assert.equal(first.text, 'waiaVisibilityAccessCallback({"ok":true});');
  assert.doesNotMatch(first.text, /Ada|example|Organisation|Token/);
  assert.equal(rows[1][6], "redeemed");
  assert.ok(Date.parse(rows[1][9]));
  assert.equal(
    context.doGet({
      parameter: {
        action: "redeem",
        token,
        callback: "waiaVisibilityAccessCallback",
      },
    }).text,
    'waiaVisibilityAccessCallback({"ok":false});',
  );
});

test("expired, unknown and malformed callback requests fail cleanly", () => {
  const { context, rows, drafts } = harness();
  context.doPost(event(submission()));
  const token = rows[1][5];
  rows[1][10] = new Date(Date.now() - 1000).toISOString();
  assert.equal(
    context.doGet({
      parameter: {
        action: "redeem",
        token,
        callback: "waiaVisibilityAccessCallback",
      },
    }).text,
    'waiaVisibilityAccessCallback({"ok":false});',
  );
  assert.equal(
    context.doGet({
      parameter: {
        action: "redeem",
        token: "f".repeat(96),
        callback: "waiaVisibilityAccessCallback",
      },
    }).text,
    'waiaVisibilityAccessCallback({"ok":false});',
  );
  assert.equal(
    context.doGet({
      parameter: { action: "redeem", token, callback: "alert(1)" },
    }).text,
    "/* invalid callback */",
  );
  assert.equal(rows[1][6], "unused");
});

test("a fresh request can be issued after expiry", () => {
  const { context, rows, drafts } = harness();
  context.doPost(event(submission()));
  rows[1][10] = new Date(Date.now() - 1000).toISOString();
  assert.equal(
    context.doPost(event(submission("response456"))).text,
    "Recorded; draft created",
  );
  assert.equal(rows.length, 3);
  assert.equal(drafts.length, 2);
  assert.notEqual(rows[1][5], rows[2][5]);
});

test("site pages show request journey and generated Insight CTA points to landing", () => {
  const article = readFileSync(
    new URL(
      "../insights/ai-adoption-is-rising-is-it-working/index.html",
      import.meta.url,
    ),
    "utf8",
  );
  const landing = readFileSync(
    new URL("../workplace-ai-visibility-check/index.html", import.meta.url),
    "utf8",
  );
  const start = readFileSync(
    new URL(
      "../workplace-ai-visibility-check/start/index.html",
      import.meta.url,
    ),
    "utf8",
  );
  const access = readFileSync(
    new URL(
      "../workplace-ai-visibility-check/access/index.html",
      import.meta.url,
    ),
    "utf8",
  );
  const accessScript = readFileSync(
    new URL("../assets/js/visibility-check-access.mjs", import.meta.url),
    "utf8",
  );
  assert.match(
    article,
    /class="insight-tool-cta"[\s\S]*href="\/workplace-ai-visibility-check\/"/,
  );
  assert.match(landing, /Request access/);
  assert.match(start, /Access is not immediate/);
  assert.doesNotMatch(start, /href="\/workplace-ai-visibility-check\/check\/"/);
  assert.match(access, /name="robots" content="noindex, nofollow"/);
  assert.match(access, /Continue to the Visibility Check/);
  assert.match(access, /visibility-check-access\.mjs/);
  assert.doesNotMatch(access, /cloudflareinsights/);
  assert.match(accessScript, /addEventListener\("click"/);
  assert.match(accessScript, /action", "redeem"/);
  assert.match(accessScript, /location\.assign\(checkPath\)/);
  assert.doesNotMatch(accessScript, /fetch\(/);
});
