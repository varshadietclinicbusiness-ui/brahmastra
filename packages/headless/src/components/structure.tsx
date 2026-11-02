"use client";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Separator, type SeparatorProps } from "react-aria-components";
import { cx } from "../utils.js";

const hidden: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

/** Text for screen readers only. Use it to finish a sentence the eye already understands. */
export function VisuallyHidden({ children, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...props} style={{ ...hidden, ...props.style }} data-slot="visually-hidden">
      {children}
    </span>
  );
}

export interface DividerProps extends SeparatorProps {
  /** inset starts where the text starts, after a leading icon or avatar. */
  variant?: "full" | "inset";
  /** A short label in the middle: "or continue with". */
  label?: ReactNode;
}

/** Separates groups. Try spacing first; reach for a divider only if groups still blur together. */
export function Divider({ variant = "full", label, className, orientation = "horizontal", ...props }: DividerProps) {
  if (label && orientation === "horizontal") {
    return (
      <div className={cx("astra-divider", className)} data-variant="labelled" role="separator" aria-orientation="horizontal">
        <span data-slot="line" />
        <span data-slot="label">{label}</span>
        <span data-slot="line" />
      </div>
    );
  }
  return <Separator {...props} orientation={orientation} data-variant={variant} className={cx("astra-divider", className)} />;
}

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  size?: "sm" | "md";
}

/** A keyboard key. Desktop only: hide shortcut hints on touch screens. */
export function Kbd({ size = "md", className, ...props }: KbdProps) {
  return <kbd {...props} data-size={size} className={cx("astra-kbd", className)} />;
}
