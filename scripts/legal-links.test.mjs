import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legalRoutes = ["website-terms", "privacy", "cookies", "data-processing-agreement", "security", "subprocessors"];
const pages = [
  "index.html", "404.html", "how-it-works/index.html", "who-its-for/index.html",
  "pricing/index.html", "see-waia/index.html", "data-privacy/index.html",
  "analytics-preferences/index.html", "ai-use-statement/index.html",
  "terms/index.html", "workplace-ai-visibility-check/index.html",
  "workplace-ai-visibility-check/start/index.html", "insights/index.html",
  "scripts/build-insights.mjs",
];
const html = (file) => readFileSync(path.join(root, file), "utf8");

test("six WAIA UK legal routes exist with approved publication metadata", () => {
  for (const route of legalRoutes) {
    const relative = `${route}/index.html`;
    assert.ok(existsSync(path.join(root, relative)), `Missing ${relative}`);
    const content = html(relative);
    assert.match(content, new RegExp(`href="https://waia\\.co\\.uk/${route}/"`));
    assert.doesNotMatch(content, /noindex|INTERNAL REVIEW|DRAFT FOR REVIEW|NOT APPROVED FOR PUBLICATION/i);
    assert.match(content, /Nineteen Point Two Limited trading as WAIA/);
  }
});

test("legal source and core public pages no longer link to the corporate legal host", () => {
  for (const file of [...pages, ...legalRoutes.map(r => `${r}/index.html`)]) {
    assert.doesNotMatch(html(file), /legal\\.nineteenpointtwo\\.com/i, `Stale legal host in ${file}`);
  }
});

test("Insights generator and sitemap include WAIA legal destinations", () => {
  const sitemap = html("sitemap.xml");
  for (const route of legalRoutes) {
    assert.match(sitemap, new RegExp(`https://waia\\.co\\.uk/${route}/`));
  }
  const generator = html("scripts/build-insights.mjs");
  assert.match(generator, /href=\\\"\\/privacy\\/\\\"/);
  assert.match(generator, /href=\\\"\\/cookies\\/\\\"/);
});

test("sensitive data, contact and hosted DPA cross references stay aligned", () => {
  assert.match(html("terms/index.html"), /\\/data-processing-agreement\\//);
  assert.match(html("privacy/index.html"), /ben@waia\\.co\\.uk/);
  assert.match(html("security/index.html"), /Customers must not submit special category personal data/);
  assert.match(html("cookies/index.html"), /waia:analytics-objection/);
});
