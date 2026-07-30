import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn, focusRing } from "../../design-system/classes";
import { Button } from "./Button";

type IconButtonVariant = "standard" | "filled" | "outlined" | "tonal";
type IconButtonSize = "dense" | "default";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  "aria-label": string;
  children: ReactNode;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
};

const variantClasses: Record<IconButtonVariant, string> = {
  filled: "bg-[#0048c4] text-white hover:bg-[#003eb7] active:bg-[#0033ac]",
  outlined: "border border-[#cccccc] bg-white text-[#4d4d4d] hover:bg-[#f5f5f5] active:bg-[#e5e5e5]",
  standard: "bg-transparent text-[#4d4d4d] hover:bg-[#f5f5f5] active:bg-[#e5e5e5]",
  tonal: "bg-[#edf0fb] text-[#0048c4] hover:bg-[#d7ddf8] active:bg-[#b1bdf0]",
};

export function IconButton({
  children,
  className = "",
  size = "default",
  type = "button",
  variant = "standard",
  ...props
}: IconButtonProps) {
  return (
    <Button unstyled
      className={cn(
        "grid shrink-0 place-items-center disabled:cursor-not-allowed disabled:opacity-50",
        size === "dense" ? "h-10 w-10 rounded-xl" : "h-12 w-12 rounded-[12px]",
        variantClasses[variant],
        focusRing,
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </Button>
  );
}
