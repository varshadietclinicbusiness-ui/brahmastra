# 0005 · Two typefaces: Host Grotesk for headings, Mukta for everything else

- **Date:** 2026-11-01
- **Status:** Accepted. Replaces the font choice in 0004; 0004's mobile sizing rules still stand.

## Context

0004 used Host Grotesk for every text style. In Figma, Mayur's feedback was that Host Grotesk was "all over the place" and should be the heading font only. A grotesk with this much character works at 22px and up, but becomes tiring in paragraphs, button labels and 12px helper text.

## Decision

- **Headings: Host Grotesk.** Only `display-*` and `heading-*` use it. Tracking tightens as the size grows: -3.5% at 72px down to 0 at 16px.
- **Body and UI: Mukta** by Ek Type (Mumbai). Body, labels, buttons, inputs, badges and overline all use it. It's a humanist sans with open shapes, so it reads well at 12–16px. Its Latin and Devanagari were drawn together, so a mixed Hindi-English sentence shares one baseline and one colour. That suits a system that calls itself Indic-first.
- **Code: JetBrains Mono**, unchanged.
- **Indic headings:** fall through to the Anek family in the heading stack. `font-family-heading-indic` (Anek Devanagari first) is for pages written entirely in an Indic language.

We compared Mukta with Instrument Sans and Geist next to Host Grotesk in Figma. Instrument Sans and Geist are both grotesks, so the pairing had too little contrast. Mukta also added Devanagari.

## The scale (19 styles)

| Style | Font | Size / line-height | Tracking |
|---|---|---|---|
| display-xl / lg / md | Host Grotesk Bold | 72/76 · 56/60 · 44/48 | -3.5% · -3% · -2.5% |
| heading-xl / lg / md / sm / xs | Host Grotesk SemiBold | 36/42 · 28/34 · 22/28 · 18/24 · 16/22 | -2% → 0 |
| body-lg / md / sm / xs | Mukta Regular | 18/28 · 16/24 · 14/20 · 12/16 | 0 (xs +0.5%) |
| label-xl / lg / md / sm | Mukta SemiBold | 22/28 · 16/20 · 14/18 · 12/16 | 0 (sm +0.5%) |
| overline | Mukta SemiBold, uppercase | 11/16 | +8% |
| code-md / sm | JetBrains Mono | 14/20 · 12/16 | 0 |

Line-heights are authored in px to match Figma and shipped as unitless ratios. Under `:lang()` for Indic languages, each ratio grows about 12% and never drops below 1.3.

## Consequences

- Renamed `caption` → `body-xs` and `code` → `code-md`. Added `label-xl`, `code-sm` and `font-family-heading-indic`.
- Family tokens are now `heading`, `body` and `mono` (previously `display`, `sans` and `mono`). Tailwind utilities follow: `font-heading`, `font-body`, `font-mono`.
- Figma variables, text styles and the code tokens are the same set. Changing one without the other is drift.
