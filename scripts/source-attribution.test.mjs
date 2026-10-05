import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import vm from "node:vm";

const attribution = readFileSync(
  new URL("../assets/js/source-attribution.js", import.meta.url),
  "utf8",
);
const handoff = readFileSync(
  new URL("../assets/js/tally-handoff.js", import.meta.url),
  "utf8",
);
const sources = ["ap", "gm", "19", "li"];
const tally = "https://tally.so/r/objzGM?product=WAIA&enquiry_type=walkthrough";

function attribute(search = "", stored = {}, unavailable = false) {
  const values = new Map();
  if (stored.source) values.set("waia:source", stored.source);
  if (stored.content) values.set("waia:content", stored.content);

  const unchanged = [
    "/how-it-works/",
    "/terms/",
    "https://app.waia.co.uk/login",
    "https://legal.nineteenpointtwo.com/privacy/",
    "https://tally.so/r/other",
    "https://example.com/",
    "mailto:example@example.com",
  ];
  const hrefs = [
    tally,
    tally.replace("walkthrough", "procurement"),
    ...unchanged,
  ];
  const links = hrefs.map((href) => ({
    href,
    getAttribute() {
      return this.href;
    },
    setAttribute(_, value) {
      this.href = value;
    },
  }));
  const storage = {
    setItem(k, v) {
      if (unavailable) throw Error("blocked");
      values.set(k, v);
    },
    getItem: (k) => values.get(k),
    removeItem: (k) => values.delete(k),
  };

  vm.runInNewContext(attribution, {
    URL,
    URLSearchParams,
    window: {
      location: {
        search,
        origin: "https://waia.co.uk",
        href: "https://waia.co.uk/" + search,
      },
      sessionStorage: storage,
    },
    document: { querySelectorAll: () => links },
  });

  assert.deepEqual(
    links.slice(2).map((l) => l.href),
    unchanged,
  );
  assert.ok(
    [...values.keys()].every((k) =>
      ["waia:source", "waia:content"].includes(k),
    ),
  );

  return {
    links: links.map((l) => l.href),
    stored: {
      source: values.get("waia:source"),
      content: values.get("waia:content"),
    },
  };
}

for (const source of sources)
  test(`${source}: CTA routing, content and session persistence`, () => {
    const result = attribute(`?s=${source}&c=2026-10-evidence-value`);
    assert.equal(
      result.links[0],
      `/go/see-waia/${source}/?c=2026-10-evidence-value`,
    );
    assert.equal(
      result.links[1],
      `/go/see-waia/${source}/?c=2026-10-evidence-value&enquiry_type=procurement`,
    );
    assert.deepEqual(result.stored, {
      source,
      content: "2026-10-evidence-value",
    });
    assert.equal(
      attribute("", result.stored).links[0],
      result.links[0],
    );
    assert.equal(
      attribute(`?s=${source}&c=2026-10-evidence-value`, {}, true).links[0],
      result.links[0],
    );
  });

for (const search of [
  "",
  "?s=test",
  "?s=",
  "?s=AP",
  "?s=%2Fbad",
  "?s=gm&s=ap",
  "?s=%00",
  "?s=direct",
])
  test(`safe direct fallback ${search}`, () =>
    assert.equal(attribute(search).links[0], "/go/see-waia/direct/"));

for (const content of [
  "",
  "UPPER",
  "bad_value",
  "/bad",
  "a".repeat(65),
])
  test(`invalid content ignored: ${content}`, () => {
    const result = attribute(`?s=li&c=${encodeURIComponent(content)}`, {
      source: "li",
      content: "old-post",
    });
    assert.equal(result.links[0], "/go/see-waia/li/");
    assert.equal(result.stored.content, undefined);
  });

test("duplicate content is ignored", () => {
  const result = attribute("?s=li&c=one&c=two");
  assert.equal(result.links[0], "/go/see-waia/li/");
  assert.equal(result.stored.content, undefined);
});

test("invalid source does not overwrite a valid session", () => {
  const result = attribute("?s=bad&c=bad-post", {
    source: "gm",
    content: "existing-post",
  });
  assert.equal(result.links[0], "/go/see-waia/gm/?c=existing-post");
});

test("new approved source without content clears stale content", () => {
  const result = attribute("?s=li", {
    source: "gm",
    content: "old-post",
  });
  assert.equal(result.links[0], "/go/see-waia/li/");
  assert.deepEqual(result.stored, { source: "li", content: undefined });
});

function redirect(source, query = "", observerAvailable = true) {
  let callback,
    timer,
    errorHandler,
    result,
    count = 0,
    disconnected = false;
  const location = {
    pathname: `/go/see-waia/${source}/`,
    origin: "https://waia.co.uk",
    href: `https://waia.co.uk/go/see-waia/${source}/${query}`,
    search: query,
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
    URLSearchParams,
    window: { location },
    document: {
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

for (const source of [...sources, "direct", "invalid"])
  test(`${source}: beacon completes before Tally navigation`, () => {
    const r = redirect(
      source,
      "?s=evil&product=bad&enquiry_type=wrong&c=2026-10-evidence-value",
    );
    assert.equal(r.result, undefined);
    r.resource("https://static.cloudflareinsights.com/beacon.min.js", "script");
    assert.equal(r.result, undefined);
    r.resource("https://example.com/cdn-cgi/rum");
    assert.equal(r.result, undefined);
    r.resource("https://cloudflareinsights.com/cdn-cgi/rum");
    const url = new URL(r.result);
    assert.equal(url.origin + url.pathname, "https://tally.so/r/objzGM");
    assert.equal(url.searchParams.get("product"), "WAIA");
    assert.equal(url.searchParams.get("enquiry_type"), "walkthrough");
    assert.equal(
      url.searchParams.get("s"),
      sources.includes(source) ? source : null,
    );
    assert.equal(url.searchParams.get("c"), "2026-10-evidence-value");
    assert.equal(r.disconnected, true);
    r.timeout();
    assert.equal(r.count, 1);
  });

test("invalid and duplicate content never reach Tally", () => {
  for (const query of [
    "?c=BAD",
    "?c=one&c=two",
    "?c=bad_value",
    `?c=${"a".repeat(65)}`,
  ]) {
    const r = redirect("li", query, false);
    r.timeout();
    assert.equal(new URL(r.result).searchParams.get("c"), null);
  }
});

test("preserve procurement; same-origin Cloudflare endpoint", () => {
  const r = redirect("gm", "?enquiry_type=procurement&c=proposal-followup");
  r.resource("https://waia.co.uk/cdn-cgi/rum?x=1");
  const url = new URL(r.result);
  assert.equal(url.searchParams.get("enquiry_type"), "procurement");
  assert.equal(url.searchParams.get("c"), "proposal-followup");
});

test("blocked/slow/unsupported analytics never blocks conversion", () => {
  for (const supported of [true, false]) {
    const r = redirect("direct", "", supported);
    r.timeout();
    assert.equal(r.result, tally);
  }
  const r = redirect("ap", "?c=apollo-followup");
  r.error();
  const url = new URL(r.result);
  assert.equal(url.searchParams.get("s"), "ap");
  assert.equal(url.searchParams.get("c"), "apollo-followup");
});

test("five noindex routes, one unchanged beacon, no sitemap entries", () => {
  const root = new URL("../go/see-waia/", import.meta.url);
  assert.deepEqual(readdirSync(root).sort(), [...sources, "direct"].sort());
  const sitemap = readFileSync(
    new URL("../sitemap.xml", import.meta.url),
    "utf8",
  );
  assert.ok(!sitemap.includes("/go/"));
  for (const source of [...sources, "direct"]) {
    const html = readFileSync(new URL(`${source}/index.html`, root), "utf8");
    assert.match(html, /content="noindex, nofollow"/);
    assert.equal((html.match(/beacon\.min\.js/g) || []).length, 1);
    assert.equal(
      (html.match(/9fa2711aed53428980734989cf03178a/g) || []).length,
      1,
    );
    assert.ok(!html.includes('rel="canonical"'));
    assert.ok(!html.includes("source-attribution.js"));
  }
  assert.ok(!handoff.includes("sessionStorage"));
  for (const code of [attribution, handoff])
    assert.doesNotMatch(
      code,
      /localStorage|document\.cookie|randomUUID|fetch\(|sendBeacon\(/,
    );
});
