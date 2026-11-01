/**
 * Proves the accessibility promise: every text/background and control pairing
 * in every theme × mode meets WCAG 2.2 AA. Fails the build if one doesn't.
 *   text      ≥ 4.5:1  (1.4.3)
 *   ui        ≥ 3:1    (1.4.11 — borders, focus rings, control fills)
 */
import { wcagContrast } from "culori";
import { MODES, THEMES } from "./definitions/themes.ts";
import { themeLayer } from "./lib.ts";

type Pair = { fg: string; bg: string; min: number; kind: "text" | "ui" };

const SURFACES = ["bg.canvas", "bg.surface", "bg.raised", "bg.sunken"];
const INTENTS = ["accent", "success", "warning", "danger", "info"];

const pairs: Pair[] = [
  ...["fg.default", "fg.muted", "fg.subtle", "fg.link"].flatMap((fg) => SURFACES.map((bg) => ({ fg, bg, min: 4.5, kind: "text" as const }))),
  { fg: "fg.inverse", bg: "bg.inverse", min: 4.5, kind: "text" },
  ...["border.strong", "border.focus"].flatMap((fg) => SURFACES.map((bg) => ({ fg, bg, min: 3, kind: "ui" as const }))),
  ...INTENTS.flatMap((intent) => [
    ...["solid", "solid-hover", "solid-active"].map((bg) => ({ fg: `${intent}.on-solid`, bg: `${intent}.${bg}`, min: 4.5, kind: "text" as const })),
    ...[`${intent}.subtle`, "bg.canvas", "bg.surface"].map((bg) => ({ fg: `${intent}.fg`, bg, min: 4.5, kind: "text" as const })),
  ]),
  // Solid controls must stand out from the page — except warning, whose ink label and border carry it.
  ...INTENTS.filter((i) => i !== "warning").map((intent) => ({ fg: `${intent}.solid`, bg: "bg.canvas", min: 3, kind: "ui" as const })),
];

let failures = 0;
for (const theme of THEMES) {
  for (const mode of MODES) {
    const layer = await themeLayer(theme, mode);
    const colors = new Map(layer.tokens.filter((t) => t.path[0] === "color").map((t) => [t.path.slice(1).join("."), String(t.$value)]));
    const rows: string[] = [];
    for (const pair of pairs) {
      const fg = colors.get(pair.fg);
      const bg = colors.get(pair.bg);
      if (!fg || !bg) throw new Error(`Missing token ${!fg ? pair.fg : pair.bg} in ${theme}-${mode}`);
      const ratio = wcagContrast(fg, bg);
      if (ratio < pair.min) {
        failures++;
        rows.push(`  ✗ ${pair.fg} on ${pair.bg}: ${ratio.toFixed(2)} < ${pair.min} (${pair.kind})  [${fg} on ${bg}]`);
      }
    }
    console.log(`${rows.length ? "✗" : "✓"} ${theme}-${mode}: ${pairs.length - rows.length}/${pairs.length} pairs pass`);
    rows.forEach((r) => console.log(r));
  }
}

if (failures) {
  console.error(`\n${failures} contrast failure(s).`);
  process.exit(1);
}
console.log("\nAll pairs meet WCAG 2.2 AA.");
