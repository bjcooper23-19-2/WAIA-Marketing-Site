# Privacy-safe source attribution

WAIA uses a small `s` query parameter to preserve enquiry source context without behavioural tracking.

## Approved source taxonomy

- `s=ap` - Apollo outbound email
- `s=gm` - manually personalised Gmail outbound
- `s=19` - Nineteen Point Two website or referral
- `s=li` - LinkedIn organic

Only these exact values are accepted. Unknown, empty, mixed-case or malformed values are ignored.

## How it works

The shared script at `assets/js/source-attribution.js` runs on public WAIA pages.

When a visitor arrives with an approved `s` value, the script stores only that short source code in `sessionStorage` under `waia:source`. This keeps the value available while the visitor moves between WAIA pages in the same browser session.

The script does not append `s` to internal navigation links. Page URLs, canonicals, sitemap entries, structured data, legal links and the WAIA application login link remain attribution-free.

When a page contains the dedicated WAIA Tally enquiry link, the script appends the approved source as `?s=value` or `&s=value` to:

`https://tally.so/r/objzGM`

For example:

`https://tally.so/r/objzGM?s=ap`

Primary `See WAIA` CTAs and the `/see-waia/` route also pass non-identifying WAIA context in the Tally URL:

`https://tally.so/r/objzGM?product=WAIA&enquiry_type=walkthrough`

If a visitor has an approved source in the same browser session, the shared script appends it as an additional `s` parameter.

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
- behavioural events

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
4. Document where that source will be used.
5. Test supported, unsupported and no-source journeys before publishing.

## Cloudflare Web Analytics

Cloudflare Web Analytics remains the only analytics beacon on the WAIA marketing site.

Cloudflare can report aggregate page-level traffic signals, but it does not receive the preserved `sessionStorage` source value from this script and cannot show which `s` value was passed to Tally. The source code is only added to the outbound Tally enquiry URL so it can be captured in Tally submissions when the hidden field is configured.
