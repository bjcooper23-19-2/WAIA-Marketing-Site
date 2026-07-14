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
- Redirect old Nineteen Point Two WAIA routes only after this multi-page version is merged and verified live.

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
