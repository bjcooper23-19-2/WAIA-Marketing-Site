# Visibility Check access: post-merge setup

The repository source is [`Code.gs`](Code.gs). No Google account, Tally setting or secret is configured by merging the PR. This uses Tally's free webhook, one private Google Sheet and Ben's Gmail drafts.

## One-time setup for Ben

1. In Google Sheets, create a **private** spreadsheet named `WAIA Visibility Check requests`. Rename its first tab exactly `Requests`. Paste this tab-separated header row into A1:

   ```text
   Requested at	First name	Email	Organisation	Tally response ID	Token	Token status	Draft created at	Sent at	Redeemed at	Expires at	Notes
   ```

   Keep the Sheet private. Copy its spreadsheet ID from the URL between `/d/` and `/edit`.

2. At `script.google.com`, create a new Apps Script project named `WAIA Visibility Check backend`. Replace the starter code with the complete contents of `Code.gs` and save it. Apps Script is the webhook and redemption backend only; recipients never use its web page.

3. In **Project Settings → Script properties**, create `SHEET_ID` with the copied ID, `TALLY_FORM_ID` with `GxPbRz` (the published form ID), and `WEBHOOK_SECRET` with a freshly generated random value of at least 32 characters, preferably `openssl rand -hex 32`. Keep the secret private. Run `authoriseSetup` once from the Apps Script editor and approve the requested Sheets and Gmail permissions as Ben. The function checks access and creates no draft.

4. Choose **Deploy → New deployment → Web app**. Set **Execute as: Me** and **Who has access: Anyone** so Tally and the WAIA access page can call it without Google login. Approve the Sheets and Gmail scopes. Copy the production URL ending `/exec`. If Apps Script code changes later, deploy a new version through **Manage deployments → Edit**.

5. In `assets/js/visibility-check-access-config.mjs`, replace `REPLACE_WITH_APPS_SCRIPT_WEB_APP_URL` with that exact `/exec` URL. Commit and deploy this one configuration change to `waia.co.uk`. Open `https://waia.co.uk/workplace-ai-visibility-check/access/?token=test` and confirm the WAIA-designed inactive-link page appears. Do this before enabling the Tally webhook.

6. In the published Tally form `https://tally.so/r/GxPbRz`, **turn off Redirect on completion** to `https://waia.co.uk/workplace-ai-visibility-check/check/`. Set the thank-you message to:

   > Thank you. Your request has been received. Access to the Workplace AI Visibility Check will be sent to the email address you provided after review.

7. Keep exactly the existing **First name**, **Work email**, and **Organisation** fields in that Tally form. Their labels must match those strings, ignoring case. Under **Integrations → Webhooks**, set the endpoint to `<APPS_SCRIPT_EXEC_URL>?webhook_key=<WEBHOOK_SECRET>`. Do not share this URL. Tally's signing-secret option cannot be verified by Apps Script because Apps Script does not expose request headers. The private URL secret is the required check.

8. Submit the live Tally form once with an inbox you control. Confirm one new `Requests` row, `Token status = unused`, a seven-day `Expires at`, and one addressed Gmail draft whose link starts `https://waia.co.uk/workplace-ai-visibility-check/access/?token=`. Check Tally's webhook event log for `Recorded; draft created`. If it says `Invalid payload`, compare its request body's `data.formId` and field labels with step 3 and step 7, correct the Script Property or labels, then submit again. Review and **manually send** the draft, then enter the send date/time in `Sent at`. Open the WAIA link: the ready page should appear and the Sheet must still say `unused`. Press **Continue to the Visibility Check**: `/check/` should open and the Sheet should say `redeemed` with `Redeemed at`. Open the email link again, press Continue, and confirm the WAIA page shows the inactive-link state. Delete the test row and draft only if appropriate to your records policy.

## Operating notes

- For each new request, review the Sheet row and Gmail draft; send or delete the draft. Fill `Sent at` manually when sent. No email is sent by code.
- A repeated webhook delivery with the same Tally response ID produces no new row or draft. A fresh submission from an email with an unused, unexpired token is also ignored. After redemption or expiry, a fresh submission creates a new link.
- If Tally's event log says `Processing failed`, inspect the `Requests` row and Apps Script **Executions**. A `draft_pending` row means draft creation or status update did not finish; check Gmail Drafts before asking for a new submission, to avoid a duplicate draft. Do not paste personal data or secret URLs into public issues.
- If the webhook secret leaks, set a new random `WEBHOOK_SECRET` Script Property and update the Tally endpoint URL. Old access links use separate tokens and continue until redeemed or expired.
- The WAIA access page checks only the token format on load. It does not contact Apps Script until the person presses **Continue to the Visibility Check**. That click loads a JSONP callback from Apps Script, avoiding a CORS dependency. The callback returns only `{ok: true}` or `{ok: false}` and no lead data.
