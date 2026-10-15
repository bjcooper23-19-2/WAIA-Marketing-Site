import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const loader = readFileSync(new URL("../assets/js/analytics.js", import.meta.url), "utf8");
const controls = readFileSync(new URL("../assets/js/analytics-preferences.js", import.meta.url), "utf8");

function browser(initial = null, storageAvailable = true) {
  let saved = initial;
  const scripts = [];
  const elements = Object.fromEntries(
    ["analytics-status", "object-to-analytics", "allow-analytics"].map((id) => [
      id,
      { hidden: true, textContent: "", addEventListener(_, handler) { this.click = handler; } },
    ]),
  );
  const localStorage = {
    getItem(key) {
      assert.equal(key, "waia:analytics-objection");
      if (!storageAvailable) throw Error("storage blocked");
      return saved;
    },
    setItem(key, value) {
      assert.equal(key, "waia:analytics-objection");
      if (!storageAvailable) throw Error("storage blocked");
      saved = value;
    },
    removeItem(key) {
      assert.equal(key, "waia:analytics-objection");
      if (!storageAvailable) throw Error("storage blocked");
      saved = null;
    },
  };
  const context = {
    window: { localStorage },
    document: {
      createElement: (tag) => ({ tag, dataset: {} }),
      body: { appendChild: (script) => scripts.push(script) },
      getElementById: (id) => elements[id],
    },
  };
  return {
    load: () => vm.runInNewContext(loader, context),
    controls: () => vm.runInNewContext(controls, context),
    elements,
    scripts,
    get saved() { return saved; },
  };
}

test("normal page loads one Cloudflare beacon when storage is available", () => {
  const b = browser();
  b.load();
  assert.equal(b.scripts.length, 1);
  assert.equal(b.scripts[0].type, "module");
  assert.equal(b.scripts[0].src, "https://static.cloudflareinsights.com/beacon.min.js");
  assert.equal(JSON.parse(b.scripts[0].dataset.cfBeacon).token, "9fa2711aed53428980734989cf03178a");
});

test("objection persists and prevents beacon loading after reload and navigation", () => {
  const b = browser();
  b.controls();
  assert.equal(b.elements["object-to-analytics"].hidden, false);
  b.elements["object-to-analytics"].click();
  assert.equal(b.saved, "1");
  assert.match(b.elements["analytics-status"].textContent, /off/);
  b.load();
  b.load();
  assert.equal(b.scripts.length, 0);
  b.elements["allow-analytics"].click();
  assert.equal(b.saved, null);
  b.load();
  assert.equal(b.scripts.length, 1);
});

test("storage failure leaves the beacon unloaded", () => {
  const b = browser(null, false);
  b.load();
  assert.equal(b.scripts.length, 0);
  b.controls();
  assert.match(b.elements["analytics-status"].textContent, /unavailable/);
});

test("every former beacon page uses the guarded loader; token access remains untracked", () => {
  const pages = [
    "../index.html", "../404.html", "../see-waia/index.html",
    "../workplace-ai-visibility-check/check/index.html",
    "../workplace-ai-visibility-check/results/index.html",
    "../go/see-waia/ap/index.html", "../go/content/2026-10-evidence-value/index.html",
  ];
  for (const path of pages) {
    const html = readFileSync(new URL(path, import.meta.url), "utf8");
    assert.match(html, /src="\/assets\/js\/analytics\.js"/);
    assert.doesNotMatch(html, /src="https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js"/);
  }
  const access = readFileSync(new URL("../workplace-ai-visibility-check/access/index.html", import.meta.url), "utf8");
  assert.doesNotMatch(access, /analytics\.js|beacon\.min\.js/);
  const preferences = readFileSync(new URL("../analytics-preferences/index.html", import.meta.url), "utf8");
  assert.match(preferences, /id="object-to-analytics"/);
  assert.match(preferences, /id="allow-analytics"/);
  assert.match(preferences, /role="status" aria-live="polite"/);
});
