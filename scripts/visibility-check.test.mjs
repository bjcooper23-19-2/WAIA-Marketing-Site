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

test("mostly middle gives a fragmented operating picture and relevant capabilities", () => {
  const result = buildResult({ ...all("partial"), data: "visible" });
  assert.equal(result.pattern, "fragmented");
  assert.match(result.headline, /activity.*consistent operating picture/i);
  assert.deepEqual(result.priorities.map(({ id }) => id), ["visibility", "review", "capacity"]);
  assert.deepEqual(result.capabilities, ["Evidence for managers", "Human review and judgement", "Turning AI-created capacity into useful work"]);
  assert.match(result.meaning, /shared visibility and repeatability/);
  assert.match(result.start, /one recurring workflow/);
  assert.equal(Object.hasOwn(result, "score"), false);
});

test("mostly strong moves towards scaling and value", () => {
  const result = buildResult(all("visible"));
  assert.equal(result.pattern, "emerging");
  assert.match(result.headline, /foundations/);
  assert.deepEqual(result.priorities.map(({ id }) => id), ["scaling", "value", "capacityOpportunity"]);
  assert.match(result.start, /compare how two teams/);
});

test("mostly weak starts with discovery", () => {
  const result = buildResult(all("unclear"));
  assert.equal(result.pattern, "limited");
  assert.equal(result.priorities[0].id, "discovery");
  assert.match(result.start, /ask the people doing it/);
  assert.doesNotMatch(result.start, /scale|reinvest/i);
});

test("mixed answers surface the strongest contrast", () => {
  const result = buildResult({ ...all("partial"), use: "visible", work: "visible", data: "visible", review: "unclear", capacity: "unclear" });
  assert.equal(result.pattern, "contrast");
  assert.match(result.interpretation, /strongest contrast/);
  assert.deepEqual(result.priorities.map(({ id }) => id), ["review", "capacity", "practice"]);
  assert.match(result.priorities[0].title, /unclear/);
  assert.match(result.priorities[1].title, /unclear/);
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
  for (const state of ["start", "access", "check", "results"]) {
    const page = readFileSync(new URL(`${state}/index.html`, route), "utf8");
    assert.match(page, /name="robots" content="noindex, nofollow"/);
    assert.doesNotMatch(
      sitemap,
      new RegExp(`workplace-ai-visibility-check/${state}/`),
    );
  }
});

test("result retains only print/save and WAIA actions", () => {
  const page = readFileSync(new URL("../workplace-ai-visibility-check/results/index.html", import.meta.url), "utf8");
  assert.match(page, /id="print-result"/);
  assert.match(page, /href="\/go\/visibility-check\/"/);
  assert.doesNotMatch(page, /Run the check again|Retake|Improve your score/i);
});
