/**
 * Visibility Check access. Paste this file into a Google Apps Script project.
 * Configure SHEET_ID, WEB_APP_URL, WEBHOOK_SECRET and TALLY_FORM_ID in Script Properties.
 * The script runs as its owner. It creates Gmail drafts; it never sends mail.
 */
const HEADERS = [
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
const COL = Object.fromEntries(HEADERS.map((name, i) => [name, i]));
const LANDING_URL = "https://waia.co.uk/workplace-ai-visibility-check/";
const CHECK_URL = "https://waia.co.uk/workplace-ai-visibility-check/check/";
const EXPIRY_DAYS = 7;
const TOKEN_PATTERN = /^[0-9a-f]{96}$/;

function authoriseSetup() {
  const sheetId =
    PropertiesService.getScriptProperties().getProperty("SHEET_ID");
  if (!sheetId) throw new Error("Set SHEET_ID first");
  ledger_(sheetId);
  GmailApp.getDrafts();
}

function config_() {
  const values = PropertiesService.getScriptProperties().getProperties();
  for (const key of [
    "SHEET_ID",
    "WEB_APP_URL",
    "WEBHOOK_SECRET",
    "TALLY_FORM_ID",
  ]) {
    if (!values[key]) throw new Error("Missing Script Property: " + key);
  }
  if (
    !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(
      values.WEB_APP_URL,
    )
  ) {
    throw new Error("WEB_APP_URL must be the deployed /exec URL");
  }
  if (values.WEBHOOK_SECRET.length < 32)
    throw new Error("WEBHOOK_SECRET is too short");
  return values;
}

function ledger_(sheetId) {
  const sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Requests");
  if (!sheet) throw new Error("Missing Requests sheet");
  const actual = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (HEADERS.some((heading, i) => actual[i] !== heading)) {
    throw new Error("Requests sheet header mismatch");
  }
  return sheet;
}

function safeCell_(value) {
  const text = String(value).trim();
  return /^[=+\-@\t\r]/.test(text) ? "'" + text : text;
}

function textField_(field, max) {
  if (typeof field !== "string") return "";
  return field
    .replace(/[\r\n\u0000-\u001f\u007f]/g, " ")
    .trim()
    .slice(0, max);
}

function parseSubmission_(raw, expectedFormId) {
  if (typeof raw !== "string" || raw.length > 50000)
    throw new Error("Invalid payload");
  let event;
  try {
    event = JSON.parse(raw);
  } catch (_) {
    throw new Error("Invalid JSON");
  }
  if (
    event.eventType !== "FORM_RESPONSE" ||
    !event.data ||
    event.data.formId !== expectedFormId ||
    !/^[A-Za-z0-9][A-Za-z0-9_-]{2,99}$/.test(event.data.responseId || "") ||
    !Array.isArray(event.data.fields)
  ) {
    throw new Error("Unexpected submission");
  }
  const labels = ["first name", "work email", "organisation"];
  const found = {};
  for (const field of event.data.fields) {
    if (!field || typeof field.label !== "string") continue;
    const label = field.label.trim().toLowerCase();
    if (!labels.includes(label)) continue;
    if (Object.prototype.hasOwnProperty.call(found, label))
      throw new Error("Duplicate field");
    found[label] = field.value;
  }
  const firstName = textField_(found["first name"], 80);
  const email = textField_(found["work email"], 254).toLowerCase();
  const organisation = textField_(found.organisation, 160);
  if (
    !firstName ||
    !organisation ||
    !/^[a-z0-9][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/.test(email)
  ) {
    throw new Error("Missing or invalid contact detail");
  }
  return { responseId: event.data.responseId, firstName, email, organisation };
}

function token_() {
  // Three independently generated UUIDs give a high-entropy, non-PII token.
  return Array.from({ length: 3 }, () =>
    Utilities.getUuid().replace(/-/g, "").toLowerCase(),
  ).join("");
}

function constantTimeEqual_(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  let difference = a.length ^ b.length;
  const count = Math.max(a.length, b.length);
  for (let i = 0; i < count; i++)
    difference |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return difference === 0;
}

function records_(sheet) {
  const last = sheet.getLastRow();
  return last < 2
    ? []
    : sheet
        .getRange(2, 1, last - 1, HEADERS.length)
        .getValues()
        .map((values, i) => ({ row: i + 2, values }));
}

function value_(record, heading) {
  return record.values[COL[heading]];
}

function doPost(e) {
  // Apps Script exposes query parameters and POST body, but not HTTP headers.
  // The private webhook URL secret is checked before reading any contact data.
  let settings;
  try {
    settings = config_();
  } catch (_) {
    return plain_("Configuration error");
  }
  if (
    !constantTimeEqual_(
      e && e.parameter && e.parameter.webhook_key,
      settings.WEBHOOK_SECRET,
    )
  ) {
    return plain_("Request rejected");
  }
  if (
    !e.postData ||
    !/^application\/json(?:\s*;|$)/i.test(e.postData.type || "")
  ) {
    return plain_("Invalid payload");
  }
  let submission;
  try {
    submission = parseSubmission_(e.postData.contents, settings.TALLY_FORM_ID);
  } catch (_) {
    return plain_("Invalid payload");
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2000)) return plain_("Busy; inspect Tally delivery log");
  try {
    const sheet = ledger_(settings.SHEET_ID);
    const rows = records_(sheet);
    const duplicate = rows.find(
      (row) => value_(row, "Tally response ID") === submission.responseId,
    );
    if (
      duplicate &&
      Date.parse(value_(duplicate, "Expires at")) <= Date.now()
    ) {
      return plain_("Request expired; submit the form again");
    }
    if (duplicate && value_(duplicate, "Token status") !== "draft_pending") {
      return plain_("Already recorded");
    }
    const active = rows.find(
      (row) =>
        value_(row, "Email") === submission.email &&
        ["unused", "draft_pending"].includes(value_(row, "Token status")) &&
        Date.parse(value_(row, "Expires at")) > Date.now(),
    );
    if (!duplicate && active) return plain_("Active request already exists");

    let record = duplicate;
    if (!record) {
      let token;
      do {
        token = token_();
      } while (rows.some((row) => value_(row, "Token") === token));
      const now = new Date();
      const expires = new Date(now.getTime() + EXPIRY_DAYS * 86400000);
      sheet.appendRow([
        now.toISOString(),
        safeCell_(submission.firstName),
        safeCell_(submission.email),
        safeCell_(submission.organisation),
        submission.responseId,
        token,
        "draft_pending",
        "",
        "",
        "",
        expires.toISOString(),
        "",
      ]);
      record = {
        row: sheet.getLastRow(),
        values: [
          now.toISOString(),
          submission.firstName,
          submission.email,
          submission.organisation,
          submission.responseId,
          token,
          "draft_pending",
          "",
          "",
          "",
          expires.toISOString(),
          "",
        ],
      };
    }
    const link = settings.WEB_APP_URL + "?token=" + value_(record, "Token");
    const greeting = textField_(submission.firstName, 80);
    const body =
      "Hi " +
      greeting +
      ",\n\n" +
      "Thank you for requesting the Workplace AI Visibility Check.\n\n" +
      "You can access it using this link:\n" +
      link +
      "\n\n" +
      "The link is unique to your request and expires after one use or seven days.\n\n" +
      "Thank you,\nBen";
    GmailApp.createDraft(
      submission.email,
      "Your Workplace AI Visibility Check",
      body,
    );
    sheet
      .getRange(record.row, COL["Draft created at"] + 1)
      .setValue(new Date().toISOString());
    sheet.getRange(record.row, COL["Token status"] + 1).setValue("unused");
    return plain_("Recorded; draft created");
  } catch (_) {
    // Do not log contact details or tokens. Tally shows this generic result in its delivery log.
    return plain_(
      "Processing failed; inspect Requests sheet and Apps Script execution log",
    );
  } finally {
    lock.releaseLock();
  }
}

function plain_(message) {
  return HtmlService.createHtmlOutput(message);
}

function tokenState_(token, sheet) {
  if (typeof token !== "string" || !TOKEN_PATTERN.test(token)) return "invalid";
  const record = records_(sheet).find((row) => value_(row, "Token") === token);
  if (!record) return "invalid";
  if (
    value_(record, "Token status") !== "unused" ||
    Date.parse(value_(record, "Expires at")) <= Date.now()
  )
    return "inactive";
  return record;
}

function doGet(e) {
  let state = "invalid";
  const token = e && e.parameter && e.parameter.token;
  try {
    state = tokenState_(token, ledger_(config_().SHEET_ID));
  } catch (_) {
    state = "invalid";
  }
  const valid = typeof state === "object";
  const heading = valid
    ? "Your Workplace AI Visibility Check is ready."
    : "This access link is no longer active.";
  const message = valid
    ? "Continue when you are ready. This link works once and expires seven days after your request."
    : "If you still need the Workplace AI Visibility Check, request a new link.";
  const safeToken = valid ? token : "";
  return HtmlService.createHtmlOutput(
    `<!doctype html><html lang="en"><head><base target="_top"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>Workplace AI Visibility Check access</title><style>body{margin:0;background:#f3f7f7;color:#102637;font:18px/1.55 Arial,sans-serif}main{box-sizing:border-box;max-width:680px;margin:10vh auto;padding:clamp(24px,6vw,48px);background:#fff;border:1px solid #d6e1e2;border-radius:16px}h1{font-size:clamp(1.7rem,5vw,2.5rem);line-height:1.15}button,.button{display:inline-block;border:0;border-radius:8px;background:#0d7377;color:#fff;padding:14px 20px;font:700 1rem Arial,sans-serif;cursor:pointer;text-decoration:none}button:disabled{opacity:.6;cursor:wait}a{color:#0b6468}p{max-width:56ch}</style></head><body><main><p>WAIA · Free working tool</p><h1>${heading}</h1><p>${message}</p>${valid ? `<button id="continue" type="button">Continue to the Visibility Check</button><p id="status" role="status" aria-live="polite"></p><script>const button=document.getElementById('continue');button.addEventListener('click',function(){button.disabled=true;document.getElementById('status').textContent='Opening your check…';google.script.run.withSuccessHandler(function(result){if(result.ok){try{window.top.location.assign(result.url)}catch(e){}document.getElementById('status').innerHTML='Access confirmed. <a target="_top" href="${CHECK_URL}">Open the Visibility Check</a>.'}else{button.remove();document.getElementById('status').textContent='This access link is no longer active. Please request a new link.'}}).withFailureHandler(function(){button.disabled=false;document.getElementById('status').textContent='Something went wrong. Please try again.'}).redeemAccess('${safeToken}')});</script>` : ""}<p><a href="${LANDING_URL}">Request a new link</a></p></main></body></html>`,
  ).setTitle("Workplace AI Visibility Check access");
}

function redeemAccess(token) {
  if (typeof token !== "string" || !TOKEN_PATTERN.test(token))
    return { ok: false };
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(2000)) return { ok: false };
  try {
    const sheet = ledger_(config_().SHEET_ID);
    const record = tokenState_(token, sheet);
    if (typeof record !== "object") return { ok: false };
    sheet.getRange(record.row, COL["Token status"] + 1).setValue("redeemed");
    sheet
      .getRange(record.row, COL["Redeemed at"] + 1)
      .setValue(new Date().toISOString());
    return { ok: true, url: CHECK_URL };
  } catch (_) {
    return { ok: false };
  } finally {
    lock.releaseLock();
  }
}
