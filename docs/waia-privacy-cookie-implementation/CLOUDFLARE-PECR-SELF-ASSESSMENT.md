# WAIA UK: interim Cloudflare Web Analytics / PECR decision record

**22 November 2026.** Owner instructs that Cloudflare Web Analytics remains enabled pending a focused privacy/legal review. This note provides a **documented provisional assessment**, not a solicitor's sign-off or final compliance determination.

## Purpose and observed implementation

- The approved business purpose is **aggregate WAIA UK website usage and performance statistics**, used to understand which pages are visited and improve the service. No behavioural advertising or individual-level personalisation is claimed for this usage.
- WAIA's `assets/js/analytics.js` manually injects the Cloudflare Web Analytics beacon from `static.cloudflareinsights.com/beacon.min.js` unless browser localStorage `waia:analytics-objection` equals `1`. If storage is inaccessible, it does not inject analytics.
- On 22 November, the owner observed the beacon request with analytics on (HTTP 200, initiated by `analytics.js:16`) and no matching request after using WAIA's Analytics Preferences objection and refreshing.
- `assets/js/analytics-preferences.js` gives a user a free way to register or reverse an objection within the same browser origin. A choice saved after a page load cannot undo tracking already sent on that page.
- Cloudflare's documentation says the Web Analytics service is privacy-oriented, uses a JavaScript beacon and does not collect or use visitors' personal data. This is **provider-stated**, not an independent audit of the WAIA account.

## Applicable legal test

The ICO's current guidance provides a statistical-purposes exception to prior consent for storage/access where the **sole purpose** is service-usage statistics and the processing is limited to what's necessary, with clear and comprehensive notice and a **simple and free way to object**. Other purposes (advertising, profiling etc.) cannot be smuggled under this exception.

References:
- https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/
- https://developers.cloudflare.com/web-analytics/about/
- https://developers.cloudflare.com/web-analytics/data-metrics/data-origin-and-collection/

## Interim assessment

The implemented website controls **appear aligned with the exception's core conditions** if (a) the service is used solely for WAIA UK usage/performance statistics and service improvement, (b) all relevant processing is limited to that purpose and (c) there is no separate injected tracker or non-exempt use. This is a **qualified assessment** based on source code, a limited live browser test, and provider documentation. It is not proof that all conditions are fulfilled.

## Remaining targeted verification, not an entire redesign

- Confirm in Cloudflare Web Analytics account settings that the identified beacon token is the only relevant Web Analytics snippet and that automatic injection/other RUM products do not bypass the WAIA objection mechanism.
- Confirm that Cloudflare stats are used solely for website statistics and improvement, not advertising or individual profiling.
- Ensure notice is accessible and sufficiently clear before analytics loads. Current footer and Analytics Preferences link provide disclosure, but further prominence may be advised.
- Obtain the focused solicitor's assessment in parallel. If non-exempt tracking is identified, switch to compliant prior consent or suspend its beacon.

**Operating choice:** Keep Web Analytics active as requested. Do not represent the PECR exception as legally signed off, and review the position if any facts change.
