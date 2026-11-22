import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(
  new URL("../pricing/index.html", import.meta.url),
  "utf8",
);
const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
const text = main
  ?.replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&")
  .replace(/\s+/g, " ")
  .trim();

test("pricing keeps the approved commercial provisions and scope boundaries", () => {
  assert.ok(text, "Pricing main content must exist");
  for (const provision of [
    "The Order Form records the number of learner licences, the subscription start and end dates, and the total subscription price.",
    "The signed Order Form confirms the amount in GBP, plus applicable taxes. WAIA does not renew automatically.",
    "If implementation services are needed, their selection, scope and price are set out in the signed Customer Order Form. They do not create an entitlement to continuing consultancy.",
    "The full subscription fee and any agreed implementation fee appear on one upfront invoice. Payment is due within 30 days unless the signed Customer Order Form says otherwise.",
    "Bespoke policy drafting.",
    "Custom learning content.",
    "Managed programme ownership.",
    "System integrations.",
    "Unlimited advisory time.",
  ]) {
    assert.ok(
      text.includes(provision),
      `Missing commercial provision: ${provision}`,
    );
  }
});

test("pricing retains the approved inclusions and enquiry path", () => {
  for (const inclusion of [
    "Agreed learner licences.",
    "Organisation administration.",
    "Standard learning pathways and toolkit.",
    "Organisation-specific workplace AI guidance.",
    "Acknowledgement and completion records.",
    "Application Evidence capture.",
    "Admin dashboards, evidence views and review signals.",
    "AI Baseline assessment.",
    "AI Use Inventory.",
    "Organisation views of learning and evidence.",
    "Standard email support.",
    "Product and content updates.",
  ]) {
    assert.ok(text.includes(inclusion), `Missing inclusion: ${inclusion}`);
  }
  assert.equal(
    (
      html.match(
        /https:\/\/tally\.so\/r\/objzGM\?product=WAIA&amp;enquiry_type=walkthrough/g,
      ) ?? []
    ).length,
    3,
  );
  for (const script of ["nav.js", "source-attribution.js", "analytics.js"]) {
    assert.ok(html.includes(`/assets/js/${script}`));
  }
  assert.ok(
    html.includes('<link rel="canonical" href="https://waia.co.uk/pricing/"'),
  );
});
