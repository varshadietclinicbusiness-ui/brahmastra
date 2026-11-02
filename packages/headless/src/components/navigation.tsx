"use client";
import type { HTMLAttributes, ReactNode } from "react";
import {
  Link as AriaLink,
  SelectionIndicator,
  Tab as AriaTab,
  TabList as AriaTabList,
  TabPanel as AriaTabPanel,
  Tabs as AriaTabs,
  composeRenderProps,
  type TabListProps,
  type TabPanelProps,
  type TabProps,
  type TabsProps,
} from "react-aria-components";
import { cx } from "../utils.js";
import { Counter } from "./status.js";

/** Sections within one screen: Recommended / Dosa / Idli. For app-level destinations, use TabBar. */
export function Tabs({ className, ...props }: TabsProps) {
  return <AriaTabs {...props} className={composeRenderProps(className, (c) => cx("astra-tabs", c))} />;
}

export function TabList<T extends object>({ className, ...props }: TabListProps<T>) {
  return <AriaTabList {...props} className={composeRenderProps(className, (c) => cx("astra-tab-list", c))} />;
}

/** One tab. The underline slides to the selected tab (and jumps under Reduce Motion). */
export function Tab({ className, children, ...props }: TabProps) {
  return (
    <AriaTab {...props} className={composeRenderProps(className, (c) => cx("astra-tab", c))}>
      {composeRenderProps(children, (content) => (
        <>
          <span data-slot="label">{content}</span>
          <SelectionIndicator data-slot="indicator" />
        </>
      ))}
    </AriaTab>
  );
}

export function TabPanel({ className, ...props }: TabPanelProps) {
  return <AriaTabPanel {...props} className={composeRenderProps(className, (c) => cx("astra-tab-panel", c))} />;
}

export interface TabBarItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  /** A number shows a count (99+ max); true shows a dot. */
  badge?: number | boolean;
}

export interface TabBarProps extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  items: TabBarItem[];
  /** The id of the current destination. */
  currentId: string;
  /** classic: full-width bar · floating: a pill 16px in from the edges · expanding: only the current tab shows its label · icon-only: labels for screen readers only */
  type?: "classic" | "floating" | "expanding" | "icon-only";
  /** Called when people tap the tab they're already on. Scroll to top here. */
  onReselect?: (id: string) => void;
  "aria-label"?: string;
}

/**
 * The app's 3–5 main destinations, at the bottom on phones. These are links that change
 * pages, so it's a <nav> with aria-current, not a tablist. Badges are part of the spoken name.
 */
export function TabBar({ items, currentId, type = "classic", onReselect, className, "aria-label": ariaLabel = "Main", ...props }: TabBarProps) {
  return (
    <nav {...props} aria-label={ariaLabel} data-type={type} className={cx("astra-tab-bar", className)}>
      <ul data-slot="list">
        {items.map((item) => {
          const current = item.id === currentId;
          const badgeText = typeof item.badge === "number" && item.badge > 0 ? `, ${item.badge} new` : item.badge === true ? ", new" : "";
          return (
            <li key={item.id} data-slot="item-wrapper">
              <AriaLink
                href={item.href}
                aria-current={current ? "page" : undefined}
                aria-label={`${item.label}${badgeText}`}
                data-current={current || undefined}
                className="astra-tab-bar-item"
                onPress={current && onReselect ? () => onReselect(item.id) : undefined}
              >
                <span data-slot="indicator" aria-hidden="true">
                  <span data-slot="icon">{item.icon}</span>
                  {item.badge ? <Counter data-slot="badge" count={typeof item.badge === "number" ? item.badge : 0} dot={item.badge === true} /> : null}
                </span>
                <span data-slot="label" aria-hidden="true">{item.label}</span>
              </AriaLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export interface AppBarProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: ReactNode;
  /** Usually a back IconButton. */
  leading?: ReactNode;
  /** Up to two IconButtons. */
  actions?: ReactNode;
  /** Large title for top-level screens (iOS style). */
  size?: "default" | "large";
  /** Set once content scrolls under it: adds the floating shadow. */
  isScrolled?: boolean;
}

/** The top bar of a screen: back, title, up to two actions. The title is the page's h1. */
export function AppBar({ title, leading, actions, size = "default", isScrolled, className, ...props }: AppBarProps) {
  return (
    <header {...props} data-size={size} data-scrolled={isScrolled || undefined} className={cx("astra-app-bar", className)}>
      <div data-slot="row">
        {leading && <div data-slot="leading">{leading}</div>}
        {size === "default" && title && <h1 data-slot="title">{title}</h1>}
        {actions && <div data-slot="actions">{actions}</div>}
      </div>
      {size === "large" && title && <h1 data-slot="title">{title}</h1>}
    </header>
  );
}
