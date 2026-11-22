# WAIA UK Privacy and Cookie Notices | Protected release candidate

**Status: REVIEW ONLY. DO NOT MERGE OR PUBLISH.**

## Scope delivered
- New proposed first-party routes: `/privacy/` and `/cookies/`.
- Existing WAIA editorial header, footer, typography and legal reading layout reused.
- Each route has a clear internal-review warning and `noindex,nofollow`.
- Full legal-source body text copied from the Nineteen Point Two Legal repository default branch (v1.4, 9 November 2026). **This is the source baseline, not the final WAIA-specific wording.**
- No incoming footer, site navigation, Insight generator, Visibility Check, Tally, DPA, contracts, consent code, analytics, sitemap or legacy URLs changed.

## Wording and approval requirements
Before release, reconcile both source-based pages with the prepared WAIA UK-specific drafts dated 22 November 2026. The drafts are review materials, not legally approved text. In particular:
1. Remove out-of-scope Nineteen Point Two corporate and US processing descriptions; retain the legal entity as controller or processor where applicable.
2. Verify live cookie/storage inventory for marketing, assessment, authentication and third-party Tally; verify suppliers, retention and deletion statements.
3. Obtain the focused UK PECR/statistical exception determination and update controls **if** required. An opt-out is not itself a prior-consent mechanism.
4. Verify the Tally privacy links; prior review identified potentially nested Privacy Policy links.
5. Obtain approval of final exact wording, legal identity, document owners, version numbers and publication dates. Remove the review warnings and `noindex`; add reviewed canonical metadata.

## Verified technical evidence
On 22 November 2026, the site owner observed `beacon.min.js` HTTP 200 initiated by `analytics.js:16` with analytics allowed; after selecting the analytics objection and reloading, no matching beacon script request appeared. This verifies script suppression in that browser, not every Cloudflare setting or legal compliance.

## Controlled implementation after approval
- Update `/data-privacy/`, `/analytics-preferences/`, `/workplace-ai-visibility-check/start/`, all shared footer links, `scripts/build-insights.mjs` and regenerate the nine Insights pages, preserving citations and metadata.
- Preserve `legal.nineteenpointtwo.com` URLs for existing contracts; do **not** redirect the DPA.
- Add approved canonical/sitemap entries only after approval.
- Verify page content, mobile/keyboard/200%-zoom presentation, links and the Visibility Check and Tally handoffs, then check live deployment explicitly.
- Legal/owner approval and separate merge/publish authorisation required.

## Explicit non-goals
No WAIA USA or Outside Clarity changes; no change to WAIA Terms, DPA, platform, legal host, DNS, Cloudflare configuration or enquiry tracking.

**Do not treat this draft PR as an assertion that either notice is complete or approved.**
