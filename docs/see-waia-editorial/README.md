# See WAIA editorial continuation

**Scope:** `/see-waia/` only. Protected journey because the page leads to an external enquiry form; the form, handoff routes and scripts are unchanged. This branch starts from `origin/main` at `e886e69` (merged PR #105).

| Review view     | Full-page render                 |
| --------------- | -------------------------------- |
| Desktop, 1440px | [Preview](preview-1440-full.jpg) |
| Mobile, 390px   | [Preview](preview-390-full.jpg)  |

## What changed

The page uses the approved `editorial-pages.css` foundation for fonts, palette, navigation, footer, buttons, focus and responsive patterns. `see-waia.css` now contains only its four page compositions. The hero introduces the walkthrough and enquiry action, the four questions to bring sit in an open editorial list, and the three existing management questions sit beside the genuine WAIA Evidence screenshot. A separate section explains that a walkthrough can demonstrate the method and discuss fit, but cannot establish the visitor's own outcomes before real evidence exists. The closing action keeps pricing, privacy and organisational-fit routes.

## Factual and functional change record

- New wording: the hero and agenda explain what a walkthrough can show, invite a question from the visitor's work, and make the follow-up explicit. The limits section adds a clear qualification about organisation-specific results. No customer result or guaranteed outcome is asserted.
- Retained: the three use, impact and decision explanations, four preparation questions, genuine Evidence screenshot and full-size link, canonical/hreflang/social metadata, sign-in and supporting links, Tally form URL and `product=WAIA&enquiry_type=walkthrough`, source attribution, navigation, Cloudflare analytics and privacy behaviour.
- Presentation only: removed the old boxed card and navy section treatment. No new form, dependency or downstream integration was added.

## Verification and review

- Repository suite: `node --test scripts/*.test.mjs` — 74 passed. Prettier and `git diff --check` passed. Static audit: one H1, four sections, unique IDs, 33 resolving local references, three correctly parameterised Tally links and unchanged navigation, attribution and analytics scripts.
- Browser: 1440px and 390px full-page renders; no horizontal overflow at 320, 390, 768, 1024 or 1440px. Genuine screenshot and both font families loaded. Mobile menu opened and closed with Escape. All three enquiry links resolved to `/go/see-waia/li/` when `?s=li`; direct route was also observed. No console errors.
- Remaining: owner visual and copy review, screen-reader and actual 200% zoom checks, field performance and live Tally/Cloudflare verification before release. The form was not submitted.

**Delivery learning:** Protected journey; human supervision effort is not tracked, one copied navigation state was corrected during review, and no escaped defect is known.
