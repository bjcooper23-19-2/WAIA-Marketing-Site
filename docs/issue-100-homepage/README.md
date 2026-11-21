# Issue 100 · production homepage review

This is the production implementation of the approved iteration 2 direction from [draft PR #99](https://github.com/bjcooper23-19-2/WAIA-Marketing-Site/pull/99) and [issue #98](https://github.com/bjcooper23-19-2/WAIA-Marketing-Site/issues/98). It is based on `origin/main` at `958d6c7`. The design reference remains open and unchanged.

## Rendered evidence

| Viewport | First screen | Product stage |
| --- | --- | --- |
| 1440 × 900 | [Desktop](after-1440-first.png) | [Evidence + Admin Home](after-1440-stage.png) |
| 768 × 900 | [Tablet](after-768-first.png) | — |
| 390 × 844 | [Phone](after-390-first.png) | [Admin Home](after-390-stage.png) |
| 320 × 720 | [Small phone](after-320-first.png) | — |

The layout, overlap, section rhythm and one-time entrance follow the approved captures in PR #99. The intentional differences are the self-hosted Inter display face replacing local Avenir Next, the narrower desktop heading measure needed to retain the approved five-line composition, and a near-opaque sticky navy header to keep navigation legible above both light and dark sections. On phone, Inter makes the opening copy block shorter, so the real product image enters the first screen slightly earlier. No visible wording or destination changed.

## Production changes

- `assets/css/homepage.css`: consolidates the selected design rules into the established stylesheet; redundant same-selector overrides were folded together. The review-only stylesheet is not loaded or copied.
- `index.html`: adds the existing authentic mobile Admin Home image as an `aria-hidden` decorative desktop layer, a class for the Visibility Check transition, and a preloaded local font. The primary image retains its caption and full-size link.
- `assets/fonts/`: contains the 47 KB Inter Latin variable WOFF2 and its [SIL OFL 1.1 license](../../assets/fonts/LICENSE-Inter.txt). The binary was copied from the adjacent WAIA product build's `@fontsource-variable/inter@5.2.8` output; its package lock records `OFL-1.1`. The font is used for homepage display type, with the existing Inter/system stack as fallback. No Avenir binary or font service is required.

## Verification record

**Passed:** 72 repository tests; exact comparison of all 130 non-whitespace HTML text nodes, 32 link destinations and 26 heading tags against main; local target-file existence for every homepage internal link; browser renders at all four widths with no horizontal overflow, failed visible images or console errors; mobile menu expansion and Escape close; visible 3 px keyboard focus on the primary enquiry action; decorative image absent from the accessibility tree; header reviewed over both light and dark sections. Sample contrast ratios: hero body 7.04:1, deep-teal link on white 5.62:1, header navigation 11.92:1, commercial body 12.28:1. `git diff --check` passed.

**Static performance review:** the primary responsive Evidence image remains eagerly loaded and preloaded, at 1470 × 865 and 167 KB for the smaller desktop source. The existing mobile Admin Home image is 780 × 991 and 82 KB; its decorative desktop copy is lazy loaded and dimensioned. The 47 KB font is preloaded with `font-display: swap`. The one-time 800 ms entrance animates opacity and transform only, with no script or new library; the reduced-motion rule disables both entrances. Screenshots remain visible without animation styles.

**Outstanding:** actual 200% browser zoom, a non-Avenir operating-system render, a live screen-reader pass, and reduced-motion emulation were unavailable in the review browser. Mobile LCP and CLS were not measured; the static review above is not a field-performance claim. Prettier and `html-validate` were unavailable offline; the installed `tidy` does not recognise HTML5 semantic elements. Chrome parsed both stylesheets and the page without console errors. Remote Tally completion and Cloudflare analytics cannot be verified from a local preview; existing handoff tests cover source forwarding and fail-open behavior, and a live post-review check remains necessary. These are review gaps, not passed gates.

**Delivery learning:** Standard risk. Human supervision time is untracked. One heading-width adjustment was needed after the portable font render; no escaped defect is known at PR creation.
