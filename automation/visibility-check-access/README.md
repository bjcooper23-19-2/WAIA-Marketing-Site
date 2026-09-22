# Visibility Check access: issue #59 post-merge setup

The repository source for the existing Google Apps Script project is [`Code.gs`](Code.gs). The WAIA site remains on GitHub Pages. Redemption now uses the dedicated Cloudflare Worker in [`cloudflare/visibility-check-redemption/`](../../cloudflare/visibility-check-redemption/) so the browser never contacts Apps Script.

## Already configured and unchanged

- The published Tally form, its First name, Work email and Organisation fields, thank-you message and webhook remain unchanged.
- The private Google Sheet, `Requests` tab and columns remain unchanged.
- The existing Apps Script project remains the Tally webhook, token authority and Sheet writer.
- `SHEET_ID`, `TALLY_FORM_ID` and `WEBHOOK_SECRET` remain unchanged. Do not reuse `WEBHOOK_SECRET` for the proxy.
- Existing Google Sheets and Gmail permissions remain unchanged.
- Gmail draft creation, the current email copy and HTML CTA remain unchanged. Ben still reviews and sends or deletes each draft manually and records `Sent at`.
- Access links remain on `https://waia.co.uk/workplace-ai-visibility-check/access/?token=...`; tokens still expire after seven days and are single-use.
- The live access page design, `/check/` route and client-side Visibility Check answers remain unchanged.

## New manual setup required after merge

1. Generate one new random secret of at least 32 characters, for example with `openssl rand -hex 32`. In the existing Apps Script project's **Project Settings → Script properties**, add it as `PROXY_SECRET`. Keep the value private and separate from `WEBHOOK_SECRET`.
2. Replace the existing Apps Script source with the merged [`Code.gs`](Code.gs), save it, then use **Deploy → Manage deployments → Edit → New version → Deploy**. The existing `/exec` URL stays the same. This redeploy is required because redemption changes from public JSONP GET to an authenticated JSON POST from the Worker; the Tally webhook contract is unchanged.
3. In Cloudflare DNS for `waia.co.uk`, change the existing apex GitHub Pages A records from **DNS only** to **Proxied**. Do not change their addresses. The Worker route requires the hostname to pass through Cloudflare; GitHub Pages remains the site origin.
4. From `cloudflare/visibility-check-redemption/`, set both Worker secrets interactively. Use the existing production Apps Script URL ending `/exec` for the first and the exact `PROXY_SECRET` value from step 1 for the second:

   ```sh
   npx wrangler secret put APPS_SCRIPT_REDEMPTION_URL
   npx wrangler secret put APPS_SCRIPT_PROXY_SECRET
   ```

5. Still in that directory, deploy the Worker:

   ```sh
   npx wrangler deploy
   ```

   The committed configuration attaches only `waia.co.uk/api/visibility-check/redeem*`; it does not replace the GitHub Pages site.

6. Run one final end-to-end test with an inbox you control. Submit the existing Tally form and confirm one Sheet row with `Token status = unused`, a seven-day `Expires at` value and one addressed Gmail draft containing only the WAIA access URL. Manually send the draft. Opening the link must leave the row `unused`; pressing **Continue to the Visibility Check** must open `/check/` and set the row to `redeemed` with `Redeemed at`; pressing Continue from the same link again must show the inactive-link state.

## Operating notes

- A repeated webhook delivery with the same Tally response ID creates no new row or draft. A fresh submission from an email with an unused, unexpired token is also ignored. After redemption or expiry, a fresh submission creates a new link.
- If Tally reports `Processing failed`, inspect the `Requests` row and Apps Script **Executions**. A `draft_pending` row means draft creation or its status update did not finish; check Gmail Drafts before asking for another submission.
- If `WEBHOOK_SECRET` leaks, rotate it in Apps Script and the existing Tally webhook URL. If `PROXY_SECRET` leaks, rotate both `PROXY_SECRET` in Apps Script and `APPS_SCRIPT_PROXY_SECRET` in the Worker, then redeploy the Apps Script version. Existing unused access tokens remain valid.
- Do not paste personal data, token-bearing links, Apps Script URLs or either secret into public issues or logs.
