import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const handoff = readFileSync(
  new URL("../assets/js/content-handoff.js", import.meta.url),
  "utf8",
);

function run({
  pathname = "/go/content/2026-10-evidence-value/",
  destinationPath = "/workplace-ai-visibility-check/check/",
  source = "li",
  observerAvailable = true,
} = {}) {
  let callback;
  let timer;
  let errorHandler;
  let result;
  let count = 0;
  let disconnected = false;

  const location = {
    pathname,
    origin: "https://waia.co.uk",
    href: `https://waia.co.uk${pathname}`,
    replace: (url) => {
      result = url;
      count++;
    },
  };

  class Observer {
    constructor(fn) {
      callback = fn;
    }
    observe(options) {
      assert.equal(options.type, "resource");
      assert.equal(options.buffered, true);
    }
    disconnect() {
      disconnected = true;
    }
  }

  vm.runInNewContext(handoff, {
    URL,
    window: { location },
    location,
    document: {
      documentElement: {
        dataset: { destinationPath, source },
      },
      querySelector: () => ({
        addEventListener: (event, fn) => {
          assert.equal(event, "error");
          errorHandler = fn;
        },
      }),
    },
    PerformanceObserver: observerAvailable ? Observer : undefined,
    setTimeout: (fn, delay) => {
      assert.equal(delay, 1500);
      timer = fn;
      return 1;
    },
    clearTimeout: () => {},
  });

  return {
    resource: (name, initiatorType = "xmlhttprequest") =>
      callback({ getEntries: () => [{ name, initiatorType }] }),
    timeout: () => timer(),
    error: () => errorHandler(),
    get result() {
      return result;
    },
    get count() {
      return count;
    },
    get disconnected() {
      return disconnected;
    },
  };
}

test("content route waits for Cloudflare then forwards source and content id", () => {
  const r = run();
  assert.equal(r.result, undefined);
  r.resource("https://cloudflareinsights.com/cdn-cgi/rum");
  assert.equal(
    r.result,
    "/workplace-ai-visibility-check/check/?s=li&c=2026-10-evidence-value",
  );
  assert.equal(r.disconnected, true);
  r.timeout();
  assert.equal(r.count, 1);
});

test("blocked or unsupported analytics never blocks the click", () => {
  const unsupported = run({ observerAvailable: false });
  unsupported.timeout();
  assert.equal(
    unsupported.result,
    "/workplace-ai-visibility-check/check/?s=li&c=2026-10-evidence-value",
  );

  const blocked = run();
  blocked.error();
  assert.equal(
    blocked.result,
    "/workplace-ai-visibility-check/check/?s=li&c=2026-10-evidence-value",
  );
});

test("unsafe destination falls back to site root", () => {
  const r = run({ destinationPath: "https://evil.example/path" });
  r.timeout();
  assert.equal(r.result, "/?s=li&c=2026-10-evidence-value");
});

test("invalid source is omitted", () => {
  const r = run({ source: "evil" });
  r.timeout();
  assert.equal(
    r.result,
    "/workplace-ai-visibility-check/check/?c=2026-10-evidence-value",
  );
});

test("invalid content route omits content id", () => {
  const r = run({ pathname: "/go/content/BAD_VALUE/" });
  r.timeout();
  assert.equal(r.result, "/workplace-ai-visibility-check/check/?s=li");
});

test("route is noindex and contains one Cloudflare beacon", () => {
  const html = readFileSync(
    new URL(
      "../go/content/2026-10-evidence-value/index.html",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(html, /content="noindex, nofollow"/);
  assert.equal((html.match(/beacon\.min\.js/g) || []).length, 1);
  assert.equal(
    (html.match(/9fa2711aed53428980734989cf03178a/g) || []).length,
    1,
  );
  assert.ok(!html.includes('rel="canonical"'));
});
