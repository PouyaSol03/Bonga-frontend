import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from "react";

import { cn, focusRing } from "../../design-system/classes";
import LinearCancelCircle from "../(icons)/LinearCancelCircle";
import { Typography } from "./Typography";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "size"> & {
  badge?: string;
  containerClassName?: string;
  error?: string;
  label?: string;
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
  leadingSlot,
  onChange,
  onClear,
  placeholder,
  supportingText,
  trailingSlot,
  value,
  ...props
}: TextFieldProps) {
  const stringValue = typeof value === "string" ? value : "";
  const hasValue = stringValue.length > 0;
  const helperText = error || supportingText;

  return (
    <label className={cn("block min-w-0", containerClassName)}>
      <Typography as="span" variant="body" size="medium" weight="regular"
        className={cn(
          "relative flex h-14 items-center gap-2 rounded-[12px] border bg-white px-4 transition [direction:ltr]",
          error ? "border-[#ee3623]" : hasValue ? "border-[#0048c4]" : "border-[#cccccc]",
          focusRing,
        )}
      >
        {hasValue && label ? (
          <Typography as="span" variant="body" size="small" weight="regular" className={cn("absolute -top-2 right-4 max-w-[calc(100%-4rem)] truncate bg-white px-1 text-right text-xs font-normal leading-5", error ? "text-[#ee3623]" : "text-[#808080]")}>
            {label}
          </Typography>
        ) : null}
        {leadingSlot}
        <input
          aria-invalid={Boolean(error)}
          className={cn(
            "min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] [direction:rtl]",
            className,
          )}
          onChange={onChange}
          placeholder={placeholder}
          value={value}
          {...props}
        />
        {badge ? <Typography as="span" variant="body" size="medium" weight="regular" className="shrink-0 text-sm font-normal leading-5 text-[#a6a6a6]">{badge}</Typography> : null}
        {hasValue && onClear ? (
          <button
            aria-label="پاک کردن"
            className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[#a6a6a6] transition hover:bg-[#f5f5f5] active:bg-[#e5e5e5]"
            onClick={(event) => {
              event.preventDefault();
              onClear();
            }}
            type="button"
          >
            <LinearCancelCircle aria-hidden="true" className="h-5 w-5" />
          </button>
        ) : null}
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
