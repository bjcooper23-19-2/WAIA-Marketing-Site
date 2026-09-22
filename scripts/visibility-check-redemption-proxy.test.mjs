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

test("valid token calls Apps Script with redirect following and private secret", async () => {
  const calls = [];
  const response = await handleRequest(request(), env, async (...args) => {
    calls.push(args);
    return Response.json({ ok: true });
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
    const response = await handleRequest(request(), env, async () =>
      Response.json({ ok, email: "must-not-leak@example.com" }),
    );
    assert.equal(response.status, 200);
    assert.deepEqual(await resultBody(response), { ok });
  }
});

test("unexpected or failed upstream responses are retryable and safe", async () => {
  const responses = [
    async () => new Response("upstream failed", { status: 500 }),
    async () => new Response("not json", { status: 200 }),
    async () => Response.json({ email: "private@example.com" }),
    async () => {
      throw new Error(`do not expose ${proxySecret}`);
    },
  ];
  for (const fetchUpstream of responses) {
    const response = await handleRequest(request(), env, fetchUpstream);
    const text = await response.text();
    assert.equal(response.status, 502);
    assert.equal(text, '{"ok":false}');
    assert.doesNotMatch(text, /private|example|proxy|script|secret/i);
  }
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
