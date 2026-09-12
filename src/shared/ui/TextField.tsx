import { useState, type ChangeEventHandler, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "../../design-system/classes";
import LinearCancelCircle from "../icons/LinearCancelCircle";
import { Typography } from "./Typography";
import { Button } from "./Button";

function formatNumberForDisplay(value: string) {
  const rawValue = value.replace(/[,،٬]/g, "");
  const match = rawValue.match(/^(-?)([0-9۰-۹٠-٩]+)([.٫][0-9۰-۹٠-٩]*)?$/);

  if (!match) return value;

  const [, sign, integerPart, decimalPart = ""] = match;
  const groupedInteger = integerPart.replace(
    /([0-9۰-۹٠-٩])(?=(?:[0-9۰-۹٠-٩]{3})+(?![0-9۰-۹٠-٩]))/g,
    "$1,",
  );

  return `${sign}${groupedInteger}${decimalPart}`;
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> & {
  badge?: string;
  containerClassName?: string;
  error?: string;
  label?: string;
  highlightWhenFilled?: boolean;
  hideBadgeWhenFloatingLabel?: boolean;
  forceHighlight?: boolean;
  forceLabel?: boolean;
  formatNumber?: boolean;
  inputRef?: Ref<HTMLInputElement>;
  leadingSlot?: ReactNode;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onClear?: () => void;
  supportingText?: string;
  trailingSlot?: ReactNode;
};

export function TextField({
  badge,
  className = "",
  containerClassName = "",
  error,
  label,
  highlightWhenFilled = false,
  hideBadgeWhenFloatingLabel = false,
  forceHighlight = false,
  forceLabel = false,
  formatNumber = false,
  inputRef,
  leadingSlot,
  onBlur,
  onChange,
  onClear,
  onFocus,
  placeholder,
  supportingText,
  trailingSlot,
  value,
  ...props
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const stringValue = typeof value === "string" ? value : "";
  const displayValue = formatNumber ? formatNumberForDisplay(stringValue) : stringValue;
  const hasValue = stringValue.length > 0;
  const helperText = error || supportingText;
  const hasFocusedStyle = forceHighlight || isFocused;
  const hasHighlightedBorder = hasFocusedStyle || (hasValue && highlightWhenFilled);
  const showFloatingLabel = Boolean(label) && (hasValue || forceLabel || isFocused);
  const showClear = Boolean(onClear) && hasValue;
  const showBadge = Boolean(badge) && !(hideBadgeWhenFloatingLabel && showFloatingLabel);

  return (
    <label className={cn("block min-w-0", containerClassName)}>
      <Typography as="span" variant="body" size="medium" weight="regular"
        className={cn(
          "relative flex h-14 items-center gap-2 rounded-[12px] border bg-surface-container-lowest px-4 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] [direction:rtl]",
          error
            ? "border-error"
            : hasHighlightedBorder
              ? "border-primary"
              : "border-outline-var",
          hasFocusedStyle
            ? error
              ? "shadow-[inset_0_0_0_1px_var(--error)]"
              : "shadow-[inset_0_0_0_1px_var(--primary)]"
            : "shadow-none",
        )}
      >
        <AnimatePresence initial={false}>
          {showFloatingLabel && label ? (
            <motion.span
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="pointer-events-none absolute -top-[10px] right-4 max-w-[calc(100%-4rem)] origin-right text-right"
              exit={{ opacity: 0, scale: 0.96, y: 4 }}
              initial={{ opacity: 0, scale: 0.96, y: 4 }}
              key="floating-label"
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <Typography
                as="span"
                variant="body"
                size="small"
                weight="regular"
                className={cn(
                  "block truncate bg-surface-container-lowest px-1",
                  error ? "text-error" : hasFocusedStyle ? "text-primary" : "text-outline",
                )}
              >
                {label}
              </Typography>
            </motion.span>
          ) : null}
        </AnimatePresence>
        {leadingSlot}
        <input
          ref={inputRef}
          aria-invalid={Boolean(error)}
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-on-surface caret-primary outline-none placeholder:text-outline placeholder:transition-colors placeholder:duration-150 [direction:rtl]",
            label && "focus:placeholder:text-transparent",
            className,
          )}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onChange={(event) => {
            if (formatNumber) {
              event.currentTarget.value = event.currentTarget.value.replace(/[,،٬]/g, "");
            }

            onChange?.(event);
          }}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          placeholder={placeholder}
          value={formatNumber ? displayValue : value}
          {...props}
        />
        <AnimatePresence initial={false}>
          {showBadge && badge ? (
            <motion.span
              animate={{ opacity: 1, scale: 1, width: "auto" }}
              className="shrink-0 overflow-hidden"
              exit={{ opacity: 0, scale: 0.96, width: 0 }}
              initial={{ opacity: 0, scale: 0.96, width: 0 }}
              key="text-field-badge"
              transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Typography
                as="span"
                variant="body"
                size="medium"
                weight="regular"
                className="whitespace-nowrap text-sm font-normal leading-5 text-outline"
              >
                {badge}
              </Typography>
            </motion.span>
          ) : null}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          {showClear && onClear ? (
            <motion.span
              animate={{ opacity: 1, scale: 1, width: 24 }}
              className="grid shrink-0 overflow-hidden"
              exit={{ opacity: 0, scale: 0.9, width: 0 }}
              initial={{ opacity: 0, scale: 0.9, width: 0 }}
              key="clear-button"
              transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <Button unstyled
                aria-label="پاک کردن"
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-on-surface-var opacity-40 transition-colors duration-150 hover:bg-surface-container-low active:bg-surface-container-high"
                onClick={(event) => {
                  event.preventDefault();
                  onClear();
                }}
                onMouseDown={(event) => event.preventDefault()}
                tabIndex={hasValue ? 0 : -1}
                type="button"
              >
                <LinearCancelCircle aria-hidden="true" className="h-6 w-6" />
              </Button>
            </motion.span>
          ) : null}
        </AnimatePresence>
        {trailingSlot}
      </Typography>
      {helperText ? (
        <Typography as="span" variant="body" size="small" weight="regular" className={cn("mt-1 block px-4 text-right text-xs font-normal leading-5", error ? "text-error" : "text-outline")}>
          {helperText}
        </Typography>
      ) : null}
    </label>
  );
}
