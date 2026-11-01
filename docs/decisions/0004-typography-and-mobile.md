# 0004 · Typography and mobile-first sizing

- **Date:** 2026-11-01
- **Status:** Accepted. The font choice and the 17-style scale were replaced by [0005](0005-two-typefaces.md); the mobile sizing rules below still apply.

## Decision

**Host Grotesk** for Latin text, and the **Anek** family (Ek Type, Mumbai) behind it in the font stack. The browser picks up Devanagari, Tamil, Bangla, Telugu, Kannada, Malayalam, Gujarati, Gurmukhi and Odia glyph by glyph — no per-language setup.

**Indic line heights.** Indic scripts stack vowel signs above and below the line, and Latin line heights clip them. Under `:lang(hi)`, `:lang(ta)` and the other Indic language tags, every text style gets a taller line height and no negative letter-spacing.

**Mobile-first sizes.**

- Medium controls are **44px** tall, the comfortable minimum touch target. Every hit area is at least 44px, even when the control looks smaller.
- `body-md` is 16px. Inputs never go below it, because iOS zooms the page on focus under 16px.
- Font sizes are authored in px (to match Figma) and shipped as rem (to respect the reader's font-size setting).
- Motion includes a dedicated `easing.sheet` curve for bottom sheets and drawers.

## Consequences

- 17 text styles: display ×3, heading ×5, body ×3, label ×3, caption, overline, code.
- The 44px rule comes from the practice file's component architecture checklist ("touch target optimisation"); here it is a token instead of a reminder.
