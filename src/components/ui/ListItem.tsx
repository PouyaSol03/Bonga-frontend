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
  return (
    <Button unstyled
      className={cn(
        "relative flex min-h-12 w-full items-center gap-3 bg-white px-4 text-right transition",
        align === "center" && "justify-center text-center",
        selected ? "text-[#0048c4]" : "text-[#1a1a1a]",
        "hover:bg-[#f8f9fd] active:bg-[#edf0fb]",
        focusRing,
        className,
      )}
      type={type}
      {...props}
    >
      {leading ? <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-6 w-6 shrink-0 place-items-center text-[#4d4d4d]">{leading}</Typography> : null}
      <Typography as="span" variant="body" size="medium" weight="regular" className={cn("min-w-0 py-3 [direction:rtl]", align === "center" ? "flex-none text-center" : "flex-1")}>
        <Typography as="span" variant="body" size="large" weight="regular" className="text-[#1a1a1a]">{title}</Typography>
        {description ? (
          <Typography as="span" variant="body" size="medium" weight="regular" className="mt-0.5 block truncate text-sm font-normal leading-5 text-[#808080]">
            {description}
          </Typography>
        ) : null}
      </Typography>
      {trailing ? <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-6 w-6 shrink-0 place-items-center text-[#4d4d4d]">{trailing}</Typography> : null}
    </Button>
  );
}
