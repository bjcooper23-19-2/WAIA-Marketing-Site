# WAIA UK standalone legal implementation

**Current source of truth:** [RELEASE-READINESS.md](RELEASE-READINESS.md). This supersedes earlier draft-only staging instructions and records current implementation, owner decisions, source QA and remaining gates.

## Objective and scope
Complete WAIA UK's independent customer-facing legal experience. Nineteen Point Two Limited remains the legal provider, trading as WAIA. The UK site is the public location for Website Terms, Privacy Notice, Cookie and Browser Storage Notice, WAIA Terms, Data Processing Agreement, Security Summary, Subprocessor List and AI Use Statement.

No customer contracts have been signed, so the initial WAIA-hosted Terms and DPA can be established for future Order Forms. Maintain original historical source records; do not delete or redirect Nineteen Point Two's legal repository as part of this website PR.

## Implemented in PR #110
- Six new WAIA UK routes with self-canonicals, version 1.0 dated 22 November 2026 and no draft/noindex placeholders.
- Existing WAIA Terms and AI Use Statement linked into the standalone legal suite.
- Core pages, Data & Privacy hub, Analytics Preferences, Visibility Check, 404 and Insights links updated to WAIA-hosted legal destinations; eight generated articles and generator updated.
- Sitemap includes all six new legal routes.
- Source-level consistency checks completed; repeatable `node --test scripts/legal-links.test.mjs` added but not yet run as Node or CI.

## Release and legal assessment
- [Owner decisions and accelerated release](OWNER-DECISIONS-AND-EARLY-RELEASE.md)
- [Substantive legal defensibility review](LEGAL-SUBSTANCE-REVIEW.md)
- [Qualified Cloudflare PECR assessment](CLOUDFLARE-PECR-SELF-ASSESSMENT.md)
- [Current release readiness and remaining verification](RELEASE-READINESS.md)

**Protected release:** Draft PR; no merge or deployment yet. Run the checks and obtain explicit human authorisation for publishing. A working site is not a substitute for testing Tally links and the actual privacy and enquiry journey.
