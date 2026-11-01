# 0002 · Token architecture: DTCG source, three tiers, one build

- **Date:** 2026-11-01
- **Status:** Accepted

## Context

Tokenisation and modes were the hardest parts of the Figma practice file that came before this system. Values drifted between frames, and light/dark lived in duplicated styles. Brahmāstra needs **one source of truth** that feeds code and Figma alike.

## Decision

**Format.** Tokens are written in the W3C Design Tokens (DTCG) format — `$value`, `$type`, `{references}` — and built with Style Dictionary 5. Colours stay hex strings (with the OKLCH recipe kept in `$extensions`) because that is what every tool reads today.

**Three tiers.**

| Tier | Example | Who uses it |
| --- | --- | --- |
| Primitive | `color.rani.600`, `space.16`, `radius.8` | Themes only. Never product code. |
| Semantic | `color.bg.canvas`, `color.danger.solid`, `radius.control` | Components and product code. |
| Text styles | `text.body-md.size` … | Typography classes. |

**Themes × modes.** A theme is a *mapping* from semantic names to primitives, never a new colour. Each theme × mode is one file (`themes/painted-dark.json`). In CSS they become attribute-scoped blocks:

```html
<html data-astra-theme="painted" data-astra-mode="dark">
```

No `data-astra-mode` means "follow the operating system".

**Generated where generation is clearer.** The colour ramps, the theme mappings and the text styles are generated from small TypeScript definitions (`scripts/definitions/`). The output JSON is committed, so the DTCG files stay readable and diffable.

**Outputs.** One build writes CSS variables, typography classes, a Tailwind v4 `@theme`, a typed JS `vars` object and a Figma variables file, so every surface agrees.

## Consequences

- Changing a theme is a one-line mapping change, checked automatically.
- Figma gets variables with modes (Neutral/Painted × Light/Dark) that alias primitives — the same structure as code. Each variable carries its CSS name as Dev Mode code syntax.
- Shadows can't be Figma variables; they become effect styles.
