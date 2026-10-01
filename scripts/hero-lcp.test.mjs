import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";

const homepage = readFileSync(
  new URL("../index.html", import.meta.url),
  "utf8",
);
const hero = "assets/product-screenshots/2026-09-30/04-evidence-desktop";

test("homepage hero is eagerly discoverable with responsive sources", () => {
  assert.match(homepage, /rel="preload"[\s\S]*as="image"/);
  assert.match(homepage, /type="image\/jpeg"/);
  assert.match(homepage, /imagesrcset=[\s\S]*04-evidence-desktop-1470\.jpg 1470w/);
  assert.match(homepage, /04-evidence-desktop\.jpg\s+2940w/);
  assert.match(homepage, /src="\/assets\/product-screenshots\/2026-09-30\/04-evidence-desktop-1470\.jpg"/);
  assert.match(homepage, /loading="eager"/);
  assert.match(homepage, /fetchpriority="high"/);
  assert.match(homepage, /width="2940"[\s\S]*height="1730"/);
});

test("hero source files exist and below-fold images remain lazy", () => {
  for (const suffix of ["-1470.jpg", ".jpg"]) {
    assert.equal(existsSync(`${hero}${suffix}`), true, suffix);
  }
  const heroEnd = homepage.indexOf(
    "</section>",
    homepage.indexOf('class="hero"'),
  );
  const belowFold = homepage.slice(heroEnd);
  assert.ok((belowFold.match(/loading="lazy"/g) || []).length >= 1);
});

test("hero preload and image use the same responsive sizing", () => {
  const sizes = homepage.match(/(?:imagesizes|sizes)="([^"]*calc\([^\"]+)"/g);
  assert.equal(sizes?.length >= 2, true);
  assert.equal(sizes[0].replace("imagesizes", "sizes"), sizes[1]);
});
