# Issue 98 · homepage visual prototype

**Status:** design review only. This branch is not approved for merge or deployment.

## Design audit

The current homepage has accurate copy, authentic product screenshots and a working enquiry route. The visual friction is concentrated in the opening: an extra-heavy headline, an abrupt light-to-navy rectangle, a screenshot contained inside a high-contrast white border, and repeated section-sized colour blocks. Later sections repeat card or rule treatments at similar visual weight, so the page offers few changes of pace. This is a design hypothesis, not evidence that enquiries are being lost.

The user problem is judging WAIA's commercial credibility quickly. The smallest useful test is one homepage-only CSS concept using the current copy and assets. Success at this stage means the owner can compare real desktop and phone renders, follow the same actions, and decide whether the direction merits a separate production implementation. Conversion impact is not asserted.

## Iteration 1

- A lighter, narrower headline and more generous first-screen spacing make the existing proposition easier to scan.
- The authentic Evidence screenshot overlaps a softly rounded navy product stage. A small offset layer adds depth without implying another interface.
- The three management questions become an editorial list beside their introduction. The Visibility Check becomes a quieter next-step entry rather than another large card.
- The Admin Home screenshot remains real and gains breathing room and restrained shadow. Later sections keep the same order and wording while using fewer heavy borders.
- No ambient or continuous motion was added. Existing button feedback remains; the CSS offset layer is static under reduced motion. This avoids extra scripting and a new loading or motion cost.

The separate `homepage-prototype.css` is loaded only on `/` for review.

## Iteration 2 · design review response

- **Typography:** Avenir Next is explored for homepage headings while Inter/system UI remains the body and interface stack. The result has tighter, more deliberate display proportions and a calmer navigation rhythm. Avenir Next is a system font on the review Mac, so there is no font request in this prototype. Its availability and brand approval need resolving before production; other systems fall back to Inter/system UI.
- **Product imagery:** The existing Evidence screenshot now leads a two-view stage. The secondary image is the authentic existing mobile Admin Home screenshot, used as a decorative, slightly angled layer on desktop. At tablet and phone widths it is hidden so it cannot cover the caption; the real mobile screenshot remains the primary phone view. The later Admin Home screenshot is presented beside a small clarity surface rather than inside another large border.
- **Composition:** The questions and Visibility Check now run together with less unused desktop space. The workflow example uses a staggered two-column editorial layout on desktop and a linear reading order on phone. Buyer fit and trust use lighter surfaces and fewer repeated cards.
- **Motion:** The product proof makes one 800ms opacity/position entrance on load. It directs attention from the proposition to the real interface. `prefers-reduced-motion` removes it. No scrolling animation, heavyweight library or generated product UI was added.

If this direction is approved, the smallest production implementation is to agree a portable display-font choice, consolidate the selected rules into the existing homepage stylesheet, remove the prototype layer, and repeat accessibility and performance checks in a separate PR before release.

## Rendered previews

Captured from the local browser at device scale 1. The baseline is `origin/main` at `958d6c7`; the after images are this branch. The initial viewport images use 1440 × 900 and 390 × 844. Section captures show the normal sticky header while scrolling.

| View | Current main | Prototype |
| --- | --- | --- |
| Desktop first screen | [Before](before-1440-first.jpg) | [After](after-1440-first.jpg) |
| Phone first screen | [Before](before-390-first.jpg) | [After](after-390-first.jpg) |
| Desktop questions | — | [After](after-1440-questions.jpg) |
| Phone questions | — | [After](after-390-questions.jpg) |
| Desktop product story | — | [After](after-1440-product.jpg) |

### Iteration 2 previews

| View | Iteration 1 | Iteration 2 |
| --- | --- | --- |
| Desktop first screen | [Before](after-1440-first.jpg) | [After](iteration-2/after-1440-first.jpg) |
| Desktop product stage | — | [After](iteration-2/after-1440-stage.jpg) |
| Desktop questions and next step | [Before](after-1440-questions.jpg) | [After](iteration-2/after-1440-questions.jpg) |
| Desktop Visibility Check | — | [After](iteration-2/after-1440-visibility.jpg) |
| Desktop Admin Home | [Before](after-1440-product.jpg) | [After](iteration-2/after-1440-product.jpg) |
| Desktop workflow | — | [After](iteration-2/after-1440-workflow.jpg) |
| Phone first screen | [Before](after-390-first.jpg) | [After](iteration-2/after-390-first.jpg) |
| Phone product stage | — | [After](iteration-2/after-390-stage.jpg) |
| Phone questions | [Before](after-390-questions.jpg) | [After](iteration-2/after-390-questions.jpg) |
| Phone Visibility Check | — | [After](iteration-2/after-390-visibility.jpg) |
| Phone workflow and buyer fit | — | [Workflow](iteration-2/after-390-workflow.jpg) · [Buyer fit](iteration-2/after-390-buyer-fit.jpg) |

## Validation and trade-offs

- The changed HTML adds one stylesheet link, a non-visible section class and an `aria-hidden` decorative copy of an existing screenshot. Approved visible copy, section order, primary screenshot sources, links, metadata, scripts and forms remain unchanged.
- Iteration 2 browser review covered 320, 390, 768, 1280 and 1440px. No document horizontal overflow or failed visible image was found. The 390px menu expanded and exposed all four navigation links. The browser reported no console errors. The primary enquiry links still resolve through the existing `/go/see-waia/direct/` handoff.
- Key changed colour pairs were checked: commercial-entry body text 12.28:1, label 10.52:1, deep-teal text on white 5.62:1 and muted body text on the light page 7.32:1.
- `node --test scripts/*.test.mjs`: 72 passed. `git diff --check`: passed.
- Prettier and `html-validate` were not available offline in this workspace; the attempted `npx --no-install` commands did not complete. The only HTML edits are a stylesheet link and a section class, and Chrome parsed and rendered both.
- The hero still preloads the same responsive product image. Iteration 2 reuses an existing 84KB mobile screenshot on desktop and adds no external font, JavaScript or 3D dependency. The reveal and layered shadows may increase paint cost; test actual LCP and rendering performance before production.
- Full-page browser capture does not render offscreen sections because the existing site uses `content-visibility: auto`. Review the section captures and the branch in a browser. Real 200% browser zoom, assistive technology and field performance have not been checked for this prototype.

**Delivery learning note:** Standard risk. One owner design review requested this second iteration. Human supervision time is not tracked; no escaped defect is known.
