# Workplace AI Visibility Check

The public landing page is `/workplace-ai-visibility-check/`. It is indexable and explains the exercise before asking for contact details. `/start/`, `/check/`, `/results/` and `/go/visibility-check/` are `noindex` and excluded from the sitemap.

## Lead flow

The `/start/` page links to the dedicated published WAIA Tally form at `https://tally.so/r/GxPbRz`. It asks only for first name, work email and organisation. The form title, **Workplace AI Visibility Check**, and its dedicated form ID identify the lead source without a URL parameter or hidden field. Tally stores contact details in the existing WAIA Tally workspace; they are not placed in site URLs, browser storage or WAIA static files. A WAIA workspace owner can open this form’s **Submissions** tab or export its responses for follow-up. A returning visitor can use the direct continuation link on `/start/` rather than create another submission.

The published form redirects successful submissions to `https://waia.co.uk/workplace-ai-visibility-check/check/`. A synthetic submission verified this exact URL without personal details or response values. This external Tally setting is not configured by the static site. The destination route will become available publicly when this branch is deployed.

The gate does not subscribe a visitor to marketing emails. There is no automatic nurture sequence. Any later promotional email must follow the current privacy notice and applicable consent or opt-out requirements. The start page links to the shared legal privacy notice; the published Tally form links to WAIA's data and privacy page.

The check stores only seven answer categories and two optional short work notes in `sessionStorage` for the current browser tab, so the results page can render and print them. It sends no answer text or contact detail to WAIA, Tally or analytics. Closing the tab clears this session-scoped result. The check does not claim to measure compliance, risk, maturity or employee performance.

## Measurement

Cloudflare Web Analytics remains the only site beacon. Its aggregate path counts can show the landing page, `/start/`, `/check/`, `/results/` and `/go/visibility-check/` (the result CTA handoff). The handoff uses the same bounded wait for the existing Cloudflare page-view request as the current Tally enquiry handoff, then redirects to `/see-waia/`. Tally's dedicated form submissions are the source of truth for leads. Path counts are not unique people or reliable stage-to-stage conversion rates. Direct visits to `/check/` and `/results/`, reloads, blockers and browsers without session storage can distort the funnel. Neither check starts inside Tally nor return visits are tied to a person across systems.

## Updating the check

The static questions live in `/workplace-ai-visibility-check/check/index.html`. Keep their `name` values aligned with `areas` in `/assets/js/visibility-check-results.mjs`. That module holds the short next-question prompts and deterministic result grouping. Run `node --test scripts/visibility-check.test.mjs` after changing either. The Tally redirect is an external form setting and must continue to point to `/workplace-ai-visibility-check/check/` when the site is live.
