import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

import { cn, focusRing } from "../../design-system/classes";
import { Typography, type TypographySize } from "./Typography";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "neutral"
  | "neutral-outline"
  | "neutral-text"
  | "text"
  | "danger";

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

/*
 * State values mirror the supplied Button component reference:
 * - filled hover: 16% white state layer
 * - filled focus/pressed: 8% white state layer
 * - outlined/ghost hover: 8% primary state layer
 * - outlined/ghost focus/pressed: 16% primary state layer
 * - disabled surface: 12% #1A1A1A with 30% disabled content
 */
const variantClasses: Record<ButtonVariant, string> = {
  danger:
    "border border-[#ee3623] bg-[#ee3623] text-white hover:bg-[#dd2b1e] focus:bg-[#c11004] active:bg-[#c11004] disabled:border-transparent disabled:bg-[#1a1a1a1f] disabled:text-[#4d4d4d]",
  ghost:
    "border border-transparent bg-transparent text-[#0048c4] hover:bg-[#0048c414] focus:bg-[#0048c429] active:bg-[#0048c429] disabled:border-transparent disabled:bg-transparent disabled:text-[#4d4d4d]",
  neutral:
    "border border-transparent bg-[#e9eaee] text-[#2e2d3e] hover:bg-[#ecedf1] focus:bg-[#ebecf0] active:bg-[#ebecf0] disabled:border-transparent disabled:bg-[#1a1a1a1f] disabled:text-[#4d4d4d]",
  "neutral-outline":
    "border border-[#cccccc] bg-transparent text-[#1a1a1a] hover:border-[#0048c4] hover:bg-[#0048c414] hover:text-[#0048c4] focus:border-[#0048c4] focus:bg-[#0048c429] focus:text-[#0048c4] active:border-[#0048c4] active:bg-[#0048c429] active:text-[#0048c4] disabled:border-[#1a1a1a1f] disabled:bg-transparent disabled:text-[#4d4d4d]",
  "neutral-text":
    "border border-transparent bg-transparent text-[#4d4d4d] hover:text-[#0048c4] focus:text-[#0048c4] active:text-[#0048c4] disabled:bg-transparent disabled:text-[#4d4d4d]",
  primary:
    "border border-[#0048c4] bg-[#0048c4] text-white hover:border-[#2865cd] hover:bg-[#2865cd] focus:border-[#1456c9] focus:bg-[#1456c9] active:border-[#1456c9] active:bg-[#1456c9] disabled:border-transparent disabled:bg-[#1a1a1a1f] disabled:text-[#4d4d4d]",
  secondary:
    "border border-[#0048c4] bg-transparent text-[#0048c4] hover:bg-[#0048c414] focus:bg-[#0048c429] active:bg-[#0048c429] disabled:border-[#1a1a1a1f] disabled:bg-transparent disabled:text-[#4d4d4d]",
  text:
    "border border-transparent bg-transparent text-[#0048c4] hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:bg-transparent disabled:text-[#4d4d4d]",
};

/* Keep the old sizing contract unchanged for existing screens. */
const legacySizeClasses: Record<LegacyButtonSize, string> = {
  lg: "h-14 gap-2 rounded-[12px] px-5 text-base font-medium leading-6",
  md: "h-12 gap-2 rounded-[10px] px-4 text-base font-medium leading-6",
  sm: "h-9 gap-2 rounded-lg px-3 text-sm font-medium leading-5",
};

/* Figma component sizes: 56 / 40 / 28. */
const sizeClasses: Record<ButtonSize, string> = {
  medium: "h-14 gap-2 px-4",
  "x-medium": "h-10 gap-2 px-4",
  small: "h-7 gap-1 px-4",
};

const contentTypographySize: Record<ButtonSize, TypographySize> = {
  medium: "large",
  "x-medium": "medium",
  small: "small",
};

const defaultRadiusBySize: Record<ButtonSize, ButtonRadius> = {
  medium: "x-medium",
  "x-medium": "medium",
  small: "small",
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

const interactionClasses =
  "select-none transition-[background-color,border-color,color,box-shadow] duration-150 ease-out disabled:cursor-not-allowed disabled:transition-none";

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
  const usesModernSize = size === "small" || size === "x-medium" || size === "medium";
  const usesLegacyApi =
    !unstyled &&
    !usesModernSize &&
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

  if (usesLegacyApi) {
    const legacySize = isLegacySize(size) ? size : "md";
    const legacyVariant = variant ?? "primary";
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

    return (
      <button
        className={cn(
          "inline-flex shrink-0 items-center justify-center whitespace-nowrap [direction:rtl]",
          interactionClasses,
          legacySizeClasses[legacySize],
          variantClasses[legacyVariant],
          focusRing,
          fullWidth && "w-full",
          className,
        )}
        disabled={isDisabled}
        style={style}
        type={type ?? "button"}
        {...props}
      >
        {loading ? (
          <span
            aria-hidden="true"
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
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
  const buttonRadius = radius ?? defaultRadiusBySize[buttonSize];
  const hasCustomColors = bgColor !== undefined || color !== undefined;
  const resolvedVariant = variant ?? "primary";
  const content = isTextContent(children) ? (
    <Typography
      as="span"
      variant="body"
      size={contentTypographySize[buttonSize]}
      weight="regular"
      className="min-w-0 truncate"
    >
      {children}
    </Typography>
  ) : (
    children
  );

  return (
    <button
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap [direction:rtl]",
        interactionClasses,
        sizeClasses[buttonSize],
        radiusClasses[buttonRadius],
        hasCustomColors
          ? "border border-transparent disabled:cursor-not-allowed disabled:opacity-30"
          : variantClasses[resolvedVariant],
        focusRing,
        fullWidth && "w-full",
        className,
      )}
      disabled={isDisabled}
      style={
        hasCustomColors
          ? {
              backgroundColor: bgColor ?? "#0048c4",
              color: color ?? "#ffffff",
              ...style,
            }
          : style
      }
      type={type ?? "button"}
      {...props}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      ) : (
        leadingIcon
      )}
      {content}
      {trailingIcon}
    </button>
  );
}
