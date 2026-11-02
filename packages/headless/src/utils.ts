/**
 * Every Brahmāstra element carries:
 *   class="astra-<component>"  a stable hook for @brahmastra/ui (inert without its CSS)
 *   data-slot="<part>"          the part's name, the same as its Figma layer name
 *   data-variant / data-size / data-tone   the visual props, so any CSS can style them
 * plus React Aria's state attributes (data-hovered, data-pressed, data-focus-visible,
 * data-disabled, data-selected…). Bring your own CSS by targeting any of these.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export type Size = "sm" | "md" | "lg";
export type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";
