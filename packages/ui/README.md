# @brahmastra/ui

The [`@brahmastra/headless`](../headless) components with Brahmāstra's look switched on. The components are identical, and the look is one stylesheet built only from [`@brahmastra/tokens`](../tokens).

```bash
pnpm add @brahmastra/ui react react-dom
```

```tsx
import "@brahmastra/ui/brahmastra.css"; // tokens + type + components, in one file
import { Button } from "@brahmastra/ui";
```

Already load the tokens yourself? Import `@brahmastra/ui/styles.css` for just the components.

## Rules the stylesheet follows

- **Tokens only.** No hex codes, no raw pixel sizes for colour, radius, spacing, shadow or motion. Change a token and every component follows.
- **Light and dark.** Set `data-astra-mode="dark"` on any element, or let the OS decide.
- **Focus is a 2px stroke on the element itself.** It only shows for keyboard users.
- **44px hit areas everywhere,** even on 20px checkboxes and small buttons.
- **Inputs are 16px or larger,** so iOS never zooms the page.
- **Motion uses the preset tokens** (`--astra-transition-press`, `-enter`, `-sheet`…) and drops to almost nothing under Reduce Motion.
- **Cascade layers.** Everything lives in `@layer astra.base, astra.components`, so your own unlayered CSS always wins without `!important`.
