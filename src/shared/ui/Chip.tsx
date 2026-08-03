import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn, focusRing } from "../../design-system/classes";
import LinearCancelSmall from "../icons/LinearCancelSmall";
import { Typography } from "./Typography";
import { Button } from "./Button";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  removable?: boolean;
  removeIcon?: ReactNode;
  selected?: boolean;
};

export function Chip({
  children,
  className = "",
  icon,
  removable = false,
  removeIcon,
  selected = false,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <Button unstyled
      aria-pressed={selected}
      className={cn(
        "inline-flex shrink-0 items-center justify-center min-w-9 gap-1.5 rounded-lg border p-2 text-sm font-medium leading-5 transition [direction:rtl]",
        selected ? "border-[#0048c4] bg-[#0048c41f] text-[#0048c4]" : "border-[#cccccc] bg-white text-[#4d4d4d]",
        focusRing,
        "disabled:cursor-not-allowed disabled:border-[#e5e5e5] disabled:bg-[#f2f2f2] disabled:text-[#b3b3b3]",
        className,
      )}
      type={type}
      {...props}
    >
      <Typography as="span" variant="label" size="medium" weight="medium" className="min-w-0 truncate">{children}</Typography>
      {removable && selected
        ? removeIcon ?? <LinearCancelSmall aria-hidden="true" className="h-5 w-5" />
        : null}
      {icon}
    </Button>
  );
}
