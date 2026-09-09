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
function attribute(search = "", stored = null, unavailable = false) {
  const values = new Map(stored ? [["waia:source", stored]] : []);
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
  assert.ok([...values.keys()].every((k) => k === "waia:source"));
  return { links: links.map((l) => l.href), stored: values.get("waia:source") };
}
for (const source of sources)
  test(`${source}: CTA routing, procurement and session persistence`, () => {
    const result = attribute(`?s=${source}`);
    assert.equal(result.links[0], `/go/see-waia/${source}/`);
    assert.equal(
      result.links[1],
      `/go/see-waia/${source}/?enquiry_type=procurement`,
    );
    assert.equal(result.stored, source);
    assert.equal(attribute("", result.stored).links[0], result.links[0]);
    assert.equal(
      attribute(`?s=${source}`, null, true).links[0],
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
test("invalid storage removed; invalid incoming does not overwrite a valid session", () => {
  assert.equal(attribute("", "bad").stored, undefined);
  assert.equal(attribute("?s=bad", "gm").links[0], "/go/see-waia/gm/");
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
    const r = redirect(source, "?s=evil&product=bad&enquiry_type=wrong");
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
    assert.equal(r.disconnected, true);
    r.timeout();
    assert.equal(r.count, 1);
  });
test("preserve procurement; same-origin Cloudflare endpoint", () => {
  const r = redirect("gm", "?enquiry_type=procurement");
  r.resource("https://waia.co.uk/cdn-cgi/rum?x=1");
  assert.equal(
    new URL(r.result).searchParams.get("enquiry_type"),
    "procurement",
  );
});
test("blocked/slow/unsupported analytics never blocks conversion", () => {
  for (const supported of [true, false]) {
    const r = redirect("direct", "", supported);
    r.timeout();
    assert.equal(r.result, tally);
  }
  const r = redirect("ap");
  r.error();
  assert.ok(r.result.endsWith("&s=ap"));
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
