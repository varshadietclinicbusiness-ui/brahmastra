# @brahmastra/tokens

The design tokens behind Brahmāstra, written in the W3C DTCG format and built into every format a product needs.

## Use

```css
@import "@brahmastra/tokens/css";        /* all variables, both themes, light + dark */
@import "@brahmastra/tokens/css/typography.css"; /* .astra-text-* classes */
```

```html
<html data-astra-theme="painted" data-astra-mode="dark">
```

- `data-astra-theme`: `neutral` (default) or `painted`.
- `data-astra-mode`: `light` or `dark`. Leave it out to follow the OS.

### Tailwind v4

```css
@import "tailwindcss";
@import "@brahmastra/tokens/css";
@import "@brahmastra/tokens/tailwind";
```

This gives utilities such as `bg-canvas`, `text-fg-muted`, `border-border`, `bg-accent`, `text-on-solid`, `rounded-control`, `shadow-raised`, `font-sans`, `text-body-md` and `ease-sheet`.

### JavaScript

```ts
import { vars } from "@brahmastra/tokens";
vars.color.bg.canvas; // "var(--astra-color-bg-canvas)"
```

## Structure

```
src/tokens/
  primitives/   color (generated), dimension, typography, effects
  semantic/     text styles (generated)
  themes/       neutral|painted × light|dark (generated)
scripts/
  definitions/  palette.ts, themes.ts, text.ts — edit these
  generate.ts   definitions → DTCG JSON
  build.ts      DTCG JSON → dist/
  check-contrast.ts  WCAG 2.2 AA across every theme × mode
```

## Scripts

- `pnpm build` regenerates the sources and builds `dist/`.
- `pnpm test` runs the contrast check, which fails on any pairing below AA.
