# Privacy-safe source attribution

WAIA uses a small `s` query parameter to preserve enquiry source context without behavioural tracking.

## Approved source taxonomy

- `s=ap` - Apollo outbound email
- `s=gm` - manually personalised Gmail outbound
- `s=19` - Nineteen Point Two website or referral
- `s=li` - LinkedIn organic

Only these exact values are accepted. Unknown, empty, mixed-case, duplicate or malformed values are ignored. An existing valid session source is retained; without one, the handoff is `direct`.

## How it works

The shared script at `assets/js/source-attribution.js` runs on public WAIA pages.

When a visitor arrives with an approved `s` value, the script stores only that short source code in `sessionStorage` under `waia:source`. This keeps the value available while the visitor moves between WAIA pages in the same browser session.

The script does not append `s` to internal navigation links. Page URLs, canonicals, sitemap entries, structured data, legal links and the WAIA application login link remain attribution-free.

Links targeting the dedicated `https://tally.so/r/objzGM` form are rewritten to one of five first-party measurement routes:

- `/go/see-waia/ap/`
- `/go/see-waia/gm/`
- `/go/see-waia/19/`
- `/go/see-waia/li/`
- `/go/see-waia/direct/`

These minimal `noindex` pages are excluded from the sitemap. They load the existing Cloudflare beacon exactly once, then use `location.replace` to forward to Tally. They do not read or write browser storage. The approved source comes from the path, not arbitrary query parameters.

For example, `/go/see-waia/gm/` forwards to `https://tally.so/r/objzGM?product=WAIA&enquiry_type=walkthrough&s=gm`. `direct` omits `s` entirely. Procurement CTAs retain the existing bounded `enquiry_type=procurement` context through the redirect; all other values default to `walkthrough`. No other query parameters are forwarded.

Static CTA destinations remain direct Tally links as a no-JavaScript fallback. A manually opened redirect with JavaScript disabled offers a plain continuation link with walkthrough context; it is not a measured automatic handoff. No new external form or hidden field is introduced.

## What is stored

Stored:

- the approved source code only: `ap`, `gm`, `19` or `li`

Not stored:

- names
- email addresses
- organisation details
- page history
- timestamps
- user IDs
- campaign IDs beyond the approved short code
- arbitrary behavioural events or click histories

The value uses `sessionStorage`, not cookies or `localStorage`, so it naturally disappears when the browser session ends. If `sessionStorage` is unavailable, the approved source still applies to enquiry links on the current page but will not persist across navigation.

## Tally configuration

Tally supports passing URL parameters into hidden fields. To capture this source in submissions, the WAIA enquiry form must include a hidden field named exactly:

`s`

The submitted value will be one of:

`ap`, `gm`, `19`, `li`

To capture the WAIA-specific walkthrough context from primary `See WAIA` CTAs and `/see-waia/`, the dedicated WAIA Tally form also includes hidden fields named exactly:

- `product`
- `enquiry_type`

The site passes `product=WAIA` and `enquiry_type=walkthrough` from the walkthrough route. Procurement CTAs pass `product=WAIA` and `enquiry_type=procurement`.

Do not add hidden fields for identity or behavioural tracking unless a separate approved requirement exists.

## Adding a future source

To add another approved source:

1. Choose a short, non-identifying code.
2. Add it to the approved taxonomy in this document.
3. Add it to the `approvedSources` set in `assets/js/source-attribution.js`.
4. Add it to `assets/js/tally-handoff.js`, create its matching `noindex` route and update the tests. Document where it will be used.
5. Test supported, unsupported and no-source journeys before publishing.

## Cloudflare Web Analytics

Cloudflare Web Analytics remains the only analytics beacon on the WAIA marketing site.

Use Cloudflare Path reporting for `/go/see-waia/<source>/` to count aggregate **Tally handoffs**, not completed enquiries or unique prospects. Tally remains the record of **submitted forms**, including its existing `s`, `product` and `enquiry_type` hidden fields. Repeated clicks, reloads and manually shared redirect URLs can count again; these are not deduplicated visitor events. No form-start or submission beacon is added.

The redirect uses Resource Timing to observe completion of the existing Cloudflare `/cdn-cgi/rum` request, rather than a fixed delay after downloading its script. It creates no analytics request of its own. [Cloudflare documents the beacon endpoints and page-load collection](https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/).

Forwarding occurs as soon as that request completes. A script-load error forwards immediately; a 1.5-second maximum wait lets visitors continue if analytics is blocked, slow or unsupported. Resource Timing does not prove successful ingestion: failed requests may complete too, browsers can block measurement, and dashboard reporting can lag. Reliable delivery cannot be guaranteed without trapping visitors. These routes provide best-effort aggregate measurement, not an audit log.

## Validation and deployment acceptance

Run `node --test scripts/source-attribution.test.mjs` for source validation, persistence, non-Tally preservation, route selection, bounded query handling, beacon sequencing, fail-open behaviour, noindex/sitemap and privacy boundaries. Existing formatting, HTML, site link/asset and browser checks still apply.

After deployment, test `gm` and `ap` separately in fresh browser sessions:

1. Open `https://waia.co.uk/?s=gm` (then repeat with `?s=ap`).
2. Navigate to How it works; confirm internal URLs remain attribution-free.
3. Enable Preserve log in browser Network tools and click See WAIA.
4. Inspect the new tab: its first-party path must be `/go/see-waia/gm/` (or `/ap/`). Confirm the existing Cloudflare beacon sends a request containing that path before Tally navigation.
5. Confirm Tally receives `product=WAIA`, `enquiry_type=walkthrough` and the correct `s`. Do not submit a real enquiry solely for QA.
6. Confirm the matching path appears in Cloudflare Web Analytics after reporting catches up. Record this evidence before closing issue #45.

Repeat with no source and an invalid source in fresh sessions: both must use `direct` and omit `s` at Tally. Test procurement separately to confirm its existing enquiry type remains intact. Until deployed-path ingestion is observed, acceptance criterion 5 remains a deployment verification dependency; a simulated or local browser request is not proof of live reporting.
