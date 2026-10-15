# Privacy-safe source attribution

WAIA uses a small `s` query parameter to preserve enquiry source context without behavioural tracking.

## Approved source taxonomy

- `s=ap` - Apollo outbound email
- `s=gm` - manually personalised Gmail outbound
- `s=19` - Nineteen Point Two website or referral
- `s=li` - LinkedIn organic

Only these exact values are accepted. Unknown, empty, mixed-case, duplicate or malformed values are ignored; the handoff is then `direct`.

## How it works

The shared script at `assets/js/source-attribution.js` runs on public WAIA pages.

When a visitor arrives with an approved `s` value, the script applies that source to enquiry links on the current page. It does not store `waia:source` or `waia:content`. Source context is lost when the visitor navigates to a URL without it.

The script does not append `s` to internal navigation links. Page URLs, canonicals, sitemap entries, structured data, legal links and the WAIA application login link remain attribution-free.

Links targeting the dedicated `https://tally.so/r/objzGM` form are rewritten to one of five first-party measurement routes:

- `/go/see-waia/ap/`
- `/go/see-waia/gm/`
- `/go/see-waia/19/`
- `/go/see-waia/li/`
- `/go/see-waia/direct/`

These minimal `noindex` pages are excluded from the sitemap. When no objection is stored, they load the existing Cloudflare beacon once, then use `location.replace` to forward to Tally. A saved objection prevents the beacon from loading, and the handoff still proceeds after its 1.5-second fail-open limit. The pages do not store marketing attribution. The approved source comes from the path, not arbitrary query parameters.

For example, `/go/see-waia/gm/` forwards to `https://tally.so/r/objzGM?product=WAIA&enquiry_type=walkthrough&s=gm`. `direct` omits `s` entirely. Procurement CTAs retain the existing bounded `enquiry_type=procurement` context through the redirect; all other values default to `walkthrough`. The published Tally form has no `c` hidden field, so `c` is not forwarded to Tally. No other query parameters are forwarded.

Static CTA destinations remain direct Tally links as a no-JavaScript fallback. A manually opened redirect with JavaScript disabled offers a plain continuation link with walkthrough context; it is not a measured automatic handoff. No new external form or hidden field is introduced.

## What is stored

Marketing attribution is not stored in browser storage. Approved source values are used only from the current URL. The separate Visibility Check result uses `sessionStorage` for answers and optional notes within the browser tab.

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

Run `node --test scripts/source-attribution.test.mjs` for source validation, non-Tally preservation, route selection, bounded query handling, beacon sequencing, fail-open behaviour, noindex/sitemap and privacy boundaries.

After deployment, test `gm` and `ap` separately:

1. Open `https://waia.co.uk/?s=gm` (then repeat with `?s=ap`).
2. Confirm internal URLs remain attribution-free. Click See WAIA on the landing page.
3. Enable Preserve log in browser Network tools.
4. Inspect the new tab: its first-party path must be `/go/see-waia/gm/` (or `/ap/`). Confirm the existing Cloudflare beacon sends a request containing that path before Tally navigation.
5. Confirm Tally receives `product=WAIA`, `enquiry_type=walkthrough` and the correct `s`. Do not submit a real enquiry solely for QA.
6. Confirm the matching path appears in Cloudflare Web Analytics after reporting catches up. Record this evidence before closing issue #45.

Repeat with no source and an invalid source: both must use `direct` and omit `s` at Tally. Test procurement separately to confirm its existing enquiry type remains intact. Until deployed-path ingestion is observed, acceptance criterion 5 remains a deployment verification dependency; a simulated or local browser request is not proof of live reporting.
