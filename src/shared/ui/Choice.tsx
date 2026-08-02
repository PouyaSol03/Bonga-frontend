import type { HTMLAttributes } from "react";

import { cn } from "../../design-system/classes";
import LinearTick from "../icons/LinearTick";
import { Typography } from "./Typography";

type ChoiceIndicatorProps = HTMLAttributes<HTMLSpanElement> & {
  checked: boolean;
  disabled?: boolean;
  type?: "checkbox" | "radio";
};

export function ChoiceIndicator({
  checked,
  className = "",
  disabled = false,
  type = "checkbox",
  ...props
}: ChoiceIndicatorProps) {
  if (type === "radio") {
    return (
      <Typography as="span" variant="body" size="medium" weight="regular"
        aria-hidden="true"
        className={cn(
          "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border",
          disabled
            ? "border-[#cccccc] bg-white"
            : checked
              ? "border-[#0048c4] bg-[#0048c4]"
              : "border-[#808080] bg-white",
          className,
        )}
        {...props}
      >
        {checked && !disabled ? <Typography as="span" variant="body" size="medium" weight="regular" className="h-2 w-2 rounded-full bg-white" /> : null}
      </Typography>
    );
  }

  return (
    <Typography as="span" variant="body" size="medium" weight="regular"
        aria-hidden="true"
        className={cn(
          "grid h-4.5 w-4.5 shrink-0 place-items-center rounded-sm border",
          disabled
            ? checked
              ? "border-[#b8b8b8] bg-[#b8b8b8] text-white"
              : "border-[#b8b8b8] bg-white text-transparent"
            : checked
              ? "border-[#0048c4] bg-[#0048c4] text-white"
              : "border-[#808080] bg-white text-transparent",
          className,
        )}
        {...props}
      >
      {checked ? <LinearTick aria-hidden="true" className="h-4 w-4" /> : null}
    </Typography>
  );
}
