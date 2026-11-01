import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";
import { formattedVariables } from "style-dictionary/utils";
import type { Dictionary, TransformedToken } from "style-dictionary/types";
import type { Mode, ThemeName } from "./definitions/themes.ts";

export const PREFIX = "astra";
export const PKG = join(dirname(fileURLToPath(import.meta.url)), "..");
export const SRC = join(PKG, "src", "tokens");
export const DIST = join(PKG, "dist");

const PRIMITIVES = join(SRC, "primitives", "*.json");
const SEMANTIC = join(SRC, "semantic", "*.json");
const themeFile = (theme: ThemeName, mode: Mode) => join(SRC, "themes", `${theme}-${mode}.json`);

const pxNumber = (value: unknown) =>
  typeof value === "object" && value !== null ? Number((value as { value: number }).value) : parseFloat(String(value));

StyleDictionary.registerTransform({
  name: "astra/font-size-rem",
  type: "value",
  filter: (token) => token.path[0] === "font" && token.path[1] === "size",
  transform: (token) => `${pxNumber(token.$value) / 16}rem`,
});

StyleDictionary.registerFormat({
  name: "astra/css-declarations",
  format: ({ dictionary }) =>
    formattedVariables({ format: "css", dictionary, outputReferences: true, usesDtcg: true, formatting: { indentation: "  " } }),
});

const transforms = [...StyleDictionary.hooks.transformGroups.css!, "astra/font-size-rem"];

export interface Layer {
  /** `--name: value;` lines, references kept as var(). */
  css: string;
  /** Tokens in this layer, transformed for CSS (resolved values). */
  tokens: TransformedToken[];
}

async function layer(source: string[], filter: (token: TransformedToken) => boolean): Promise<Layer> {
  const sd = new StyleDictionary({
    source,
    log: { verbosity: "silent", warnings: "disabled" },
    platforms: {
      css: {
        transforms,
        prefix: PREFIX,
        files: [{ destination: "out.css", format: "astra/css-declarations", filter }],
      },
    },
  });
  const [file] = await sd.formatPlatform("css");
  const dictionary: Dictionary = await sd.getPlatformTokens("css");
  return { css: String(file?.output ?? ""), tokens: dictionary.allTokens.filter(filter) };
}

const isTheme = (token: TransformedToken) => (token.filePath ?? "").includes("/themes/");

/** Primitives + theme-independent semantics (text styles). */
export function baseLayer() {
  return layer([PRIMITIVES, SEMANTIC], (token) => !isTheme(token));
}

/** One theme × mode, referencing primitives. */
export function themeLayer(theme: ThemeName, mode: Mode) {
  return layer([PRIMITIVES, themeFile(theme, mode)], isTheme);
}
