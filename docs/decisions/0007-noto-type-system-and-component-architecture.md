# 0007 · Noto type system for Indian scripts, and component architecture rules

- **Date:** 2026-11-02
- **Status:** Accepted. Replaces the typefaces chosen in 0005.

## Typography

**Decision:** Noto Sans for everything except code, with Mukta and Host Grotesk removed. Noto was made by Google and Monotype so that every script shares the same weights, vertical metrics and rhythm. Mixed Hindi-English or Tamil-English interfaces read as one product, and Indian-language apps aren't a second-class case.

How it works:

- **19 text styles** with the same names as before. In Figma they're bound to two variable collections:
  - **Type scale** (modes: Mobile, Desktop). Only display and heading styles grow on desktop; body stays 16px everywhere.
  - **Script** (modes: Latin, Devanagari, Bengali, Tamil, Telugu, Kannada, Malayalam, Gujarati). Each mode switches the font family and line-height and sets tracking to 0.
- **Line-height classes:**
  - Latin follows the 4px-grid values in the scale.
  - **Indic** (Devanagari, Bengali, Tamil, Gujarati, Gurmukhi, Odia): body 1.75×, headings 1.5×.
  - **Tall** (Telugu, Kannada, Malayalam, whose conjuncts stack above and below): body 1.875×, headings 1.6×.
  - All are rounded up to 4px and are always at least the Latin value + 4.
- **Code** gets the same thing through `:lang()` selectors in `typography.css`, plus a 1024px desktop breakpoint. `<html lang="ta">` is all a product team needs.
- **Gurmukhi and Odia** are in the CSS font stack but aren't available in Figma's font list yet, so they have no Figma mode.
- The plan's 10-mode limit per collection caps the Script collection at 10 modes.

## Component architecture

Mayur's practice checklist has 11 rules: integrity, tokens, naming, content, auto layout, dimensions, truncation, accessibility, colour, typography and touch targets. We added 11 more, documented on the Components page:

- atomic nesting
- slots = code
- complete states
- theme-proof
- icons keep colour
- focus is a stroke
- no clipping
- script-ready
- documented
- properties over variants
- headless mapping

Changes that came with this:

- **Focus** is a `Focus ring` atom (a 2px stroke, 2px outside the shape), not a drop shadow.
- **Icon colour** is a variable `icon/color` in an **Icon colour** collection with 10 modes. Each icon slot sets its mode.
  - We tried two approaches first. Glyph overrides were lost when a designer swapped the icon through the instance-swap property, which made Primary buttons show black icons on black. Alpha masks broke on swap too.
  - Variable modes cascade from the slot frame, so they survive swaps.
- **Sizing:** min/max widths come from 320–430px phones and 1280px desktops. Examples: Button S 64–240, M 88–400, L 112–480; fields 200–560; toasts 280–480; dialogs 280–480. Control heights are locked.
- **Hit areas:** controls whose visible shape is under 44px carry an invisible 44px `hit-area` (72 variants).
- **Clipping:** clip content is off everywhere except the phone frames on the Screens page.
- **Pages** are grouped by atomic level: Atoms (Icons, Atoms), Molecules (by category), Organisms, Templates. Every component entry says what it is, when to use it and when not to.
- An audit script checks the rules (hardcoded colours, unstyled text, generic layer names, frames without auto layout, prop naming, hit areas). On 2026-11-02 the only failures were the missing hit areas, and the script added them.
