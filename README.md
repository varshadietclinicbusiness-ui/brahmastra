# Brahmāstra

**The truly headless design system for taste.**
Behaviour and accessibility, solved. The look is yours.

> Code is cheap now. Taste isn't.

Brahmāstra is an open-source design system for designers who code. It separates what every product needs — keyboard support, screen-reader semantics, focus management, touch-sized targets, motion that respects reduced-motion — from what makes a product *yours*: the look. Use the headless layer and bring your own styles, or import one stylesheet and get Brahmāstra’s look in light and dark.

Made in India, by [Mayur Choudhary](https://mayurchoudhary.in) ([@ux_by_mayur](https://x.com/ux_by_mayur)). Free forever, MIT licensed.

## What makes it different

- **Truly headless.** Behaviour and accessibility ship separately from styles. Styles are CSS variables, with zero runtime cost.
- **Mobile-first, properly.** 44px touch targets as a token, bottom sheets and bottom navigation as first-class components, a sheet motion curve, and no 16px-input zoom traps.
- **Accessibility you can check.** Every colour pairing in every theme is tested against WCAG 2.2 AA in CI.
- **Indic-first.** Noto Sans across English and nine Indian scripts, with per-script line heights and a mobile/desktop type scale. `<html lang="ta">` is all it takes. Indian formats (₹, lakh/crore, +91, OTP) are coming as components.
- **Figma ↔ code parity.** The same tokens, the same names and the same modes in both.

## Status

🚧 Early build. Done so far:

- [x] Token system — `@brahmastra/tokens`
- [x] Headless components — `@brahmastra/headless` (58 component exports on React Aria, 30 tests incl. an axe scan)
- [x] Themed components — `@brahmastra/ui` (one token-only stylesheet, light + dark)
- [x] Playground — `apps/playground`
- [ ] Docs site

## Packages

| Package | What |
| --- | --- |
| [`@brahmastra/tokens`](packages/tokens) | DTCG tokens → CSS variables, Tailwind v4 theme, typed JS, Figma variables |
| [`@brahmastra/headless`](packages/headless) | Accessible React components with no styles, plus Indian formats (₹, +91, lakh/crore) |
| [`@brahmastra/ui`](packages/ui) | The same components with Brahmāstra's look: one CSS file built only from tokens |

## Develop

```bash
corepack pnpm install
corepack pnpm build
corepack pnpm test
corepack pnpm --filter @brahmastra/playground dev   # http://localhost:5174
```

Every significant decision is recorded in [`docs/decisions`](docs/decisions).
