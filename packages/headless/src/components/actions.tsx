"use client";
import type { ReactNode } from "react";
import {
  Button as AriaButton,
  Link as AriaLink,
  ProgressBar as AriaProgressBar,
  composeRenderProps,
  type ButtonProps as AriaButtonProps,
  type LinkProps as AriaLinkProps,
} from "react-aria-components";
import { ArrowUpRightIcon, ChevronRightIcon } from "../icons.js";
import { cx, type Size } from "../utils.js";
import { VisuallyHidden } from "./structure.js";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";

export interface ButtonProps extends Omit<AriaButtonProps, "isPending"> {
  /** Primary for the one main action on a screen, Secondary/Outline for the rest, Ghost in toolbars, Danger to destroy. */
  variant?: ButtonVariant;
  /** sm 36px · md 44px · lg 52px. The hit area is always at least 44px. */
  size?: Size;
  /** Shows a spinner, keeps the button's width, blocks presses and tells screen readers. */
  isLoading?: boolean;
  /** Read out while loading. Write what is happening: "Placing order". */
  loadingLabel?: string;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  /** Stretch to the container's width (bottom bars, forms on phones). */
  fullWidth?: boolean;
}

/**
 * Starts an action. Built on React Aria's Button, so it works with mouse, touch,
 * keyboard and screen readers, and only shows a focus stroke for keyboard users.
 */
export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingLabel = "Loading",
  leadingIcon,
  trailingIcon,
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      {...props}
      isPending={isLoading}
      data-variant={variant}
      data-size={size}
      data-full-width={fullWidth || undefined}
      className={composeRenderProps(className, (c) => cx("astra-button", c))}
    >
      {composeRenderProps(children, (content, { isPending }) => (
        <>
          {leadingIcon && <span data-slot="leading-icon" aria-hidden="true">{leadingIcon}</span>}
          <span data-slot="label">{content}</span>
          {trailingIcon && <span data-slot="trailing-icon" aria-hidden="true">{trailingIcon}</span>}
          {isPending && (
            <AriaProgressBar isIndeterminate aria-label={loadingLabel} data-slot="spinner" className="astra-spinner" />
          )}
        </>
      ))}
    </AriaButton>
  );
}

export interface IconButtonProps extends Omit<ButtonProps, "leadingIcon" | "trailingIcon" | "children" | "fullWidth"> {
  /** Required: an icon alone has no name. Say what it does, "Add to favourites", not "Heart". */
  "aria-label": string;
  icon: ReactNode;
}

/** A Button with only an icon. It still gets a 44px hit area and a spoken name. */
export function IconButton({ icon, className, ...props }: IconButtonProps) {
  return (
    <Button {...props} className={composeRenderProps(className, (c) => cx("astra-icon-button", c))}>
      <span data-slot="icon" aria-hidden="true">{icon}</span>
    </Button>
  );
}

export interface LinkProps extends AriaLinkProps {
  size?: "sm" | "md";
  /** Adds a chevron, for "View all" links at the end of a section. */
  showArrow?: boolean;
  /** Opens in a new tab, shows ↗ and tells screen readers it does. */
  isExternal?: boolean;
}

/** Takes people somewhere. For actions (Pay, Save), use Button. */
export function Link({ size = "md", showArrow, isExternal, className, children, ...props }: LinkProps) {
  return (
    <AriaLink
      {...props}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : null)}
      data-size={size}
      className={composeRenderProps(className, (c) => cx("astra-link", c))}
    >
      {composeRenderProps(children, (content) => (
        <>
          <span data-slot="label">{content}</span>
          {isExternal ? (
            <>
              <ArrowUpRightIcon data-slot="trailing-icon" />
              <VisuallyHidden>(opens in a new tab)</VisuallyHidden>
            </>
          ) : (
            showArrow && <ChevronRightIcon data-slot="trailing-icon" />
          )}
        </>
      ))}
    </AriaLink>
  );
}
