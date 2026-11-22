# Legal and utility presentation review

This branch starts from `origin/main` at `e886e69` (the merged Pricing release). It is independent of the open See WAIA, Insights and Visibility Check PRs. The work touches Protected privacy and legal surfaces, so the review boundary is presentation only.

| Route | Existing content | Presentation change |
| --- | --- | --- |
| `/data-privacy/` | Product and data boundaries, document destinations, procurement enquiry | Approved light editorial shell, type, section rhythm and document list |
| `/terms/` | Terms of Service, version 1.2, 15 October 2026 | Narrow reading column and approved shell |
| `/ai-use-statement/` | Product and AI Use Statement, version 1.1, 9 September 2026 | Narrow reading column and approved shell |
| `/analytics-preferences/` | Analytics status, object/allow controls, Cookie and Privacy Notices | Approved shell and legible control layout |
| `/404.html` | Page-not-found guidance and route links | Approved shell and a simple light recovery layout |

## Factual and functional record

- No substantive page-body copy or claims changed. Main text, main links, control IDs, script URLs, and canonical/alternate links were compared with `origin/main` and matched for the four legal/privacy routes. The 404 main content and scripts likewise remain unchanged.
- The existing legal document dates and versions remain visible. There are no proposed changes to contractual language.
- The Analytics Preferences page still loads `nav.js` and `analytics-preferences.js` only; no analytics loader was added to that page. Browser checks confirmed that Object to analytics turns the status off and reveals Allow analytics, and that allowing restores the original state.
- The shared header and footer add the approved site navigation and retain the legal, privacy, cookie, market, sign-in and enquiry destinations. Existing attribution and analytics scripts on other routes remain unchanged.
- The Visibility Check request/access/check/results routes, redemption API and Worker were not edited.

## Previews

All images are full-page browser renders at the stated viewport width.

| Route | 1440px | 390px |
| --- | --- | --- |
| Data & Privacy | [Desktop](data-privacy-1440-full.jpg) | [Mobile](data-privacy-390-full.jpg) |
| Terms | [Desktop](terms-1440-full.jpg) | [Mobile](terms-390-full.jpg) |
| AI Use Statement | [Desktop](ai-use-statement-1440-full.jpg) | [Mobile](ai-use-statement-390-full.jpg) |
| Analytics Preferences | [Desktop](analytics-preferences-1440-full.jpg) | [Mobile](analytics-preferences-390-full.jpg) |
| 404 | [Desktop](404-1440-full.jpg) | [Mobile](404-390-full.jpg) |

## Checks and remaining verification

- `node --test scripts/*.test.mjs`: 74 passed.
- Prettier and `git diff --check` passed.
- The four protected routes retain their main text, main link URLs, control IDs, script URLs and canonical/alternate URLs, verified against `origin/main`.
- Local file links and assets on the five changed pages resolve. Browser checks at 320px, 390px, 768px and 1440px found no horizontal overflow; mobile navigation opens and closes with Escape.
- The preference buttons were tested in the local browser, with the original “on” state restored. This does not verify Cloudflare beacon delivery in production.
- Manual accessibility review beyond keyboard navigation and focus affordances, live external legal destinations, production analytics behavior, and site performance remain for review. No legal approval is requested for a text change because none was made; an owner should confirm the visual treatment before merge.
