# WAIA UK homepage production review

This branch implements the approved light editorial homepage on top of `main` at `ea8c786`. The refined local prototype remains on `codex/homepage-editorial-prototype` at `5b12480`. Copies of its final 1440px and 390px renders are kept here for direct comparison with the production implementation:

| Width | Approved prototype | Production implementation |
| --- | --- | --- |
| 1440px | [full page](approved-prototype-1440-full.jpg) | [full page](preview-1440-full.jpg) |
| 390px | [full page](approved-prototype-390-full.jpg) | [full page](preview-390-full.jpg) |

## Implementation and differences

The eight sections, light palette, Instrument Serif and DM Sans pairing, canonical Open Wayfinder assets, softened hero Evidence image, smaller overlapping Admin Home image, and wide Evidence plus compact Admin Home detail are carried through from the prototype. The Admin Home detail is a content-only crop of the genuine demo-account screenshot; its caption identifies the context. The crop is not redrawn.

The production page keeps the existing canonical and social metadata, source-attributed Tally enquiry URLs, guarded analytics loader, and current internal routes. The responsive menu uses the site's existing `nav.js` and keeps Escape-to-close behaviour. The footer marks the UK market as current and preserves its legal/privacy and analytics-preferences links. The Evidence caption, two worked-example qualifications and three trust-boundary bullets use natural contractions; their claims are unchanged. These are the material differences from the prototype. No pricing, customer proof or product evidence has been added.

The self-hosted font files are the original Google Fonts TTFs with their SIL Open Font License files. They are retained from the prototype to ensure visual fidelity and remove a third-party font request. A WOFF2/subsetting performance improvement should be considered before merge if field measurements show a material cost; no such substitution was available in this local environment.

## Checks and approval gate

- `node --test scripts/*.test.mjs`: 72 passed.
- `prettier --check` for the changed HTML, CSS and test: passed.
- Static page check: eight sections, one H1, unique IDs and all 38 local references resolve.
- Browser review: full-page 1440px and 390px captures; no horizontal overflow at 320, 390, 768 or 1440px; all product images and both font families loaded; the mobile menu opened and closed with Escape; enquiry links resolved to the existing same-origin attribution handoff.
- `git diff --check`: passed.

The owner still needs to approve the production render and complete the focused editorial pass. A screen-reader review, actual 200% browser-zoom review, field performance/CLS measurement and downstream Tally submission check remain outstanding. This PR must not be merged, deployed or published before human approval.

**Delivery learning note:** Standard risk. The owner approved the direction after one imagery and legibility refinement pass. Human supervision time is not tracked; no escaped defect is known.
