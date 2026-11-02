"use client";
import type { HTMLAttributes, ReactNode } from "react";
import {
  Button as AriaButton,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
  UNSTABLE_Toast as AriaToast,
  UNSTABLE_ToastContent as AriaToastContent,
  UNSTABLE_ToastQueue as AriaToastQueue,
  UNSTABLE_ToastRegion as AriaToastRegion,
  composeRenderProps,
  type DisclosureGroupProps,
  type DisclosureProps,
} from "react-aria-components";
import { flushSync } from "react-dom";
import { ChevronDownIcon, CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon, XIcon } from "../icons.js";
import { cx } from "../utils.js";

const TONE_ICON = { info: InfoIcon, success: CircleCheckIcon, warning: TriangleAlertIcon, danger: CircleAlertIcon };

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: "info" | "success" | "warning" | "danger";
  title: ReactNode;
  children?: ReactNode;
  /** Buttons or Links at the bottom. */
  actions?: ReactNode;
  onDismiss?: () => void;
  /**
   * Interrupt screen readers (role="alert") only for errors people must act on now.
   * Otherwise it's a polite status. Defaults: danger interrupts, the rest are polite.
   */
  urgent?: boolean;
}

/** A message about the page or a section. The icon and title carry the meaning, never colour alone. */
export function Alert({ tone = "info", title, children, actions, onDismiss, urgent = tone === "danger", className, ...props }: AlertProps) {
  const Icon = TONE_ICON[tone];
  return (
    <div {...props} role={urgent ? "alert" : "status"} data-tone={tone} className={cx("astra-alert", className)}>
      <Icon data-slot="icon" />
      <div data-slot="content">
        <p data-slot="title">{title}</p>
        {children && <div data-slot="body">{children}</div>}
        {actions && <div data-slot="actions">{actions}</div>}
      </div>
      {onDismiss && (
        <AriaButton data-slot="dismiss" aria-label="Dismiss" onPress={onDismiss}>
          <XIcon />
        </AriaButton>
      )}
    </div>
  );
}

export interface ToastContent {
  title: ReactNode;
  description?: ReactNode;
  tone?: "neutral" | "success" | "danger";
  action?: { label: string; onAction: () => void };
}

/**
 * A queue for toasts. Create one for the app, render <ToastRegion queue={toasts} />
 * once, then call toasts.add({ title: "Added to cart" }). Toasts last 4s (6s with an action).
 */
export function createToastQueue(options: { maxVisibleToasts?: number } = {}) {
  const queue = new AriaToastQueue<ToastContent>({
    maxVisibleToasts: options.maxVisibleToasts ?? 3,
    // Animate in and out with the View Transitions API where it exists.
    wrapUpdate(fn) {
      const doc = typeof document !== "undefined" ? (document as Document & { startViewTransition?: (cb: () => void) => void }) : undefined;
      if (doc?.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) doc.startViewTransition(() => flushSync(fn));
      else fn();
    },
  });
  return {
    queue,
    add: (content: ToastContent, opts: { timeout?: number } = {}) =>
      queue.add(content, { timeout: opts.timeout ?? (content.action ? 6000 : 4000) }),
    close: (key: string) => queue.close(key),
  };
}

export function ToastRegion({ toasts }: { toasts: ReturnType<typeof createToastQueue> }) {
  return (
    <AriaToastRegion queue={toasts.queue} className="astra-toast-region">
      {({ toast }) => (
        <AriaToast toast={toast} className="astra-toast" data-tone={toast.content.tone ?? "neutral"} style={{ viewTransitionName: toast.key }}>
          <AriaToastContent data-slot="content">
            <p data-slot="title">{toast.content.title}</p>
            {toast.content.description && <p data-slot="description">{toast.content.description}</p>}
          </AriaToastContent>
          {toast.content.action && (
            <AriaButton
              data-slot="action"
              onPress={() => {
                toast.content.action!.onAction();
                toasts.close(toast.key);
              }}
            >
              {toast.content.action.label}
            </AriaButton>
          )}
          <AriaButton slot="close" data-slot="close" aria-label="Close">
            <XIcon />
          </AriaButton>
        </AriaToast>
      )}
    </AriaToastRegion>
  );
}

export interface AccordionItemProps extends Omit<DisclosureProps, "children"> {
  title: ReactNode;
  children: ReactNode;
}

/** Hides details people only sometimes need. Each title is a real heading with a button inside. */
export function AccordionItem({ title, children, className, ...props }: AccordionItemProps) {
  return (
    <Disclosure {...props} className={composeRenderProps(className, (c) => cx("astra-accordion-item", c))}>
      <Heading data-slot="heading">
        <AriaButton slot="trigger" data-slot="trigger">
          <span data-slot="title">{title}</span>
          <ChevronDownIcon data-slot="chevron" />
        </AriaButton>
      </Heading>
      <DisclosurePanel data-slot="panel">
        <div data-slot="content">{children}</div>
      </DisclosurePanel>
    </Disclosure>
  );
}

export function Accordion({ className, ...props }: DisclosureGroupProps) {
  return <DisclosureGroup {...props} className={composeRenderProps(className, (c) => cx("astra-accordion", c))} />;
}
