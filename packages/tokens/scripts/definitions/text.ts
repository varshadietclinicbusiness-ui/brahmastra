/**
 * Semantic text styles, mirrored 1:1 from Figma (Type scale × Script collections).
 * Noto Sans for every script, so English and Indian languages share weights and rhythm.
 * Sizes are px (shipped as rem). Line-heights are px on a 4px grid, shipped as unitless
 * ratios. Desktop only enlarges display and heading styles.
 */

type Family = "heading" | "body" | "mono";
type Kind = "head" | "body" | "code";
type Weight = "regular" | "medium" | "semibold" | "bold" | "extrabold";

export interface TextStyle {
  family: Family;
  kind: Kind;
  /** [size, line-height] in px on phones (the default). */
  mobile: [number, number];
  /** [size, line-height] in px from the desktop breakpoint up. */
  desktop: [number, number];
  weight: Weight;
  /** Letter-spacing in percent of the font size (Latin only; Indian scripts are never tracked). */
  tracking: number;
  description: string;
}

export const TEXT_STYLES: Record<string, TextStyle> = {
  "display-xl": { family: "heading", kind: "head", mobile: [40, 48], desktop: [72, 80], weight: "bold", tracking: -2, description: "Marketing hero, one per page." },
  "display-lg": { family: "heading", kind: "head", mobile: [34, 40], desktop: [56, 64], weight: "bold", tracking: -1.5, description: "Landing headlines." },
  "display-md": { family: "heading", kind: "head", mobile: [30, 36], desktop: [44, 52], weight: "bold", tracking: -1, description: "Section openers, docs titles." },
  "heading-xl": { family: "heading", kind: "head", mobile: [26, 32], desktop: [36, 44], weight: "semibold", tracking: -0.5, description: "Page title on desktop, onboarding title." },
  "heading-lg": { family: "heading", kind: "head", mobile: [22, 28], desktop: [28, 36], weight: "semibold", tracking: -0.5, description: "Screen title on phones." },
  "heading-md": { family: "heading", kind: "head", mobile: [20, 28], desktop: [24, 32], weight: "semibold", tracking: 0, description: "Section title." },
  "heading-sm": { family: "heading", kind: "head", mobile: [18, 24], desktop: [20, 28], weight: "semibold", tracking: 0, description: "Card, sheet and dialog titles." },
  "heading-xs": { family: "heading", kind: "head", mobile: [16, 24], desktop: [16, 24], weight: "semibold", tracking: 0, description: "List group headers." },
  "body-lg": { family: "body", kind: "body", mobile: [18, 28], desktop: [18, 28], weight: "regular", tracking: 0, description: "Intros, long reading." },
  "body-md": { family: "body", kind: "body", mobile: [16, 24], desktop: [16, 24], weight: "regular", tracking: 0, description: "Default text and inputs. Never smaller in inputs: iOS zooms below 16px." },
  "body-sm": { family: "body", kind: "body", mobile: [14, 20], desktop: [14, 20], weight: "regular", tracking: 0, description: "Secondary text, dense lists. Smallest size for Indian scripts." },
  "body-xs": { family: "body", kind: "body", mobile: [12, 16], desktop: [12, 16], weight: "regular", tracking: 0, description: "Captions and timestamps, Latin only." },
  "label-xl": { family: "body", kind: "body", mobile: [20, 28], desktop: [22, 28], weight: "semibold", tracking: 0, description: "Prices, OTP digits, stats." },
  "label-lg": { family: "body", kind: "body", mobile: [16, 20], desktop: [16, 20], weight: "semibold", tracking: 0, description: "M and L buttons." },
  "label-md": { family: "body", kind: "body", mobile: [14, 20], desktop: [14, 20], weight: "semibold", tracking: 0, description: "S buttons, tabs, field labels." },
  "label-sm": { family: "body", kind: "body", mobile: [12, 16], desktop: [12, 16], weight: "semibold", tracking: 0, description: "Badges, tab-bar labels." },
  overline: { family: "body", kind: "body", mobile: [11, 16], desktop: [12, 16], weight: "semibold", tracking: 8, description: "Eyebrow labels, uppercase, Latin only." },
  "code-md": { family: "mono", kind: "code", mobile: [14, 20], desktop: [14, 20], weight: "regular", tracking: 0, description: "Code and tokens." },
  "code-sm": { family: "mono", kind: "code", mobile: [12, 16], desktop: [12, 16], weight: "regular", tracking: 0, description: "Inline code in docs." },
};

/** BCP 47 language tags per line-height class. Tall scripts stack conjuncts above and below the line. */
export const SCRIPT_CLASSES = {
  indic: ["hi", "mr", "ne", "sa", "bn", "as", "ta", "gu", "pa", "or"],
  tall: ["te", "kn", "ml"],
} as const;
export type ScriptClass = keyof typeof SCRIPT_CLASSES;

export const DESKTOP_MIN_WIDTH = 1024;

const ceil4 = (x: number) => Math.ceil(x / 4) * 4;
const ratio = (lh: number, size: number) => Math.round((lh / size) * 1000) / 1000;

/** Line-height in px for a script class — the same formula the Figma Script modes use. */
export function lineHeightPx(s: TextStyle, cls: ScriptClass | "latin", bp: "mobile" | "desktop"): number {
  const [size, latin] = s[bp];
  if (cls === "latin" || s.kind === "code") return latin;
  const k = s.kind === "head" ? (cls === "tall" ? 1.6 : 1.5) : cls === "tall" ? 1.875 : 1.75;
  return Math.max(latin + 4, ceil4(size * k));
}

export const lineHeightRatio = (s: TextStyle, cls: ScriptClass | "latin", bp: "mobile" | "desktop") => ratio(lineHeightPx(s, cls, bp), s[bp][0]);

export const FONT_SIZES = [...new Set(Object.values(TEXT_STYLES).flatMap((s) => [s.mobile[0], s.desktop[0]]))].sort((a, b) => a - b);

export function textTokens() {
  const text: Record<string, unknown> = {};
  for (const [name, s] of Object.entries(TEXT_STYLES)) {
    text[name] = {
      $description: s.description,
      family: { $type: "fontFamily", $value: `{font.family.${s.family}}` },
      size: { $type: "dimension", $value: `{font.size.${s.mobile[0]}}` },
      "size-desktop": { $type: "dimension", $value: `{font.size.${s.desktop[0]}}` },
      "line-height": { $type: "number", $value: lineHeightRatio(s, "latin", "mobile") },
      "line-height-desktop": { $type: "number", $value: lineHeightRatio(s, "latin", "desktop") },
      weight: { $type: "fontWeight", $value: `{font.weight.${s.weight}}` },
      tracking: { $type: "dimension", $value: { value: s.tracking / 100, unit: "em" } },
    };
  }
  return { text };
}
