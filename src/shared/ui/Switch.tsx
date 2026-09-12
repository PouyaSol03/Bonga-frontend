import type { ButtonHTMLAttributes } from "react";

import { cn, focusRing } from "../../design-system/classes";
import { Typography } from "./Typography";
import { Button } from "./Button";

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
    <Button unstyled
      aria-checked={checked}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] [direction:ltr] active:scale-[0.96]",
        checked ? "bg-primary shadow-[0_0_0_2px_rgba(0,72,196,0.14)]" : "bg-outline-var hover:bg-outline-var/80",
        focusRing,
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100",
        className,
      )}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      role="switch"
      type={type}
      {...props}
    >
      <Typography as="span" variant="body" size="medium" weight="regular"
        className={cn(
          "absolute top-1 h-4 w-4 rounded-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          checked ? "left-1 translate-x-5 bg-surface-container-lowest shadow-[0_1px_3px_rgba(0,0,0,0.2)]" : "left-1 translate-x-0 bg-surface-container-lowest shadow-[0_1px_2px_rgba(0,0,0,0.15)]",
        )}
      />
    </Button>
  );
}
