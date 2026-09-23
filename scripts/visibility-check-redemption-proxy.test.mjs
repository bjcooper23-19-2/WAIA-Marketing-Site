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
const redirect = () =>
  new Response(null, { status: 302, headers: { Location: contentUrl } });
const content = (body, options = {}) =>
  new Response(body, {
    status: 200,
    headers: { "Content-Type": "application/json" },
    ...options,
  });
const redirectedFetch = (body) => async (_url, options) =>
  options.method === "POST" ? redirect() : content(JSON.stringify(body));

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

test("redeem POST follows the ContentService redirect with a separate GET", async () => {
  const calls = [];
  const response = await handleRequest(request(), env, async (...args) => {
    calls.push(args);
    return calls.length === 1 ? redirect() : content('{"ok":true}');
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await resultBody(response), { ok: true });
  assert.equal(calls.length, 2);
  assert.equal(calls[0][0].origin, "https://script.google.com");
  assert.equal(calls[0][0].searchParams.get("action"), "redeem");
  assert.equal(calls[0][1].redirect, "manual");
  assert.deepEqual(JSON.parse(calls[0][1].body), {
    token,
    proxy_secret: proxySecret,
  });
  assert.equal(calls[1][0].href, contentUrl);
  assert.equal(calls[1][1].method, "GET");
  assert.equal(calls[1][1].redirect, "manual");
  assert.equal(calls[1][1].body, undefined);
});

test("Apps Script true and false results are normalised", async () => {
  for (const ok of [true, false]) {
    const confirmed = await handleRequest(request(), env, redirectedFetch({ ok }));
    assert.equal(confirmed.status, 200);
    assert.deepEqual(await resultBody(confirmed), { ok });
  }
});

test("a 303 ContentService redirect is accepted", async () => {
  const response = await handleRequest(request(), env, async (_url, options) =>
    options.method === "POST"
      ? new Response(null, { status: 303, headers: { Location: contentUrl } })
      : content('{"ok":true}'),
  );
  assert.deepEqual(await resultBody(response), { ok: true });
});

test("unexpected or failed upstream responses are retryable and safe", async () => {
  const responses = [
    async () => new Response("upstream failed", { status: 500 }),
    async () => content('{"ok":true}'),
    async () =>
      new Response(null, {
        status: 302,
        headers: { Location: "https://example.com/macros/echo" },
      }),
    async () => new Response(null, { status: 307, headers: { Location: contentUrl } }),
    async (_url, options) =>
      options.method === "POST"
        ? redirect()
        : new Response("not json", {
            status: 200,
            headers: { "Content-Type": "text/html" },
          }),
    async (_url, options) =>
      options.method === "POST" ? redirect() : content("not json"),
    redirectedFetch({ ok: true, email: "private@example.com" }),
    async (_url, options) =>
      options.method === "POST"
        ? redirect()
        : new Response("no", { status: 405 }),
    async () => {
      throw new Error(`do not expose ${proxySecret}`);
    },
  ];
  for (const fetchUpstream of responses) {
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
    assert.doesNotMatch(JSON.stringify(logs), new RegExp(`${token}|${proxySecret}|private@example`));
  }
});

test("a second redemption remains inactive", async () => {
  let redemptions = 0;
  const fetchUpstream = async (_url, options) => {
    if (options.method === "POST") {
      redemptions += 1;
      return redirect();
    }
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
