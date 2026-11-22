# WAIA UK standalone legal launch | Release readiness, 22 November 2026

**Status: Publication candidate prepared in Draft PR #110, not merged, not deployed, not live-verified.** Treat this as a protected legal/privacy release. No assumption that a passing source check proves production compliance.

## Owner-confirmed (closed)
- Nineteen Point Two Limited trading as WAIA, not a new company; no existing signed WAIA contracts.
- WAIA contact email ben@waia.co.uk, owner-confirmed working alias to ben@nineteenpointtwo.com.
- Exclude special category personal data unless expressly agreed; manual export and deletion subject to law/backups.
- Paid subscriptions require signed Customer Order Form incorporating WAIA UK Terms and DPA; no automatic renewal unless expressly agreed.
- Cloudflare Web Analytics remains enabled; used exclusively for website statistics and site improvement, not profiling, ads or behavioural targeting.
- Retain Tally. Owner has not enabled additional form tracking or optional partial-submission saving.
- No further WAIA learner/customer-data recipients known to owner beyond Lovable/Supabase, Resend, Cloudflare, Tally and Google-based Visibility Check process.
- Use limited evidence-led security and backup statements; owner prefers earliest defensible release.

## Source-verified
- WAIA analytics source is controlled by a browser localStorage objection; when storage is unreadable, the beacon does not load.
- Live owner browser check (22 November): beacon loaded when analytics permitted, absent on reload after objection. Does not verify every Cloudflare account setting.
- Visibility Check assessment answers and optional note fields held in sessionStorage; source attribution does not write session storage.
- WAIA app Supabase authentication configured to persist session; normal domain uses localStorage.
- Six first-party legal pages exist with version 1.0 date 22 November 2026, their canonical URLs and no review-only banners/noindex.
- Core links, legal hub, preference page, Visibility Check and eight generated Insights article links point to first-party WAIA legal URLs. Insights generator uses the same destinations. Sitemap contains six proposed legal routes.
- Source inspection covered 19 public/core routes and found no remaining legal.nineteenpointtwo.com references. Targeted source assertions passed in the connected GitHub session; repeatable test added at `scripts/legal-links.test.mjs`. **Node test not executed in a local repository or CI.**

## Factual/legal exceptions still needing verification
1. **Cloudflare:** confirm no automatic second beacon or non-exempt purpose, all source settings consistent with objection, and statutory statistical-purposes exception application. Owner's sole-purpose statement and public provider claims make this plausible but do not constitute formal PECR sign-off. Keep analytics enabled per owner direction. See `CLOUDFLARE-PECR-SELF-ASSESSMENT.md`.
2. **Tally:** owner disabled optional tracking and partial-saving; independently inspect live form privacy-policy link, service storage disclosures and current form settings, including the historical nested privacy-link issue.
3. **Hosted app/supplier facts:** check production tenant access restrictions and provider roles, data location and transfer safeguards where represented, incident response and DPA export/deletion procedures. The Security Summary no longer promises an exact backup period or point-in-time availability, but cannot substitute for the provider's actual security terms.
4. **Contract materials:** before first paid WAIA order, ensure the Order Form directly incorporates /terms/ and /data-processing-agreement/ at agreed version/date and archive the copies. A focused solicitor review is recommended for binding DPA clauses and the PECR interpretation.
5. **Delivery validation:** run `node scripts/build-insights.mjs` and confirm generated output is unchanged/expected, `node --test scripts/legal-links.test.mjs`, other relevant repository QA, and a desktop/mobile/keyboard review. Test real public URLs, cookie preference, and Tally handoffs after release; a GitHub merge or successful build is not deployment verification.

## Acceptance decision

The technical publication candidate is prepared, but **the PR must remain draft and unmerged until the above factual/security checks and protected release verification have completed**. No separate user questionnaire is needed. The current legal host remains live/unchanged until the WAIA routes are deployed and verified.

If the solicitor later identifies a required statutory change, update the published notice and implementation. An owner preference to keep analytics on does not independently establish PECR compliance.

## Focused protected QA pass (22 November 2026)

**Scope:** GitHub branch PR #110, public supplier/ICO guidance, 38 repository HTML routes, JavaScript source and six legal documents. No direct access to hosted Cloudflare/Tally settings, deployed database, live browser or local checkout available through this connection.

### Results and fixes
- **PASS, static:** Exhaustive review of all **38 HTML files** on the candidate branch for corporate legal URLs and corporate-site links. Three additional legacy legal/footer dependencies were found in `workplace-ai-visibility-check/access/`, `check/` and `results/`, plus the old footer in `start/`. All four pages corrected. Intentional noindex for access/check/results/start remains unchanged.
- **PASS, static:** All 38 HTML files' root-relative `href` and `src` targets checked against the current recursive Git tree. No missing first-party destination identified.
- **PASS, static:** Six legal documents' key semantic container tags were balanced, each with one H1 and existing local CSS. Improved legal notice table wrapping, keyboard region focus and semantic column headers (Privacy two tables, Cookies one).
- **PASS, static:** Six legal pages have WAIA self-canonical URLs, 1.0 publication-version metadata, no draft/noindex markers and owner-confirmed trading identity/contact. Sitemap includes six routes.
- **PASS, static:** 22 JavaScript/MJS source files inspected for unwanted corporate links; matches were confined to deliberate negative assertions in test files. Insights generator and eight generated Insights article footer links use the WAIA destinations.
- **PASS, source:** Supabase migrations for learner evidence and structured use cases have `ENABLE ROW LEVEL SECURITY`, role- and organisation-scoped policies. Authentication code persists session in localStorage on ordinary app domains. **This does not prove deployed migrations or cross-tenant denial in production.**
- **PASS, supplier documentation only:** Tally's partial response capture is an opt-in product feature (owner confirms disabled); Resend publicly provides a DPA including UK transfer clauses, and Cloudflare describes Web Analytics deployment including automatic-injection risks. **Account-specific options and full supply-chain are unverified.**
- **PASS, qualified PECR analysis:** Owner says analytics solely aggregate site statistics/improvement, and the manual source/owner browser objection test aligns with the ICO's statutory exception framework. Still need to verify Cloudflare account configuration including auto-injection and whether all processing is eligible.
- **NOT EXECUTED:** `node --test scripts/*.test.mjs`, `node scripts/build-insights.mjs` and output diff, automated HTML validation, desktop/mobile/keyboard rendering, real Tally form submission, live network/Cloudflare check, and live Supabase tenant isolation. GitHub connector does not run a shell; no associated Actions workflow run appeared at inspected branch head. Do not convert these into pass claims.

### Resulting acceptance
Release source-level audit: **PASS with corrections**. Protected end-to-end release gate: **OPEN** until commands, relevant browser/supplier checks and explicit merge/publish approval. This branch remains a pre-release candidate. No additional owner strategy/questionnaire decisions are required.
