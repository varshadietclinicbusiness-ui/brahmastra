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
  { name: "aasmani", meaning: "aasmani — sky blue, the bright interactive blue", hue: 242, chroma: 0.18, lift: 0 },
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
  { name: "kajal", meaning: "kohl — the ink neutral, a cool slate", hue: 250, chroma: 0.045 },
  { name: "mitti", meaning: "clay — the warm paper neutral", hue: 78, chroma: 0.03 },
];

// Lightness and chroma curves follow the workshop colour system (Newton School
// sample DS): pale, airy tints, chroma peaking at 600, then a steep drop into
// deep shades. Measured in OKLCH from its ramps, then averaged across hues.
// We add a 950 step for dark-mode canvases.
export const L_CHROMATIC = [0.975, 0.94, 0.895, 0.83, 0.765, 0.69, 0.585, 0.51, 0.4, 0.32, 0.25];
export const C_CURVE = [0.08, 0.19, 0.3, 0.52, 0.72, 0.92, 1, 0.83, 0.63, 0.52, 0.4];
export const LIFT_WEIGHT = [0, 0.2, 0.4, 0.7, 0.9, 1, 1, 0.8, 0.5, 0.3, 0.1];
// Neutrals are a cool slate: chroma peaks mid-ramp (600) so greys read blue-grey,
// and fades at both ends so canvases stay clean.
export const L_NEUTRAL = [0.98, 0.95, 0.915, 0.87, 0.805, 0.72, 0.555, 0.46, 0.33, 0.25, 0.185];
export const C_NEUTRAL = [0.07, 0.13, 0.22, 0.31, 0.49, 0.69, 1, 0.89, 0.58, 0.38, 0.3];
