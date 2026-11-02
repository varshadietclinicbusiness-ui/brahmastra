"use client";
import type { ReactNode } from "react";
import {
  Checkbox as AriaCheckbox,
  FieldError,
  CheckboxGroup as AriaCheckboxGroup,
  Label,
  Radio as AriaRadio,
  RadioGroup as AriaRadioGroup,
  SelectionIndicator,
  Slider as AriaSlider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  Switch as AriaSwitch,
  Text,
  ToggleButton,
  ToggleButtonGroup,
  composeRenderProps,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  type CheckboxProps as AriaCheckboxProps,
  type RadioGroupProps as AriaRadioGroupProps,
  type RadioProps as AriaRadioProps,
  type SliderProps as AriaSliderProps,
  type SwitchProps as AriaSwitchProps,
  type ToggleButtonGroupProps,
  type ToggleButtonProps,
} from "react-aria-components";
import { CheckIcon, MinusIcon } from "../icons.js";
import { cx } from "../utils.js";
import { FieldLabel, type FieldBaseProps } from "./fields.js";

export interface CheckboxProps extends Omit<AriaCheckboxProps, "children"> {
  children?: ReactNode;
  /** A second line under the label. */
  description?: ReactNode;
}

/** On or off, many at once. The whole row is tappable, and the box has a 44px hit area. */
export function Checkbox({ children, description, className, ...props }: CheckboxProps) {
  return (
    <AriaCheckbox {...props} className={composeRenderProps(className, (c) => cx("astra-checkbox", c))}>
      {({ isSelected, isIndeterminate }) => (
        <>
          <span data-slot="box" aria-hidden="true">
            {isIndeterminate ? <MinusIcon /> : isSelected ? <CheckIcon /> : null}
          </span>
          {(children || description) && (
            <span data-slot="text">
              {children && <span data-slot="label">{children}</span>}
              {description && <span data-slot="description">{description}</span>}
            </span>
          )}
        </>
      )}
    </AriaCheckbox>
  );
}

export interface CheckboxGroupProps extends Omit<AriaCheckboxGroupProps, "children">, FieldBaseProps {
  children: ReactNode;
}

export function CheckboxGroup({ label, description, errorMessage, necessityIndicator, children, className, ...props }: CheckboxGroupProps) {
  return (
    <AriaCheckboxGroup {...props} className={composeRenderProps(className, (c) => cx("astra-choice-group", c))}>
      {label && <FieldLabel necessityIndicator={necessityIndicator}>{label}</FieldLabel>}
      {description && <Text slot="description" className="astra-helper-text">{description}</Text>}
      <div data-slot="options">{children}</div>
      <FieldError className="astra-helper-text" data-tone="error">{typeof errorMessage === "function" ? errorMessage : errorMessage}</FieldError>
    </AriaCheckboxGroup>
  );
}

export interface RadioProps extends Omit<AriaRadioProps, "children"> {
  children?: ReactNode;
  description?: ReactNode;
}

/** One choice from a short list you can see at once. */
export function Radio({ children, description, className, ...props }: RadioProps) {
  return (
    <AriaRadio {...props} className={composeRenderProps(className, (c) => cx("astra-radio", c))}>
      <span data-slot="circle" aria-hidden="true" />
      <span data-slot="text">
        <span data-slot="label">{children}</span>
        {description && <span data-slot="description">{description}</span>}
      </span>
    </AriaRadio>
  );
}

export interface RadioGroupProps extends Omit<AriaRadioGroupProps, "children">, FieldBaseProps {
  children: ReactNode;
}

export function RadioGroup({ label, description, errorMessage, necessityIndicator, children, className, ...props }: RadioGroupProps) {
  return (
    <AriaRadioGroup {...props} className={composeRenderProps(className, (c) => cx("astra-choice-group", c))}>
      {label && <FieldLabel necessityIndicator={necessityIndicator}>{label}</FieldLabel>}
      {description && <Text slot="description" className="astra-helper-text">{description}</Text>}
      <div data-slot="options">{children}</div>
      <FieldError className="astra-helper-text" data-tone="error">{typeof errorMessage === "function" ? errorMessage : errorMessage}</FieldError>
    </AriaRadioGroup>
  );
}

export interface SwitchProps extends Omit<AriaSwitchProps, "children"> {
  children?: ReactNode;
  description?: ReactNode;
}

/** A setting that takes effect immediately. If it needs a Save button, use a Checkbox. */
export function Switch({ children, description, className, ...props }: SwitchProps) {
  return (
    <AriaSwitch {...props} className={composeRenderProps(className, (c) => cx("astra-switch", c))}>
      <span data-slot="text">
        <span data-slot="label">{children}</span>
        {description && <span data-slot="description">{description}</span>}
      </span>
      <span data-slot="track" aria-hidden="true">
        <span data-slot="thumb" />
      </span>
    </AriaSwitch>
  );
}

export interface ChipProps extends ToggleButtonProps {
  /** A trailing chevron, for chips that open a menu (Sort ▾). */
  hasMenu?: boolean;
}

/** A small toggle for filters: Pure veg, Rating 4.0+. Selected chips show a tick. */
export function Chip({ hasMenu, className, children, ...props }: ChipProps) {
  return (
    <ToggleButton {...props} className={composeRenderProps(className, (c) => cx("astra-chip", c))}>
      {composeRenderProps(children, (content, { isSelected }) => (
        <>
          {isSelected && <CheckIcon data-slot="check" />}
          <span data-slot="label">{content}</span>
        </>
      ))}
    </ToggleButton>
  );
}

/** A row of filter chips. Usually selectionMode="multiple". */
export function ChipGroup({ className, ...props }: ToggleButtonGroupProps) {
  return <ToggleButtonGroup selectionMode="multiple" {...props} className={composeRenderProps(className, (c) => cx("astra-chip-group", c))} />;
}

export interface SegmentedControlProps extends Omit<ToggleButtonGroupProps, "selectionMode" | "children"> {
  /** 2 to 4 options. Keys are what onSelectionChange gives back. */
  options: Array<{ id: string; label: ReactNode }>;
  "aria-label": string;
}

/** Switches between 2–4 views of the same content, like Delivery / Takeaway. The indicator slides between them. */
export function SegmentedControl({ options, className, ...props }: SegmentedControlProps) {
  return (
    <ToggleButtonGroup
      disallowEmptySelection
      {...props}
      selectionMode="single"
      className={composeRenderProps(className, (c) => cx("astra-segmented-control", c))}
    >
      {options.map((o) => (
        <ToggleButton key={o.id} id={o.id} className="astra-segment">
          <SelectionIndicator data-slot="indicator" />
          <span data-slot="label">{o.label}</span>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export interface SliderProps<T extends number | number[]> extends AriaSliderProps<T> {
  label?: ReactNode;
  /** Format the value: rupees, km. */
  showOutput?: boolean;
}

/** Pick a value or a range by dragging. Arrow keys move it one step; Page Up/Down move 10. */
export function Slider<T extends number | number[]>({ label, showOutput = true, className, ...props }: SliderProps<T>) {
  return (
    <AriaSlider {...props} className={composeRenderProps(className, (c) => cx("astra-slider", c))}>
      {(label || showOutput) && (
        <div data-slot="header">
          {label && <Label data-slot="label">{label}</Label>}
          {showOutput && <SliderOutput data-slot="output" />}
        </div>
      )}
      <SliderTrack data-slot="track">
        {({ state }) => {
          const n = state.values.length;
          const start = n > 1 ? state.getThumbPercent(0) : 0;
          const end = state.getThumbPercent(n - 1);
          return (
            <>
              <span data-slot="fill" style={{ left: `${start * 100}%`, width: `${(end - start) * 100}%` }} />
              {state.values.map((_, i) => (
                <SliderThumb key={i} index={i} data-slot="thumb" />
              ))}
            </>
          );
        }}
      </SliderTrack>
    </AriaSlider>
  );
}
