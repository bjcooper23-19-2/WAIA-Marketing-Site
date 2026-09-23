# Workplace AI Visibility Check

The public landing page is `/workplace-ai-visibility-check/`. It explains the exercise before asking for contact details. `/start/`, `/access/`, `/check/`, `/results/` and `/go/visibility-check/` are `noindex` and excluded from the sitemap. The article at `/insights/ai-adoption-is-rising-is-it-working/` links to the public landing page.

## Request and access

The `/start/` page opens the existing dedicated Tally form, `https://tally.so/r/GxPbRz`, with only first name, work email and organisation. After submission, Tally keeps its existing completion message and does not redirect to `/check/`. Tally calls the Apps Script webhook. The script records the request in a private Google Sheet and creates a Gmail **draft** containing a `waia.co.uk/workplace-ai-visibility-check/access/?token=...` link. Ben reviews the request and sends or deletes the draft manually.

The WAIA `/access/` page validates only the presence and 96-character hexadecimal format of the token when it loads. A correctly formatted link shows **Your Workplace AI Visibility Check is ready** without making a network request. Only an active press of **Continue to the Visibility Check** sends a same-origin POST to `/api/visibility-check/redeem`. A narrowly routed Cloudflare Worker validates the request and calls Apps Script server-to-server. Apps Script atomically validates and redeems the token, then returns only success or failure. Success navigates directly to `/check/`; invalid, expired or already-used tokens show the existing inactive-link state. A transient proxy, Apps Script or network failure leaves the button available for retry. The access page has no Cloudflare Web Analytics beacon.

The access token expires seven days after the request and can be redeemed once. The `Sent at` column is for Ben to fill manually after sending; the script does not infer Gmail delivery. The same Tally response ID is ignored on retry. Another form submission from the same email while an unused, unexpired request exists is ignored; after redemption or expiry, a fresh submission creates a fresh row and draft. Ben can delete an unwanted draft and note his decision in the Sheet.

The browser never contacts or executes code from Apps Script and has no Apps Script URL or CORS dependency. The Worker sends the redemption POST to Apps Script, then fetches the one-time Content Service redirect with a separate GET after checking its destination. It accepts only a JSON `{ "ok": true }` or `{ "ok": false }` response from that path. On an upstream failure it logs only status, safe URL and content-type categories, response length and error category. It forwards the token with a separate private proxy secret and never returns record data. Neither opening the email nor loading the WAIA page calls the backend. Apps Script remains the token authority and preserves the Sheet lookup, expiry check, script lock, redemption timestamp and single-use behaviour.

The Tally webhook uses its existing private URL secret because [Apps Script web app events do not expose HTTP headers](https://developers.google.com/apps-script/guides/web#request_parameters), so it cannot inspect Tally's `Tally-Signature` header. The Worker-to-Apps-Script redemption call uses a new, separate `PROXY_SECRET`; it does not reuse the Tally webhook secret. Keep both secrets and the webhook URL private and rotate the relevant secret if exposed. Apps Script also cannot choose a non-2xx HTTP status for its webhook `HtmlOutput`, so use Tally's delivery log and the Sheet to spot processing errors.

The gate controls the normal emailed journey. The static `/check/` route remains technically discoverable. It is a free exercise, not an authenticated application.

No promotional email sign-up is required. Tally stores the submitted contact details; the private Sheet and draft use them only to fulfil the request. The check stores seven answer categories and two optional short work notes in `sessionStorage` for the current browser tab. It sends no answer text or contact detail to WAIA, Tally or analytics. Closing the tab clears the result. The check is not a compliance audit, risk score, maturity score or employee performance tool.

## Measurement

Cloudflare Web Analytics remains the only site beacon. It provides aggregate path counts, not a person-level funnel. Tally submissions and the private Sheet are the operational request and redemption records. No tracking has been added to the access page.

## Updating the check

The static questions live in `/workplace-ai-visibility-check/check/index.html`. Keep their `name` values aligned with `areas` in `/assets/js/visibility-check-results.mjs`. Run `node --test scripts/*.test.mjs` after changing the flow. The Apps Script source and short post-merge proxy setup checklist are in [`automation/visibility-check-access/`](../automation/visibility-check-access/README.md).
