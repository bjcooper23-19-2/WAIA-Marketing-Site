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

## Local protected QA continuation (22 November 2026)

**Recommendation: do not merge or publish yet.** This pass used a checkout of PR #110 at its candidate head, an isolated local preview, and read-only visits to the public Tally forms. It did not submit a real enquiry, redeem a real access token, inspect supplier account settings or deploy the site.

- **PASS, repository tests:** `node --test scripts/*.test.mjs` completed with 79/79 passing after release-specific fixes. The fixed footer-count assertion had assumed 24 pages; the six new legal pages bring the actual footer count to 30. The legal-link regression now detects the old company wording even when line-wrapped.
- **PASS with focused correction, Insights:** `node scripts/build-insights.mjs` completed for eight articles. A token-level HTML comparison of all nine generated files against the pre-run files found one semantic difference: the approved operator identity in each footer. The generator also reformats thousands of lines, so the branch retains the existing formatted HTML and applies only that identity correction. The generator source already emits the approved identity.
- **PASS, source diff:** `git diff --check` and the PR base-to-head whitespace check passed after removing one trailing-space line. The release patch also removes a repeated Tally sentence from the Cookie Notice and aligns old footer identity across public and enquiry pages.
- **PASS, local desktop/phone rendering:** On the PR checkout at 1280×800 and 390×844, all six new legal routes, See WAIA, and the six Visibility Check routes opened without horizontal page overflow or broken first-party legal links. Legal pages have one H1 and loaded images. The Privacy and Cookie tables scroll inside focusable regions on phones; ArrowRight moved the focused table. The phone menu expanded and exposed the navigation. Source and browser checks covered the intended Tally handoff URLs; automated tests cover fail-open and invalid-token paths.
- **PARTIAL, live Tally:** Both public Tally form URLs loaded. The Visibility Check form visibly renders “Privacy Policy” as two adjacent links: “Privacy” points to `https://waia.co.uk/data-privacy/`, while “Policy” still points to `https://legal.nineteenpointtwo.com/privacy/`. This is a release-blocking external form configuration/content defect; correct the live Tally form to one WAIA UK Privacy Notice link at `https://waia.co.uk/privacy/` and verify its rendered link. The walkthrough form's first screen showed no privacy link. Hidden-field capture, optional tracking/partial-save settings and actual submission delivery remain unverified because no test submission or form-admin access was used.
- **OPEN, external controls:** Cloudflare automatic injection, other tracker settings and the precise PECR exception conditions remain unverified in the account. Production supplier access, transfer, backup and export/deletion facts and signed Order Form incorporation remain subject to the earlier checks above. No associated GitHub Actions workflow run or PR review was returned for the inspected candidate head; this local pass does not substitute for required CI or human approval.

After the Tally link and external controls are verified, rerun the protected gates on the final PR head, obtain explicit owner merge approval, and perform separate post-deployment live checks before claiming publication complete.

## Owner confirmations and product-security reconciliation (22 November 2026, evening)

**Purpose:** Reconcile WAIA UK PR #110 against the current WAIA Product security findings without implying draft product fixes have reached production.

### Confirmed in the conversation (not independently exercised in this GitHub review)
- **Tally:** Owner reports the live Visibility Check form Privacy Policy link has been corrected and now works. The prior broken split link is closed on **owner confirmation**. This session has not independently reopened the public form; a post-publish form handoff and submission test remains advisable.
- **Cloudflare:** Owner supplied a screenshot of the `waia.co.uk` Real User Measurements setting, with **“Enable with JS Snippet installation”** selected. The option's own description states manual script installation is required. This confirms the selected RUM configuration is *not* automatic injection. Earlier owner browser test showed the manual beacon absent after a saved objection. Does not establish a formal PECR opinion or exclude unrelated tracking features.
- **Database location:** Owner supplied Lovable production database-settings screenshot showing **Europe (Stockholm), PostgreSQL 17.6.1.111**. The region is factually confirmed. The generic database-export button is *not* evidence of a tested per-customer export/deletion process.
- **Tally settings and suppliers:** Owner confirms optional partial-response saving/additional tracking are off and knows of no other recipients than the listed providers. This is owner attestation, not account-admin or supplier-contract verification.

### Security Summary and DPA audit

Source documents checked: `security/index.html`, `data-processing-agreement/index.html`, `subprocessors/index.html`, and the **actual** WAIA product PR #397 description and current product security finding evidence.

- **Finding A, legacy cleanup:** The existing product source contains a privileged prelaunch cleanup function protected using an email claim. The security scan describes a plausible route to previewing user identifiers, addresses and related record counts (and a separate deletion operation exists). The exploit requires identity/authentication conditions that have **not** been established in production. **The code-level removal exists only in draft product PR #397; it is not deployed.** The Security Summary was narrowed from an absolute claim that platform admin access is limited to authorised personnel to intended administrative restriction plus ongoing review/remediation. This is not a substitute for fixing or verifying the privileged endpoint.
- **Finding B, assessment integrity:** Product migrations allowed authorised organisation admins to write derived AI baseline/drag scores directly. This is a plausible evidence-integrity defect, not proof of cross-tenant data exposure. Draft product PR #397 restricts direct writes and adds a trusted atomic score-saving pathway; **the changes are not yet merged or deployed**. The legal text makes no guarantee that derived scores are tamper-proof or independently certified.
- **DPA:** Reviewed processor obligations under Article 28, security measures under Article 32, incident notification, subprocessors, transfer safeguards and return/deletion obligations. **No specific existing security control, certification, fixed backup retention, or guarantee of zero vulnerabilities is claimed as already achieved** in the DPA. These remain binding *future obligations* on any signed Order Form; removing them would not be an appropriate response to scan findings. No current signed WAIA customers have been reported. No DPA edits were justified by these two findings alone.
- **Subprocessor List:** Role and Stockholm location descriptions remain aligned with owner screenshot and known provider architecture. It does not claim independent auditing of the entire supplier chain or guaranteed UK-only processing.

**Risk and release interpretation:** Marketing PR #110 and product PR #397 have independent engineering release workflows. Publishing accurate legal documents does not remediate a product vulnerability. This review does **not** certify the deployed WAIA application as secure, compliant or free of the two findings. A risk owner should explicitly accept or mitigate exposure from the privileged cleanup pathway before relying on the Security Summary for procurement, and the product security release must remain prioritised. Avoid claiming the product findings resolved until #397 is merged, migrated, deployed and hosted-denial-tested.

### PR #110 readiness delta

- Closed on owner confirmation: live Tally privacy-link defect.
- Closed by screenshot: Cloudflare RUM **manual snippet installation** and production database location.
- Completed in repo: Security Summary wording reconciliation; DPA read for contradiction, no change justified.
- Remaining independent release evidence: final head QA for the single text edit, real Tally submission/Visibility Check handoff and URL check after publication, any supplier account verification material to claims, targeted PECR legal review, and explicit approval for protected merge/publish.

**Do not describe the external controls as fully audited.** PR remains draft pending final release authorisation and any material risk-disposition decision. Product PR #397 is still separate and draft.
