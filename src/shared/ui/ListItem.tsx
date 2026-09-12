import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn, focusRing } from "../../design-system/classes";
import { Typography } from "./Typography";
import { Button } from "./Button";

type ListItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  align?: "right" | "center";
  description?: ReactNode;
  leading?: ReactNode;
  selected?: boolean;
  title: ReactNode;
  trailing?: ReactNode;
};

export function ListItem({
  align = "right",
  className = "",
  description,
  leading,
  selected = false,
  title,
  trailing,
  type = "button",
  ...props
}: ListItemProps) {
  const isCenter = align === "center";

  return (
    <Button
      unstyled
      className={cn(
        "relative flex w-full items-center gap-2 bg-surface-container-lowest px-4 py-4 first:pt-4 last:pb-0 text-right transition [direction:rtl]",
        // description ? "min-h-[72px]" : "min-h-[72px]",
        isCenter && "justify-center text-center",
        selected ? "text-primary" : "text-on-surface",
        "hover:bg-surface-container active:bg-surface-container-high",
        focusRing,
        className,
      )}
      type={type}
      {...props}
    >
      {leading ? (
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="grid h-6 w-6 shrink-0 place-items-center text-on-surface-var"
        >
          {leading}
        </Typography>
      ) : null}

      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={cn(
          "min-w-0 [direction:rtl]",
          isCenter ? "flex-none text-center" : "flex-1 text-right",
        )}
      >
        <Typography
          as="span"
          variant="body"
          size="large"
          weight="regular"
          className={cn(
            "block pt-1.5",
            selected ? "text-primary" : "text-on-surface",
            isCenter ? "text-center" : "text-right",
          )}
        >
          {title}
        </Typography>

        {description ? (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className={cn(
              "mt-0 block pb-1.5 truncate text-outline",
              isCenter ? "text-center" : "text-right",
            )}
          >
            {description}
          </Typography>
        ) : null}
      </Typography>

      {trailing ? (
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="grid h-6 w-6 shrink-0 place-items-center text-on-surface-var"
        >
          {trailing}
        </Typography>
      ) : null}
    </Button>
  );
}
