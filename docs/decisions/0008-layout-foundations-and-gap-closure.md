# 0008 · Layout foundations, safe areas, and closing the gaps

- **Date:** 2026-11-02
- **Status:** Accepted

## Context

Mayur compared Brahmāstra with the workshop sample design system and found it incomplete. That file has things we didn't:
- breakpoint grid styles, and a Space/Size page with Spacer components
- Corner and Effects pages (7 shadows plus blurs), and Utilities (annotations, notes, file cover)
- a Guides page
- components we lacked: Date/Time picker, File upload, Button group, Input group, Page header, Side sheet, a full Table, Checkbox/Radio groups

We also had no safe-area handling, even though we call ourselves mobile-first.

## Decision

**Foundations**, each on its own page: Colour, Typography, Layout & grids, Spacing & sizing, Radius, Elevation, Motion.

- **Breakpoints:**

  | Name | Width | Columns | Gutter | Margin |
  |---|---|---|---|---|
  | Compact | 0–599 | 4 | 16 | 16 |
  | Medium | 600–1023 | 8 | 16 | 24 |
  | Expanded | 1024–1439 | 12 | 24 | 32 (1200 max) |
  | Large | 1440+ | 12 | 24 | centred 1280 container |

  1024 matches the typography Desktop switch. These replace the old sm/md/lg/xl tokens (640/768/1024/1280), which weren't used by anything yet. The same numbers ship as 4 Figma grid styles and as `breakpoint.*`, `grid.*` and `container.*` tokens (plus `container.reading` 680px).
- **Safe areas:**
  - Components: Status bar (iOS 54pt with Dynamic Island, Android 32dp), Home indicator (34pt), Android navigation (gesture 24dp, 3-button 48dp), Safe area spacers, and Device frames (iPhone 16 393×852, iPhone SE 375×667, Android 412×915).
  - Code: `safe-area.css` maps `env(safe-area-inset-*)`. The `size.safe-area.*` tokens are design-time only.
- **Elevation:** soft xs–xl (with dark versions), hard sm/md/lg for Painted, and blur sm/md/lg (8/16/32px). Documented with the z-index stack.
- **Motion:** the existing duration and easing tokens, now with drawn curves, interaction patterns and Reduce Motion rules.
- **Spacing:** 28 Spacer components for redlines, bound to space variables.

**Components added:**

| Level | Components |
|---|---|
| Molecules | Date picker (single/range, weeks from Sunday), Time picker (slots/field), File upload + File item, Input group (₹ / @okaxis add-ons), Checkbox group, Radio group, Button group (horizontal/stacked) |
| Organisms | Page header, Side sheet, Table (toolbar + header + rows + pagination) |

**Process:**
- Utilities: Annotation (Note/Spec/Accessibility/Question), Status tag (Ready/Beta/In progress/Deprecated), Note, File cover.
- Guides: start here, using it well, developers, contributing, governance and versions, handoff checklist.

## Consequences

- The library is now 76 components (443 variants) plus 1,964 icons, against the workshop file's roughly 25 component pages.
- Tailwind v4 users get literal `--breakpoint-*` values (media queries can't read CSS variables).
