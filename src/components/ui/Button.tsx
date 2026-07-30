import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

import { cn, disabledClasses, focusRing } from "../../design-system/classes";
import { Typography } from "./Typography";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "text" | "danger" | "neutral";
type LegacyButtonSize = "sm" | "md" | "lg";
export type ButtonSize = "small" | "x-medium" | "medium";
export type ButtonRadius = "small" | "medium" | "x-medium";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  bgColor?: CSSProperties["backgroundColor"];
  color?: CSSProperties["color"];
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  loading?: boolean;
  radius?: ButtonRadius;
  size?: ButtonSize | LegacyButtonSize;
  trailingIcon?: ReactNode;
  unstyled?: boolean;
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

const legacySizeClasses: Record<LegacyButtonSize, string> = {
  lg: "h-14 gap-2 rounded-[12px] px-5 text-base font-medium leading-6",
  md: "h-12 gap-2 rounded-[10px] px-4 text-base font-medium leading-6",
  sm: "h-9 gap-2 rounded-lg px-3 text-sm font-medium leading-5",
};

const sizeClasses: Record<ButtonSize, string> = {
  medium: "gap-2 p-4",
  "x-medium": "gap-2 px-4 py-2.5",
  small: "gap-1 px-4 py-2.5",
};

const radiusClasses: Record<ButtonRadius, string> = {
  "x-medium": "rounded-[12px]",
  medium: "rounded-[10px]",
  small: "rounded-[8px]",
};

const isLegacySize = (size: ButtonProps["size"]): size is LegacyButtonSize =>
  size === "sm" || size === "md" || size === "lg";

const isTextContent = (children: ReactNode) =>
  typeof children === "string" || typeof children === "number";

export function Button({
  bgColor,
  children,
  className = "",
  color,
  disabled,
  fullWidth = false,
  leadingIcon,
  loading = false,
  radius,
  size,
  style,
  trailingIcon,
  type,
  unstyled = false,
  variant,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const usesLegacyApi =
    !unstyled &&
    bgColor === undefined &&
    color === undefined &&
    radius === undefined &&
    (isLegacySize(size) ||
      variant !== undefined ||
      fullWidth ||
      leadingIcon !== undefined ||
      trailingIcon !== undefined ||
      loading);

  if (unstyled) {
    return (
      <button
        className={className}
        disabled={isDisabled}
        style={style}
        type={type ?? "button"}
        {...props}
      >
        {children}
      </button>
    );
  }

  const content = isTextContent(children) ? (
    <Typography
      as="span"
      variant="body"
      size="medium"
      weight="regular"
      className="min-w-0 truncate"
    >
      {children}
    </Typography>
  ) : (
    children
  );

  if (usesLegacyApi) {
    const legacySize = isLegacySize(size) ? size : "md";
    const legacyVariant = variant ?? "primary";

    return (
      <button
        className={cn(
          "inline-flex shrink-0 items-center justify-center whitespace-nowrap [direction:rtl]",
          legacySizeClasses[legacySize],
          variantClasses[legacyVariant],
          focusRing,
          disabledClasses,
          fullWidth && "w-full",
          className,
        )}
        disabled={isDisabled}
        style={style}
        type={type ?? "button"}
        {...props}
      >
        {loading ? (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        ) : (
          leadingIcon
        )}
        {content}
        {trailingIcon}
      </button>
    );
  }

  const buttonSize = isLegacySize(size) || size === undefined ? "medium" : size;
  const buttonRadius = radius ?? "medium";

  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap border border-transparent text-base font-medium leading-6 [direction:rtl]",
        sizeClasses[buttonSize],
        radiusClasses[buttonRadius],
        focusRing,
        disabledClasses,
        fullWidth && "w-full",
        className,
      )}
      disabled={isDisabled}
      style={{
        backgroundColor: bgColor ?? "#0048c4",
        color: color ?? "#ffffff",
        ...style,
      }}
      type={type ?? "button"}
      {...props}
    >
      {loading ? (
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        leadingIcon
      )}
      {content}
      {trailingIcon}
    </button>
  );
}
