/**
 * The Brahmāstra palette, defined in OKLCH so every hue steps through
 * lightness the same way. `generate.ts` turns these into DTCG hex tokens.
 *
 * Primitive names are Indian on purpose: they are memorable, they carry the
 * system's identity, and nobody types them in product code — semantic tokens
 * (`color.bg.canvas`, `color.danger.solid`) are what components use.
 */

export const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type Step = (typeof STEPS)[number];

export interface HueFamily {
  name: string;
  meaning: string;
  /** OKLCH hue angle in degrees. */
  hue: number;
  /** Peak chroma, reached at steps 500–600 before gamut mapping. */
  chroma: number;
  /** Extra lightness at the mid steps — yellows and greens need it to look vivid. */
  lift: number;
}

export const HUES: HueFamily[] = [
  { name: "sindoor", meaning: "vermilion — the red of danger and devotion", hue: 29, chroma: 0.22, lift: 0 },
  { name: "kesar", meaning: "saffron — warm orange", hue: 52, chroma: 0.19, lift: 0.04 },
  { name: "haldi", meaning: "turmeric — signal yellow", hue: 86, chroma: 0.18, lift: 0.12 },
  { name: "tota", meaning: "parrot — the green of go", hue: 148, chroma: 0.19, lift: 0.02 },
  { name: "mor", meaning: "peacock — deep teal", hue: 205, chroma: 0.13, lift: 0 },
  { name: "neel", meaning: "indigo — the dye India gave the world", hue: 268, chroma: 0.2, lift: -0.03 },
  { name: "jamun", meaning: "java plum — purple", hue: 305, chroma: 0.18, lift: 0 },
  { name: "rani", meaning: "rani pink — the loudest colour on a sign board", hue: 354, chroma: 0.22, lift: 0 },
];

export interface NeutralFamily {
  name: string;
  meaning: string;
  hue: number;
  chroma: number;
}

export const NEUTRALS: NeutralFamily[] = [
  { name: "kajal", meaning: "kohl — the ink neutral, faintly cool", hue: 265, chroma: 0.012 },
  { name: "mitti", meaning: "clay — the warm paper neutral", hue: 78, chroma: 0.022 },
];

// Lightness per step. Chromatic ramps stop at 0.27 because a darker colour
// stops reading as its hue; neutrals go deeper to make usable dark canvases.
export const L_CHROMATIC = [0.975, 0.945, 0.895, 0.83, 0.74, 0.655, 0.575, 0.495, 0.42, 0.35, 0.27];
export const C_CURVE = [0.12, 0.25, 0.45, 0.68, 0.88, 1, 1, 0.9, 0.75, 0.6, 0.45];
export const LIFT_WEIGHT = [0, 0.2, 0.4, 0.7, 0.9, 1, 1, 0.8, 0.5, 0.3, 0.1];
export const L_NEUTRAL = [0.985, 0.965, 0.925, 0.87, 0.72, 0.58, 0.48, 0.39, 0.3, 0.235, 0.18];
export const C_NEUTRAL = [0.4, 0.5, 0.6, 0.8, 1, 1, 1, 1, 1, 1, 1];
