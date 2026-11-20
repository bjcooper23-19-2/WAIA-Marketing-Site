# Issue 98 · homepage visual prototype

**Status:** design review only. This branch is not approved for merge or deployment.

## Design audit

The current homepage has accurate copy, authentic product screenshots and a working enquiry route. The visual friction is concentrated in the opening: an extra-heavy headline, an abrupt light-to-navy rectangle, a screenshot contained inside a high-contrast white border, and repeated section-sized colour blocks. Later sections repeat card or rule treatments at similar visual weight, so the page offers few changes of pace. This is a design hypothesis, not evidence that enquiries are being lost.

The user problem is judging WAIA's commercial credibility quickly. The smallest useful test is one homepage-only CSS concept using the current copy and assets. Success at this stage means the owner can compare real desktop and phone renders, follow the same actions, and decide whether the direction merits a separate production implementation. Conversion impact is not asserted.

## Concept

- A lighter, narrower headline and more generous first-screen spacing make the existing proposition easier to scan.
- The authentic Evidence screenshot overlaps a softly rounded navy product stage. A small offset layer adds depth without implying another interface.
- The three management questions become an editorial list beside their introduction. The Visibility Check becomes a quieter next-step entry rather than another large card.
- The Admin Home screenshot remains real and gains breathing room and restrained shadow. Later sections keep the same order and wording while using fewer heavy borders.
- No ambient or continuous motion was added. Existing button feedback remains; the CSS offset layer is static under reduced motion. This avoids extra scripting and a new loading or motion cost.

The separate `homepage-prototype.css` is loaded only on `/` for review. If approved, the smallest production implementation is to integrate selected rules into the existing homepage stylesheet, remove the prototype layer, and repeat the visual and performance checks before a separately authorised release.

## Rendered previews

Captured from local Chrome at device scale 1. The baseline is `origin/main` at `958d6c7`; the after images are this branch. The initial viewport images use 1440 × 900 and 390 × 844. Section captures show the normal sticky header while scrolling.

| View | Current main | Prototype |
| --- | --- | --- |
| Desktop first screen | [Before](before-1440-first.png) | [After](after-1440-first.png) |
| Phone first screen | [Before](before-390-first.png) | [After](after-390-first.png) |
| Desktop questions | — | [After](after-1440-questions.png) |
| Phone questions | — | [After](after-390-questions.png) |
| Desktop product story | — | [After](after-1440-product.png) |

## Validation and trade-offs

- The changed HTML adds one stylesheet link and a non-visible section class. Approved visible copy, section order, screenshot sources, links, metadata, scripts and forms remain unchanged.
- Browser review covered 320, 390, 768, 1280 and 1440px. No document horizontal overflow or failed visible image was found. The 390px menu expanded and exposed all four navigation links. The browser reported no console errors. The primary enquiry links still resolve through the existing `/go/see-waia/direct/` handoff.
- `node --test scripts/*.test.mjs`: 72 passed. `git diff --check`: passed.
- Prettier and `html-validate` were not available offline in this workspace; the attempted `npx --no-install` commands did not complete. The only HTML edits are a stylesheet link and a section class, and Chrome parsed and rendered both.
- The hero still preloads the same responsive product image. The prototype adds no image, font, JavaScript or 3D dependency. The only new decorative layer is CSS; the larger screenshot shadow may modestly increase paint cost, which should be checked with actual performance profiling before production.
- Full-page browser capture does not render offscreen sections because the existing site uses `content-visibility: auto`. Review the section captures and the branch in a browser. Real 200% browser zoom, assistive technology and field performance have not been checked for this prototype.

**Delivery learning note:** Standard risk. Human supervision time, rework and escaped defects are not yet known; record them after owner review.
