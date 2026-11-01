# 0001 · Stack: a pnpm + Turborepo monorepo, TypeScript, zero-runtime CSS

- **Date:** 2026-11-01
- **Status:** Accepted

## Context

Brahmāstra ships several things that version together — tokens, a headless behaviour layer, a styled layer, a CLI, and a docs site. Designers who code will install one piece or all of them. The system has to stay fast to build and simple to contribute to.

## Decision

- **Monorepo** with pnpm workspaces and Turborepo. Packages live in `packages/*` (`@brahmastra/tokens`, later `headless`, `ui`, `cli`); the docs site lives in `apps/docs`.
- **TypeScript everywhere.** Type definitions are part of the API.
- **Zero-runtime styling.** Components are styled with CSS custom properties and `data-*` state attributes, never CSS-in-JS. Styles cost nothing at runtime and work in any framework that renders HTML.
- **pnpm via Corepack** (`corepack pnpm …`), pinned in `packageManager`, so contributors get the same version without a global install.

## Consequences

- One `pnpm build` builds everything in dependency order, cached.
- Packages publish independently under the `@brahmastra` npm scope. The unscoped name `brahmastra` is taken.
