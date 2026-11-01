# 0006 · Colour curves from the workshop system, icons from Lucide

- **Date:** 2026-11-01
- **Status:** Accepted. Refines 0003 (colour); the semantic layer and the four modes are unchanged.

## Context

Mayur asked for the colour system to be properly inspired by the "Colour System – Foundations" page of the workshop sample design system (Newton School, Figma Community). He also wanted its icon library brought in whole.

## Colour: what we took from the workshop system

We measured its ramps in OKLCH and adopted their shape. We didn't copy their hex values.

- **Airy curves.** Tints are paler, mid steps are lighter, and chroma peaks at step 600 before falling steeply into deep shades. `L_CHROMATIC`, `C_CURVE`, `L_NEUTRAL` and `C_NEUTRAL` in `palette.ts` are averages of the workshop ramps. We kept a 950 step for dark-mode canvases.
- **A cool slate neutral.** `kajal` moved from a near-grey (chroma 0.012) to a blue-leaning slate (hue 250, chroma peaking at 0.045 at step 600), like their grey.
- **A sky-blue family.** Their brand blue became **aasmani** (Hindi/Urdu for sky-blue). Its role is "Brand alt": for products that want a blue brand and point `accent` at it in their own theme.
- **Family roles.** Every family now has a documented job: Neutral, Neutral warm, Brand, Brand alt, Accent, Success, Danger, Warning, Info, Decor ×2. The Foundations page shows them in the workshop's Swatch · Token · Hex table layout.
- **Overlay alphas.** `ink-alpha` and `white-alpha` at 8/16/25/60/75/90% are for scrims, pressed states on photos and image protection.

## Where we deliberately differ

- **AA first.** In the workshop ramps, step 600 fails AA with white text for several hues (sky 3.6:1, green 2.7:1, yellow 2.3:1). Taking the curve as-is broke 21 of our 236 contrast pairs. Fixes:
  - Step 600 is pulled slightly darker (L 0.585).
  - Neutral 600 sits at L 0.555 so `fg.subtle` passes.
  - `border.strong` moved from neutral 500 to 600 in Neutral Light.
  - Painted Light secondary text uses warm `mitti` greys, because slate on clay paper looked cold and also failed.
  Result: 236/236 pairs pass again.
- **Three tiers, not yet.** The workshop file has a third tier of component tokens (`components/button/default/bg`, …). We documented it on the Foundations page as the next step, but didn't build it yet: it means rebinding every component and is worth its own decision.

## Icons: why not the workshop library

The workshop file's 1,171 icons are **Untitled UI Icons**: the naming (`check-verified-01`, `activity-heart`) and the outlined single-vector construction match. The Untitled UI licence allows free use in your own products. It forbids including them in any "UI kit, design system, code library … intended for resale, redistribution, or public access", and forbids publishing framework versions. Brahmāstra is a public MIT design system, so copying them would break that licence.

Instead we imported **Lucide** (ISC licence, version 1.66.0): 1,963 icons, the same 24px grid and 2px round stroke our first icons used. They're arranged in the workshop library's 19 categories (General, Arrows, Users … Education), mapped from Lucide's own categories. We left out icons that only belong to the animals, emoji, gaming and sports categories.

- The 56 original icon components were kept and given Lucide glyphs (renamed where Lucide's name differs, e.g. `close` → `x`). Every existing instance therefore kept working. `icon/back` stays as an alias of `chevron-left`.
- Every icon is a single flattened vector called `glyph`. That's why swapping icons inside a component keeps its colour override.
- When icons ship in code, the Lucide ISC licence text must ship with them.

## Consequences

- Colours changed everywhere (Figma variables and CSS), but no semantic token was renamed. Product code needs no changes.
- New primitives: `aasmani-*`, `ink-alpha-*`, `white-alpha-*`, `transparent`.
