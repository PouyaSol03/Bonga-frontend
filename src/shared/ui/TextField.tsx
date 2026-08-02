import { useState, type ChangeEventHandler, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "../../design-system/classes";
import LinearCancelCircle from "../icons/LinearCancelCircle";
import { Typography } from "./Typography";
import { Button } from "./Button";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> & {
  badge?: string;
  containerClassName?: string;
  error?: string;
  label?: string;
  highlightWhenFilled?: boolean;
  hideBadgeWhenFloatingLabel?: boolean;
  forceHighlight?: boolean;
  forceLabel?: boolean;
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
          "relative flex h-14 items-center gap-2 rounded-[12px] border bg-white px-4 transition-[border-color,box-shadow] duration-200 ease-out [direction:rtl]",
          error
            ? "border-[#ee3623]"
            : hasHighlightedBorder
              ? "border-[#0048c4]"
              : "border-[#cccccc]",
          hasFocusedStyle
            ? error
              ? "shadow-[inset_0_0_0_1px_#ee3623]"
              : "shadow-[inset_0_0_0_1px_#0048c4]"
            : "shadow-none",
        )}
      >
        <AnimatePresence initial={false}>
          {showFloatingLabel && label ? (
            <motion.span
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={cn(
                "pointer-events-none absolute -top-[10px] right-4 max-w-[calc(100%-4rem)] origin-right truncate bg-white px-1 text-right text-xs font-normal leading-5",
                error ? "text-[#ee3623]" : hasFocusedStyle ? "text-[#0048c4]" : "text-[#808080]",
              )}
              exit={{ opacity: 0, scale: 0.96, y: 4 }}
              initial={{ opacity: 0, scale: 0.96, y: 4 }}
              key="floating-label"
              transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
        {leadingSlot}
        <input
          ref={inputRef}
          aria-invalid={Boolean(error)}
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-base font-normal leading-6 text-[#1a1a1a] caret-[#0048c4] outline-none placeholder:text-[#a6a6a6] placeholder:transition-colors placeholder:duration-150 [direction:rtl]",
            label && "focus:placeholder:text-transparent",
            className,
          )}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
          onChange={onChange}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          placeholder={placeholder}
          value={value}
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
                className="whitespace-nowrap text-sm font-normal leading-5 text-[#a6a6a6]"
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
                className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[#4d4d4d] opacity-40 transition-colors duration-150 hover:bg-[#f5f5f5] active:bg-[#e5e5e5]"
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
        <Typography as="span" variant="body" size="small" weight="regular" className={cn("mt-1 block px-4 text-right text-xs font-normal leading-5", error ? "text-[#ee3623]" : "text-[#808080]")}>
          {helperText}
        </Typography>
      ) : null}
    </label>
  );
}
