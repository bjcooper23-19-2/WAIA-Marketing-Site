# PR #83 mobile refinement

These captures compare the initial PR #83 commit `e9ee8a5` with the focused mobile refinement. They use local Chrome at a device scale factor of 1 with reduced motion.

| Width | Initial viewport before        | Initial viewport after       | Hero-to-product transition before   | Transition after                  | Admin Home story before        | Story after                  |
| ----- | ------------------------------ | ---------------------------- | ----------------------------------- | --------------------------------- | ------------------------------ | ---------------------------- |
| 320px | [Before](before-320-first.png) | [After](after-320-first.png) | [Before](before-320-transition.png) | [After](after-320-transition.png) | [Before](before-320-story.png) | [After](after-320-story.png) |
| 390px | [Before](before-390-first.png) | [After](after-390-first.png) | [Before](before-390-transition.png) | [After](after-390-transition.png) | [Before](before-390-story.png) | [After](after-390-story.png) |

## Decision

The existing Admin Home mobile screenshot remains the first product view. It is the only approved mobile screenshot of WAIA's management interface and directly supports the hero's evidence-to-action message. The other approved mobile image shows a learner exercise, which would give a different first impression of the product. Desktop screenshots scaled to phone width are less legible.

The frame now overlaps the light-to-navy boundary consistently at both phone widths, tying the introduction to the product stage without an added graphic or claim. The later Admin Home figure is hidden on phones because it repeats the same image; the section's copy and link remain. Desktop layout and images are unchanged.

## Checks

- 320px and 390px: no page overflow or JavaScript errors; the visible product image loaded.
- Existing homepage links and destinations were identical before and after the refinement.
- 768px and 1440px first-screen screenshots were pixel-identical before and after.
- 68 repository tests, homepage HTML validation, Prettier, and `git diff --check` passed.
