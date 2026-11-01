/**
 * Semantic text styles. Mobile-first sizes; each style references primitives
 * and ships as CSS variables plus an `.astra-text-<style>` class.
 */

type Family = "sans" | "display" | "mono";
type LineHeight = "tight" | "snug" | "normal" | "relaxed";
type Weight = "regular" | "medium" | "semibold" | "bold" | "extrabold";
type Tracking = "tighter" | "tight" | "normal" | "wide";

export interface TextStyle {
  family: Family;
  size: number;
  lineHeight: LineHeight;
  weight: Weight;
  tracking: Tracking;
  description: string;
}

export const TEXT_STYLES: Record<string, TextStyle> = {
  "display-xl": { family: "display", size: 64, lineHeight: "tight", weight: "extrabold", tracking: "tighter", description: "Hero moments. One per screen, at most." },
  "display-lg": { family: "display", size: 48, lineHeight: "tight", weight: "extrabold", tracking: "tighter", description: "Landing headlines." },
  "display-md": { family: "display", size: 40, lineHeight: "tight", weight: "bold", tracking: "tighter", description: "Section openers on marketing pages." },
  "heading-xl": { family: "sans", size: 32, lineHeight: "snug", weight: "bold", tracking: "tight", description: "Page title on desktop." },
  "heading-lg": { family: "sans", size: 28, lineHeight: "snug", weight: "bold", tracking: "tight", description: "Page title on mobile." },
  "heading-md": { family: "sans", size: 24, lineHeight: "snug", weight: "semibold", tracking: "tight", description: "Section title." },
  "heading-sm": { family: "sans", size: 20, lineHeight: "snug", weight: "semibold", tracking: "tight", description: "Card and sheet titles." },
  "heading-xs": { family: "sans", size: 18, lineHeight: "snug", weight: "semibold", tracking: "normal", description: "Group labels, list headers." },
  "body-lg": { family: "sans", size: 18, lineHeight: "relaxed", weight: "regular", tracking: "normal", description: "Long-form reading." },
  "body-md": { family: "sans", size: 16, lineHeight: "normal", weight: "regular", tracking: "normal", description: "Default body text. Never smaller in inputs — iOS zooms below 16px." },
  "body-sm": { family: "sans", size: 14, lineHeight: "normal", weight: "regular", tracking: "normal", description: "Secondary text, dense lists." },
  "label-lg": { family: "sans", size: 16, lineHeight: "snug", weight: "medium", tracking: "normal", description: "Large buttons, tab bar labels on tablets." },
  "label-md": { family: "sans", size: 14, lineHeight: "snug", weight: "medium", tracking: "normal", description: "Buttons, form labels, tabs." },
  "label-sm": { family: "sans", size: 12, lineHeight: "snug", weight: "medium", tracking: "normal", description: "Badges, chips, bottom-nav labels." },
  caption: { family: "sans", size: 12, lineHeight: "normal", weight: "regular", tracking: "normal", description: "Helper text, timestamps." },
  overline: { family: "sans", size: 12, lineHeight: "snug", weight: "semibold", tracking: "wide", description: "Eyebrow labels. Use with uppercase." },
  code: { family: "mono", size: 14, lineHeight: "normal", weight: "regular", tracking: "normal", description: "Inline and block code." },
};

export function textTokens() {
  const text: Record<string, unknown> = {};
  for (const [name, s] of Object.entries(TEXT_STYLES)) {
    text[name] = {
      $description: s.description,
      family: { $type: "fontFamily", $value: `{font.family.${s.family}}` },
      size: { $type: "dimension", $value: `{font.size.${s.size}}` },
      "line-height": { $type: "number", $value: `{font.line-height.${s.lineHeight}}` },
      weight: { $type: "fontWeight", $value: `{font.weight.${s.weight}}` },
      tracking: { $type: "dimension", $value: `{font.tracking.${s.tracking}}` },
    };
  }
  return { text };
}
