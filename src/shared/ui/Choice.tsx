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
  checked = false,
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
          "grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] select-none active:scale-[0.94]",
          disabled
            ? "border-[#cccccc] bg-white"
            : checked
              ? "border-[#0048c4] bg-[#0048c4] shadow-[0_0_0_2px_rgba(0,72,196,0.15)]"
              : "border-[#808080] bg-white hover:border-[#0048c4]/70",
          className,
        )}
        {...props}
      >
        {checked && !disabled ? (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="h-2 w-2 rounded-full bg-white animate-radio-pop transform"
          />
        ) : null}
      </Typography>
    );
  }

  return (
    <Typography as="span" variant="body" size="medium" weight="regular"
      aria-hidden="true"
      className={cn(
        "grid h-4.5 w-4.5 shrink-0 place-items-center rounded-[4px] border-[1.5px] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] select-none active:scale-[0.92]",
        disabled
          ? checked
            ? "border-[#b8b8b8] bg-[#b8b8b8] text-white"
            : "border-[#b8b8b8] bg-white text-transparent"
          : checked
            ? "border-[#0048c4] bg-[#0048c4] text-white shadow-[0_0_0_2px_rgba(0,72,196,0.15)]"
            : "border-[#808080] bg-white text-transparent hover:border-[#0048c4]/70",
        className,
      )}
      {...props}
    >
      {checked ? (
        <span className="flex items-center justify-center animate-check-pop transform">
          <LinearTick aria-hidden="true" className="h-3.5 w-3.5" />
        </span>
      ) : null}
    </Typography>
  );
}
