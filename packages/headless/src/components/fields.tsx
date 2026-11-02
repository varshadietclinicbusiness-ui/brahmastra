"use client";
import { useState, type ReactNode } from "react";
import {
  Button as AriaButton,
  FieldError,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  SearchField as AriaSearchField,
  Select as AriaSelect,
  SelectValue,
  Text,
  TextArea,
  TextField as AriaTextField,
  composeRenderProps,
  type ListBoxItemProps,
  type SearchFieldProps as AriaSearchFieldProps,
  type SelectProps as AriaSelectProps,
  type TextFieldProps as AriaTextFieldProps,
  type ValidationResult,
} from "react-aria-components";
import { formatIndianMobile, isValidIndianMobile, normalizeIndianMobile } from "../format.js";
import { CheckIcon, ChevronDownIcon, CircleAlertIcon, SearchIcon, XIcon } from "../icons.js";
import { cx } from "../utils.js";

export interface FieldBaseProps {
  label?: ReactNode;
  /** A hint under the field: "We'll send a one-time code". */
  description?: ReactNode;
  /** Shown when the field is invalid. A string, or a function of the validation result. */
  errorMessage?: string | ((validation: ValidationResult) => string);
  /**
   * Mark whichever is rarer on the form: "required" adds *, "optional" adds (optional).
   * Required fields still need isRequired for validation.
   */
  necessityIndicator?: "required" | "optional";
}

export function FieldLabel({ children, necessityIndicator }: { children: ReactNode; necessityIndicator?: FieldBaseProps["necessityIndicator"] }) {
  return (
    <Label className="astra-label" data-necessity={necessityIndicator}>
      {children}
      {necessityIndicator === "required" && <span data-slot="required" aria-hidden="true">*</span>}
      {necessityIndicator === "optional" && <span data-slot="optional">(optional)</span>}
    </Label>
  );
}

function FieldFooter({ description, errorMessage }: Pick<FieldBaseProps, "description" | "errorMessage">) {
  return (
    <>
      {description && <Text slot="description" className="astra-helper-text" data-tone="default">{description}</Text>}
      <FieldError className="astra-helper-text" data-tone="error">
        {(v) => (
          <>
            <CircleAlertIcon data-slot="icon" />
            <span>{typeof errorMessage === "function" ? errorMessage(v) : errorMessage ?? v.validationErrors.join(" ")}</span>
          </>
        )}
      </FieldError>
    </>
  );
}

export interface TextFieldProps extends Omit<AriaTextFieldProps, "children">, FieldBaseProps {
  placeholder?: string;
  /** An icon or text before the value: ₹, a search glass. */
  leading?: ReactNode;
  /** After the value: a unit, a show-password button. */
  trailing?: ReactNode;
  /** Grows to several lines. */
  multiline?: boolean;
  rows?: number;
}

/**
 * One line of text. The input is 16px or larger so iOS never zooms the page, and
 * the label, hint and error are wired to it for screen readers.
 */
export function TextField({ label, description, errorMessage, necessityIndicator, placeholder, leading, trailing, multiline, rows = 3, className, ...props }: TextFieldProps) {
  return (
    <AriaTextField {...props} className={composeRenderProps(className, (c) => cx("astra-field", c))}>
      {label && <FieldLabel necessityIndicator={necessityIndicator}>{label}</FieldLabel>}
      <div data-slot="control" data-multiline={multiline || undefined}>
        {leading && <span data-slot="leading">{leading}</span>}
        {multiline ? <TextArea placeholder={placeholder} rows={rows} data-slot="input" /> : <Input placeholder={placeholder} data-slot="input" />}
        {trailing && <span data-slot="trailing">{trailing}</span>}
      </div>
      <FieldFooter description={description} errorMessage={errorMessage} />
    </AriaTextField>
  );
}

export interface PhoneFieldProps extends Omit<TextFieldProps, "value" | "defaultValue" | "onChange" | "leading" | "type" | "inputMode" | "validate" | "multiline"> {
  /** 10 digits, no spaces or +91. */
  value?: string;
  defaultValue?: string;
  /** Called with the 10 digits only, even when people paste "+91 98765-43210". */
  onChange?: (digits: string) => void;
  dialCode?: string;
}

/**
 * An Indian mobile number. Shows +91, formats as "98765 43210" while typing,
 * accepts pasted numbers in any format, and checks for 10 digits starting 6–9.
 */
export function PhoneField({ value, defaultValue = "", onChange, dialCode = "+91", label = "Mobile number", errorMessage = "Enter a 10-digit mobile number", ...props }: PhoneFieldProps) {
  const [inner, setInner] = useState(normalizeIndianMobile(defaultValue));
  const digits = value !== undefined ? normalizeIndianMobile(value) : inner;
  return (
    <TextField
      {...props}
      label={label}
      errorMessage={errorMessage}
      type="tel"
      inputMode="numeric"
      autoComplete="tel-national"
      value={formatIndianMobile(digits)}
      onChange={(v) => {
        const next = normalizeIndianMobile(v);
        if (value === undefined) setInner(next);
        onChange?.(next);
      }}
      validate={(v) => (v === "" && !props.isRequired) || isValidIndianMobile(v) ? null : typeof errorMessage === "string" ? errorMessage : "Invalid number"}
      leading={<span data-slot="dial-code">{dialCode}</span>}
      className={cx("astra-phone-field", typeof props.className === "string" ? props.className : undefined)}
    />
  );
}

export interface OTPInputProps extends Omit<AriaTextFieldProps, "children" | "value" | "defaultValue" | "onChange">, Omit<FieldBaseProps, "necessityIndicator"> {
  length?: 4 | 6;
  value?: string;
  defaultValue?: string;
  onChange?: (code: string) => void;
  /** Called once all digits are in. Verify here; no extra button press needed. */
  onComplete?: (code: string) => void;
}

/**
 * A one-time code. It's one real input under the boxes, so the code fills itself from
 * SMS on iOS and Android (autocomplete="one-time-code"), and pasting "123-456" works.
 */
export function OTPInput({ length = 6, value, defaultValue = "", onChange, onComplete, label = "Enter the code we sent you", description, errorMessage, className, ...props }: OTPInputProps) {
  const [inner, setInner] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const code = (value ?? inner).replace(/\D/g, "").slice(0, length);
  return (
    <AriaTextField
      {...props}
      value={code}
      onChange={(v) => {
        const next = v.replace(/\D/g, "").slice(0, length);
        if (value === undefined) setInner(next);
        onChange?.(next);
        if (next.length === length) onComplete?.(next);
      }}
      className={composeRenderProps(className, (c) => cx("astra-otp", c))}
      data-length={length}
    >
      {label && <FieldLabel>{label}</FieldLabel>}
      <div data-slot="cells">
        <Input
          data-slot="input"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {Array.from({ length }, (_, i) => (
          <span
            key={i}
            data-slot="cell"
            aria-hidden="true"
            data-filled={i < code.length || undefined}
            data-active={focused && (i === code.length || (code.length === length && i === length - 1)) || undefined}
          >
            {code[i] ?? ""}
          </span>
        ))}
      </div>
      <FieldFooter description={description} errorMessage={errorMessage} />
    </AriaTextField>
  );
}

export interface SearchFieldProps extends Omit<AriaSearchFieldProps, "children"> {
  label?: string;
  placeholder?: string;
  /** Extra controls on the right, like a mic button. */
  trailing?: ReactNode;
}

/** Search with a clear button. Escape clears it. The label is spoken even when hidden. */
export function SearchField({ label = "Search", placeholder = "Search", trailing, className, ...props }: SearchFieldProps) {
  return (
    <AriaSearchField {...props} aria-label={props["aria-label"] ?? label} className={composeRenderProps(className, (c) => cx("astra-search-field", c))}>
      <div data-slot="control">
        <SearchIcon data-slot="leading" />
        <Input placeholder={placeholder} data-slot="input" />
        <AriaButton data-slot="clear" aria-label="Clear search">
          <XIcon />
        </AriaButton>
        {trailing && <span data-slot="trailing">{trailing}</span>}
      </div>
    </AriaSearchField>
  );
}

export interface SelectProps<T extends object> extends Omit<AriaSelectProps<T>, "children">, FieldBaseProps {
  placeholder?: string;
  items?: Iterable<T>;
  children: ReactNode | ((item: T) => ReactNode);
}

/** Pick one option from a list of 5 or more. For 2–4 options, Radio group or Segmented control is faster. */
export function Select<T extends object>({ label, description, errorMessage, necessityIndicator, placeholder = "Select", items, children, className, ...props }: SelectProps<T>) {
  return (
    <AriaSelect {...props} placeholder={placeholder} className={composeRenderProps(className, (c) => cx("astra-field astra-select", c))}>
      {label && <FieldLabel necessityIndicator={necessityIndicator}>{label}</FieldLabel>}
      <AriaButton data-slot="control">
        <SelectValue data-slot="value" />
        <ChevronDownIcon data-slot="chevron" />
      </AriaButton>
      <FieldFooter description={description} errorMessage={errorMessage} />
      <Popover className="astra-popover" offset={4}>
        <ListBox items={items} className="astra-listbox">
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export function SelectItem(props: ListBoxItemProps) {
  const textValue = props.textValue ?? (typeof props.children === "string" ? props.children : undefined);
  return (
    <ListBoxItem {...props} textValue={textValue} className={composeRenderProps(props.className, (c) => cx("astra-listbox-item", c))}>
      {composeRenderProps(props.children, (content, { isSelected }) => (
        <>
          <span data-slot="label">{content}</span>
          {isSelected && <CheckIcon data-slot="check" />}
        </>
      ))}
    </ListBoxItem>
  );
}
