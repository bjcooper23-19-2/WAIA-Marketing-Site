import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const legalRoutes = ["website-terms", "privacy", "cookies", "data-processing-agreement", "security", "subprocessors"];
const read = (file) => readFileSync(path.join(root, file), "utf8");
const listHtml = (folder = "") => {
  const fullPath = path.join(root, folder);
  return readdirSync(fullPath).flatMap(name => {
    const rel = path.join(folder, name);
    if (name.startsWith(".") || ["node_modules", ".git"].includes(name)) return [];
    const info = statSync(path.join(root, rel));
    return info.isDirectory() ? listHtml(rel) : name.endsWith(".html") ? [rel] : [];
  });
};
const allHtml = listHtml();

test("six standalone legal routes have approved publication metadata", () => {
  for (const route of legalRoutes) {
    const relative = `${route}/index.html`;
    assert.ok(existsSync(path.join(root, relative)), `Missing ${relative}`);
    const content = read(relative);
    assert.ok(content.includes(`href="https://waia.co.uk/${route}/"`), `Canonical missing: ${relative}`);
    assert.doesNotMatch(content, /noindex|INTERNAL REVIEW|DRAFT FOR REVIEW|NOT APPROVED FOR PUBLICATION/i, `Unreleased legal content: ${relative}`);
    assert.ok(content.includes("Nineteen Point Two Limited trading as WAIA"), `Provider missing: ${relative}`);
    assert.ok(content.includes("Version 1.0"), `Version missing: ${relative}`);
  }
});

test("all HTML routes remove old legal host and corporate website dependencies", () => {
  for (const file of allHtml) {
    const content = read(file);
    assert.ok(!content.includes("legal.nineteenpointtwo.com"), `Legacy legal host in ${file}`);
    assert.ok(!content.includes("https://nineteenpointtwo.com") && !content.includes("https://www.nineteenpointtwo.com") && !content.includes("http://nineteenpointtwo.com"), `Corporate website link in ${file}`);
    assert.ok(!/WAIA is a Nineteen Point Two\s+product\./.test(content), `Old company footer in ${file}`);
  }
});

test("first-party href and src destinations exist in the repository", () => {
  for (const file of allHtml) {
    const content = read(file);
    for (const match of content.matchAll(/(?:href|src)=["'](\/[^"'?#]+)(?:[?#][^"']*)?["']/g)) {
      const relative = decodeURIComponent(match[1].slice(1));
      const target = relative.endsWith("/") ? relative + "index.html" : relative;
      assert.ok(existsSync(path.join(root, target)) || existsSync(path.join(root, target, "index.html")),
        `Missing first-party destination ${match[1]} in ${file}`);
    }
  }
});

test("sitemap and Insights source/generation output use WAIA legal destinations", () => {
  const sitemap = read("sitemap.xml");
  for (const route of legalRoutes) {
    assert.ok(sitemap.includes(`https://waia.co.uk/${route}/`), `Sitemap missing: ${route}`);
  }
  const generator = read("scripts/build-insights.mjs");
  assert.ok(generator.includes('href="/privacy/"'));
  assert.ok(generator.includes('href="/cookies/"'));
  for (const file of allHtml.filter(file => file.startsWith("insights/"))) {
    const content = read(file);
    assert.ok(content.includes('href="/privacy/"'), `Insights privacy link missing: ${file}`);
    assert.ok(content.includes('href="/cookies/"'), `Insights cookies link missing: ${file}`);
  }
});

test("contact, restricted data, analytics objection and DPA links align", () => {
  assert.ok(read("terms/index.html").includes("/data-processing-agreement/"));
  assert.ok(read("privacy/index.html").includes("ben@waia.co.uk"));
  assert.ok(read("security/index.html").includes("Customers must not submit special category personal data"));
  assert.ok(read("cookies/index.html").includes("waia:analytics-objection"));
});
