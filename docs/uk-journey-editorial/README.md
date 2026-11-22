# UK buyer-journey editorial continuation

**Scope:** `/how-it-works/` and `/who-its-for/` only. The reference is the released homepage in PR #103. This is a Standard marketing presentation change; product claims, pricing, legal text, attribution, form routing and functional tools are unchanged.

## Review renders

| Page | Desktop | Mobile |
| --- | --- | --- |
| How it works | [1440px full page](how-1440-full.jpg) | [390px full page](how-390-full.jpg) |
| Who it's for | [1440px full page](who-1440-full.jpg) | [390px full page](who-390-full.jpg) |

## Dependency audit and shared foundation

Before this change, both routes loaded `workplace-ai-academy.css`, which also styles Pricing, Insights, the Visibility Check, legal and utility routes. How it works additionally loaded its own large override file. The homepage has a standalone approved stylesheet. The two redesigned pages now share `editorial-pages.css`, which contains their self-hosted Instrument Serif and DM Sans declarations, colour/spacing/type rules, navigation and footer treatment, links, focus states, responsive layouts and reduced-motion rule. The unused How it works override was removed. The homepage and all other routes keep their existing CSS and behaviour.

The genuine AI Baseline, learner session and Guidance screenshots remain on How it works. The mobile learner screenshot remains the mobile picture source. The Who it's for page retains the canonical Open Wayfinder mark as a quiet hero watermark. No product interface, customer evidence or result was fabricated.

## Old-to-new content map

### How it works

| Existing content | New presentation |
| --- | --- |
| Hero and four Inside WAIA signals | Light editorial introduction with the same signals in a short horizontal list. |
| Six-part operating model and learning-evidence caveat | Six numbered steps on a pale surface; caveat remains immediately below. |
| AI Baseline, learner session and Guidance product views | Three genuine views in a spacious alternating image story, with captions and full-size links retained. |
| Evidence strength and value direction | Two text-led columns; all evidence states and directions remain. |
| Indicative capacity rules and four states | Navy section with the same calculation limits and four outcomes. |
| Illustrative workflow scenario | Five numbered stages; still explicitly not a customer case study. |
| Seven getting-started steps | Seven steps on a pale surface with the same scope and sequence. |
| Participant and manager experiences | Two open editorial columns; all ten list items remain. |
| Product boundaries and supporting links | Three open columns with the same exclusions and routes. |
| Final walkthrough CTA | Quiet centred invitation; Tally context and Pricing route unchanged. |

### Who it's for

| Existing content | New presentation |
| --- | --- |
| Hero and four fit signals | Light introduction with the same signal labels and canonical mark. |
| Seven organisational questions | Two-column numbered questions, one column on mobile. |
| Five buyer-role cards | Five anchored editorial rows; role-specific evidence and action bullets remain. |
| Good fit / not the right fit | Open paired comparison with all original boundaries. |
| Employee boundary | Navy section with the same privacy and human-review qualifications. |
| Three starting questions and supporting links | Open three-column questions with Pricing and privacy routes retained. |
| Four early-customer expectations | Pale four-column editorial list; no traction or customer results added. |
| Final fit CTA | Centred invitation; Tally context and How it works route unchanged. |

## Material copy changes

The commercial story is more direct without broadening the claims. The main changes are:

| Route | Before | After |
| --- | --- | --- |
| How it works hero | “How WAIA helps management see what AI is doing to work.” | “See what AI's doing to the work. Decide what comes next.” |
| How it works opening | A longer explanation of the assistants, Guidance, learning and real-work evidence | A shorter explanation that keeps all four elements and the management follow-up qualification. |
| How it works model | “Turn individual AI use into decisions management can make.” | “Move from AI use to decisions management can make.” |
| How it works AI Baseline | “AI Baseline now leads with…” | “AI Baseline shows…” removes release-note wording without changing the described follow-up. |
| How it works capacity | “Indicative capacity is evidence dependent.” | “Capacity signals need strong evidence.” The following paragraph keeps the conditions and reasons calculation may be withheld. |
| How it works start / CTA | “A practical start, not a transformation programme.” / “Ask to see WAIA in the context of your organisation.” | “Start with a real management question.” / “See how WAIA could work in your organisation.” |
| Who it's for hero | “WAIA is for organisations that need evidence of what AI is doing to work.” | “For organisations asking what AI's changing at work.” |
| Who it's for opening | Two sentences about the difficulty of seeing use, guidance, learning and examples together | One direct sentence retaining those elements and the manager decision purpose. |
| Who it's for sections | “Use WAIA when these questions are becoming unavoidable.” / “Different roles need the same answer.” / “Questions to ask internally before a fit conversation.” | “When these questions matter, WAIA can help.” / “Different roles need the same evidence.” / “What would you need to see first?” |
| Who it's for CTA | “Ask to see whether WAIA fits your organisation.” | “See whether WAIA fits your organisation.” |
| Who it's for early customers | “The right founding customers should want…” | “It's best suited to founding customers who want…” retains the early-product and case-study caveats in more direct language. |

The remaining product, fit, evidence and trust copy is retained. The headlines use natural contractions where they make the language more conversational. SEO title, description, canonical and social metadata have not changed.

## Checks and remaining review

- Repository suite: `node --test scripts/*.test.mjs` — 72 passed.
- Prettier and `git diff --check` — passed.
- Browser: full-page 1440px and 390px renders, no horizontal overflow at 320/390/768/1440px on either page; genuine screenshots and fonts loaded; mobile menu opened and closed with Escape; primary enquiry links resolved through the existing same-origin attribution handoff.
- Local reference and heading/ID check — passed: 35 and 31 local references resolve respectively; each page has one H1, unique IDs, the expected section count, three correctly parameterised WAIA enquiry links and the existing navigation/attribution/analytics scripts.

Owner visual and copy review are required before merge. A screen-reader pass, actual 200% browser zoom and field performance check remain useful release checks. The downstream Tally form was not submitted. No merge or publication is authorised by this PR.

**Delivery learning:** Standard risk. Human supervision time is not tracked. One internal copy correction followed the visual review; no escaped defect is known.

## Later phases (plan only)

1. **Pricing:** Align the editorial presentation after the owner approves this shared foundation. Preserve signed Order Form language, scope, amounts and qualifications; treat any commercial wording change as Protected.
2. **See WAIA:** Carry the approved conversion styling into the dedicated enquiry page after Pricing, then verify source attribution, `product=WAIA` and `enquiry_type=walkthrough` through the handoff. Keep submission behaviour unchanged.
3. **Insights:** Define index and article templates using the approved hierarchy, then update the generator and source content together so generated pages stay reproducible. Keep article claims and citations under editorial review.
4. **Visibility Check landing:** Align the public introduction and CTA with the same language. Keep request, access, check, results and redemption logic isolated; verify the handoff before any release.
5. **Legal and utility:** Apply only measured typography, navigation and accessibility consistency after the commercial routes settle. Legal wording, privacy choices and analytics behaviour need their own Protected review if changed.
