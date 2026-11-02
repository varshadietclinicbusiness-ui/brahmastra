# 0010 · Layered, mode-aware elevation and more motion presets

- **Date:** 2026-11-02
- **Status:** Accepted. Replaces the `soft-*` shadows from 0002/0009.

## Context

- Mayur wasn't impressed by the shadows and asked for a world-class shadow system.
- The old set was five `soft-*` shadows plus a separate `-dark` copy of each. In Figma, those were ten effect styles, and designers had to pick the dark one by hand.
- The hard "sign-painter" shadows were left over from the removed Painted theme.

## Research

- **Razorpay Blade** (open source):
  - Three elevation tokens (`lowRaised`, `midRaised`, `highRaised`), tinted with a blue-grey (`hsla(200, 10%, 18%, …)`) rather than black.
  - Popups combine an inset 1px border, the elevation, and, in dark mode, an inset top highlight.
  - Its motion tokens split easing into entrance, exit, standard, emphasized and overshoot.
- **Common practice** (Material, Apple, layered-shadow write-ups): use several stacked shadows rather than one, because real light gives a sharp contact shadow and a soft ambient one. In dark mode, show height with lighter surfaces, because shadows barely show.

## Decision

**Shadows: `scripts/definitions/elevation.ts` generates `primitives/shadow.json`.**

- **Layers.** Each level stacks up to three layers:
  - **Ring:** `0 0 0 1px`, ink at 6%. It replaces a border.
  - **Contact:** small and tight.
  - **Ambient:** large, soft, with negative spread. Offsets and blurs roughly double per level.
- **Light mode** layers use kajal-950 (`#0e1319`), not black, so shadows belong to the palette.
- **Dark mode** layers use black at 40–70%, a white 6–10% ring, and an inset 1px white top edge.
- **Primitives:**
  - Levels `xs`, `sm`, `md`, `lg`, `xl`.
  - Special shadows: `lift` (dragging), `cast-up` (bars at the foot of the screen) and `well` (inset).
  - Each has a `-dark` twin.
- **Semantic roles:** `subtle`, `raised`, `floating`, `overlay`, `modal`, `drag`, `up` and `inset`.
  - Components use roles only.
  - Each theme mode maps every role to the right primitive.
  - Tailwind gets `shadow-subtle` … `shadow-up` and `inset-shadow-well`.
- **Removed** the hard sign-painter shadows.

**Figma**

- Eight effect styles, named `elevation/1 subtle` … `elevation/5 modal`, `elevation/6 lift`, `elevation/up` and `elevation/well`.
- Every layer's colour is bound to a Semantic colour variable (`shadow/<role>/<n>-<layer>`) with Light and Dark values. One style therefore switches with the frame's mode, and the `-dark` styles are deleted.
- The old `soft-*` styles were upgraded in place, so existing components kept their shadows. The 7 layers that used dark styles were moved over.
- Figma uses the light-mode geometry for both modes; only colours change. Code is the exact source.

**Motion**

- Added:
  - `duration.instant` (80ms)
  - `easing.overshoot` (0.34, 1.56, 0.64, 1), for small confirmations only
  - `easing.linear`, for loops only
  - presets `transition.hover` (instant + standard) and `transition.pop` (base + overshoot)
- Exits stay about two-thirds of the matching entrance.

**Docs.** The Elevation and Motion pages in Figma were rewritten in plain English. They cover anatomy, the scale in both modes, a component mapping, interaction states, choreography timelines, mobile patterns, haptics, Reduce Motion and performance.

## Consequences

- One shadow role works in light and dark, in both Figma and CSS, with nothing to swap by hand.
- Dark-mode shadows in Figma are close to the code values but not identical in geometry. Small differences are expected.
