import { createElement, type ComponentPropsWithRef, type JSX, type ReactNode } from "react";

import { cn } from "../../design-system/classes";
import { typography } from "../../design-system/typography";

export type TypographyVariant = "display" | "headline" | "title" | "label" | "body";
export type TypographySize = "small" | "medium" | "large";
export type TypographyWeight = "regular" | "medium" | "semibold";
export type TypographyElement = Extract<keyof JSX.IntrinsicElements, string>;

type TypographyStyleProps =
  | { variant?: "body"; weight?: "regular" | "medium" }
  | { variant: "title" | "label"; weight?: "medium" | "semibold" }
  | { variant: "display" | "headline"; weight?: never };

type TypographyOwnProps<T extends TypographyElement> = {
  as?: T;
  children?: ReactNode;
  className?: string;
  size?: TypographySize;
} & TypographyStyleProps;

type TypographyReservedProp = "as" | "children" | "className" | "size" | "variant" | "weight";

export type TypographyProps<T extends TypographyElement = "p"> = TypographyOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, TypographyReservedProp>;

const sizeClasses: Record<TypographyVariant, Record<TypographySize, string>> = {
  body: {
    large: typography.bodyLg,
    medium: typography.bodyMd,
    small: typography.bodySm,
  },
  display: {
    large: typography.displayLg,
    medium: typography.displayMd,
    small: typography.displaySm,
  },
  headline: {
    large: typography.headlineLg,
    medium: typography.headlineMd,
    small: typography.headlineSm,
  },
  label: {
    large: typography.labelLg,
    medium: typography.labelMd,
    small: typography.labelSm,
  },
  title: {
    large: typography.titleLg,
    medium: typography.titleMd,
    small: typography.titleSm,
  },
};

const weightClasses: Record<TypographyWeight, string> = {
  medium: "font-medium",
  regular: "font-normal",
  semibold: "font-semibold",
};

const textSizePattern = /(?:^|\s)(?:[^\s:]+:)*(?:text-(?:xs|sm|base|lg|xl|[2-9]xl)|text-\[\s*-?\d+(?:\.\d+)?(?:px|rem)\s*\])(?=\s|$)/;
const lineHeightClassPattern = /^(?:[^\s:]+:)*!?leading-(?:none|tight|snug|normal|relaxed|loose|\d+|\[[^\]]+\])!?$/;
const fontWeightPattern = /(?:^|\s)(?:[^\s:]+:)*font-(?:thin|extralight|light|normal|medium|semibold|bold|extrabold|black|\[[^\]]+\])(?=\s|$)/;

function resolveWeight(variant: TypographyVariant, weight?: TypographyWeight): TypographyWeight {
  if (variant === "display" || variant === "headline") {
    return "regular";
  }

  if (variant === "title" || variant === "label") {
    return weight === "semibold" ? "semibold" : "medium";
  }

  return weight === "medium" ? "medium" : "regular";
}

function removeLineHeightClasses(className: string) {
  return className
    .split(/\s+/)
    .filter((token) => token && !lineHeightClassPattern.test(token))
    .join(" ");
}

function getTypographyClasses(
  className: string,
  variant: TypographyVariant,
  size: TypographySize,
  weight?: TypographyWeight,
) {
  const tokenClasses = sizeClasses[variant][size].split(" ");
  const textSizeClass = tokenClasses.find((token) => token.startsWith("text-"));
  const lineHeightClass = tokenClasses.find((token) => token.startsWith("leading-"));
  const resolvedWeight = resolveWeight(variant, weight);

  return cn(
    !textSizePattern.test(className) && textSizeClass,
    lineHeightClass,
    !fontWeightPattern.test(className) && weightClasses[resolvedWeight],
  );
}

export function Typography<T extends TypographyElement = "p">({
  as,
  children,
  className = "",
  size = "medium",
  variant = "body",
  weight,
  ...props
}: TypographyProps<T>) {
  const Component: TypographyElement = as ?? "p";
  const resolvedClassName = removeLineHeightClasses(className);
  const elementProps = {
    ...(props as Record<string, unknown>),
    className: cn(
      getTypographyClasses(resolvedClassName, variant, size, weight),
      resolvedClassName,
    ),
  };

  return createElement(
    Component,
    elementProps,
    children,
  );
}
