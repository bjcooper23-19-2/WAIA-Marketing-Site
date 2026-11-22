# Pricing editorial continuation

**Scope and risk:** `/pricing/` only. Protected because the page presents commercial terms. The released homepage and PR #104's shared editorial foundation are the design references. No pricing model, agreement, form, analytics or legal route was changed.

## Review renders

| View            | Full-page preview                |
| --------------- | -------------------------------- |
| Desktop, 1440px | [Preview](preview-1440-full.jpg) |
| Mobile, 390px   | [Preview](preview-390-full.jpg)  |

## Old-to-new content map

| Previous page                                              | New presentation                                                                                                                                                                              |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero, four commercial metrics and repeated Order Form lede | Light editorial hero with the same headline, a benefit-led introduction and four open commercial facts.                                                                                       |
| Navy “What you're buying” panel and subscription section   | Benefit explanation moves into the hero and inclusions introduction. The fixed licence, date, GBP and tax terms sit together in a pale “How pricing works” section.                           |
| Four boxed inclusion categories                            | Four open, two-column editorial groups. Every inclusion bullet is unchanged.                                                                                                                  |
| Standalone implementation section                          | Optional implementation sits beside the existing five standard-scope exclusions.                                                                                                              |
| Paired invoice and exclusions cards                        | Invoice and payment timing get a short navy section; the exclusion list sits with implementation. Protected sentences and exclusion bullets are unchanged.                                    |
| Eight FAQ answers                                          | Four distinct questions remain. Licence quantity, licence term and pricing answers are consolidated into the prominent terms section; the first-enquiry answer is already in the closing CTA. |
| Closing walkthrough CTA                                    | Same invitation and enquiry destination, using the shared editorial footer and buttons.                                                                                                       |

## Editorial change record

- The hero's commercial-process lede became a short explanation of Guidance, learning and evidence from real work. The four commercial facts and detailed term section retain the original process information.
- “What you're buying” moves from a negative comparison with an AI content library to a direct explanation of the integrated service and included capabilities. It does not introduce a new result or customer claim.
- Inclusion category names and bullets are retained. New editorial subheadings explain their role: access, shared expectations, a starting picture and service support.
- “One agreed scope” becomes “One scope, agreed in the Order Form.” The protected body copy is unchanged, aside from splitting the original paragraph so optional implementation is explained beside the exclusions.
- The invoice heading becomes “One upfront invoice.” Its protected body copy is unchanged.
- “Short answers before the first call” becomes “A few useful details before we talk.” Four duplicate FAQ entries were removed as mapped above. The retained answers are unchanged.
- The next-step CTA text and all enquiry URL parameters are unchanged. Natural contractions in the existing legal/compliance answer are retained.

## Protected commercial provisions

The following statements retain the previous page's wording and meaning. The regression test in `scripts/pricing-commercial.test.mjs` guards the exact sentences and inclusion/exclusion lists.

| Provision                                                                                                                                      | Current location                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| Learner licences agreed per organisation; fixed start/end dates; total subscription price in the signed Order Form                             | Hero overview and “How pricing works” |
| Total amount in GBP plus applicable taxes; no automatic renewal                                                                                | “How pricing works”                   |
| Implementation optional, with selection, scope and price in the signed Customer Order Form                                                     | “Optional implementation” and FAQ     |
| No entitlement to continuing consultancy                                                                                                       | “Optional implementation” and FAQ     |
| Full subscription plus any agreed implementation fee on one upfront invoice; 30-day payment unless the signed Form says otherwise              | “Payment”                             |
| Bespoke policy drafting, custom learning content, managed programme ownership, integrations and unlimited advisory time outside standard scope | “Outside the standard scope”          |

No numerical prices, tiers, monthly billing, trials, discounts, consultancy entitlement or guarantees were added. No protected-term rewrite is proposed for owner approval.

## CSS and functionality scope

Pricing now uses `assets/css/editorial-pages.css` for self-hosted Instrument Serif and DM Sans, palette, buttons, navigation, footer, focus states, spacing and responsive behaviour. `assets/css/pricing-page.css` contains only Pricing-specific compositions. The shared stylesheet and other page files were not edited. The original canonical/social metadata, Tally destination and parameters, sign-in/supporting routes, source attribution script and Cloudflare analytics loader remain.

## Verification and review

- Repository suite: `node --test scripts/*.test.mjs` — 74 passed, including two new Pricing commercial regressions.
- Prettier and `git diff --check` — passed. Static audit: one H1, seven sections, unique IDs and 31 resolving local references.
- Browser checks: full-page 1440px and 390px previews; no horizontal overflow at 320, 390, 768, 1024 or 1440px; self-hosted fonts loaded; mobile menu opened and closed with Escape; all three enquiry CTAs resolved through `/go/see-waia/direct/`; no browser console errors.
- Remaining: owner visual, editorial and commercial review; screen-reader pass, 200% browser zoom and field performance check before merge/release. The Tally form was not submitted.

**Delivery learning:** Protected risk. Human supervision effort is not tracked; no escaped defect is known.
