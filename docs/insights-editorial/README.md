# Insights editorial continuation

**Scope and dependency:** Insights hub, eight generated article pages, their generator and `insights.css`. This Standard visual change starts from merged `origin/main` at `e886e69` and has no dependency on See WAIA PR #106. Markdown sources were not edited.

| Page                                    | Desktop                                   | Mobile                                  |
| --------------------------------------- | ----------------------------------------- | --------------------------------------- |
| Insights hub                            | [1440px full page](hub-1440-full.jpg)     | [390px full page](hub-390-full.jpg)     |
| Representative article with data tables | [1440px full page](article-1440-full.jpg) | [390px full page](article-390-full.jpg) |

## Implementation

`scripts/build-insights.mjs` owns the site shell and all generated Insights markup. It now emits the approved editorial navigation and footer, skip link, shared `editorial-pages.css` foundation and font preloads. The article source renderer, metadata construction, slug handling and structured-data construction are unchanged. The latest article receives a visual featured class; the remaining articles use open, ruled editorial entries rather than product cards. Article pages use an open reading column, the established type hierarchy and locally scrollable data tables. The hub and article conversion routes remain where they were.

Generated HTML was rebuilt from the unchanged Markdown and formatted for a reviewable diff. Future article publishing uses the same generator and page stylesheet. The normal publishing sequence is `node scripts/build-insights.mjs` followed by formatting the generated HTML before committing.

## Factual and functional change record

- Historical article body copy, source links and citations are unchanged. The hub headline, introduction, article titles, dates, categories, reading times, excerpts and CTA copy are unchanged.
- All nine pages retain their canonical URLs, SEO/social metadata and JSON-LD values. The article slugs and publication dates remain unchanged.
- The Tally walkthrough URL and attribution script, internal conversion routes, sign-in, analytics script and privacy links are preserved. No new dependency or tracking behaviour was added.
- Presentation changes are limited to the generator's shared shell, one featured-article class and `insights.css`.

## Verification and review

- Semantic comparison against `origin/main`: all nine pages have equal title, meta values, canonical, JSON-LD and date attributes; all eight article body text and link lists match exactly after whitespace normalization.
- Browser: hub and representative article full-page previews at 1440px and 390px; no horizontal overflow at 320, 390, 768, 1024 or 1440px; article data tables scroll inside their own wrappers on mobile; fonts loaded; menu opened and closed with Escape; walkthrough links resolve through the direct attribution handoff; no console errors.
- Repository suite: `node --test scripts/*.test.mjs` — 74 passed. All nine generated pages reproduced byte-for-byte after a repeat build and formatting pass. Prettier and `git diff --check` passed. Each page has one H1, unique IDs and resolving local references.
- Remaining: owner visual review, screen-reader and actual 200% zoom checks, field performance and live attribution verification before merge/release. External citations were compared but not all visited.

**Delivery learning:** Standard risk. Human supervision effort is not tracked; no escaped defect is known.
