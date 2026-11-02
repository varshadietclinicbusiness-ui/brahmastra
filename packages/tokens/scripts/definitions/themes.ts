/**
 * Semantic tokens per theme × mode. Every value is a reference into the
 * primitive palette, so a theme is a *mapping*, never a new colour.
 *
 * One theme, `neutral`: calm, monochrome ink that lets a product's brand lead,
 * in light and dark. (A loud "painted" theme existed until 2026-11-02; see
 * decision 0009.) Products re-brand by remapping `accent` in their own theme.
 */

export type Mode = "light" | "dark";
export type ThemeName = "neutral";
import { ROLES } from "./elevation.ts";

export const THEMES: ThemeName[] = ["neutral"];
export const MODES: Mode[] = ["light", "dark"];

const c = (family: string, step: number | string) => `{color.${family}.${step}}`;
const WHITE = "{color.white}";
const INK = c("kajal", 950);

/** The 8 roles every intent (accent, success, warning, danger, info) exposes. */
export const INTENT_ROLES = [
  "solid",
  "solid-hover",
  "solid-active",
  "subtle",
  "subtle-hover",
  "fg",
  "border",
  "on-solid",
] as const;
type IntentRole = (typeof INTENT_ROLES)[number];
type Intent = Record<IntentRole, string>;

/** A chromatic intent: white text on a deep solid in light, ink text on a bright solid in dark. */
function chromatic(family: string, mode: Mode, overrides: Partial<Intent> = {}): Intent {
  const base: Intent =
    mode === "light"
      ? {
          solid: c(family, 600),
          "solid-hover": c(family, 700),
          "solid-active": c(family, 800),
          subtle: c(family, 50),
          "subtle-hover": c(family, 100),
          fg: c(family, 700),
          border: c(family, 300),
          "on-solid": WHITE,
        }
      : {
          solid: c(family, 400),
          "solid-hover": c(family, 300),
          "solid-active": c(family, 200),
          subtle: c(family, 950),
          "subtle-hover": c(family, 900),
          fg: c(family, 300),
          border: c(family, 700),
          "on-solid": INK,
        };
  return { ...base, ...overrides };
}

/** Haldi is too light for white text at any vivid step, so warning always uses ink on yellow. */
function warning(mode: Mode): Intent {
  return mode === "light"
    ? chromatic("haldi", mode, {
        solid: c("haldi", 400),
        "solid-hover": c("haldi", 500),
        "solid-active": c("haldi", 600),
        fg: c("haldi", 800),
        border: c("haldi", 400),
        "on-solid": INK,
      })
    : chromatic("haldi", mode);
}

function statuses(mode: Mode) {
  return {
    success: chromatic("tota", mode, mode === "light" ? { solid: c("tota", 700), "solid-hover": c("tota", 800), "solid-active": c("tota", 900), fg: c("tota", 800) } : {}),
    warning: warning(mode),
    danger: chromatic("sindoor", mode),
    info: chromatic("neel", mode),
  };
}

export type SemanticTree = Record<string, Record<string, unknown>>;

function neutral(mode: Mode): SemanticTree {
  const n = (step: number) => c("kajal", step);
  const light = mode === "light";
  return {
    color: {
      bg: light
        ? { canvas: WHITE, surface: WHITE, raised: WHITE, sunken: n(50), inverse: n(900), overlay: "{color.scrim}", hover: n(50), pressed: n(100), selected: c("neel", 50) }
        : { canvas: n(950), surface: n(900), raised: n(800), sunken: n(950), inverse: n(50), overlay: "{color.scrim}", hover: n(800), pressed: n(700), selected: c("neel", 950) },
      fg: light
        ? { default: n(950), muted: n(700), subtle: n(600), placeholder: n(600), disabled: n(400), inverse: n(50), link: c("neel", 600) }
        : { default: n(50), muted: n(300), subtle: n(400), placeholder: n(400), disabled: n(600), inverse: n(950), link: c("neel", 300) },
      border: light
        ? { subtle: n(100), default: n(200), strong: n(600), focus: c("neel", 500) }
        : { subtle: n(900), default: n(800), strong: n(500), focus: c("neel", 300) },
      accent: light
        ? { solid: n(950), "solid-hover": n(800), "solid-active": n(700), subtle: n(100), "subtle-hover": n(200), fg: n(950), border: n(300), "on-solid": WHITE }
        : { solid: n(50), "solid-hover": n(200), "solid-active": n(300), subtle: n(800), "subtle-hover": n(700), fg: n(50), border: n(600), "on-solid": n(950) },
      ...statuses(mode),
    },
    // Concentric corners: outer = inner + 4px padding.
    radius: { control: "{radius.8}", "control-outer": "{radius.12}", surface: "{radius.12}", overlay: "{radius.16}", "overlay-inner": "{radius.12}", pill: "{radius.full}" },
    "border-width": { default: "{border-width.1}", strong: "{border-width.2}" },
    // Elevation roles (decision 0010): each maps to a layered primitive, with its own dark set.
    shadow: Object.fromEntries(Object.entries(ROLES).map(([role, level]) => [role, `{shadow.${level}${light ? "" : "-dark"}}`])),
  };
}

export function semantic(theme: ThemeName, mode: Mode): SemanticTree {
  void theme;
  return neutral(mode);
}
