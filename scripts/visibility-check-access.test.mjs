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
const proxySecret = "b".repeat(64);
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
    PROXY_SECRET: proxySecret,
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
      MimeType: { JSON: "application/json" },
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

function redemptionEvent(token, key = proxySecret) {
  return {
    parameter: { action: "redeem" },
    postData: {
      type: "application/json",
      contents: JSON.stringify({ token, proxy_secret: key }),
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
  assert.match(drafts[0][2], /expires after one use or after seven days\./);
  assert.equal(typeof drafts[0][3], "object");
  assert.match(drafts[0][3].htmlBody, /Open the Workplace AI Visibility Check/);
  assert.ok(
    drafts[0][3].htmlBody.includes(`${accessPage}?token=${rows[1][5]}`),
  );
  assert.ok(!drafts[0][2].includes("Ada@Example.com"));
  assert.ok(Date.parse(rows[1][10]) - Date.parse(rows[1][0]) === 7 * 86400000);
});

test("Apps Script contains no recipient-facing access page", () => {
  assert.doesNotMatch(source, /Your Workplace AI Visibility Check is ready/);
  assert.doesNotMatch(source, /Continue to the Visibility Check/);
  assert.match(source, /ContentService\.MimeType\.JSON/);
  assert.doesNotMatch(source, /JSONP|callback/i);
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

test("backend redemption works once and does not expose personal data", () => {
  const { context, rows } = harness();
  context.doPost(event(submission()));
  const token = rows[1][5];
  assert.equal(rows[1][6], "unused");
  const first = context.doPost(redemptionEvent(token));
  assert.equal(first.text, '{"ok":true}');
  assert.doesNotMatch(first.text, /Ada|example|Organisation|Token/);
  assert.equal(rows[1][6], "redeemed");
  assert.ok(Date.parse(rows[1][9]));
  assert.equal(context.doPost(redemptionEvent(token)).text, '{"ok":false}');
});

test("expired, unknown, malformed and unauthorised redemptions fail cleanly", () => {
  const { context, rows, drafts } = harness();
  context.doPost(event(submission()));
  const token = rows[1][5];
  rows[1][10] = new Date(Date.now() - 1000).toISOString();
  assert.equal(context.doPost(redemptionEvent(token)).text, '{"ok":false}');
  assert.equal(
    context.doPost(redemptionEvent("f".repeat(96))).text,
    '{"ok":false}',
  );
  assert.equal(
    context.doPost(redemptionEvent(token, "wrong")).text,
    '{"ok":false}',
  );
  assert.equal(rows[1][6], "unused");
  assert.equal(drafts.length, 1);
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
  assert.match(accessScript, /fetch\(redemptionPath/);
  assert.match(accessScript, /method: "POST"/);
  assert.match(accessScript, /location\.assign\(checkPath\)/);
  assert.doesNotMatch(accessScript, /script\.google\.com/);
  assert.doesNotMatch(
    accessScript,
    /JSONP|callbackName|createElement\("script"\)/i,
  );
});

function accessHarness({ token = "a".repeat(96), fetchResult } = {}) {
  const elements = Object.fromEntries(
    [
      "#access-title",
      "#access-message",
      "#access-action",
      "#access-status",
      "#access-request-link",
    ].map((selector) => [
      selector,
      {
        textContent: "",
        hidden: true,
        disabled: false,
        addEventListener(_event, listener) {
          this.listener = listener;
        },
      },
    ]),
  );
  const requests = [];
  const navigations = [];
  const accessScript = readFileSync(
    new URL("../assets/js/visibility-check-access.mjs", import.meta.url),
    "utf8",
  );
  const context = vm.createContext({
    AbortController,
    URLSearchParams,
    clearTimeout,
    document: { querySelector: (selector) => elements[selector] },
    fetch: async (...args) => {
      requests.push(args);
      if (fetchResult instanceof Error) throw fetchResult;
      return (
        fetchResult || {
          ok: true,
          json: async () => ({ ok: true }),
        }
      );
    },
    JSON,
    location: {
      search: token === null ? "" : `?token=${token}`,
      assign: (path) => navigations.push(path),
    },
    setTimeout,
  });
  vm.runInContext(accessScript, context);
  return {
    action: elements["#access-action"],
    elements,
    navigations,
    requests,
  };
}

test("valid token shows Continue and makes no request on page load", () => {
  const { action, elements, requests } = accessHarness();
  assert.equal(
    elements["#access-title"].textContent,
    "Your Workplace AI Visibility Check is ready.",
  );
  assert.equal(action.hidden, false);
  assert.equal(requests.length, 0);
});

test("invalid token shows the inactive state without a request", () => {
  const { action, elements, requests } = accessHarness({ token: "invalid" });
  assert.equal(
    elements["#access-title"].textContent,
    "This access link is no longer active.",
  );
  assert.equal(action.hidden, true);
  assert.equal(elements["#access-request-link"].hidden, false);
  assert.equal(requests.length, 0);
});

test("Continue makes one same-origin POST and success opens the check", async () => {
  const { action, navigations, requests } = accessHarness();
  await action.listener();
  assert.equal(requests.length, 1);
  assert.equal(requests[0][0], "/api/visibility-check/redeem");
  assert.equal(requests[0][1].method, "POST");
  assert.deepEqual(JSON.parse(requests[0][1].body), { token: "a".repeat(96) });
  assert.deepEqual(navigations, ["/workplace-ai-visibility-check/check/"]);
});

test("inactive response shows the existing inactive state", async () => {
  const { action, elements } = accessHarness({
    fetchResult: { ok: true, json: async () => ({ ok: false }) },
  });
  await action.listener();
  assert.equal(
    elements["#access-title"].textContent,
    "This access link is no longer active.",
  );
  assert.equal(action.hidden, true);
});

test("transient failure re-enables Continue and allows retry", async () => {
  const result = { ok: false, status: 502, json: async () => ({ ok: false }) };
  const { action, elements, requests } = accessHarness({ fetchResult: result });
  await action.listener();
  assert.equal(action.disabled, false);
  assert.equal(
    elements["#access-status"].textContent,
    "Access could not be confirmed. Please try again.",
  );
  await action.listener();
  assert.equal(requests.length, 2);
});
