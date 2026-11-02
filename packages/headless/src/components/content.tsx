"use client";
import type { HTMLAttributes, ReactNode } from "react";
import { Link as AriaLink, type LinkProps as AriaLinkProps } from "react-aria-components";
import { formatCompactIndian } from "../format.js";
import { ChevronRightIcon, StarIcon } from "../icons.js";
import { cx } from "../utils.js";

export interface ListItemProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title: ReactNode;
  subtitle?: ReactNode;
  /** An icon, Avatar or Thumbnail. */
  leading?: ReactNode;
  /** Meta text, a Switch, a Badge… */
  trailing?: ReactNode;
  /** Makes the whole row a link and adds a chevron. */
  href?: string;
  /** Makes the whole row a button. */
  onPress?: AriaLinkProps["onPress"];
}

/**
 * One row in a list. With href or onPress, the whole row is one tap target (no nested
 * buttons). Without them, it's plain content,.
 */
export function ListItem({ title, subtitle, leading, trailing, href, onPress, className, ...props }: ListItemProps) {
  const inner = (
    <>
      {leading && <span data-slot="leading">{leading}</span>}
      <span data-slot="text">
        <span data-slot="title">{title}</span>
        {subtitle && <span data-slot="subtitle">{subtitle}</span>}
      </span>
      {trailing && <span data-slot="trailing">{trailing}</span>}
      {(href || onPress) && <ChevronRightIcon data-slot="chevron" />}
    </>
  );
  if (href || onPress) {
    return (
      <AriaLink href={href} onPress={onPress} className={cx("astra-list-item", className)} data-interactive>
        {inner}
      </AriaLink>
    );
  }
  return (
    <div {...props} className={cx("astra-list-item", className)}>
      {inner}
    </div>
  );
}

export interface RatingProps extends HTMLAttributes<HTMLSpanElement> {
  value: number;
  /** Number of ratings, shown as (2.1K). */
  count?: number;
  /** badge: green pill (4.3 ★), the Indian food-app style · stars: five stars */
  type?: "badge" | "stars";
  max?: number;
}

/** A read-only rating. Spoken as "4.3 out of 5, 2,140 ratings". */
export function Rating({ value, count, type = "badge", max = 5, className, ...props }: RatingProps) {
  const label = `${value.toFixed(1)} out of ${max}${count ? `, ${count.toLocaleString("en-IN")} ratings` : ""}`;
  const tone = value >= 4 ? "success" : value >= 3 ? "warning" : "danger";
  return (
    <span {...props} role="img" aria-label={label} data-type={type} data-tone={tone} className={cx("astra-rating", className)}>
      {type === "badge" ? (
        <span data-slot="badge">
          <StarIcon data-slot="star" />
          {value.toFixed(1)}
        </span>
      ) : (
        <span data-slot="stars">
          <span data-slot="stars-base">
            {Array.from({ length: max }, (_, i) => (
              <StarIcon key={i} data-slot="star" />
            ))}
          </span>
          <span data-slot="stars-fill" style={{ width: `${(Math.min(max, Math.max(0, value)) / max) * 100}%` }}>
            {Array.from({ length: max }, (_, i) => (
              <StarIcon key={i} data-slot="star" />
            ))}
          </span>
        </span>
      )}
      {count !== undefined && <span data-slot="count">({formatCompactIndian(count)})</span>}
    </span>
  );
}

export interface CardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** Makes the whole card one link, named by its title. Inner buttons still work. */
  href?: string;
  /** The card's name. Required when href is set. */
  title?: ReactNode;
  media?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  variant?: "raised" | "outline" | "flat";
}

/**
 * A group of facts about one thing (a restaurant, a dish). With href, the title is the
 * link and its tap area stretches over the whole card, so buttons inside stay separate.
 */
export function Card({ href, title, media, children, footer, variant = "raised", className, ...props }: CardProps) {
  return (
    <article {...props} data-variant={variant} data-interactive={href ? true : undefined} className={cx("astra-card", className)}>
      {media && <div data-slot="media">{media}</div>}
      <div data-slot="body">
        {title && (
          <h3 data-slot="title">
            {href ? (
              <AriaLink href={href} data-slot="link">
                {title}
              </AriaLink>
            ) : (
              title
            )}
          </h3>
        )}
        {children}
      </div>
      {footer && <div data-slot="footer">{footer}</div>}
    </article>
  );
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  /** One Button that helps fill the space. */
  action?: ReactNode;
}

/** Shown where content would be. Tell people how to fill it. Never use it while loading. */
export function EmptyState({ icon, title, description, action, className, ...props }: EmptyStateProps) {
  return (
    <div {...props} className={cx("astra-empty-state", className)}>
      {icon && <span data-slot="icon" aria-hidden="true">{icon}</span>}
      <h2 data-slot="title">{title}</h2>
      {description && <p data-slot="description">{description}</p>}
      {action && <div data-slot="action">{action}</div>}
    </div>
  );
}
