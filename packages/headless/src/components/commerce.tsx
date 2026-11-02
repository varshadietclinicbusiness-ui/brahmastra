"use client";
import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { Button as AriaButton, Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";
import { formatINR, savingPercent } from "../format.js";
import { ChevronRightIcon, MinusIcon, PlusIcon } from "../icons.js";
import { cx } from "../utils.js";
import { VisuallyHidden } from "./structure.js";

export interface VegMarkProps extends HTMLAttributes<HTMLSpanElement> {
  type: "veg" | "non-veg";
  size?: "sm" | "md";
}

/** India's FSSAI food mark. The shape (dot vs triangle) carries the meaning, so it works without colour. */
export function VegMark({ type, size = "sm", className, ...props }: VegMarkProps) {
  return (
    <span
      {...props}
      role="img"
      aria-label={type === "veg" ? "Vegetarian" : "Non-vegetarian"}
      data-type={type}
      data-size={size}
      className={cx("astra-veg-mark", className)}
    >
      <span data-slot="mark" aria-hidden="true" />
    </span>
  );
}

export interface PriceProps extends HTMLAttributes<HTMLSpanElement> {
  /** Selling price in rupees. */
  value: number;
  /** The MRP or old price. Shown struck through, with the saving, only when higher than value. */
  mrp?: number;
  /** Show "20% off" after the struck price. */
  showSaving?: boolean;
  /** 0 shows FREE (with the struck mrp, if any). */
  freeLabel?: string;
  /** Show paise. Only on bills. */
  paise?: boolean;
  size?: "sm" | "md" | "lg";
}

/** A rupee amount in Indian grouping (₹1,24,999). Screen readers hear "₹280, was ₹350". */
export function Price({ value, mrp, showSaving = true, freeLabel = "FREE", paise, size = "md", className, ...props }: PriceProps) {
  const isFree = value === 0;
  const discounted = mrp !== undefined && mrp > value;
  const pct = discounted ? savingPercent(mrp!, value) : 0;
  return (
    <span {...props} data-size={size} data-type={isFree ? "free" : discounted ? "discounted" : "default"} className={cx("astra-price", className)}>
      <span data-slot="value">{isFree ? freeLabel : formatINR(value, { paise })}</span>
      {discounted && (
        <>
          <VisuallyHidden>, was</VisuallyHidden>
          <s data-slot="mrp">{formatINR(mrp!, { paise })}</s>
          {showSaving && !isFree && pct > 0 && <span data-slot="saving">{pct}% off</span>}
        </>
      )}
    </span>
  );
}

export interface OfferTagProps extends HTMLAttributes<HTMLSpanElement> {
  /** inline next to a name · benefit for perks · on-image over a photo · ribbon on a card edge */
  type?: "inline" | "benefit" | "on-image" | "ribbon";
  icon?: ReactNode;
  /** Second line for on-image tags: "UPTO ₹100". */
  subtitle?: ReactNode;
}

/** The single best deal on a card. One per card. */
export function OfferTag({ type = "inline", icon, subtitle, className, children, ...props }: OfferTagProps) {
  return (
    <span {...props} data-type={type} className={cx("astra-offer-tag", className)}>
      {icon && <span data-slot="icon" aria-hidden="true">{icon}</span>}
      <span data-slot="label">{children}</span>
      {subtitle && <span data-slot="subtitle">{subtitle}</span>}
    </span>
  );
}

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  /** The thing being counted, for screen readers: "Remove one Filter coffee". */
  itemName: string;
  min?: number;
  max?: number;
  isDisabled?: boolean;
  /** Text on the button at zero. */
  addLabel?: string;
  className?: string;
}

/**
 * ADD, then − 2 +. The Indian food-app pattern. Focus stays on a sensible button when
 * the control changes shape, and the new count is announced politely.
 */
export function QuantityStepper({ value, onChange, itemName, min = 0, max = 20, isDisabled, addLabel = "ADD", className }: QuantityStepperProps) {
  const addRef = useRef<HTMLButtonElement>(null);
  const plusRef = useRef<HTMLButtonElement>(null);
  const prev = useRef(value);
  const interacted = useRef(false);
  useEffect(() => {
    if (interacted.current) {
      if (prev.current === 0 && value > 0) plusRef.current?.focus();
      if (prev.current > 0 && value === 0) addRef.current?.focus();
    }
    prev.current = value;
  }, [value]);
  const set = (v: number) => {
    interacted.current = true;
    onChange(Math.min(max, Math.max(min, v)));
  };

  if (value <= 0) {
    return (
      <AriaButton
        ref={addRef}
        isDisabled={isDisabled}
        onPress={() => set(1)}
        aria-label={`${addLabel} ${itemName}`}
        data-state="add"
        className={cx("astra-quantity-stepper", className)}
      >
        <span data-slot="label">{addLabel}</span>
        <PlusIcon data-slot="add-icon" />
      </AriaButton>
    );
  }
  return (
    <div role="group" aria-label={`${itemName} quantity`} data-state="count" data-disabled={isDisabled || undefined} className={cx("astra-quantity-stepper", className)}>
      <AriaButton data-slot="decrement" isDisabled={isDisabled} onPress={() => set(value - 1)} aria-label={`Remove one ${itemName}`}>
        <MinusIcon />
      </AriaButton>
      <output data-slot="count" aria-live="polite">
        {value}
        <VisuallyHidden> in cart</VisuallyHidden>
      </output>
      <AriaButton ref={plusRef} data-slot="increment" isDisabled={isDisabled || value >= max} onPress={() => set(value + 1)} aria-label={`Add one more ${itemName}`}>
        <PlusIcon />
      </AriaButton>
    </div>
  );
}

export interface CartBarProps extends Omit<AriaLinkProps, "children"> {
  count: number;
  total: number;
  /** Small print under the total. */
  note?: string;
  actionLabel?: string;
  /** "Add ₹70 more for free delivery". progress is 0–1. */
  nudge?: { message: ReactNode; progress?: number; unlocked?: boolean };
}

/** Sticks to the bottom of menus once something is in the cart. The whole bar is one link. */
export function CartBar({ count, total, note = "Extra charges may apply", actionLabel = "View cart", nudge, className, ...props }: CartBarProps) {
  const items = `${count} ${count === 1 ? "item" : "items"}`;
  return (
    <div className={cx("astra-cart-bar", typeof className === "string" ? className : undefined)}>
      {nudge && (
        <div data-slot="nudge" data-unlocked={nudge.unlocked || undefined}>
          <span data-slot="nudge-message">{nudge.message}</span>
          {nudge.progress !== undefined && !nudge.unlocked && (
            <span data-slot="nudge-track" aria-hidden="true">
              <span data-slot="nudge-fill" style={{ width: `${Math.round(Math.min(1, Math.max(0, nudge.progress)) * 100)}%` }} />
            </span>
          )}
        </div>
      )}
      <AriaLink {...props} data-slot="bar" aria-label={`${actionLabel}, ${items}, ${formatINR(total)}`}>
        <span data-slot="summary">
          <span data-slot="title">{items} · {formatINR(total)}</span>
          {note && <span data-slot="note">{note}</span>}
        </span>
        <span data-slot="action">{actionLabel}</span>
        <ChevronRightIcon data-slot="chevron" />
      </AriaLink>
    </div>
  );
}

export interface BillLine {
  label: ReactNode;
  amount: number;
  /** The amount before a discount, struck through (₹40 delivery that's now free). */
  originalAmount?: number;
  /** A small ⓘ next to the label. Pass a Tooltip trigger or any node. */
  info?: ReactNode;
}

export interface BillSummaryProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  lines: BillLine[];
  total: number;
  totalLabel?: ReactNode;
  /** Shown as a green line under the total: "You saved ₹51 on this order". */
  savings?: number;
}

/** Every charge on its own line, before people pay. */
export function BillSummary({ title = "Bill details", lines, total, totalLabel = "To pay", savings, className, ...props }: BillSummaryProps) {
  return (
    <section {...props} aria-label={typeof title === "string" ? title : undefined} className={cx("astra-bill-summary", className)}>
      {title && <h3 data-slot="title">{title}</h3>}
      <dl data-slot="lines">
        {lines.map((line, i) => (
          <div data-slot="line" key={i}>
            <dt>
              {line.label}
              {line.info}
            </dt>
            <dd>
              <Price value={line.amount} mrp={line.originalAmount} showSaving={false} size="sm" />
            </dd>
          </div>
        ))}
        <div data-slot="total">
          <dt>{totalLabel}</dt>
          <dd>{formatINR(total)}</dd>
        </div>
      </dl>
      {savings ? <p data-slot="savings">You saved {formatINR(savings)} on this order</p> : null}
    </section>
  );
}
