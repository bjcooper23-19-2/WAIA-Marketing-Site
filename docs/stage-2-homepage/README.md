# Stage 2 homepage visual pilot

The `before-*` screenshots were captured from `origin/main` at `d5f519f`, which includes Stage 1 PR #82. The `after-*` screenshots show the initial PR #83 design. The [mobile refinement evidence](mobile-refinement/README.md) compares that design with the final phone presentation. All captures use local Chrome, the same viewport dimensions, a device scale factor of 1, and reduced motion. `first` is the initial viewport; `section-2` through `section-4` show the start of the Admin Home story, three buyer questions, and illustrative workflow respectively. The section screenshots are viewport captures, so the sticky navigation remains visible as it would during normal scrolling.

| Width  | Initial viewport before              | Initial viewport after             |
| ------ | ------------------------------------ | ---------------------------------- |
| 320px  | [Before](before-home-320-first.png)  | [After](after-home-320-first.png)  |
| 390px  | [Before](before-home-390-first.png)  | [After](after-home-390-first.png)  |
| 768px  | [Before](before-home-768-first.png)  | [After](after-home-768-first.png)  |
| 1280px | [Before](before-home-1280-first.png) | [After](after-home-1280-first.png) |
| 1440px | [Before](before-home-1440-first.png) | [After](after-home-1440-first.png) |

## Main composition changes

- The same headline, explanation, and CTAs now occupy a light editorial introduction. This gives the headline a deliberate line length and makes the primary action easier to find.
- The Evidence view is enlarged and cropped in a navy product stage. Its caption retains access to the complete screenshot. At phone widths, the existing mobile Admin Home screenshot replaces the reduced desktop interface and links to its full-size image.
- The Admin Home story uses a clearer heading-to-explanation relationship and a quieter screenshot frame. The three buyer questions now use numbered editorial columns. The fictional workflow example reads as one connected sequence instead of four separate cards.
- The new stylesheet is loaded only by the homepage. Existing site-wide CSS, other page markup, claims, pricing, navigation destinations, and enquiry URLs remain unchanged.

## More before-and-after views

| Component             | Desktop before                           | Desktop after                           | Mobile before                          | Mobile after                          |
| --------------------- | ---------------------------------------- | --------------------------------------- | -------------------------------------- | ------------------------------------- |
| Admin Home story      | [1440px](before-home-1440-section-2.png) | [1440px](after-home-1440-section-2.png) | [390px](before-home-390-section-2.png) | [390px](after-home-390-section-2.png) |
| Three buyer questions | [1440px](before-home-1440-section-3.png) | [1440px](after-home-1440-section-3.png) | [390px](before-home-390-section-3.png) | [390px](after-home-390-section-3.png) |
| Illustrative workflow | [1440px](before-home-1440-section-4.png) | [1440px](after-home-1440-section-4.png) | [390px](before-home-390-section-4.png) | [390px](after-home-390-section-4.png) |

The [mobile focus state](after-home-390-focus.png) and [expanded navigation](after-home-390-menu.png) were also captured.

## Validation

- `node --test scripts/*.test.mjs`: 68 passed.
- `html-validate` passed for all public HTML files, excluding the pre-existing brand preview, which has five inline-style errors unrelated to this change.
- Prettier check passed for the changed HTML, CSS, and test file; `git diff --check` passed.
- Browser checks at 320, 390, 768, 1280, and 1440px found no page overflow, JavaScript errors, or failed visible images. A 640px check covered the approximate layout width of a 1280px viewport at 200% zoom.
- Existing homepage link text and destinations matched the baseline at all five requested widths. The new full-size Admin Home image link points to an existing product asset. The mobile menu expanded and exposed its links.
- Measured contrast on the new hero: headline 16.3:1, explanation 9.46:1, primary and secondary buttons 5.62:1; primary hover 7.42:1. The secondary keyboard focus outline is 3px deep teal. Reduced-motion rendering was checked.
- How It Works, Pricing, See WAIA, and Workplace AI Visibility Check were rendered at 390 and 1440px with no page overflow or JavaScript errors. They do not load the new stylesheet.

## Review points

The Evidence image is intentionally cropped so its central content is larger; the full image remains available in the caption. At 320px, the top of the mobile product view appears in the first screen and its main content follows immediately below. The mobile refinement removes the repeated Admin Home image from the later story while keeping its approved explanation and action. Visual polish may improve credibility and comprehension, but any effect on enquiries requires measurement after release.
