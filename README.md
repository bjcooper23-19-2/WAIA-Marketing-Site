# WAIA Marketing Site

Standalone marketing website for WAIA, the workplace AI adoption control product operated by Nineteen Point Two Ltd.

## Purpose

This repository contains the first standalone WAIA marketing site for `https://waia.co.uk/`.

The site was migrated from the existing Nineteen Point Two website and keeps WAIA as the primary brand. Nineteen Point Two is retained as the operating company and secondary endorsement.

## Local Preview

This is a static HTML/CSS/JS site. From the repository root:

```sh
npx http-server . -p 4173
```

Then open `http://127.0.0.1:4173/`.

## Routes

- `/`
- `/how-it-works/`
- `/terms/`
- `/ai-use-statement/`
- `/404.html`
- `/robots.txt`
- `/sitemap.xml`

## Source Used For Migration

Source repository:

`/Users/bencooper/Documents/Codex/2026-05-02/work-in-the-github-repo-for`

Source pages and assets:

- `waia/index.html`
- `waia/how-it-works/index.html`
- `waia-terms/index.html`
- `waia-ai-use-statement/index.html`
- `assets/css/workplace-ai-academy.css`
- `assets/css/legal.css`
- `assets/js/nav.js`
- `assets/images/waia/`
- `assets/favicon/favicon.svg`

## Production Targets

- Marketing site: `https://waia.co.uk/`
- WAIA application login: `https://waia.nineteenpointtwo.com/login`
- Enquiry form: `https://tally.so/r/gDgbQP`

## Pre-Launch Tasks

- Configure analytics for the standalone WAIA domain.
- Configure consent management before adding analytics or marketing scripts.
- Complete custom-domain DNS and hosting deployment for `waia.co.uk`.
- Confirm final legal review of WAIA terms and AI use statement after domain setup.
- Confirm whether any additional shared legal pages should be mirrored or remain linked to `nineteenpointtwo.com`.
- Do not redirect the old Nineteen Point Two WAIA routes until this standalone site is approved and live.
