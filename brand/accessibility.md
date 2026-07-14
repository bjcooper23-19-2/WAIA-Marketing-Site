# WAIA Brand Accessibility Rules

## Standard

All marketing-site implementation work must meet WCAG 2.2 AA expectations for text, controls, focus and meaningful graphical elements.

## Contrast rules

- normal text: minimum 4.5:1
- large text: minimum 3:1
- meaningful controls, borders and focus indicators: minimum 3:1 against adjacent colours
- do not rely on colour alone to communicate state

## Approved pairings

- `#F8FAFC` on `#081220`
- `#CBD5E1` on `#081220`
- `#0F172A` on `#FFFFFF`
- `#475569` on `#FFFFFF`
- `#0F172A` on `#F2F5F7`
- white text on `#0D7377`
- `#0D7377` text and icons on white
- `#081220` text on `#22D3EE` where bright cyan is used as a filled active state

## Restricted pairings

- bright cyan body text on white or pale cyan
- white body text on pale cyan, pale grey or translucent white cards
- low-opacity white borders as the only boundary on a light surface
- muted grey text below the required contrast ratio
- transparent buttons whose text and border disappear against the page background

## Interaction states

Every link and button must have:

- a readable default state
- a visible hover state
- a visible keyboard focus state
- a readable active state
- a readable disabled state where used

Use the bright-cyan focus ring on dark and light surfaces only where it maintains at least 3:1 contrast. Otherwise use deep teal or operating navy.

## Logo accessibility

- decorative logo instances should use empty alt text
- primary brand instances should use `alt="WAIA"`
- do not repeat the full descriptor in alt text when it appears as adjacent visible text
- favicon and app icons do not need hidden descriptive copy

## Testing requirements

Test at:

- 320px mobile width
- 768px tablet width
- 1280px and 1440px desktop widths
- 200% browser zoom
- keyboard-only navigation
- reduced-motion preference
- high brightness and low brightness displays where practical

The known failures on `/who-its-for/` and `/pricing/` must be explicitly rechecked after implementation.