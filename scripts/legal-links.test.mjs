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
const read = (file) => readFileSync(path.join(root, file), "utf8");

test("six WAIA UK legal routes have publication metadata", () => {
  for (const route of legalRoutes) {
    const relative = `${route}/index.html`;
    assert.ok(existsSync(path.join(root, relative)), `Missing ${relative}`);
    const content = read(relative);
    assert.ok(content.includes(`href="https://waia.co.uk/${route}/"`), `Canonical missing in ${route}`);
    assert.doesNotMatch(content, /noindex|INTERNAL REVIEW|DRAFT FOR REVIEW|NOT APPROVED FOR PUBLICATION/i);
    assert.ok(content.includes("Nineteen Point Two Limited trading as WAIA"));
  }
});

test("core pages and legal routes no longer link to corporate legal host", () => {
  for (const file of [...pages, ...legalRoutes.map(route => `${route}/index.html`)]) {
    assert.ok(!read(file).includes("legal.nineteenpointtwo.com"), `Stale legal host in ${file}`);
  }
});

test("sitemap and Insights generator use first-party legal URLs", () => {
  const sitemap = read("sitemap.xml");
  for (const route of legalRoutes) {
    assert.ok(sitemap.includes(`https://waia.co.uk/${route}/`), `Sitemap missing ${route}`);
  }
  const generator = read("scripts/build-insights.mjs");
  assert.ok(generator.includes('href="/privacy/"'));
  assert.ok(generator.includes('href="/cookies/"'));
});

test("contact, restricted data and DPA cross-references are present", () => {
  assert.ok(read("terms/index.html").includes("/data-processing-agreement/"));
  assert.ok(read("privacy/index.html").includes("ben@waia.co.uk"));
  assert.ok(read("security/index.html").includes("Customers must not submit special category personal data"));
  assert.ok(read("cookies/index.html").includes("waia:analytics-objection"));
});
