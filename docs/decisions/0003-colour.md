# 0003 · Colour: OKLCH ramps, Indian names, contrast proven in CI

- **Date:** 2026-11-01
- **Status:** Accepted

## Context

Hand-picked hex ramps step unevenly — a "500" yellow looks lighter than a "500" blue, so the same step can't play the same role across hues. And "accessible by default" means nothing unless someone checks it.

## Decision

**OKLCH generation.** Every ramp has 11 steps (50–950) with the same lightness curve, a chroma curve that peaks at 500–600, and a per-hue `lift` for yellows and greens, which need extra lightness to look vivid. Values are gamut-mapped to sRGB.

**Indian names for primitives.** sindoor (vermilion), kesar (saffron), haldi (turmeric), tota (parrot green), mor (peacock), neel (indigo), jamun (plum), rani (rani pink), kajal (kohl ink) and mitti (clay paper). The names give the system an identity, and they cost nothing in usability, because product code only touches semantic names (`color.danger.solid`).

**Two themes from one palette.**

- **Neutral** — monochrome ink accent on white. Calm, so a product's own brand can lead.
- **Painted** — Indian hand-painted signage: cream paper canvas, ink outlines (2px borders), rani-pink accent, hard offset shadows with no blur, sharper corners.

**Contrast is a test, not a promise.** `pnpm test` checks 59 pairings in each of the 4 theme × mode combinations against WCAG 2.2 AA: text pairs at 4.5:1 and UI boundaries (strong borders, focus rings, solid controls) at 3:1. The build fails on any miss.

## Consequences

- First run: 235/236 pairs passed. The painted link colour on sunken paper was 4.17:1; it moved from neel-600 to neel-700. That is the system working as designed.
- Warning solids (haldi yellow) always carry ink text. White on yellow never passes.
