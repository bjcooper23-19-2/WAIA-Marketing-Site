# WAIA Marketing Site

Standalone product marketing website for WAIA, the workplace AI adoption control product operated by Nineteen Point Two Ltd.

## Purpose

This repository contains the standalone WAIA product website for `https://waia.co.uk/`.

WAIA is the primary visible brand. Nineteen Point Two Ltd is the legal operator, customer relationship owner and secondary endorsement.

## Local Preview

This is a static HTML/CSS/JS site. From the repository root:

```sh
npx http-server . -p 4173
```

Then open `http://127.0.0.1:4173/`.

## Route Structure

- `/` - product overview
- `/how-it-works/` - product operating model and implementation
- `/who-its-for/` - buyer fit and organisational signals
- `/insights/` - WAIA workplace AI editorial index
- `/insights/ai-adoption-vs-ai-effectiveness/`
- `/insights/shadow-ai-workplace-ai-adoption/`
- `/insights/cost-of-ai-is-becoming-visible/`
- `/insights/hidden-cost-of-workplace-ai/`
- `/insights/operational-strain-beneath-workplace-ai-adoption/`
- `/insights/hidden-cost-of-fragmented-ai-adoption/`
- `/pricing/` - annual licence pricing, scope and commercial FAQ
- `/data-privacy/` - data, privacy and product boundaries
- `/terms/` - WAIA Terms of Service
- `/ai-use-statement/` - WAIA Product and AI Use Statement
- `/404.html`
- `/robots.txt`
- `/sitemap.xml`

## Production Targets

- Marketing site: `https://waia.co.uk/`
- WAIA application login: `https://waia.nineteenpointtwo.com/login`
- Enquiry form: `https://tally.so/r/gDgbQP`
- Operator: Nineteen Point Two Ltd

## Page Architecture

The site is organised around the buyer questions a prospective customer needs to answer:

- What is WAIA?
- How does it work?
- Is it right for an organisation like ours?
- What does it cost?
- What does it record and how is customer data handled?

WAIA is also the permanent editorial home for workplace AI content. Insights should stay focused on practical, operator-led thinking about workplace AI adoption, informal and Shadow AI use, operational visibility, guidance and governance as enablement, learner and manager judgement, workflow consistency, evidence of effective AI use and hidden adoption risk.

## Insights Publishing

Insight source content lives in:

`src/content/insights/`

Generated output lives in:

`insights/`

Build the Insights section from markdown with:

```sh
node scripts/build-insights.mjs
```

The generator reads markdown source files, sorts articles newest first and writes the Insights index plus one folder-style route per article. The initial migration added six articles; future Insights can be added by creating another markdown source with the same frontmatter and running the build.

Required frontmatter:

- `title`
- `slug`
- `date`
- `category`
- `excerpt`

Optional frontmatter currently supported:

- `metaTitle`
- `metaDescription`
- `ogTitle`
- `ogDescription`
- `readingTime`
- `tags`

Commit both the markdown source files and generated HTML whenever Insights content changes. Do not edit generated article HTML directly unless the generator is also updated to preserve the change.

Editorial guardrails:

- WAIA owns workplace AI editorial content.
- Keep the section calm, credible, practical, commercially grounded and operator-led.
- Do not turn Insights into a generic AI blog.
- Do not add unsupported customer outcomes, testimonials, certifications or compliance claims.
- Keep article CTAs aligned to the WAIA buyer journey.
- Avoid links that send users through old Nineteen Point Two workplace AI routes.

More detail is in `docs/insights.md`.

## Privacy-Safe Enquiry Source Attribution

WAIA supports a lightweight `s` query parameter on inbound links so enquiry source context can be passed to the existing Tally form without cookies, behavioural tracking or a consent platform.

Approved source values:

- `s=ap` - Apollo outbound email
- `s=gm` - manually personalised Gmail outbound
- `s=19` - Nineteen Point Two website or referral
- `s=li` - LinkedIn organic

The shared script at `assets/js/source-attribution.js` validates incoming values, stores only the approved short source code in `sessionStorage`, and appends it to WAIA Tally enquiry links as `?s=value`. It does not store identities, page histories, timestamps or behavioural data, and it does not alter canonical URLs, sitemap entries, metadata, legal links or the WAIA application login URL.

To capture the value in Tally submissions, the Tally enquiry form needs a hidden field named exactly `s`.

Cloudflare Web Analytics remains aggregate page analytics only. It cannot report the preserved `sessionStorage` source value or confirm which `s` value was submitted to Tally.

More detail is in `docs/source-attribution.md`.

## Shared Legal Documents

WAIA-specific terms and AI use information live in this repository at `/terms/` and `/ai-use-statement/`.

The marketing site is live at `https://waia.co.uk/`. GitHub Pages deployment is active, custom-domain DNS is configured, and HTTPS is enforced.

Shared Nineteen Point Two Ltd documents remain on `www.nineteenpointtwo.com`:

- Privacy policy
- Cookie policy
- Data Processing Agreement
- Security
- Subprocessors

## Brand Notes

WAIA uses the approved **Open Wayfinder** identity.

Brand idea: **Make the next move visible.**

The canonical brand source and documentation pack remains in `brand/`:

- `brand/README.md`
- `brand/visual-system.md`
- `brand/accessibility.md`
- `brand/tokens.css`
- `brand/assets/`
- `brand/implementation-brief.md`

Production web assets are copied into public paths under `assets/`:

- `assets/brand/waia-mark-gradient.svg`
- `assets/brand/waia-mark-teal.svg`
- `assets/brand/waia-mark-white.svg`
- `assets/brand/waia-mark-mono-dark.svg`
- `assets/brand/waia-lockup-dark.svg`
- `assets/brand/waia-lockup-light.svg`
- `assets/brand/waia-lockup-compact-dark.svg`
- `assets/favicon/favicon.svg`
- `assets/favicon/favicon.ico`
- `assets/favicon/favicon-32.png`
- `assets/favicon/favicon-512.png`
- `assets/favicon/apple-touch-icon.png`
- `assets/favicon/waia-favicon.svg`
- `assets/favicon/waia-favicon.ico`
- `assets/favicon/waia-favicon-32.png`
- `assets/favicon/waia-apple-touch-icon.png`

The `waia-*` favicon filenames are used in page HTML so browser and CDN caches do not continue serving an older generic `favicon.ico`.

Semantic colour rules:

- Operating navy is used for navigation, product shell and high-level product framing.
- Clarity white is used for instruction, decision content and important explanation.
- Deep teal is used for readable action, links and emphasis on light surfaces.
- Bright cyan is reserved for active states, focus and illumination on dark surfaces.
- Bright cyan should not be used as body text on pale backgrounds.

Accessibility expectations:

- Meaningful text and controls should meet WCAG AA contrast expectations.
- Light surfaces should use dark primary text, secondary slate text and deep-teal emphasis.
- Dark surfaces should use white or muted light text with bright cyan as an accent.
- All links and controls need visible hover and keyboard focus states.

This branch is the marketing-site pilot only. Product-platform implementation of the WAIA identity and Clarity Panel pattern will follow separately.

## Remaining Work

- Cloudflare Web Analytics is installed manually through the beacon stored in this repository.
- Automatic Cloudflare RUM injection is not relied upon.
- The site does not use Apollo website tracking or Cookiebot.
- Behavioural and marketing tracking should not be added without an approved requirement.
- Confirm final legal review of WAIA terms, AI use statement and shared document links.
- Redirect old Nineteen Point Two WAIA and workplace AI Insights routes only after the WAIA Insights branch and the corresponding Nineteen Point Two redirect branch have both been reviewed, merged and verified live.

## Source Used For Initial Migration

Source repository:

`/Users/bencooper/Documents/Codex/2026-05-02/work-in-the-github-repo-for`

Original source pages and assets:

- `waia/index.html`
- `waia/how-it-works/index.html`
- `waia-terms/index.html`
- `waia-ai-use-statement/index.html`
- `assets/css/workplace-ai-academy.css`
- `assets/css/legal.css`
- `assets/js/nav.js`
- `assets/images/waia/`
- `assets/favicon/favicon.svg`

Additional Insights migration source:

- `src/content/insights/`
- `scripts/build-insights.mjs`
- `insights/`
- `assets/css/insights.css`
