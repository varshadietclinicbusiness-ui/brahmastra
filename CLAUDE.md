# Brahmāstra — notes for agents

Open-source headless design system by Mayur Choudhary. Read `README.md` and `docs/decisions/` first.

## Conventions

- Run pnpm as `corepack pnpm …` (no global pnpm on this machine).
- CSS variables use the `--astra-` prefix; theme and mode attributes are `data-astra-theme` / `data-astra-mode`.
- Product code and components use **semantic** tokens only (`color.bg.canvas`, `color.danger.solid`). Primitives (`color.rani.600`) are for themes.
- Don't edit generated token JSON (`primitives/color.json`, `semantic/text.json`, `themes/*.json`). Edit `packages/tokens/scripts/definitions/*` and run the build.
- Any new theme mapping must pass `corepack pnpm --filter @brahmastra/tokens test` (WCAG 2.2 AA).
- Mobile is first-class: 44px minimum hit areas, inputs ≥16px text, bottom sheet / bottom nav patterns.
- Record significant decisions as a new numbered file in `docs/decisions/`. They feed the public "How it was built" and "Learnings" pages, so they must be true.
- Never invent case-study facts (users, metrics, testimonials, history).
