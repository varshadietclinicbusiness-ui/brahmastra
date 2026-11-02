# 0009 · One theme, a new Latin type pairing, and token roles

- **Date:** 2026-11-02
- **Status:** Accepted. Supersedes the Painted theme (0003) and the Latin font choice in 0007.

## Context

- **Painted theme.** Mayur found the pink theme (rani accent, cream paper, ink borders, hard shadows) "childish". It's removed.
- **Typography.** Typography in Noto Sans "didn't look convincing". We studied Razorpay's Blade, which is open source; its Figma file is view-only for our tools, so we read the code instead. Blade pairs a characterful heading face (TASA Orbiter) with Inter for text, uses separate desktop and mobile sizes, and tracks headings −1.3% to −3.3%.
- **Tokens.** Hover and pressed states were borrowing `bg/sunken` and even `border/subtle` as fills. That's a sign the semantic layer was missing roles.

## Decision

**Theme**
- One theme, Neutral, in Light and Dark.
- Figma's Semantic modes are now Light and Dark.
- In CSS, `data-astra-mode` is the only switch (`data-astra-theme` is gone).
- Removed `border.control`, the hard shadows and the Painted-only radii.
- Products re-brand by remapping `accent`.

**Typography**
- **Latin:** headings in Schibsted Grotesk SemiBold, body and UI in Inter.
- **Indian scripts:** the Figma Script modes still switch both families to the matching Noto Sans. Weights are variables too (Inter calls it "Semi Bold", Noto "SemiBold").
- **Scale:** heading line-heights are tighter (44/76 for display-xl, 32/40 for heading-xl). Tracking runs −2.5% on display, −1.5% to −0.5% on headings, −0.3% to −0.5% on body and labels, and 0 for Indian scripts.
- **Why not Blade's font:** we compared Instrument Sans, Geist, Schibsted Grotesk and Inter. Instrument at −3.3% crowded ("in12"), and Geist reads as Vercel. Schibsted is warm and editorial without borrowing Razorpay's identity.

**Token roles**

| Group | Tokens | Notes |
|---|---|---|
| Colour | `color.bg.hover`, `color.bg.pressed`, `color.bg.selected`, `color.fg.placeholder` | Figma components now bind to these instead of borrowed tokens. |
| Elevation | `shadow.floating`, `shadow.modal` | Join `raised` and `overlay`. |
| Spacing roles | `inset.*`, `stack.*`, `inline.*`, `section.*`, `page-margin` | Theme-independent, in `semantic/space.json`. |
| Motion presets | `transition.press`, `move`, `enter`, `exit`, `sheet` | DTCG transition composites, in `semantic/motion.json`. |

**Brand**
- Mayur's spiral mark is now a Logo component (Mark, Lockup, Stacked, App icon).
- It sits at the top of every doc page, on the cover and file cover, and as the app icon on the login screens.

## Consequences

- Contrast: 59 pairs × 2 modes, all AA.
- Code that set `data-astra-theme` needs no change (the attribute is simply ignored now). `.astra-text-*` classes pick up the new fonts once Inter and Schibsted Grotesk are loaded.
