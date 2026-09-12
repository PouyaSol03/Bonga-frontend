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
  filled: "bg-primary text-on-primary hover:opacity-90 active:opacity-80",
  outlined: "border border-outline-var bg-surface-container-lowest text-on-surface-var hover:bg-surface-container active:bg-surface-container-high",
  standard: "bg-transparent text-on-surface-var hover:bg-surface-container active:bg-surface-container-high",
  tonal: "bg-primary-container text-primary hover:bg-primary-container/80 active:bg-primary-container/60",
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
        "grid shrink-0 place-items-center select-none cursor-pointer will-change-transform active:scale-[0.94] transition-[transform,background-color,border-color,color,box-shadow,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:duration-100 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100",
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
