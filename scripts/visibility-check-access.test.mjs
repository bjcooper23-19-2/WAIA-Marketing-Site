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
const endpoint = "https://script.google.com/macros/s/example123/exec";

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
    WEB_APP_URL: endpoint,
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
  assert.ok(drafts[0][2].includes(`${endpoint}?token=${rows[1][5]}`));
  assert.ok(!drafts[0][2].includes("Ada@Example.com"));
  assert.ok(Date.parse(rows[1][10]) - Date.parse(rows[1][0]) === 7 * 86400000);
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

test("GET only confirms; deliberate redemption works once", () => {
  const { context, rows } = harness();
  context.doPost(event(submission()));
  const token = rows[1][5];
  const page = context.doGet({ parameter: { token } });
  assert.match(page.html, /Your Workplace AI Visibility Check is ready/);
  assert.match(page.html, /Continue to the Visibility Check/);
  assert.equal(rows[1][6], "unused");
  assert.equal(context.redeemAccess(token).ok, true);
  assert.equal(rows[1][6], "redeemed");
  assert.ok(Date.parse(rows[1][9]));
  assert.equal(context.redeemAccess(token).ok, false);
  assert.match(
    context.doGet({ parameter: { token } }).html,
    /no longer active/,
  );
});

test("expired and unknown tokens fail cleanly; fresh request can be issued", () => {
  const { context, rows, drafts } = harness();
  context.doPost(event(submission()));
  const token = rows[1][5];
  rows[1][10] = new Date(Date.now() - 1000).toISOString();
  assert.match(
    context.doGet({ parameter: { token } }).html,
    /no longer active/,
  );
  assert.equal(context.redeemAccess(token).ok, false);
  assert.match(
    context.doGet({ parameter: { token: "f".repeat(96) } }).html,
    /no longer active/,
  );
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
  assert.match(
    article,
    /class="insight-tool-cta"[\s\S]*href="\/workplace-ai-visibility-check\/"/,
  );
  assert.match(landing, /Request access/);
  assert.match(start, /Access is not immediate/);
  assert.doesNotMatch(start, /href="\/workplace-ai-visibility-check\/check\/"/);
});
