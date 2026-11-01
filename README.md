# Brahmāstra

**The truly headless design system for taste.**
Behaviour and accessibility, solved. The look is yours.

> Code is cheap now. Taste isn't.

Brahmāstra is an open-source design system for designers who code. It separates what every product needs — keyboard support, screen-reader semantics, focus management, touch-sized targets, motion that respects reduced-motion — from what makes a product *yours*: the look. Use the headless layer and bring your own styles, or start from one of the two themes and bend them.

Made in India, by [Mayur Choudhary](https://mayurchoudhary.in) ([@ux_by_mayur](https://x.com/ux_by_mayur)). Free forever, MIT licensed.

## What makes it different

- **Truly headless.** Behaviour and accessibility ship separately from styles. Styles are CSS variables, with zero runtime cost.
- **Mobile-first, properly.** 44px touch targets as a token, bottom sheets and bottom navigation as first-class components, a sheet motion curve, and no 16px-input zoom traps.
- **Accessibility you can check.** Every colour pairing in every theme is tested against WCAG 2.2 AA in CI.
- **Indic-first.** Host Grotesk with the Anek family for nine Indian scripts, plus Indic-aware line heights. Indian formats (₹, lakh/crore, +91, OTP) are coming as components.
- **Figma ↔ code parity.** The same tokens, the same names and the same modes in both.

## Status

🚧 Early build. Done so far:

- [x] Token system — `@brahmastra/tokens`
- [ ] Headless components — `@brahmastra/headless`
- [ ] Themed components — `@brahmastra/ui`
- [ ] Docs site

## Packages

| Package | What |
| --- | --- |
| [`@brahmastra/tokens`](packages/tokens) | DTCG tokens → CSS variables, Tailwind v4 theme, typed JS, Figma variables |

## Develop

```bash
corepack pnpm install
corepack pnpm build
corepack pnpm test
```

Every significant decision is recorded in [`docs/decisions`](docs/decisions).
