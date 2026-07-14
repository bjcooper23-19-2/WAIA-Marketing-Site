# Codex Implementation Brief: WAIA Marketing-Site Brand Pilot

## Repository

`bjcooper23-19-2/WAIA-Marketing-Site`

## Objective

Apply the approved **Open Wayfinder** identity and shared visual system to the WAIA marketing site without changing product positioning, pricing, analytics, Tally destinations or the existing WAIA application login.

The marketing site is the controlled pilot. Do not edit the WAIA application repository in this branch.

## Source of truth

Use the files in `/brand/` as the approved foundation:

- `/brand/README.md`
- `/brand/visual-system.md`
- `/brand/accessibility.md`
- `/brand/tokens.css`
- `/brand/assets/`

Do not redraw or reinterpret the logo during implementation.

## Required work

### 1. Production asset placement

Copy the approved assets into a public production path, for example:

- `/assets/brand/waia-mark-gradient.svg`
- `/assets/brand/waia-mark-teal.svg`
- `/assets/brand/waia-mark-white.svg`
- `/assets/brand/waia-lockup-dark.svg`
- `/assets/brand/waia-lockup-light.svg`
- `/assets/brand/waia-lockup-compact-dark.svg`
- `/assets/favicon/favicon.svg`

Keep `/brand/` as the source documentation and review pack.

Generate any required ICO or PNG derivatives from the SVG source without changing the geometry.

### 2. Header and navigation

Replace the temporary rounded-square WAIA text mark across every public page.

Use:

- compact dark lockup or mark plus accessible text in desktop navigation
- standalone mark or compact lockup in mobile navigation
- `alt="WAIA"` for primary brand images

Preserve all current navigation destinations and active-page behaviour.

### 3. Favicons and metadata

Update favicon and browser icon references across every page.

Add or update:

- SVG favicon
- ICO fallback if the repository currently uses one
- Apple touch icon if supported by the existing page structure

Do not add tracking or external font dependencies.

### 4. Shared CSS tokens

Integrate the approved semantic tokens into `assets/css/workplace-ai-academy.css`.

Avoid a second disconnected token system. Map or replace the current variables carefully so the site continues to render consistently.

Required semantic roles:

- operating navy
- clarity white
- deep teal
- bright cyan
- neutral light
- primary and secondary text on light
- primary and secondary text on dark
- borders
- focus
- success, caution and risk

### 5. Contrast corrections

Correct the known failures and audit the same patterns across every page.

At minimum:

- `/who-its-for/`: Good fit and Not the right fit cards
- `/pricing/`: FAQ-area buttons and any light-background controls
- all buttons placed on `.waia-light-section`
- proof cards, outcome cards and fit cards reused on light surfaces
- hover, focus and active states

Use dark text and deep teal on light surfaces. Reserve bright cyan primarily for dark surfaces and focus/active accents.

### 6. WAIA Clarity Panel marketing pilot

Add one restrained example of the Clarity Panel to the homepage or how-it-works page where it improves buyer understanding.

Suitable content structure:

- What WAIA makes clear
- What people are expected to do
- Why it matters
- What organisations can see next

Do not turn the marketing site into a learner interface. This is a visual and narrative demonstration of the shared component role.

### 7. General visual refinement

Preserve the current layout, page architecture, content and product-led tone.

Refine rather than redesign:

- keep dark navy product framing
- keep editorial spacing
- use white surfaces more deliberately
- reduce excessive glow where it harms edge clarity
- keep cyan as an accent, not a default text colour
- maintain responsive behaviour

### 8. Documentation

Update the root README with:

- approved Open Wayfinder identity
- location of brand source files
- production asset locations
- colour and accessibility rules
- note that the WAIA product rollout is a separate follow-up

## Must not change

- pricing values
- product claims or positioning
- Tally URL
- WAIA application login URL
- Cloudflare Web Analytics token or loading behaviour
- legal content
- sitemap routes
- canonical URLs
- redirect work in the Nineteen Point Two repository

## Validation

Run and report:

- Prettier write and check
- `git diff --check`
- HTML validation for every public page
- XML validation for sitemap
- local static-server review of every route
- keyboard navigation check
- 320px, 768px, 1280px and 1440px viewport checks
- 200% zoom check
- contrast checks for all changed colour pairings
- favicon and logo asset loading checks
- no console errors
- no broken internal links
- no change to Tally or app-login destinations

## Delivery workflow

Create a new branch from current `main` after this brand-pack branch is merged.

Suggested branch:

`codex/implement-waia-brand-marketing-pilot`

Suggested commit:

`Implement WAIA Open Wayfinder marketing identity`

Push the branch and do not merge. Report:

- commit SHA
- files changed
- asset mapping
- contrast fixes completed
- visual QA summary
- validation results
- any product-side follow-up identified