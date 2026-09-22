# Workplace AI Visibility Check

The public landing page is `/workplace-ai-visibility-check/`. It explains the exercise before asking for contact details. `/start/`, `/check/`, `/results/` and `/go/visibility-check/` are `noindex` and excluded from the sitemap. The article at `/insights/ai-adoption-is-rising-is-it-working/` links to the public landing page.

## Request and access

The `/start/` page opens the existing dedicated Tally form, `https://tally.so/r/GxPbRz`, with only first name, work email and organisation. After submission, Tally must show the completion message in [the setup instructions](../automation/visibility-check-access/README.md); its old redirect to `/check/` must be removed. Tally calls the Apps Script webhook. The script records the request in a private Google Sheet and creates a Gmail **draft**. Ben reviews the request and sends or deletes the draft manually. The recipient opens a unique link, sees a confirmation page, then presses **Continue to the Visibility Check**. Opening the link alone does not use it.

The access token expires seven days after the request and can be redeemed once. The `Sent at` column is for Ben to fill manually after sending; the script does not infer Gmail delivery. The same Tally response ID is ignored on retry. Another form submission from the same email while an unused, unexpired request exists is ignored; after redemption or expiry, a fresh submission creates a fresh row and draft. Ben can delete an unwanted draft and note his decision in the Sheet.

The webhook uses a private URL secret because [Apps Script web app events do not expose HTTP headers](https://developers.google.com/apps-script/guides/web#request_parameters), so it cannot inspect Tally's `Tally-Signature` header. This is a v1 platform limitation. The URL secret and exact form ID are checked before accepting data. Keep the webhook URL private and rotate the secret if exposed. Apps Script also cannot choose a non-2xx HTTP status for its `HtmlOutput`, so use Tally's delivery log and the Sheet to spot processing errors. Do not publish the webhook URL in site content or a ticket.

The gate controls the normal emailed journey. The static `/check/` route remains technically discoverable. It is a free exercise, not an authenticated application.

No promotional email sign-up is required. Tally stores the submitted contact details; the private Sheet and draft use them only to fulfil the request. The check stores seven answer categories and two optional short work notes in `sessionStorage` for the current browser tab. It sends no answer text or contact detail to WAIA, Tally or analytics. Closing the tab clears the result. The check is not a compliance audit, risk score, maturity score or employee performance tool.

## Measurement

Cloudflare Web Analytics remains the only site beacon. It provides aggregate path counts, not a person-level funnel. Tally submissions and the private Sheet are the operational request and redemption records. No tracking has been added to the access page.

## Updating the check

The static questions live in `/workplace-ai-visibility-check/check/index.html`. Keep their `name` values aligned with `areas` in `/assets/js/visibility-check-results.mjs`. Run `node --test scripts/visibility-check.test.mjs` after changing either. The Apps Script source, exact Sheet schema and post-merge setup are in [`automation/visibility-check-access/`](../automation/visibility-check-access/README.md).
