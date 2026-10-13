# Stage 3 visual review — How It Works and Pricing

Captured from local `main` (before) and `codex/how-it-works-pricing-redesign` (after) at 320, 390, 768, 1280 and 1440px. Captures use reduced motion. Both page files preserve the approved text and links; the comparison script found exact text-node and link parity against `main`.

## First screen

| Page | Width | Before | After |
| --- | --- | --- | --- |
| How It Works | 320 | [Before](before-how-it-works-320-first.png) | [After](after-how-it-works-320-first.png) |
| How It Works | 390 | [Before](before-how-it-works-390-first.png) | [After](after-how-it-works-390-first.png) |
| How It Works | 768 | [Before](before-how-it-works-768-first.png) | [After](after-how-it-works-768-first.png) |
| How It Works | 1280 | [Before](before-how-it-works-1280-first.png) | [After](after-how-it-works-1280-first.png) |
| How It Works | 1440 | [Before](before-how-it-works-1440-first.png) | [After](after-how-it-works-1440-first.png) |
| Pricing | 320 | [Before](before-pricing-320-first.png) | [After](after-pricing-320-first.png) |
| Pricing | 390 | [Before](before-pricing-390-first.png) | [After](after-pricing-390-first.png) |
| Pricing | 768 | [Before](before-pricing-768-first.png) | [After](after-pricing-768-first.png) |
| Pricing | 1280 | [Before](before-pricing-1280-first.png) | [After](after-pricing-1280-first.png) |
| Pricing | 1440 | [Before](before-pricing-1440-first.png) | [After](after-pricing-1440-first.png) |

## Major sections

| Page / component | Desktop before | Desktop after | Mobile before | Mobile after |
| --- | --- | --- | --- | --- |
| How It Works — six-stage model | [1440](before-how-it-works-1440-model.png) | [1440](after-how-it-works-1440-model.png) | [390](before-how-it-works-390-model.png) | [390](after-how-it-works-390-model.png) |
| How It Works — product section | [1440](before-how-it-works-1440-product-top.png) | [1440](after-how-it-works-1440-product-top.png) | [390](before-how-it-works-390-product-top.png) | [390](after-how-it-works-390-product-top.png) |
| How It Works — AI Baseline view | [1440](before-how-it-works-1440-product-1.png) | [1440](after-how-it-works-1440-product-1.png) | [390](before-how-it-works-390-product-1.png) | [390](after-how-it-works-390-product-1.png) |
| How It Works — learner view | [1440](before-how-it-works-1440-product-2.png) | [1440](after-how-it-works-1440-product-2.png) | [390](before-how-it-works-390-product-2.png) | [390](after-how-it-works-390-product-2.png) |
| How It Works — Guidance view | [1440](before-how-it-works-1440-product-3.png) | [1440](after-how-it-works-1440-product-3.png) | [390](before-how-it-works-390-product-3.png) | [390](after-how-it-works-390-product-3.png) |
| How It Works — final CTA | [1440](before-how-it-works-1440-final-cta.png) | [1440](after-how-it-works-1440-final-cta.png) | [390](before-how-it-works-390-final-cta.png) | [390](after-how-it-works-390-final-cta.png) |
| Pricing — annual bands | [1440](before-pricing-1440-bands.png) | [1440](after-pricing-1440-bands.png) | [390](before-pricing-390-bands.png) | [390](after-pricing-390-bands.png) |
| Pricing — inclusions | [1440](before-pricing-1440-inclusions-top.png) | [1440](after-pricing-1440-inclusions-top.png) | [390](before-pricing-390-inclusions-top.png) | [390](after-pricing-390-inclusions-top.png) |
| Pricing — qualifications | [1440](before-pricing-1440-qualifications.png) | [1440](after-pricing-1440-qualifications.png) | [390](before-pricing-390-qualifications.png) | [390](after-pricing-390-qualifications.png) |
| Pricing — FAQs | [1440](before-pricing-1440-faq-top.png) | [1440](after-pricing-1440-faq-top.png) | [390](before-pricing-390-faq-top.png) | [390](after-pricing-390-faq-top.png) |
| Pricing — final CTA | [1440](before-pricing-1440-final-cta.png) | [1440](after-pricing-1440-final-cta.png) | [390](before-pricing-390-final-cta.png) | [390](after-pricing-390-final-cta.png) |

## Design decisions

- **How It Works:** The pale editorial hero introduces the existing explanation. The operating model is a readable three-by-two sequence on desktop and six vertical stages on phones. The existing three product views now follow that sequence instead of appearing after the longer explanatory sections. The page retains human review and product-boundary content.
- **Pricing:** The starting price, VAT, annual term and eligible-population basis are grouped as one typographic fact set. Annual bands sit in a single high-contrast table; the 320px layout keeps both columns visible. Inclusions, implementation, optional support, exclusions and FAQs use distinct sections with rules rather than repeated cards.
- Both pages keep Inter, navy, deep teal, white and approved brand assets. The new CSS files load only on their respective routes. No shared stylesheet was changed.

## Validation and review points

- `node --test scripts/*.test.mjs`: 68 passed.
- `html-validate` passed for public HTML. The unrelated `brand/preview/index.html` retains five pre-existing inline-style errors and was excluded from the public-page run.
- Prettier and `git diff --check` passed for changed source files.
- Browser QA at 320, 390, 640, 768, 1280 and 1440px found no page overflow, broken images, or script errors. The 640px check approximates a 1280px viewport at 200% zoom. The Pricing table fits at 320px without internal scrolling. Mobile navigation opened, and primary hero actions retained 3px visible focus outlines. The homepage, See WAIA and Visibility Check were checked at 390 and 1440px without overflow or script errors. See [browser-qa.json](browser-qa.json).
- The price table, all commercial qualifications, copy, link destinations and tracking scripts are unchanged. Text-node and link parity were checked against `main`.
- The two large desktop admin screenshots remain dense on phones, even with a modest crop. The existing full-size image links remain available. The learner view uses its existing mobile screenshot. Review whether these approved assets provide enough detail for the first product demonstration; no replacement image was invented.
- On narrow phones, Pricing now shows the starting price in the first screen; its explanatory paragraph and hero CTA follow below. This order favours immediate price comprehension. Conversion effect needs measurement after release.
