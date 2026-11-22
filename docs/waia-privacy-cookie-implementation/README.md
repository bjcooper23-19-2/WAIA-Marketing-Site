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

## Owner direction: WAIA UK standalone legal destination (22 November 2026)
The intended public brand is **WAIA**, with clear identification of **Nineteen Point Two Limited trading as WAIA** as the operating and contracting company, subject to verification of corporate trading disclosures and approval of exact wording.

The branch now also includes **review-only** candidate pages for:
- `/website-terms/` (source v1.1, 15 October 2026)
- `/security/` (source v1.2, 15 October 2026)
- `/subprocessors/` (source v1.3, 15 October 2026)

They reuse the WAIA editorial layout but preserve original source text for redlining. The pages are not final WAIA UK-specific notices; they retain clear review warnings and noindex.

**Current WAIA documents remain:** `/terms/` and `/ai-use-statement/`. The legal-source DPA v1.4 (11 November 2026) explicitly incorporates `legal.nineteenpointtwo.com/data-processing-agreement/` for signed agreements. New agreements can use a future WAIA-hosted DPA only after contract-owner sign-off and a controlled Order Form/version cutover. Existing agreed terms and source URLs must remain retrievable. Do not redirect the original DPA URL.

**Cut ties means customer-facing link and publication independence, not changing the operating company, deleting a legal archive or breaking signed customer agreements.** No existing customer-facing link should be repointed until the exact destination is approved, tested and live. The old corporate marketing website and shared legal estate are outside this PR's implementation authority.

**Release execution proposal:** Replace corporate source baseline in the five candidates with approved WAIA UK-specific documents, create the approved WAIA DPA for new contracts if signed-version rules permit, set approved canonicals/date/version, remove noindex, verify company disclosure and registered office, update all site and generated links, add sitemap routes, test end-to-end, then obtain separate merge and publication approval. Legal owner must confirm which documents can be approved while the PECR consent assessment and supplier inventory remain open.

## Reconciliation update: owner confirms no existing customer contracts (22 November 2026)

The owner confirms WAIA currently has **no signed customer contracts**. The proposed migration can therefore designate WAIA UK documents as the initial authoritative set for future contracts, rather than maintaining multiple incorporated versions for existing WAIA customers. Verify before release that no other signed WAIA agreements, Order Forms or procurement commitments exist.

**On this draft branch:**
- Six proposed WAIA UK document routes now exist: Website Terms, Privacy, Cookies, DPA, Security and Subprocessors. Existing WAIA `/terms/` and `/ai-use-statement/` remain part of the standalone suite.
- All six candidates were reconciled towards UK-only WAIA scope and linked internally to the future WAIA document routes. Existing source material and commercial/legal protections are retained where possible; specific edits include WAIA company/trading-name presentation and proposed DPA/UK terms incorporation.
- `/terms/` now references the proposed WAIA-hosted DPA on **this draft branch only**; the live contract URL has not changed. The Customer Order Form template and any pre-contract materials must be aligned to both `/terms/` and `/data-processing-agreement/` before first signature.
- Original legal-host URLs need not remain the entry point for new WAIA customers, but should not be deleted or redirected until legacy inbound links and the corporate legal estate are separately reviewed.
- The documents still contain review warnings and noindex directives. They use former document dates/versions as **source provenance**, not approved WAIA publication versions. Legal and factual approval is outstanding.

**Outstanding mandatory factual and approval checks:**
1. Verify Nineteen Point Two Limited's accurate registered identity and registered office, and approve the trading-as-WAIA disclosure.
2. Verify privacy data categories, supplier processing/locations, retention/security promises and controller/processor roles against production.
3. Complete the limited live browser storage/Tally check and legal assessment of Cloudflare analytics, Visibility Check storage and PECR before publishing corresponding claims.
4. Have appropriate legal/privacy/contract reviewers approve the exact six revised documents and updated Terms, with source comparisons and version dates.
5. Approve the Customer Order Form terms/DPA URLs and ensure the first sales contract uses the approved versions.
6. Only after those gates, remove review/noindex controls, set WAIA canonical URLs and sitemap entries, update the common footer, Data & Privacy hub, Analytics Preferences, Visibility Check request links, and Insights generator output. Run layout/accessibility, links and functional checks before merge/publish.

**Do not merge this PR in its current state.** It stages proposed documents and a contract-link change, not final authorised legal text.
