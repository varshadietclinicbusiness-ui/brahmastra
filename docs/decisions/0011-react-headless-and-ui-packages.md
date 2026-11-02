# 0011 · The React packages: headless behaviour, one stylesheet for the look

- **Date:** 2026-11-02
- **Status:** Accepted

## Context

Only the token package existed in code, so nobody could actually use Brahmāstra yet. Mayur asked for the React package to be "so freaking good and accurate", and for the most value-driven design system there is. The promise in the README is "truly headless": behaviour and accessibility apart from looks.

## Decision

**Two packages, one set of components**

- **`@brahmastra/headless`** is React components on React Aria Components 1.22. It has no CSS. Each element carries:
  - a stable class (`astra-<component>`)
  - `data-slot` parts named the same as the Figma layers
  - `data-variant` / `data-size` / `data-tone`
  - React Aria's state attributes (`data-pressed`, `data-focus-visible`, …)
- **`@brahmastra/ui`** re-exports the same components and adds one stylesheet, built from `src/css/*.css`, using only `--astra-*` tokens.
  - It ships `styles.css` (components only) and `brahmastra.css` (tokens, type, safe areas and components in one file).
  - Styles sit in `@layer astra.base, astra.components`, so app CSS wins without `!important`.
- Class names were chosen over styling `[data-slot]` alone, because other libraries (shadcn/ui) also use `data-slot`. Class hooks don't clash.

**Built on React Aria, not reinvented**

- Buttons, fields, selection, tabs, menus, dialogs and tooltips wrap React Aria for keyboard, touch, screen-reader and i18n behaviour.
- **BottomSheet** uses React Aria's new `Sheet`.
  - It moves with native scrolling, so swipe-to-dismiss follows the finger exactly.
  - We only style the surface and pass a `swipeAnimation` keyframe for the backdrop. Our own slide animations would fight the gesture.
- **Toasts** use React Aria's `UNSTABLE_Toast*` APIs behind our own `createToastQueue` / `ToastRegion`, so the unstable surface is hidden from users and can change underneath.
- Segmented controls and tabs use `SelectionIndicator`, so the indicator slides between options.

**Value for Indian products, built in**

- `format.ts`: ₹ in lakh/crore grouping, K/L/Cr short counts, and +91 mobile normalising, formatting and validation.
- **PhoneField:** "+91" prefix, formats as "98765 43210", accepts pasted numbers in any format, validates 6–9 starts.
- **OTPInput:** one real input under the cells, so iOS/Android SMS autofill and paste work.
- **Commerce components:**
  - VegMark (FSSAI) and Price (spoken as "₹280, was ₹350")
  - QuantityStepper (ADD → − n +, moves focus sensibly, announces the count)
  - CartBar with a free-delivery nudge, BillSummary, OfferTag

**Quality gates**

- Vitest + Testing Library + axe-core: 30 tests, covering formats, keyboard and screen-reader behaviour, and an axe scan over the kit.
  - The suite caught a real bug on its first run: `maxLength` on the OTP input cut "123-456" before the dash could be removed.
- A Vite playground (`apps/playground`) shows a real ordering screen in a phone frame plus every component, in light and dark. It was checked in a browser at desktop width and at 375px.
  - That check caught a phone overflow (grid items with `min-width: auto`). It also caught a white thumb on a near-white "on" switch track in dark mode. Both are fixed.

## Not done yet

- **Squircle corners:** CSS `corner-shape` is not used yet. Browser support and its curve don't match Figma's 100% iOS smoothing closely enough.
- **Not built yet:** Date picker, File upload, Table, Side sheet, and the newer organisms (order tracker, coupon card, payment methods…).
- **Unchecked:** no visual regression tests yet, and the components haven't been checked on real iOS and Android devices.
