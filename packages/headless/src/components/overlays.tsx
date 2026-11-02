"use client";
import type { ReactNode } from "react";
import {
  Dialog as AriaDialog,
  DialogTrigger,
  Heading,
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  MenuTrigger,
  Modal,
  ModalOverlay,
  OverlayArrow,
  Popover,
  Sheet,
  SheetBackdrop,
  SheetOverlay,
  Tooltip as AriaTooltip,
  TooltipTrigger,
  composeRenderProps,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  type ModalOverlayProps,
  type PopoverProps,
  type TooltipProps as AriaTooltipProps,
} from "react-aria-components";
import { CheckIcon, XIcon } from "../icons.js";
import { cx } from "../utils.js";

export { DialogTrigger, MenuTrigger, TooltipTrigger };

export interface DialogProps extends Omit<ModalOverlayProps, "children" | "className"> {
  title: ReactNode;
  /** One or two lines that explain the question. */
  description?: ReactNode;
  /** Usually two Buttons: the safe one first. They get `close` via the render function. */
  actions?: ReactNode | ((close: () => void) => ReactNode);
  children?: ReactNode | ((close: () => void) => ReactNode);
  /** alertdialog for destructive confirmations: it can't be dismissed by tapping outside. */
  role?: "dialog" | "alertdialog";
  className?: string;
}

/**
 * Asks one clear question and waits for an answer. Focus moves in, stays in, and goes
 * back to the button that opened it. Use inside <DialogTrigger> or control with isOpen.
 */
export function Dialog({ title, description, actions, children, role = "dialog", className, isDismissable, ...props }: DialogProps) {
  return (
    <ModalOverlay {...props} isDismissable={isDismissable ?? role === "dialog"} className="astra-overlay">
      <Modal className={cx("astra-dialog", className)}>
        <AriaDialog role={role} data-slot="dialog">
          {({ close }) => (
            <>
              <Heading slot="title" data-slot="title">{title}</Heading>
              {description && <p data-slot="description">{description}</p>}
              {children && <div data-slot="body">{typeof children === "function" ? children(close) : children}</div>}
              {actions && <div data-slot="actions">{typeof actions === "function" ? actions(close) : actions}</div>}
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

export interface BottomSheetProps {
  title: ReactNode;
  children?: ReactNode | ((close: () => void) => ReactNode);
  /** Pinned at the bottom: the main action. */
  footer?: ReactNode | ((close: () => void) => ReactNode);
  /** How tall it opens and where it can stop, e.g. ["50%", "100%"]. */
  snapPoints?: Array<number | string>;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  /** Hides the × (keep it unless a footer button closes the sheet). */
  hideCloseButton?: boolean;
  className?: string;
}

/**
 * Slides up from the bottom and follows the finger. Swipe down, tap outside or press
 * Escape to close; there's always a Close button too, for people who can't swipe.
 * Built on React Aria's Sheet. Use inside <DialogTrigger> or control with isOpen.
 */
export function BottomSheet({ title, children, footer, snapPoints, isOpen, defaultOpen, onOpenChange, hideCloseButton, className }: BottomSheetProps) {
  return (
    <SheetOverlay position="bottom" snapPoints={snapPoints} isOpen={isOpen} defaultOpen={defaultOpen} onOpenChange={onOpenChange} className="astra-sheet-overlay">
      <SheetBackdrop className="astra-sheet-backdrop" swipeAnimation="astra-sheet-backdrop" />
      <Sheet className={cx("astra-bottom-sheet", className)}>
        <AriaDialog data-slot="dialog">
          {({ close }) => (
            <>
              <span data-slot="handle" aria-hidden="true" />
              <div data-slot="header">
                <Heading slot="title" data-slot="title">{title}</Heading>
                {!hideCloseButton && (
                  <button type="button" data-slot="close" aria-label="Close" onClick={close}>
                    <XIcon />
                  </button>
                )}
              </div>
              <div data-slot="body">{typeof children === "function" ? children(close) : children}</div>
              {footer && <div data-slot="footer">{typeof footer === "function" ? footer(close) : footer}</div>}
            </>
          )}
        </AriaDialog>
      </Sheet>
    </SheetOverlay>
  );
}

export interface MenuProps<T extends object> extends AriaMenuProps<T> {
  placement?: PopoverProps["placement"];
}

/** A short list of actions that opens from a button. Use inside <MenuTrigger> with a Button first. */
export function Menu<T extends object>({ placement = "bottom end", className, ...props }: MenuProps<T>) {
  return (
    <Popover placement={placement} offset={4} className="astra-popover">
      <AriaMenu {...props} className={composeRenderProps(className, (c) => cx("astra-menu", c))} />
    </Popover>
  );
}

export interface MenuItemProps extends AriaMenuItemProps {
  icon?: ReactNode;
  /** Destructive actions are red and go last. */
  tone?: "default" | "danger";
  /** A keyboard shortcut hint, shown on desktop. */
  shortcut?: ReactNode;
}

export function MenuItem({ icon, tone = "default", shortcut, className, children, ...props }: MenuItemProps) {
  const textValue = props.textValue ?? (typeof children === "string" ? children : undefined);
  return (
    <AriaMenuItem {...props} textValue={textValue} data-tone={tone} className={composeRenderProps(className, (c) => cx("astra-menu-item", c))}>
      {composeRenderProps(children, (content, { isSelected, selectionMode }) => (
        <>
          {icon && <span data-slot="icon" aria-hidden="true">{icon}</span>}
          <span data-slot="label">{content}</span>
          {shortcut && <span data-slot="shortcut">{shortcut}</span>}
          {selectionMode !== "none" && isSelected && <CheckIcon data-slot="check" />}
        </>
      ))}
    </AriaMenuItem>
  );
}

export interface TooltipProps extends Omit<AriaTooltipProps, "children"> {
  children: ReactNode;
}

/**
 * A short hint on hover or keyboard focus. Phones don't hover, so never hide anything
 * important in a tooltip. Use inside <TooltipTrigger> after the element it describes.
 */
export function Tooltip({ children, offset = 8, className, ...props }: TooltipProps) {
  return (
    <AriaTooltip {...props} offset={offset} className={composeRenderProps(className, (c) => cx("astra-tooltip", c))}>
      <OverlayArrow data-slot="arrow">
        <svg width={10} height={6} viewBox="0 0 10 6" aria-hidden="true"><path d="M0 0 L5 6 L10 0" /></svg>
      </OverlayArrow>
      {children}
    </AriaTooltip>
  );
}
