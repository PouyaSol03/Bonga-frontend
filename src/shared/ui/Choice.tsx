import type { HTMLAttributes } from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "../../design-system/classes";
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
            ? "border-outline-var bg-surface-container"
            : checked
              ? "border-primary bg-primary shadow-[0_0_0_2px_rgba(0,72,196,0.15)]"
              : "border-outline bg-surface-container-lowest hover:border-primary/70",
          className,
        )}
        {...props}
      >
        <AnimatePresence initial={false}>
          {checked && !disabled && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2, ease: "backOut" }}
              className="h-2 w-2 rounded-full bg-on-primary"
            />
          )}
        </AnimatePresence>
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
            ? "border-outline/50 bg-outline/50 text-on-primary"
            : "border-outline/50 bg-surface-container text-transparent"
          : checked
            ? "border-primary bg-primary text-on-primary shadow-[0_0_0_2px_rgba(0,72,196,0.15)]"
            : "border-outline bg-surface-container-lowest text-transparent hover:border-primary/70",
        className,
      )}
      {...props}
    >
      <AnimatePresence initial={false}>
        {checked && (
          <motion.span
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.2, ease: "backOut" }}
            className="flex items-center justify-center text-on-primary"
          >
            <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 14 14">
              <motion.path
                d="M2.5 7.5L5.5 10.5L11.5 3.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.22, delay: 0.04, ease: "easeOut" }}
              />
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </Typography>
  );
}
