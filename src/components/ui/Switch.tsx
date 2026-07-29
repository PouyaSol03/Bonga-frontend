import type { ButtonHTMLAttributes } from "react";

import { cn, focusRing } from "../../design-system/classes";

type SwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Switch({
  checked,
  className = "",
  disabled = false,
  onChange,
  type = "button",
  ...props
}: SwitchProps) {
  return (
    <button
      aria-checked={checked}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full transition [direction:ltr]",
        checked ? "bg-[#0048c4]" : "bg-[#d1d1d1]",
        focusRing,
        "disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      role="switch"
      type={type}
      {...props}
    >
      <span
        className={cn(
          "absolute top-1 h-4 w-4 rounded-full transition-transform",
          checked ? "left-1 translate-x-5 bg-white" : "left-1 translate-x-0 bg-[#808080]",
        )}
      />
    </button>
  );
}
