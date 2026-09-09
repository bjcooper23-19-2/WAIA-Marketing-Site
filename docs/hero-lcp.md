# Homepage hero image performance

Measured on 8 September 2026 against the existing hero layout at commit
`cfd3ac6`. No CSS, copy, image crop or display dimensions changed.

## Delivery

- Original PNG: 1675 x 932, 370,646 bytes. Retained for deeper product proof.
- Full-size lossless WebP: 1675 x 932, 272,656 bytes (26.4% smaller).
  Decoded RGB pixels match the original PNG exactly.
- Smaller lossless WebP: 840 x 467, 109,046 bytes (70.6% smaller than the PNG).
  Derived by downsampling the original, with no lossy compression.
- The hero uses width-based `srcset` and `sizes`, `loading="eager"` and
  `fetchpriority="high"`. Existing intrinsic dimensions and async decoding remain.
- All three below-fold homepage screenshots retain `loading="lazy"` and
  `decoding="async"`. The original source remains available; no dependencies were
  added to the repository.

## Regression investigation

Cloudflare RUM currently identifies the 840px WebP as the homepage LCP element,
with field values in the supplied report of P50 7.56s, P75 8.11s, P90 9.32s and
P99 12.56s. The page already has `loading="eager"`, `fetchpriority="high"`,
explicit dimensions and a responsive `srcset`; it is discoverable in the initial
HTML. A same-day three-run production Lighthouse sample measured 2.31s, 1.75s
and 2.17s LCP under the existing simulated desktop profile, so the supplied RUM
tail appears to be driven by real-user/device/network conditions rather than a
reproducible desktop discovery failure.

The remaining delivery gap was that the browser had to discover the image from
the body after the stylesheet. The hero now has a responsive AVIF preload in the
document head and an AVIF `picture` source, while retaining the existing WebP
source as fallback. The new 840px AVIF is 51,988 bytes versus 109,046 bytes for
the 840px WebP (52.3% smaller); the 1675px AVIF is 136,357 bytes versus 272,656
bytes for the full WebP (50.0% smaller). The q95 AVIF derivatives were decoded
and compared against their WebP inputs; maximum channel difference was 9/255
and mean absolute error was below 0.6/255, with no visible text or UI clarity
regression in visual inspection.

The preload uses the same `imagesizes` expression as the image, so the browser
can select the 840px or 1675px source without downloading both. No CSS/layout,
hero dimensions or below-fold loading behaviour changed.

## Before and after

Lighthouse 13.4.1, local Python static server, headless Chrome, cold browser per
run, 1440 x 1000 desktop viewport at 1x density. Simulated throttling: 150ms RTT,
1638.4 Kbps throughput and 4x CPU slowdown. Three runs before and three after,
with the same settings. The hero image was the LCP element in both versions.

| Metric         | Before | After  |
| -------------- | ------ | ------ |
| LCP run 1      | 4.053s | 2.477s |
| LCP run 2      | 3.904s | 2.477s |
| LCP run 3      | 3.603s | 2.477s |
| Median LCP     | 3.904s | 2.477s |
| CLS, every run | 0      | 0      |

Median simulated LCP improved by 1.427s (36.6%). These are local lab results,
not production PageSpeed or field measurements. Hosting, cache, device and
network conditions will affect deployed results. The 1x lab browser selected
the 840px source; high-density desktop browsers select the full-size source.

## Responsive verification

At 2x density, rendered image widths were 262, 332, 702, 706 and 782px at
320, 390, 768, 1280 and 1440px viewports respectively. Mobile selected the
840px asset; tablet and desktop selected 1675px. No horizontal overflow or
upscaling was observed. Desktop and mobile renders were inspected. HTML
validation, Prettier and `git diff --check` passed.
