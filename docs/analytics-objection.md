# Website analytics objection

Cloudflare Web Analytics remains the site's only analytics beacon. Every page that previously included the beacon now loads `/assets/js/analytics.js`. This first-party script checks the browser's `localStorage` value `waia:analytics-objection` before requesting Cloudflare's script. A value of `1` prevents the beacon from loading on subsequent page loads and navigation. If browser storage cannot be read, analytics stays off.

Visitors can set or remove the objection at `/analytics-preferences/`, linked from `/data-privacy/`. The preference page itself does not load analytics. The objection is the only new browser storage value and is used solely to remember that choice. Removing it permits analytics on later pages. The control cannot retract a beacon request made on a page before the visitor objected.

This implementation assumes the Cloudflare setup qualifies for the applicable PECR statistical-purposes exception. That depends on confirmation of the actual processing and contractual conditions before release. If prior consent is required, this objection control is insufficient and the change must not be merged or published as a compliance solution until a consent approach is decided.

The Visibility Check Tally form (`https://tally.so/r/GxPbRz`) currently links its “Privacy Policy” text to `https://waia.co.uk/data-privacy/`. In Tally's form editor, change that text link to `https://legal.nineteenpointtwo.com/privacy/` and publish the form. This is Tally-hosted form content, so the marketing repository cannot correct it. The WAIA `/workplace-ai-visibility-check/start/` page already links to the canonical Privacy Notice.

The external Cookie Notice is managed in the Nineteen Point Two Legal repository. Its update should link to `https://waia.co.uk/analytics-preferences/` and explain the objection storage value. This repository does not change the legal notice.
