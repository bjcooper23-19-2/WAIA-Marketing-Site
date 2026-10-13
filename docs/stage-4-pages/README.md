# Stage 4 visual review — See WAIA and Visibility Check

Captured from local `main` at `7f6a9b8` (before) and `codex/see-waia-visibility-redesign` (after) in Chrome with reduced motion. First-screen captures use a 900px-tall viewport. The full set includes 320, 390, 768, 1280 and 1440px for both pages.

## First screen

| Page             | Width | Before                                           | After                                          |
| ---------------- | ----- | ------------------------------------------------ | ---------------------------------------------- |
| See WAIA         | 320   | [Before](before-see-waia-320-first.png)          | [After](after-see-waia-320-first.png)          |
| See WAIA         | 390   | [Before](before-see-waia-390-first.png)          | [After](after-see-waia-390-first.png)          |
| See WAIA         | 768   | [Before](before-see-waia-768-first.png)          | [After](after-see-waia-768-first.png)          |
| See WAIA         | 1280  | [Before](before-see-waia-1280-first.png)         | [After](after-see-waia-1280-first.png)         |
| See WAIA         | 1440  | [Before](before-see-waia-1440-first.png)         | [After](after-see-waia-1440-first.png)         |
| Visibility Check | 320   | [Before](before-visibility-check-320-first.png)  | [After](after-visibility-check-320-first.png)  |
| Visibility Check | 390   | [Before](before-visibility-check-390-first.png)  | [After](after-visibility-check-390-first.png)  |
| Visibility Check | 768   | [Before](before-visibility-check-768-first.png)  | [After](after-visibility-check-768-first.png)  |
| Visibility Check | 1280  | [Before](before-visibility-check-1280-first.png) | [After](after-visibility-check-1280-first.png) |
| Visibility Check | 1440  | [Before](before-visibility-check-1440-first.png) | [After](after-visibility-check-1440-first.png) |

## Main sections

| Component                                                | Before                                               | After                                                                                          |
| -------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| See WAIA agenda, desktop                                 | [1440](before-see-waia-1440-agenda.png)              | [1440](after-see-waia-1440-agenda.png)                                                         |
| See WAIA agenda, phone                                   | [390](before-see-waia-390-agenda.png)                | [390](after-see-waia-390-agenda.png)                                                           |
| See WAIA product image                                   | No product image on this page                        | [1440](after-see-waia-1440-product.png), [390](after-see-waia-390-product.png)                 |
| See WAIA final request and boundaries, desktop           | [1440](before-see-waia-1440-final-cta.png)           | [1440](after-see-waia-1440-final-cta.png)                                                      |
| See WAIA final request and boundaries, phone             | [390](before-see-waia-390-final-cta.png)             | [390](after-see-waia-390-final-cta.png)                                                        |
| Visibility Check explanation, desktop                    | [1440](before-visibility-check-1440-explanation.png) | [1440](after-visibility-check-1440-explanation.png)                                            |
| Visibility Check explanation, phone                      | [390](before-visibility-check-390-explanation.png)   | [390](after-visibility-check-390-explanation.png)                                              |
| Visibility Check question preview                        | No preview on this page                              | [1440](after-visibility-check-1440-preview.png), [390](after-visibility-check-390-preview.png) |
| Visibility Check result and request explanation, desktop | [1440](before-visibility-check-1440-assessment.png)  | [1440](after-visibility-check-1440-assessment.png)                                             |
| Visibility Check result and request explanation, phone   | [390](before-visibility-check-390-assessment.png)    | [390](after-visibility-check-390-assessment.png)                                               |

## Design and content decisions

- See WAIA now moves from a light invitation into a three-part ruled agenda and an approved WAIA Evidence screenshot. The second existing walkthrough action now sits beside the existing boundaries statement at the end. The phone image crops into a real management-attention area; its link opens the complete screenshot.
- Visibility Check leads with the existing purpose and request action beside a static excerpt of the first live question and its three exact answers. The business rationale uses editorial columns, and the existing result explanation becomes a distinct closing section.
- The Visibility Check landing now repeats the existing access-page sentence that a request is reviewed and access is not immediate. This clarifies the current step without changing the gate, form or eligibility.
- Existing page copy, commercial claims, conversion links and script tags remain. The new screenshot caption and preview label are short descriptive interface labels. The new CSS files load only on their respective marketing pages; the shared CSS, access page, live check and other public pages are unchanged.

## Conversion route and limitations

- See WAIA: both main request links retain `https://tally.so/r/objzGM?product=WAIA&enquiry_type=walkthrough` in source. With `s=li`, the existing source-attribution script rewrites all three enquiry links to `/go/see-waia/li/`. The handoff code and Cloudflare beacon are unchanged. The Tally destination returned HTTP 200 on 13 October 2026. No enquiry was submitted.
- Visibility Check: both marketing actions still lead to `/workplace-ai-visibility-check/start/`; that page still links to `https://tally.so/r/GxPbRz` and remains `noindex`. The Tally destination returned HTTP 200. The reviewed email link, one-use token redemption, `/check/` and results were not modified or exercised with a live request.
- Manual review means access is not immediate. Timing remains unspecified in approved content. Changing that process or making the direct static check route inaccessible would be a separate funnel decision. The visual changes may improve comprehension and confidence; any effect on requests requires measurement after release.

## Validation

- `node --test scripts/*.test.mjs`: 68 passed.
- Public HTML validation passed; the unrelated `brand/preview/index.html` retains five pre-existing inline-style errors and was excluded from this public-page run.
- Prettier and `git diff --check` passed for changed source files.
- [Browser QA](browser-qa.json) checked both pages at all five requested widths: no horizontal page overflow, broken images or page script errors. At 390 and 1440px, the homepage, How It Works, Pricing and the Visibility Check start page showed no overflow or broken visible images. Both phone menus opened. Main CTAs measured at least 51px tall, with white-on-teal text contrast of 5.62:1 and 3px focus outlines.
- [Interaction QA](interaction-qa.json) checked primary default, hover, focus and pressed states with reduced motion. Hover darkened to `#095f63`; pressed buttons had no position shift; transitions were reduced to 0.01ms. See [walkthrough focus](after-see-final-390-focus.png) and [Visibility Check focus](after-visibility-390-focus.png).
- The question and three answers in the preview match `/workplace-ai-visibility-check/check/` exactly. Text and link comparison against `main` found no removed marketing text or existing links. The only new link opens an existing product screenshot.
