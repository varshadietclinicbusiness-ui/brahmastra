"use client";
import { useEffect, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { Label, ProgressBar as AriaProgressBar, type ProgressBarProps as AriaProgressBarProps } from "react-aria-components";
import { cx, type Size, type Tone } from "../utils.js";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  /** Subtle for most places; Solid on photos and in dense lists. */
  emphasis?: "subtle" | "solid";
  /** A small dot before the text, for live states like "Open now". */
  dot?: boolean;
}

/** A read-only label: Delivered, New, Bestseller. One or two words. Never tappable (that's a Chip). */
export function Badge({ tone = "neutral", emphasis = "subtle", dot, className, children, ...props }: BadgeProps) {
  return (
    <span {...props} data-tone={tone} data-emphasis={emphasis} className={cx("astra-badge", className)}>
      {dot && <span data-slot="dot" aria-hidden="true" />}
      <span data-slot="label">{children}</span>
    </span>
  );
}

export interface CounterProps extends HTMLAttributes<HTMLSpanElement> {
  count?: number;
  /** Above this, shows "99+". */
  max?: number;
  /** Just a dot: "something new", no number. */
  dot?: boolean;
}

/**
 * A count on an icon or avatar. It's hidden from screen readers on purpose:
 * put the count in the parent's name instead ("Orders, 3 new"). Renders nothing at 0.
 */
export function Counter({ count = 0, max = 99, dot, className, ...props }: CounterProps) {
  if (!dot && count <= 0) return null;
  return (
    <span {...props} aria-hidden="true" data-type={dot ? "dot" : "number"} className={cx("astra-counter", className)}>
      {dot ? null : count > max ? `${max}+` : count}
    </span>
  );
}

export type Presence = "online" | "busy" | "away" | "offline";
const PRESENCE_LABEL: Record<Presence, string> = { online: "Online", busy: "Busy", away: "Away", offline: "Offline" };

export interface StatusDotProps extends HTMLAttributes<HTMLSpanElement> {
  status: Presence;
  /** Show the word next to the dot. When hidden, it's still read by screen readers. */
  showLabel?: boolean;
  label?: string;
}

export function StatusDot({ status, showLabel = true, label, className, ...props }: StatusDotProps) {
  const text = label ?? PRESENCE_LABEL[status];
  return (
    <span {...props} data-status={status} className={cx("astra-status-dot", className)} {...(showLabel ? null : { role: "img", "aria-label": text })}>
      <span data-slot="dot" aria-hidden="true" />
      {showLabel && <span data-slot="label">{text}</span>}
    </span>
  );
}

export interface SpinnerProps extends Omit<AriaProgressBarProps, "isIndeterminate" | "value"> {
  size?: Size;
  /** Wait this long before showing, so quick loads never flash a spinner. 300ms is a good default for pages. */
  delay?: number;
}

/** For short waits you can't measure. For whole screens, use Skeleton; when you know progress, use ProgressBar. */
export function Spinner({ size = "md", delay = 0, className, "aria-label": ariaLabel = "Loading", ...props }: SpinnerProps) {
  const [visible, setVisible] = useState(delay === 0);
  useEffect(() => {
    if (delay === 0) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  if (!visible) return null;
  return (
    <AriaProgressBar
      {...props}
      isIndeterminate
      aria-label={ariaLabel}
      data-size={size}
      className={cx("astra-spinner", typeof className === "string" ? className : undefined)}
    />
  );
}

export interface ProgressBarProps extends Omit<AriaProgressBarProps, "children"> {
  label?: ReactNode;
  /** Show the percentage (or valueLabel) next to the label. */
  showValue?: boolean;
}

/** Progress you can measure, like an upload. It turns green at 100%. */
export function ProgressBar({ label, showValue = true, className, ...props }: ProgressBarProps) {
  return (
    <AriaProgressBar {...props} className={cx("astra-progress-bar", typeof className === "string" ? className : undefined)}>
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          {(label || showValue) && (
            <div data-slot="header">
              {label && <Label data-slot="label">{label}</Label>}
              {showValue && !isIndeterminate && <span data-slot="value">{valueText}</span>}
            </div>
          )}
          <div data-slot="track" data-complete={percentage === 100 || undefined}>
            <div data-slot="fill" style={{ width: isIndeterminate ? undefined : `${percentage}%` }} />
          </div>
        </>
      )}
    </AriaProgressBar>
  );
}

export interface ProgressRingProps extends Omit<AriaProgressBarProps, "children" | "isIndeterminate"> {
  size?: Size;
  /** Show the % in the middle (lg only has room for it). */
  showValue?: boolean;
}

const RING: Record<Size, [number, number]> = { sm: [20, 2.5], md: [40, 4], lg: [64, 5] };

/** A circular ProgressBar for tight spots. Starts at 12 o'clock, runs clockwise. */
export function ProgressRing({ size = "md", showValue = size === "lg", className, ...props }: ProgressRingProps) {
  const [d, w] = RING[size];
  const r = (d - w) / 2;
  const c = 2 * Math.PI * r;
  return (
    <AriaProgressBar {...props} data-size={size} className={cx("astra-progress-ring", typeof className === "string" ? className : undefined)}>
      {({ percentage = 0, valueText }) => (
        <>
          <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} aria-hidden="true" data-complete={percentage === 100 || undefined}>
            <circle data-slot="track" cx={d / 2} cy={d / 2} r={r} fill="none" strokeWidth={w} />
            <circle
              data-slot="fill"
              cx={d / 2}
              cy={d / 2}
              r={r}
              fill="none"
              strokeWidth={w}
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - percentage / 100)}
              transform={`rotate(-90 ${d / 2} ${d / 2})`}
            />
          </svg>
          {showValue && <span data-slot="value">{valueText}</span>}
        </>
      )}
    </AriaProgressBar>
  );
}

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  shape?: "text" | "circle" | "rect";
  /** For text: how many lines. Widths step down (100%, 90%, 60%) so it reads like a paragraph. */
  lines?: number;
  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
}

/**
 * A grey placeholder shaped like the content that's coming. Hidden from screen
 * readers: set aria-busy="true" on the container that's loading instead.
 */
export function Skeleton({ shape = "text", lines = 1, width, height, className, style, ...props }: SkeletonProps) {
  if (shape === "text" && lines > 1) {
    const widths = ["100%", "90%", "60%"];
    return (
      <div {...props} aria-hidden="true" className={cx("astra-skeleton-group", className)} style={style}>
        {Array.from({ length: lines }, (_, i) => (
          <div key={i} className="astra-skeleton" data-shape="text" style={{ width: i === lines - 1 ? widths[2] : widths[i % 2] }} />
        ))}
      </div>
    );
  }
  return <div {...props} aria-hidden="true" data-shape={shape} className={cx("astra-skeleton", className)} style={{ width, height, ...style }} />;
}

export interface LiveIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  /** live: streams, countdowns (red). active: live order tracking (green). */
  tone?: "live" | "active";
  /** Without a label, only the dot shows; pass aria-label then. */
  children?: ReactNode;
}

/** Something is updating in real time. The pulse stops under Reduce Motion; the words carry the meaning. */
export function LiveIndicator({ tone = "active", className, children, ...props }: LiveIndicatorProps) {
  return (
    <span {...props} data-tone={tone} data-type={children ? "label" : "dot"} className={cx("astra-live-indicator", className)}>
      <span data-slot="dot" aria-hidden="true" />
      {children && <span data-slot="label">{children}</span>}
    </span>
  );
}
