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
      {label ? (
        <Typography
          as="p"
          variant="body"
          size="large"
          weight="medium"
          className="text-on-surface m-0 mb-2 text-right text-base leading-6 font-medium"
        >
          {label}
        </Typography>
      ) : null}
      <Button
        unstyled
        aria-invalid={Boolean(error)}
        className={cn(
          "bg-surface-container-lowest relative flex h-14 w-full items-center justify-between gap-3 rounded-[12px] border px-4 text-base leading-6 font-normal transition [direction:ltr]",
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
              "bg-surface-container-lowest pointer-events-none absolute -top-[10px] right-4 max-w-[calc(100%-4rem)] truncate px-1 text-right [direction:rtl]",
              error ? "text-error" : "text-outline",
            )}
          >
            {placeholder}
          </Typography>
        ) : null}
        {leadingSlot ?? (
          <LinearArrowDown1 aria-hidden="true" className="text-on-surface-var h-5 w-5" />
        )}
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className={cn(
            "min-w-0 flex-1 truncate text-right [direction:rtl]",
            hasValue ? "text-on-surface" : "text-outline",
          )}
        >
          {value || placeholder}
        </Typography>
      </Button>
      {helperText ? (
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="regular"
          className={cn(
            "mt-1 block px-4 text-right text-xs leading-5 font-normal",
            error ? "text-error" : "text-outline",
          )}
        >
          {helperText}
        </Typography>
      ) : null}
    </div>
  );
}
