import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn, focusRing } from "../../design-system/classes";
import LinearArrowDown1 from "../(icons)/LinearArrowDown1";
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
      {label ? <Typography as="p" variant="body" size="large" weight="medium" className="m-0 mb-2 text-right text-base font-medium leading-6 text-[#1a1a1a]">{label}</Typography> : null}
      <Button unstyled
        aria-invalid={Boolean(error)}
        className={cn(
          "relative flex h-14 w-full items-center justify-between gap-3 rounded-[12px] border bg-white px-4 text-base font-normal leading-6 transition [direction:ltr]",
          error ? "border-[#ee3623]" : "border-[#cccccc]",
          focusRing,
          className,
        )}
        type={type}
        {...props}
      >
        {leadingSlot ?? <LinearArrowDown1 aria-hidden="true" className="h-5 w-5 text-[#4d4d4d]" />}
        <Typography as="span" variant="body" size="medium" weight="regular" className={cn("min-w-0 flex-1 truncate text-right [direction:rtl]", hasValue ? "text-[#1a1a1a]" : "text-[#a6a6a6]")}>
          {value || placeholder}
        </Typography>
      </Button>
      {helperText ? (
        <Typography as="span" variant="body" size="small" weight="regular" className={cn("mt-1 block px-4 text-right text-xs font-normal leading-5", error ? "text-[#ee3623]" : "text-[#808080]")}>
          {helperText}
        </Typography>
      ) : null}
    </div>
  );
}
