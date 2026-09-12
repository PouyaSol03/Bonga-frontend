import type { ButtonHTMLAttributes, ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn, focusRing } from "../../design-system/classes";
import LinearCancelSmall from "../icons/LinearCancelSmall";
import { Typography } from "./Typography";
import { Button } from "./Button";

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  removable?: boolean;
  removeIcon?: ReactNode;
  selected?: boolean;
  showCheck?: boolean;
};

function SelectedCheckIcon({ shouldReduceMotion = false }: { shouldReduceMotion?: boolean | null }) {
  return (
    <svg aria-hidden="true" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 20 20">
      <motion.path
        animate={{ pathLength: 1 }}
        d="M4.5 10.2l3.4 3.4 7.6-8"
        initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
        transition={{ delay: 0.05, duration: 0.22, ease: "easeOut" }}
      />
    </svg>
  );
}

export function Chip({
  children,
  className = "",
  icon,
  removable = false,
  removeIcon,
  selected = false,
  showCheck = false,
  type = "button",
  ...props
}: ChipProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <Button unstyled
      aria-pressed={selected}
      className={cn(
        "inline-flex shrink-0 items-center justify-center min-w-9 rounded-[10px] border p-2 text-sm font-medium leading-5 cursor-pointer will-change-transform active:scale-[0.97] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:duration-100 [direction:rtl]",
        selected ? "border-primary bg-primary-container text-primary" : "border-outline-var bg-surface-container-lowest text-on-surface hover:border-outline hover:bg-surface-container-low",
        focusRing,
        "disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100 disabled:border-outline-var/50 disabled:bg-surface-container disabled:text-outline",
        className,
      )}
      type={type}
      {...props}
    >
      <AnimatePresence initial={false}>
        {selected && showCheck && !removable && !icon && (
          <motion.span
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { marginInlineEnd: 4, opacity: 1, scale: 1, width: 20 }
            }
            className="inline-flex items-center justify-center overflow-hidden shrink-0"
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { marginInlineEnd: 0, opacity: 0, scale: 0.6, width: 0 }
            }
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { marginInlineEnd: 0, opacity: 0, scale: 0.6, width: 0 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.1 }
                : {
                    marginInlineEnd: { duration: 0.25, ease: [0.25, 1, 0.5, 1] },
                    opacity: { duration: 0.18 },
                    scale: { duration: 0.22, ease: "backOut" },
                    width: { duration: 0.25, ease: [0.25, 1, 0.5, 1] },
                  }
            }
          >
            <SelectedCheckIcon shouldReduceMotion={shouldReduceMotion} />
          </motion.span>
        )}
      </AnimatePresence>
      <Typography as="span" variant="label" size="medium" weight="medium" className="min-w-0 truncate">{children}</Typography>
      {removable && selected
        ? removeIcon ?? <LinearCancelSmall aria-hidden="true" className="h-5 w-5" />
        : null}
      {icon}
    </Button>
  );
}
