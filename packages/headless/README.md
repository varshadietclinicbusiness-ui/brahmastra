# @brahmastra/headless

Accessible React components with **no styles**. Built on [React Aria](https://react-spectrum.adobe.com/react-aria/), so keyboard, touch, screen readers, focus management and internationalisation are handled for you. You bring the look, or use [`@brahmastra/ui`](../ui) for Brahmāstra's.

```bash
pnpm add @brahmastra/headless react react-dom
```

```tsx
import { Button, PhoneField, QuantityStepper } from "@brahmastra/headless";

<PhoneField onChange={setDigits} />          // +91, "98765 43210", accepts pasted numbers
<QuantityStepper itemName="Filter coffee" value={n} onChange={setN} />
<Button isLoading loadingLabel="Placing order">Place order</Button>
```

## How to style it

Every element gives you three stable hooks, so any CSS (plain CSS, Tailwind, CSS Modules) can style it:

| Hook | Example | What it is |
| --- | --- | --- |
| Class | `.astra-button` | One per component. Your `className` is added to it, never replacing it. |
| Part | `[data-slot="label"]` | Each inner part, named the same as its Figma layer. |
| Look and state | `[data-variant="primary"]`, `[data-size="lg"]`, `[data-pressed]`, `[data-focus-visible]` | The visual props, plus React Aria's state attributes. |

```css
.astra-button[data-variant="primary"] { background: hotpink; }
.astra-button[data-pressed] { scale: 0.97; }
.astra-button [data-slot="label"] { font-weight: 600; }
```

`className` also accepts React Aria's render function: `className={({ isPressed }) => isPressed ? "down" : "up"}`.

## What's inside

| Group | Components |
| --- | --- |
| Actions | Button, IconButton, Link |
| Fields | TextField (incl. multiline), PhoneField, OTPInput, SearchField, Select + SelectItem |
| Selection | Checkbox, CheckboxGroup, Radio, RadioGroup, Switch, Chip, ChipGroup, SegmentedControl, Slider |
| Commerce, made for India | VegMark, Price, OfferTag, QuantityStepper, CartBar, BillSummary |
| Status | Badge, Counter, StatusDot, Spinner, ProgressBar, ProgressRing, Skeleton, LiveIndicator |
| People and media | Avatar, AvatarGroup, Thumbnail |
| Navigation | Tabs, TabList, Tab, TabPanel, TabBar, AppBar |
| Overlays | Dialog, BottomSheet, Menu + MenuItem, Tooltip (+ their triggers) |
| Feedback | Alert, createToastQueue + ToastRegion, Accordion + AccordionItem |
| Content | ListItem, Rating, Card, EmptyState |
| Structure | Divider, Kbd, VisuallyHidden |

## Indian formats

Pure functions, no React needed:

```ts
import { formatINR, formatCompactIndian, formatIndianMobile, isValidIndianMobile } from "@brahmastra/headless/format";

formatINR(124999);              // "₹1,24,999"
formatCompactIndian(150000);    // "1.5L"
formatIndianMobile("+91 9876543210"); // "98765 43210"
isValidIndianMobile("5876543210");    // false: must start with 6–9
```

## Promises we test

`pnpm test` runs 30 tests, including an automated accessibility scan with axe-core, and checks behaviour people rely on:

- A loading Button blocks presses and announces progress.
- PhoneField accepts "+91 98765-43210" and reports only the 10 digits.
- OTPInput is one real input, so SMS autofill and paste work.
- QuantityStepper moves focus sensibly as it changes shape.
- TabBar is a `<nav>` of links with `aria-current`, and badges are part of each tab's name.

Every component also ships with `"use client"`, so it works in React Server Component apps such as Next.js.
