import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { areas, buildResult } from "../assets/js/visibility-check-results.mjs";

const all = (status) => Object.fromEntries(areas.map(({ id }) => [id, status]));

test("requires an answer for every area", () => {
  assert.throws(
    () => buildResult({ use: "visible" }),
    /Complete each question/,
  );
  assert.throws(
    () => buildResult({ ...all("visible"), data: "high-risk" }),
    /Complete each question/,
  );
});

test("groups answers by visibility without a score", () => {
  const result = buildResult({
    ...all("visible"),
    data: "unclear",
    review: "partial",
  });
  assert.deepEqual(
    result.groups.unclear.map(({ id }) => id),
    ["data"],
  );
  assert.deepEqual(
    result.groups.partial.map(({ id }) => id),
    ["review"],
  );
  assert.equal(result.groups.visible.length, 5);
  assert.equal(Object.hasOwn(result, "score"), false);
});

test("prioritises unclear areas before partly visible ones and keeps next steps short", () => {
  const result = buildResult({
    ...all("partial"),
    capacity: "unclear",
    data: "unclear",
  });
  assert.deepEqual(
    result.next.map(({ id }) => id),
    ["data", "capacity", "review", "work"],
  );
  assert.ok(result.next.every(({ next }) => next.length > 50));
});

test("a fully visible result still offers useful checks", () => {
  const result = buildResult(all("visible"));
  assert.equal(result.next.length, 3);
});

test("question names and answer categories match the result logic", () => {
  const page = readFileSync(
    new URL(
      "../workplace-ai-visibility-check/check/index.html",
      import.meta.url,
    ),
    "utf8",
  );
  const names = [...page.matchAll(/data-question="([a-z]+)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(
    names,
    areas.map(({ id }) => id),
  );
  for (const id of names) {
    for (const value of ["visible", "partial", "unclear"]) {
      assert.match(
        page,
        new RegExp(`<input[^>]*name="${id}"[^>]*value="${value}"`, "s"),
      );
    }
  }
});

test("only the public explanation is indexed", () => {
  const route = new URL("../workplace-ai-visibility-check/", import.meta.url);
  const landing = readFileSync(new URL("index.html", route), "utf8");
  const sitemap = readFileSync(
    new URL("../sitemap.xml", import.meta.url),
    "utf8",
  );
  assert.match(
    landing,
    /rel="canonical"\s+href="https:\/\/waia.co.uk\/workplace-ai-visibility-check\/"/,
  );
  assert.match(
    sitemap,
    /https:\/\/waia.co.uk\/workplace-ai-visibility-check\//,
  );
  for (const state of ["start", "check", "results"]) {
    const page = readFileSync(new URL(`${state}/index.html`, route), "utf8");
    assert.match(page, /name="robots" content="noindex, nofollow"/);
    assert.doesNotMatch(
      sitemap,
      new RegExp(`workplace-ai-visibility-check/${state}/`),
    );
  }
});
