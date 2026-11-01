/**
 * Semantic text styles, mirrored 1:1 from the Figma text styles.
 * Host Grotesk sets headings only; Mukta (Ek Type) carries body and UI text.
 * Line-height is authored in px like Figma and shipped as a unitless ratio;
 * tracking is in em (Figma's percent / 100).
 */

type Family = "heading" | "body" | "mono";
type Weight = "regular" | "medium" | "semibold" | "bold" | "extrabold";

export interface TextStyle {
  family: Family;
  size: number;
  /** Line-height in px, as set in Figma. */
  lineHeight: number;
  weight: Weight;
  /** Letter-spacing in em. */
  tracking: number;
  description: string;
}

export const TEXT_STYLES: Record<string, TextStyle> = {
  "display-xl": { family: "heading", size: 72, lineHeight: 76, weight: "bold", tracking: -0.035, description: "Hero moments. One per screen, at most." },
  "display-lg": { family: "heading", size: 56, lineHeight: 60, weight: "bold", tracking: -0.03, description: "Landing headlines." },
  "display-md": { family: "heading", size: 44, lineHeight: 48, weight: "bold", tracking: -0.025, description: "Section openers on marketing and docs pages." },
  "heading-xl": { family: "heading", size: 36, lineHeight: 42, weight: "semibold", tracking: -0.02, description: "Page title on desktop; hero title on mobile." },
  "heading-lg": { family: "heading", size: 28, lineHeight: 34, weight: "semibold", tracking: -0.015, description: "Page title on mobile (large app bar)." },
  "heading-md": { family: "heading", size: 22, lineHeight: 28, weight: "semibold", tracking: -0.01, description: "Section title." },
  "heading-sm": { family: "heading", size: 18, lineHeight: 24, weight: "semibold", tracking: -0.005, description: "Card, sheet and app-bar titles." },
  "heading-xs": { family: "heading", size: 16, lineHeight: 22, weight: "semibold", tracking: 0, description: "Group labels, list headers." },
  "body-lg": { family: "body", size: 18, lineHeight: 28, weight: "regular", tracking: 0, description: "Long-form reading, intros." },
  "body-md": { family: "body", size: 16, lineHeight: 24, weight: "regular", tracking: 0, description: "Default body text. Never smaller in inputs: iOS zooms below 16px." },
  "body-sm": { family: "body", size: 14, lineHeight: 20, weight: "regular", tracking: 0, description: "Secondary text, dense lists." },
  "body-xs": { family: "body", size: 12, lineHeight: 16, weight: "regular", tracking: 0.005, description: "Helper text, timestamps, captions." },
  "label-xl": { family: "body", size: 22, lineHeight: 28, weight: "semibold", tracking: 0, description: "OTP digits, prices, stat numbers." },
  "label-lg": { family: "body", size: 16, lineHeight: 20, weight: "semibold", tracking: 0, description: "M and L buttons, field values that act like labels." },
  "label-md": { family: "body", size: 14, lineHeight: 18, weight: "semibold", tracking: 0, description: "S buttons, form labels, tabs, chips." },
  "label-sm": { family: "body", size: 12, lineHeight: 16, weight: "semibold", tracking: 0.005, description: "Badges, counters, tab-bar labels." },
  overline: { family: "body", size: 11, lineHeight: 16, weight: "semibold", tracking: 0.08, description: "Eyebrow labels. Use with uppercase." },
  "code-md": { family: "mono", size: 14, lineHeight: 20, weight: "regular", tracking: 0, description: "Inline and block code." },
  "code-sm": { family: "mono", size: 12, lineHeight: 16, weight: "regular", tracking: 0, description: "Token names and data-slot names in docs." },
};

const round = (n: number) => Math.round(n * 1000) / 1000;

/** Unitless line-height, so it scales with the reader's font-size setting. */
export const lineHeightRatio = (s: TextStyle) => round(s.lineHeight / s.size);

export function textTokens() {
  const text: Record<string, unknown> = {};
  for (const [name, s] of Object.entries(TEXT_STYLES)) {
    text[name] = {
      $description: s.description,
      family: { $type: "fontFamily", $value: `{font.family.${s.family}}` },
      size: { $type: "dimension", $value: `{font.size.${s.size}}` },
      "line-height": { $type: "number", $value: lineHeightRatio(s) },
      weight: { $type: "fontWeight", $value: `{font.weight.${s.weight}}` },
      tracking: { $type: "dimension", $value: { value: s.tracking, unit: "em" } },
    };
  }
  return { text };
}
