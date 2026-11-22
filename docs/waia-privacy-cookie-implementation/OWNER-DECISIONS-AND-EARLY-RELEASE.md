# WAIA UK standalone legal site | Owner decisions and accelerated release

Recorded: 22 November 2026. These are the owner's commercial/product choices, not external legal approval.

## Explicitly approved by owner
1. Operate **WAIA** as a trading name of **Nineteen Point Two Limited**; no separate legal entity implied.
2. Use a monitored **WAIA-branded legal/privacy contact address**, exact address now supplied as **ben@waia.co.uk**, but the owner confirms that it works as an alias of ben@nineteenpointtwo.com. The draft legal pages use this address. This is owner-confirmed operational evidence, not independently tested delivery.
3. WAIA is **not intended** for special-category personal data, including medical information and sensitive HR casework; customer submissions prohibited unless specifically agreed in writing.
4. Customer export and deletion are handled **manually on request** with lawful retention and backup limitations. Do not promise self-service export, instantaneous deletion, guaranteed purge of protected backups, or specific backup retention unless verified.
5. Paid WAIA UK subscriptions require **both parties' agreed Customer Order Form**, incorporating WAIA Terms and WAIA UK DPA. No automatic renewal unless expressly agreed.
6. Owner prefers an **earlier publication route** rather than blocking the whole site release pending a complete solicitor review. This preference **does not authorise false factual statements, breach of PECR, or publication of unfinished review drafts**.
7. Owner confirms **no signed customer contracts** currently exist, enabling first contract incorporation via waia.co.uk URLs.

## Independently confirmed public record
Companies House company number 15905276, NINETEEN POINT TWO LIMITED, active, incorporated 19 August 2024, registered office C/O James Todd & Co Furzehall Farm, 110 Wickham Road, Fareham, Hampshire, United Kingdom, PO16 7JH.
Reference: https://find-and-update.company-information.service.gov.uk/company/15905276 (record accessed 22 Nov 2026; source displayed a crawl age, so reconfirm for publication if address changes).

## Verified source behaviour (not live verification)
WAIA UK marketing website:
- `assets/js/analytics.js` injects Cloudflare Web Analytics beacon unless `waia:analytics-objection` localStorage key equals '1'. If storage cannot be accessed, beacon does not load.
- `assets/js/analytics-preferences.js` stores/removes that key. Objection takes effect on subsequent navigations, not retroactively on already loaded pages.
- Owner's Chrome test on 22 November: HTTP 200 beacon from analytics.js when enabled, none after objecting and reloading.
- `assets/js/visibility-check.mjs` stores answers and optional notes in `sessionStorage` under `waia:visibility-check`. These data remain in the browser tab; it is not proof of retention behaviour on external Tally.
- `assets/js/source-attribution.js` rewrites Tally links from allowed query `s` source codes; no storage is written in this file.

WAIA application (repository code, not live hosted checks):
- `src/integrations/supabase/client.ts` configures Supabase persistSession=true, autoRefreshToken=true, custom storage; `src/integrations/supabase/previewAuthStorage.ts` returns localStorage for normal production domains and brokers Lovable preview authentication separately.
- These observations substantiate disclosure of necessary browser storage, but cannot prove a complete cookie inventory, row-level security in production or service-provider processing guarantees.

## Accelerated, conditional publication route

**Gate A: factual and operational checks (not optional)**
- **Owner-confirmed:** ben@waia.co.uk is a functioning alias of ben@nineteenpointtwo.com, an inbox the owner uses. No separate mailbox provisioning is required. A targeted delivery check remains optional release QA, not a substantive blocker.
- Check precise Tally form privacy link, provider storage/partial response setting and Google Apps Script access request flow.
- Confirm supplier categories and roles, regional processing/transfer description, RLS/access-control and backup claims, current source data categories.
- Confirm operative DPA obligations can be performed (export/deletion on request; incident notification and subprocessor change process).

**Gate B: analytics treatment**
- Either document with evidence that the Cloudflare use satisfies ICO's statistical-purposes exception (clear information, simple objection, sole statistical use, no advertising/profiling/personalisation) OR temporarily disable **the website's manual analytics beacon** pending legal advice, with a separate browser check for any automatically injected beacon. Disabling analytics would trade some traffic measurement for a smaller release risk; it requires an explicit documented implementation decision.
- Do not equate opt-out functionality or 'cookieless' with consent exemption.

**Gate C: publication mechanics**
- Resolve all review banners, `noindex,nofollow`, source provenance, UK-only scope, version and effective date before release.
- Do not alter signed-version authority once the first Order Form exists; preserve copies of each published version and signed Order Form.
- Inspect the full link graph; updated first-party links in PR #110 include main pages, legal hub, Analytics Preferences, Visibility Check and Insights generator, but **the generated Insights HTML must be regenerated from its source before merge**.
- Verify all public routes, links, layout, keyboard and mobile presentation and data/form journeys. Ensure a build and deployed site are independently verified. Confirm all first-party legal destinations are live before removing old corporate links.
- Make the PR ready only after gates A-C are evidenced. Owner approval of risk acceptance is not a substitute for applicable legal obligations.

**Not a blocker to website development:** the separate solicitor review can proceed in parallel if the above gates establish a lawful and factually accurate publication. A solicitor opinion remains recommended for PECR interpretation and binding commercial/DPA terms, and first customer contract should not incorporate an unreviewed high-risk legal promise.

## Outstanding input specifically from owner
- **ben@waia.co.uk** supplied and confirmed working by owner on 22 November 2026; forwards as an alias to ben@nineteenpointtwo.com.
