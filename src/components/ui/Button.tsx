import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn, disabledClasses, focusRing } from "../../design-system/classes";

type ButtonVariant = "primary" | "secondary" | "ghost" | "text" | "danger" | "neutral";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  loading?: boolean;
  size?: ButtonSize;
  trailingIcon?: ReactNode;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  danger: "border border-[#ee3623] bg-[#ee3623] text-white hover:bg-[#dd2b1e] active:bg-[#c11004]",
  ghost: "border border-transparent bg-transparent text-[#0048c4] hover:bg-[#0048c40f] active:bg-[#0048c41f]",
  neutral: "border border-[#cccccc] bg-white text-[#4d4d4d] hover:bg-[#f5f5f5] active:bg-[#e5e5e5]",
  primary: "border border-[#0048c4] bg-[#0048c4] text-white hover:bg-[#003eb7] active:bg-[#0033ac]",
  secondary: "border border-[#0048c4] bg-white text-[#0048c4] hover:bg-[#f8f9fd] active:bg-[#edf0fb]",
  text: "border border-transparent bg-transparent text-[#0048c4] hover:bg-transparent active:bg-[#0048c40f]",
};

const sizeClasses: Record<ButtonSize, string> = {
  lg: "h-14 rounded-[12px] px-5 text-base font-medium leading-6",
  md: "h-12 rounded-[10px] px-4 text-base font-medium leading-6",
  sm: "h-9 rounded-lg px-3 text-sm font-medium leading-5",
};

export function Button({
  children,
  className = "",
  disabled,
  fullWidth = false,
  leadingIcon,
  loading = false,
  size = "md",
  trailingIcon,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap [direction:rtl]",
        sizeClasses[size],
        variantClasses[variant],
        focusRing,
        disabledClasses,
        fullWidth && "w-full",
        className,
      )}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> : leadingIcon}
      {children ? <span className="min-w-0 truncate">{children}</span> : null}
      {trailingIcon}
    </button>
  );
}
