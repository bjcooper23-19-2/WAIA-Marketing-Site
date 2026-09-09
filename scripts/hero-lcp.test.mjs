import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";

const homepage = readFileSync(
  new URL("../index.html", import.meta.url),
  "utf8",
);
const hero = "assets/images/waia/waia-evidence-overview-hero";

test("homepage hero is eagerly discoverable with responsive modern and fallback sources", () => {
  assert.match(homepage, /rel="preload"[\s\S]*as="image"/);
  assert.match(homepage, /type="image\/avif"/);
  assert.match(homepage, /imagesrcset=[\s\S]*hero-840\.avif 840w/);
  assert.match(homepage, /<picture>/);
  assert.match(homepage, /hero-840\.avif 840w/);
  assert.match(homepage, /<img[\s\S]*waia-evidence-overview-hero\.webp/);
  assert.match(homepage, /loading="eager"/);
  assert.match(homepage, /fetchpriority="high"/);
  assert.match(homepage, /width="1675"[\s\S]*height="932"/);
});

test("hero source files exist and below-fold images remain lazy", () => {
  for (const suffix of ["-840.avif", ".avif", "-840.webp", ".webp"]) {
    assert.equal(existsSync(`${hero}${suffix}`), true, suffix);
  }
  const heroEnd = homepage.indexOf(
    "</section>",
    homepage.indexOf('class="hero"'),
  );
  const belowFold = homepage.slice(heroEnd);
  assert.ok((belowFold.match(/loading="lazy"/g) || []).length >= 3);
});

test("hero preload and image use the same responsive sizing", () => {
  const sizes = homepage.match(/(?:imagesizes|sizes)="([^"]*calc\([^\"]+)"/g);
  assert.equal(sizes?.length >= 2, true);
  assert.equal(sizes[0].replace("imagesizes", "sizes"), sizes[1]);
});
