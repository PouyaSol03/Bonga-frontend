import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn, focusRing } from "../../design-system/classes";
import LinearArrowDown1 from "../icons/LinearArrowDown1";
import { Typography } from "./Typography";
import { Button } from "./Button";

type SelectFieldProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  error?: string;
  label?: string;
  placeholder: string;
  supportingText?: string;
  value?: string;
  leadingSlot?: ReactNode;
};

export function SelectField({
  className = "",
  error,
  label,
  leadingSlot,
  placeholder,
  supportingText,
  value,
  type = "button",
  ...props
}: SelectFieldProps) {
  const hasValue = Boolean(value);
  const helperText = error || supportingText;

  return (
    <div>
      {label ? <Typography as="p" variant="body" size="large" weight="medium" className="m-0 mb-2 text-right text-base font-medium leading-6 text-on-surface">{label}</Typography> : null}
      <Button unstyled
        aria-invalid={Boolean(error)}
        className={cn(
          "relative flex h-14 w-full items-center justify-between gap-3 rounded-[12px] border bg-surface-container-lowest px-4 text-base font-normal leading-6 transition [direction:ltr]",
          error ? "border-error" : "border-outline-var",
          focusRing,
          className,
        )}
        type={type}
        {...props}
      >
        {hasValue ? (
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className={cn(
              "pointer-events-none absolute -top-[10px] right-4 max-w-[calc(100%-4rem)] truncate bg-surface-container-lowest px-1 text-right [direction:rtl]",
              error ? "text-error" : "text-outline",
            )}
          >
            {placeholder}
          </Typography>
        ) : null}
        {leadingSlot ?? <LinearArrowDown1 aria-hidden="true" className="h-5 w-5 text-on-surface-var" />}
        <Typography as="span" variant="body" size="medium" weight="regular" className={cn("min-w-0 flex-1 truncate text-right [direction:rtl]", hasValue ? "text-on-surface" : "text-outline")}>
          {value || placeholder}
        </Typography>
      </Button>
      {helperText ? (
        <Typography as="span" variant="body" size="small" weight="regular" className={cn("mt-1 block px-4 text-right text-xs font-normal leading-5", error ? "text-error" : "text-outline")}>
          {helperText}
        </Typography>
      ) : null}
    </div>
  );
}
