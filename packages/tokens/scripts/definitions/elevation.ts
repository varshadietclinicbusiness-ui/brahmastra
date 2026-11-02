/**
 * Elevation: layered, tinted shadows (decision 0010).
 *
 * Every level stacks up to three layers so it reads like real light:
 *   ring     a 1px hairline that keeps the edge crisp on white (replaces a border)
 *   contact  a small, tight shadow right under the edge: "it touches the page"
 *   ambient  a large, soft, offset shadow: "it floats this high"
 * Offsets and blurs roughly double per level. Light mode tints every layer with
 * kajal-950 (the slate ink) instead of black, so shadows look like part of the palette.
 * Dark mode can't rely on shadows (dark on dark), so each level adds a light top edge
 * and a white hairline, and uses black at higher opacity.
 */

/** [x, y, blur, spread, alpha, inset?] — colour comes from the mode. */
type Layer = [number, number, number, number, number, boolean?];

export interface Level {
  description: string;
  light: Layer[];
  /** Layers on white-alpha are marked with a leading "w". */
  dark: (Layer | ["w", ...Layer])[];
}

export const INK = "#0e1319"; // kajal-950
export const BLACK = "#000000";

export const LEVELS: Record<string, Level> = {
  xs: {
    description: "Level 1 · barely lifted: secondary buttons, inputs on tinted backgrounds.",
    light: [[0, 0, 0, 1, 0.06], [0, 1, 2, 0, 0.06]],
    dark: [["w", 0, 0, 0, 1, 0.06], [0, 1, 2, 0, 0.4]],
  },
  sm: {
    description: "Level 2 · raised: cards and tiles that sit on the page.",
    light: [[0, 0, 0, 1, 0.06], [0, 1, 2, 0, 0.06], [0, 2, 6, -2, 0.08]],
    dark: [["w", 0, 0, 0, 1, 0.06], ["w", 0, 1, 0, 0, 0.04, true], [0, 1, 2, 0, 0.4], [0, 2, 6, -2, 0.4]],
  },
  md: {
    description: "Level 3 · floating: sticky bars, floating tab bars, FABs, chips on photos.",
    light: [[0, 0, 0, 1, 0.06], [0, 2, 4, -1, 0.06], [0, 6, 12, -3, 0.08], [0, 12, 24, -6, 0.1]],
    dark: [["w", 0, 0, 0, 1, 0.08], ["w", 0, 1, 0, 0, 0.06, true], [0, 4, 8, -2, 0.5], [0, 12, 24, -6, 0.5]],
  },
  lg: {
    description: "Level 4 · overlay: menus, popovers, tooltips, toasts.",
    light: [[0, 0, 0, 1, 0.06], [0, 2, 4, 0, 0.04], [0, 8, 16, -4, 0.08], [0, 24, 48, -12, 0.16]],
    dark: [["w", 0, 0, 0, 1, 0.08], ["w", 0, 1, 0, 0, 0.08, true], [0, 8, 16, -4, 0.5], [0, 24, 48, -12, 0.6]],
  },
  xl: {
    description: "Level 5 · modal: dialogs, side sheets, bottom sheets at full height.",
    light: [[0, 0, 0, 1, 0.06], [0, 4, 8, 0, 0.04], [0, 16, 32, -8, 0.1], [0, 40, 80, -20, 0.24]],
    dark: [["w", 0, 0, 0, 1, 0.1], ["w", 0, 1, 0, 0, 0.08, true], [0, 16, 32, -8, 0.6], [0, 40, 80, -20, 0.7]],
  },
  lift: {
    description: "Picked up: a card or row while it's being dragged. Higher than modal, with no ring.",
    light: [[0, 4, 8, -2, 0.08], [0, 16, 32, -8, 0.14], [0, 32, 64, -16, 0.2]],
    dark: [["w", 0, 1, 0, 0, 0.08, true], [0, 16, 32, -8, 0.6], [0, 32, 64, -16, 0.7]],
  },
  "cast-up": {
    description: "Casts upward: sticky bottom bars, cart bars and bottom sheets that sit at the screen's foot.",
    light: [[0, -1, 0, 0, 0.06], [0, -8, 24, -8, 0.1]],
    dark: [["w", 0, -1, 0, 0, 0.08], [0, -8, 24, -8, 0.5]],
  },
  well: {
    description: "Pressed in: wells, segmented-control tracks, sliders' empty track.",
    light: [[0, 1, 2, 0, 0.08, true], [0, 0, 0, 1, 0.06, true]],
    dark: [[0, 1, 2, 0, 0.5, true], ["w", 0, 0, 0, 1, 0.06, true]],
  },
};

/** Semantic roles → primitive level. Components use roles only. */
export const ROLES: Record<string, string> = {
  subtle: "xs",
  raised: "sm",
  floating: "md",
  overlay: "lg",
  modal: "xl",
  drag: "lift",
  up: "cast-up",
  inset: "well",
};

const hex8 = (hex: string, a: number) => hex + Math.round(a * 255).toString(16).padStart(2, "0");

function toDtcg(layers: Level["light"] | Level["dark"], base: string) {
  return layers.map((l) => {
    const white = l[0] === "w";
    const [x, y, blur, spread, alpha, inset] = (white ? l.slice(1) : l) as Layer;
    return {
      color: hex8(white ? "#ffffff" : base, alpha),
      offsetX: `${x}px`,
      offsetY: `${y}px`,
      blur: `${blur}px`,
      spread: `${spread}px`,
      ...(inset ? { inset: true } : {}),
    };
  });
}

export function shadowTokens() {
  const shadow: Record<string, unknown> = { $type: "shadow" };
  for (const [name, level] of Object.entries(LEVELS)) {
    shadow[name] = { $description: level.description, $value: toDtcg(level.light, INK) };
    shadow[`${name}-dark`] = { $description: `${level.description} Dark mode.`, $value: toDtcg(level.dark, BLACK) };
  }
  return { shadow };
}
