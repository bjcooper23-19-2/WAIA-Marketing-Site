# Visibility Check landing editorial continuation

**Scope and dependency:** `/workplace-ai-visibility-check/index.html` and `assets/css/visibility-landing.css` only. This Protected journey change starts from merged `origin/main` at `e886e69`, with no dependency on See WAIA PR #106 or Insights PR #107.

| View            | Full-page render                 |
| --------------- | -------------------------------- |
| Desktop, 1440px | [Preview](preview-1440-full.jpg) |
| Mobile, 390px   | [Preview](preview-390-full.jpg)  |

## What changed

The public landing now uses `editorial-pages.css` for the approved typography, palette, navigation, footer, buttons, focus and responsive patterns. `visibility-landing.css` is scoped to the public introduction only. The opening keeps the tool name, benefit, sample question, request action, access timing and non-audit boundary together. The existing ask/trace/decide explanation follows in open editorial columns. A navy closing section explains the seven-question result and repeats the request link.

## Factual and functional change record

- The seven areas, summary categories, printable/savable result and browser-tab privacy statement keep their previous meaning. The closing text uses natural contractions; the opening eyebrow now states “seven questions” alongside the existing “free working tool” and “10–15 minutes”.
- Both `Request access` links still point to `/workplace-ai-visibility-check/start/`. The start page, Tally request, emailed access, check, results, storage, redemption and Cloudflare Worker are untouched.
- Canonical and social metadata, analytics and source-attribution scripts, sign-in and supporting routes are preserved. The footer gains the same legal and supporting routes as the approved buyer-journey pages.
- The landing no longer loads `visibility-check.css`; that file continues to serve the functional tool pages unchanged. No new form, eligibility rule, dependency or tracking behaviour was added.

## Verification and review

- Browser: full-page 1440px and 390px renders; no horizontal overflow at 320, 390, 768, 1024 or 1440px; both fonts loaded; mobile menu opened and closed with Escape; clicking `Request access` reached `/start/`, where the existing “Access is not immediate” message was present; no console errors.
- Repository suite: `node --test scripts/*.test.mjs` — 74 passed. Static audit: original metadata and scripts preserved, two request links, one H1, unique IDs and 28 resolving local references. The tracked diff contains only the landing HTML and its stylesheet. Prettier and `git diff --check` passed.
- Remaining: owner visual/copy review, screen-reader and actual 200% zoom checks, field performance and live access-flow verification before merge/release. No request form was submitted.

**Delivery learning:** Protected journey; human supervision effort is not tracked, no rework or escaped defect is known.
