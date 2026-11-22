# WAIA UK | Legal and factual defensibility review

**Review date:** 22 November 2026
**Materials:** PR #110 proposed six legal documents, WAIA Terms and AI Use Statement; underlying existing Nineteen Point Two legal source; verified Cloudflare owner browser test; current UK ICO and Companies disclosure guidance. **This is an informed drafting review, not a solicitor's legal opinion or proof of operational compliance.**

## Summary

The structure is commercially sensible: Nineteen Point Two Limited is the legal person and WAIA the outward-facing trading identity; public website terms do not substitute for a signed SaaS contract; Customer Order Forms incorporate WAIA Terms and a UK-hosted DPA; controller/processor roles are separated; the Security Summary avoids certifications and guarantees; and the product limits are consistent with its stated scope.

**No-go for current draft publication:** the owner can approve commercial choices, but unverified statements of actual security operations, supplier arrangements and PECR treatment must not be represented as facts. PR #110 stays draft with review warnings/noindex.

## Findings, ranked by material exposure

### P0 | Confirm before external legal reliance
1. **Analytics / PECR:** The WAIA beacon and objection flow were live-tested in one browser on 22 November. This establishes local script suppression only, not Cloudflare's full processing purposes, injection configuration or exemption conditions. UK ICO guidance describes a statistical purposes exception with conditions. Confirm those or switch to prior consent if necessary. Do not equate Cloudflare's 'cookieless' description with consent exemption.
2. **App/storage and Tally:** Browser storage, authentication sessions, upstream third-party forms, and any partial response handling need a live inventory. The prior categorical 'no partial submissions' claims were replaced with a qualified provider-description. Verify Tally form privacy notices and the Visibility Check's Google Apps Script flow.
3. **Data security statements:** The Security Summary asserts row-level security on all public tables, cross-tenant restrictions, service-provider roles, daily backups, ~14-day retention and no point-in-time recovery. Verify against the live WAIA product, database configuration, provider backup terms and controls before publication. Do not publish an unverified restoration or encryption assertion.
4. **Provider / transfer arrangements:** Confirm Lovable, Supabase, Cloudflare, Resend, Tally, Google processing roles, regional hosting, Resend transfer safeguards and direct-vs-underlying supplier status. The subprocessor list and DPA must agree. Contract safeguards and documented transfer assessments cannot simply be inferred from supplier marketing.
5. **Legal identity:** Verify registration, full registered name, current registered office, place of registration, number 15905276 and availability/use of 'WAIA' trading name. Confirm company disclosure is accessible on the website and Customer Order Form. Site copy must avoid implying WAIA is a separate legal company.
6. **Contract incorporation:** Verify no signed WAIA Order Forms, existing proposals or conflicting promises. Ensure the actual Order Form to be signed contains the exact new `waia.co.uk/terms/` and `waia.co.uk/data-processing-agreement/` versions and dates, with an immutable archived copy of each signed version. DPA Article 28 mandatory terms and current UK GDPR regulatory wording merit a targeted legal check before signing.

### P1 | Substantive review
7. **Privacy notice completeness:** Confirm controller lawful bases for each purpose, specific recipients/categories, transfer safeguards, retention schedule or meaningful criteria, source of personal data, statutory/contractual requirements where applicable, rights, complaint route and details of ICO, and whether Article 14 information is needed for organisation-provided user data. Avoid generic statements without actual procedures.
8. **Processor vs controller boundary:** WAIA customer employee progress, evidence and review records are normally processed on customer instructions; technical security/billing/account relationship data can be separately controlled by WAIA. Verify each use and any independent analytics or cross-customer analysis before describing it as legitimate interests.
9. **DPA operational promises:** Verify subprocessor change notice and objection workflow, security incident notification process, user/data request assistance, audit mechanism, data return/deletion timing and backups against what the team could actually execute. The DPA is contractually binding once incorporated.
10. **Commercial Terms:** Check limitation of liability, fees, invoicing, suspension, termination, renewals, support standard, data export, intellectual property and order-of-precedence with the intended Order Form. Preserve fair treatment and non-excludable liabilities. 'Not legal advice' and other disclaimers do not eliminate mandatory duties.
11. **Scope:** WAIA UK website notices should not pretend to describe the US marketing site. Existing terms and DPA may apply to cross-border WAIA customers if chosen in an Order Form; no new claims about geographical data restrictions should be made without confirmation.
12. **Contact identity:** The existing documents use a `ben@nineteenpointtwo.com` contact address. A visible 19.2 email does not create a legal-site dependency, but conflicts with a customer-facing clean WAIA identity. Set and verify a monitored WAIA domain contact before changing it. Never invent a mailbox.

### P2 | Usability/editorial
13. Explain the differences between `/website-terms/` (public content) and `/terms/` (paid SaaS service). Keep product privacy boundaries at `/data-privacy/` distinct from the legal Privacy Notice.
14. Published legal pages need proper version/effective-date control and a clear contact route, not developer test claims or disclaimers such as 'pending legal review' in visitor-facing legal text.
15. Cross-link the six approved UK routes from the legal hub, footer, Analytics Preferences, Visibility Check and generated Insights. Verify no live dependency on `legal.nineteenpointtwo.com` remains after deployment. Do not remove the original legal records or product/US regional switch links without separate assessment.

## Corrections already made in this branch
- UK-specific framing and legal operator/trading name throughout six candidate pages.
- New proposed WAIA-hosted DPA with UK-only contract incorporation; Terms staged to reference it.
- WAIA Terms' subprocessor, cookie and privacy links pointed to the proposed local pages.
- Removed categorical Tally partial-submission claims and removed a dated Cloudflare browser-test statement from public-facing cookie copy. The live test belongs in evidence, not a legal notice.
- Existing original provider/retention specifics remain pending factual verification. **Their retention on this draft branch does not certify them.**

## Release decision

**Status: HOLD FOR FACTUAL VERIFICATION AND LEGAL/COMMERCIAL OWNER APPROVAL.**

No signed contracts means URL migration is simpler, not that DPA duties or UK GDPR/PECR risks disappear. The solicitor can review only the flagged legal interpretations and contract clauses; the owner/product operator should verify service facts. No mandatory extra full legal rewrite identified from this review; follow with targeted corrections once the actual implementation has been checked.

## Legal reference points
- ICO, 'What are the exceptions?' (statistical purposes exception): https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/
- UK GDPR, Articles 13, 14 and 28: https://www.legislation.gov.uk/eur/2016/679
- Companies (Trading Disclosures) Regulations 2015, Part 6: https://www.legislation.gov.uk/uksi/2015/17/part/6
