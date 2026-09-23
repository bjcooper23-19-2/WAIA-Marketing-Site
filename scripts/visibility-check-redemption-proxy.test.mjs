import assert from "node:assert/strict";
import { test } from "node:test";

import { handleRequest } from "../cloudflare/visibility-check-redemption/worker.mjs";

const token = "a".repeat(96);
const proxySecret = "b".repeat(64);
const env = {
  APPS_SCRIPT_REDEMPTION_URL:
    "https://script.google.com/macros/s/test-deployment_123/exec",
  APPS_SCRIPT_PROXY_SECRET: proxySecret,
};

const request = (body = { token }, options = {}) =>
  new Request("https://waia.co.uk/api/visibility-check/redeem", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...options,
  });

const resultBody = async (response) => JSON.parse(await response.text());
const contentUrl =
  "https://script.googleusercontent.com/macros/echo?user_content_key=one-time-key";
const content = (body, options = {}) =>
  Object.defineProperty(new Response(body, {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...options,
  }), "url", { value: contentUrl });
const finalFetch = (body) => async () => content(JSON.stringify(body));

test("wrong method is rejected", async () => {
  const response = await handleRequest(
    new Request("https://waia.co.uk/api/visibility-check/redeem"),
    env,
  );
  assert.equal(response.status, 405);
  assert.equal(response.headers.get("allow"), "POST");
});

test("malformed body and token are rejected before Apps Script", async () => {
  let calls = 0;
  const fetchUpstream = async () => {
    calls += 1;
    return Response.json({ ok: true });
  };
  const malformed = await handleRequest(
    new Request("https://waia.co.uk/api/visibility-check/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    }),
    env,
    fetchUpstream,
  );
  const invalid = await handleRequest(
    request({ token: "not-a-token" }),
    env,
    fetchUpstream,
  );
  assert.equal(malformed.status, 400);
  assert.equal(invalid.status, 400);
  assert.equal(calls, 0);
});

test("redeem POST automatically follows to a successful JSON response", async () => {
  const calls = [];
  const response = await handleRequest(request(), env, async (...args) => {
    calls.push(args);
    return content('{"ok":true}');
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await resultBody(response), { ok: true });
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0].origin, "https://script.google.com");
  assert.equal(calls[0][0].searchParams.get("action"), "redeem");
  assert.equal(calls[0][1].redirect, "follow");
  assert.deepEqual(JSON.parse(calls[0][1].body), {
    token,
    proxy_secret: proxySecret,
  });
});

test("Apps Script true and false results are normalised", async () => {
  for (const ok of [true, false]) {
    const confirmed = await handleRequest(request(), env, finalFetch({ ok }));
    assert.equal(confirmed.status, 200);
    assert.deepEqual(await resultBody(confirmed), { ok });
  }
});

test("malformed, non-JSON and non-200 final responses are retryable and safely logged", async () => {
  const responses = [
    { fetch: async () => content("not json"), category: "invalid_final_body" },
    { fetch: async () => content("<html>private@example.com</html>", {
      headers: { "Content-Type": "text/html" },
    }), category: "unexpected_final_type" },
    { fetch: async () => content("no", { status: 404 }), category: "unexpected_final_status" },
    { fetch: finalFetch({ ok: true, email: "private@example.com" }), category: "invalid_final_shape" },
    { fetch: async () => content("x".repeat(1001), { headers: { "Content-Type": "application/json" } }), category: "final_body_too_large" },
  ];
  for (const { fetch: fetchUpstream, category } of responses) {
    const originalWarn = console.warn;
    const logs = [];
    console.warn = (...args) => logs.push(args);
    let response;
    try {
      response = await handleRequest(request(), env, fetchUpstream);
    } finally {
      console.warn = originalWarn;
    }
    const text = await response.text();
    assert.equal(response.status, 502);
    assert.equal(text, '{"ok":false}');
    assert.doesNotMatch(text, /private|example|proxy|script|secret/i);
    assert.equal(logs.length, 1);
    assert.deepEqual(Object.keys(logs[0][1]), [
      "error_category", "status", "hostname", "path_category", "content_type", "response_length",
    ]);
    assert.equal(logs[0][1].error_category, category);
    assert.equal(logs[0][1].hostname, "script.googleusercontent.com");
    assert.equal(logs[0][1].path_category, "content-service-echo");
    assert.doesNotMatch(JSON.stringify(logs), new RegExp(`${token}|${proxySecret}|private@example|one-time-key`));
  }
});

test("failed fetch does not expose secrets", async () => {
  const logs = [];
  const originalWarn = console.warn;
  console.warn = (...args) => logs.push(args);
  try {
    const response = await handleRequest(request(), env, async () => {
      throw new Error(`do not expose ${proxySecret}`);
    });
    assert.equal(response.status, 502);
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(logs[0][1].error_category, "post_fetch_failed");
  assert.doesNotMatch(JSON.stringify(logs), new RegExp(`${token}|${proxySecret}`));
});

test("a second redemption remains inactive", async () => {
  let redemptions = 0;
  const fetchUpstream = async () => {
    redemptions += 1;
    return content(JSON.stringify({ ok: redemptions === 1 }));
  };
  assert.deepEqual(await resultBody(await handleRequest(request(), env, fetchUpstream)), { ok: true });
  assert.deepEqual(await resultBody(await handleRequest(request(), env, fetchUpstream)), { ok: false });
});

test("configuration details are never returned", async () => {
  const response = await handleRequest(request(), {}, async () => {
    throw new Error("must not be called");
  });
  const text = await response.text();
  assert.equal(response.status, 503);
  assert.equal(text, '{"ok":false}');
  assert.doesNotMatch(text, /APPS_SCRIPT|google|secret/i);
});
