# Legal and procurement accuracy review

Reviewed 9 September 2026 for issue #7 against marketing main `49cf9d1` and
the live shared Nineteen Point Two documents. This is a factual consistency
review, not a legal opinion, security certification or verification of signed
supplier agreements. Issue #7 remains open for the dependencies below.

## Corrections in this repository

| Surface                                                          | Finding                                                                                                            | Correction and evidence                                                                                                                                                                                                                                                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Terms sections 2 and 7; AI Use Statement; Data & Privacy records | Legal descriptions omitted workflow evidence and management review records already described by the product pages. | Identify user-submitted frequency, net time change, checking/rework, outcomes, narrative, grouping and review records. The application save schema stores these fields against organisation/user IDs; admin review code records reviewer identity, outcome and context.                                |
| Terms section 7 and AI Use Statement                             | Legal descriptions did not explain the limits of evidence classifications and capacity outputs.                    | Distinguish evidence strength from outcome direction, require human review for validation, and state that indicative capacity is not cash saving or an employee performance score. The application capacity builder uses product rules and returns not-ready, positive, neutral or negative estimates. |
| Terms section 12                                                 | DPA was referenced without a direct link or its precedence rule.                                                   | Link to the existing shared DPA and repeat its section 16 precedence for Customer Personal Data processing. No new contractual priority was invented.                                                                                                                                                  |
| Terms section 19 and AI Use Statement                            | Material-change documentation wording differed from Data & Privacy's existing commitment.                          | Use the same commitment to update customer documents, product notices, privacy information, subprocessors and contractual terms when future AI processing materially changes.                                                                                                                          |
| Model-training commitment                                        | Detailed wording limited the commitment to personal data, and the initial review incorrectly narrowed the summary. | Restore the approved broad Customer Data commitment across the homepage, Data & Privacy, Terms and AI Use Statement. Keep the separate personal-data analysis and processing statements distinct from model training.                                                                                  |
| Terms contact and document versions                              | Contract notice addressee used the short brand name.                                                               | Specify Nineteen Point Two Ltd. Terms and AI Use Statement move to version 1.1, dated 9 September 2026.                                                                                                                                                                                                |

## Evidence inspected

Read-only application reference:
`bjcooper23-19-2/workplace-ai-academy-7ebe4f12` at
`fe7db9d2bab9cf4efa5e84858044e8d26352622d`:

- `src/server-fns/learner-application-evidence.ts`: user-linked evidence fields,
  validation and storage, including optional tool/method context.
- `src/server-fns/application-evidence-confidence.ts`: authenticated admin scope,
  recorded review outcomes and validation context snapshots.
- `src/lib/application-evidence-capacity.ts`: conservative rule-based estimates,
  readiness gates, positive/neutral/negative directions and cash-saving boundary.
- `src/lib/resend-email.server.ts` and `src/lib/transactional-email.server.ts`:
  Resend delivery implementation exists and is configuration-dependent.

The local demo-seed checkout was older than main and was not used as evidence of
current deployment. No application files, environment values, customer data or
supplier settings were changed. Source availability does not prove the exact
production configuration.

## Confirmed accurate without changes

- WAIA is the product; Nineteen Point Two Ltd is operator and contracting party.
  The shared Privacy Notice identifies Nineteen Point Two Limited, company
  15905276, at the same Fareham address used by the Terms. Ltd/Limited is not a
  competing operator identity. Details were cross-checked between documents,
  not independently certified against a company register.
- Customer ownership of Customer Data and supplier ownership/licensing of the
  platform are distinct. The DPA takes priority for personal-data processing.
- The annual eligible-population package remains GBP 5,000 / 7,500 / 12,500 plus
  VAT for up to 50 / 51-100 / 101-250 people, with custom pricing above 250.
  Optional Guided Adoption remains GBP 2,500 plus VAT per year.
- Standard implementation, administrator onboarding, three administrators,
  standard email support and one 90-day operating review are package inclusions.
  A review at 90 days is not a 90-day contract or a newly offered programme.
- Terms leave billing frequency, renewal and term particulars to the order
  documents, specify 30-day invoice payment unless otherwise agreed, and exclude
  VAT/applicable taxes. This does not contradict annual licensing. No automatic
  renewal, cancellation right, refund, discount, currency conversion or SLA was
  added. The international GBP/tax/invoicing note stays unchanged.
- Product-page boundaries do not promise prompt interception, individual
  productivity scores, employment decisions, guaranteed ROI or compliance.
  Recording user-supplied workplace evidence is distinct from monitoring tools.
- The approved intentional no-training commitment covers Customer Data, not
  only personal data. No new AI provider, zero-retention, residency or certification claim
  was introduced. The shared list distinguishes Outside Clarity AI processing
  from WAIA; it does not establish OpenAI or Stripe as active WAIA suppliers.
- England-and-Wales jurisdiction, British English, company identity and
  international availability remain unchanged.
- Tally procurement/walkthrough routes, approved attribution codes, app login,
  canonical URLs, pricing, navigation and Cloudflare implementation are intact.

## Shared documents and remaining dependencies

All five document destinations responded successfully during direct live
retrieval. Search-index copies were older; the live HTML was used instead.

| Document                                                           | Live version        | Review result / follow-up                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Privacy Notice](https://www.nineteenpointtwo.com/privacy/)        | 1.1, 17 August 2026 | Controller/processor roles, company details, ordinary retention and international-transfer qualifications are present. WAIA learner/admin data lists still focus on learning and omit the newer workflow observations and review context. Update at source to match actual processing.                                                                                                                                                                               |
| [Cookie Notice](https://www.nineteenpointtwo.com/cookies/)         | 1.1, 17 August 2026 | Describes cookieless Cloudflare measurement and no active advertising pixels. Does not specifically describe WAIA's sessionStorage enquiry source code. Confirm how that storage is covered by the shared notice and its consent/exemption position with the owner; do not infer legal exemption from sessionStorage alone.                                                                                                                                          |
| [DPA](https://www.nineteenpointtwo.com/data-processing-agreement/) | 1.0, 27 May 2026    | Correct destination; section 16 gives precedence. Schedule 1 and documented instructions need reconciliation with workflow evidence, grouping, reviewer records and snapshots. Existing broad wording is not proof that the detailed schedule is sufficient. Requires shared-document owner/legal approval.                                                                                                                                                          |
| [Security Summary](https://www.nineteenpointtwo.com/security/)     | 1.0, 27 May 2026    | Appropriately avoids certification/uptime guarantees. Backup frequency, retention, restore arrangements and provider evidence are explicitly matters to confirm, not verified controls. Keep these as procurement questions until the operator supplies evidence.                                                                                                                                                                                                    |
| [Subprocessors](https://www.nineteenpointtwo.com/subprocessors/)   | 1.1, 17 August 2026 | Lovable/Supabase chain and Outside Clarity-specific AI/Stripe distinctions are stated. Confirm whether the Resend path in current WAIA source is deployed and its direct/indirect supplier role, data scope, agreements and transfer safeguards. If active, update the shared list's email-provider description. Tally's enquiry-processing role should also be confirmed in the shared privacy/provider inventory; do not assume it is a learner-data subprocessor. |

The shared documents' headers still link to the legacy product login and generic
enquiry form. Their WAIA actions should be corrected in the Nineteen Point Two
repository to the current app login and dedicated WAIA enquiry journey. No shared
document was copied into or edited from this repository.

These dependencies prevent a complete accuracy sign-off. Do not use `Closes #7`
until the shared-document owner has resolved them and the amended WAIA pages
have been merged and verified live. Existing contract enforceability, supplier
agreements, retention/backup configuration, international-transfer implementation
and the exact deployed email path cannot be certified from this marketing repo.

## Validation

- Prettier and HTML validation on the three changed public pages.
- Internal links, assets, duplicate IDs and canonical checks on affected pages.
- All five live shared legal/procurement destinations returned HTTP 200,
  without submitting an enquiry.
- Source search for legacy login/routes, monitoring/scoring, AI providers,
  model training, capacity/ROI, contractual, annual and tax wording.
- Mobile/desktop smoke checks at 390px and 1440px on Terms, AI Use Statement and
  Data & Privacy: no horizontal overflow, working mobile navigation, correct
  app login, and approved `s=ap` propagation into the dedicated Tally form.
- `git diff --check` and scope review. No Insights rebuild is needed.

Commands run successfully:

```sh
npx prettier --write terms/index.html ai-use-statement/index.html data-privacy/index.html README.md docs/legal-procurement-review.md
npx prettier --check terms/index.html ai-use-statement/index.html data-privacy/index.html README.md docs/legal-procurement-review.md
npx html-validate terms/index.html ai-use-statement/index.html data-privacy/index.html
xmllint --noout sitemap.xml
git diff --check
node /private/tmp/waia-lcp-tools/legal-check.mjs
```

The temporary Playwright check also verified local linked files/assets,
duplicate IDs, canonical URLs and one Cloudflare beacon per affected page.
It compared page heads, navigation, footers, script tags and Tally link markup
against the base commit and confirmed they were unchanged. A tracked-file search
found no legacy application login URL. The temporary check is not a repository
dependency or production asset.

The PR contains the exact commands and observed validation results. Local
validation does not establish that this branch's corrections are already live.
