import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn, focusRing } from "../../design-system/classes";
import LinearCancelSmall from "../(icons)/LinearCancelSmall";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  removable?: boolean;
  selected?: boolean;
};

export function Chip({
  children,
  className = "",
  icon,
  removable = false,
  selected = false,
  type = "button",
  ...props
}: ChipProps) {
  return (
    <button
      aria-pressed={selected}
      className={cn(
        "inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 text-sm font-medium leading-5 transition [direction:rtl]",
        selected ? "border-[#0048c4] bg-[#0048c41f] text-[#0048c4]" : "border-[#cccccc] bg-white text-[#4d4d4d]",
        focusRing,
        "disabled:cursor-not-allowed disabled:border-[#e5e5e5] disabled:bg-[#f2f2f2] disabled:text-[#b3b3b3]",
        className,
      )}
      type={type}
      {...props}
    >
      {removable && selected ? <LinearCancelSmall aria-hidden="true" className="h-4 w-4" /> : null}
      <span className="min-w-0 truncate">{children}</span>
      {icon}
    </button>
  );
}
