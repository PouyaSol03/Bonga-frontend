import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

import LinearCancelSmall from "../icons/LinearCancelSmall";
import { Button } from "../ui/Button";
import { Typography } from "../ui/Typography";

export type ToastVariant = "error" | "success" | "info" | "warning";

export type ToastItem = {
  message: string;
  title?: string;
  variant?: ToastVariant;
};

type ToastProps = {
  onDismiss: () => void;
  toast: ToastItem | null;
};

const toastStyles: Record<
  ToastVariant,
  { background: string; border: string; text: string }
> = {
  success: {
    background: "bg-tertiary-container/40",
    border: "border-tertiary",
    text: "text-tertiary",
  },
  error: {
    background: "bg-error-container/40",
    border: "border-error",
    text: "text-error",
  },
  info: {
    background: "bg-primary-container/40",
    border: "border-primary",
    text: "text-primary",
  },
  warning: {
    background: "bg-warning-container/40",
    border: "border-warning",
    text: "text-warning",
  },
};

export function Toast({ onDismiss, toast }: ToastProps) {
  if (typeof document === "undefined") return null;

  const variant = toast?.variant ?? "success";
  const styles = toastStyles[variant];

  return createPortal(
    <AnimatePresence>
      {toast ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          aria-live={variant === "error" ? "assertive" : "polite"}
          className="pointer-events-none fixed inset-x-0 top-4 z-[200] flex justify-center px-4"
          exit={{ opacity: 0, y: -24 }}
          initial={{ opacity: 0, y: -36 }}
          key={`${variant}:${toast.title ?? ""}:${toast.message}`}
          role={variant === "error" ? "alert" : "status"}
          transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <div
            className={`pointer-events-auto flex min-h-[69px] w-[329px] max-w-[calc(100vw-32px)] items-center rounded-[8px] border ${styles.background} ${styles.border}`}
            dir="rtl"
          >
            <div className="min-w-0 flex-1 py-[10px] pr-[13px] text-right">
              {toast.title ? (
                <Typography
                  as="p"
                  variant="title"
                  size="medium"
                  weight="medium"
                  className={`m-0 truncate text-[16px] leading-[22px] ${styles.text}`}
                >
                  {toast.title}
                </Typography>
              ) : null}

              <Typography
                as="p"
                variant="body"
                size="medium"
                weight="regular"
                className={`m-0 ${toast.title ? "mt-[2px]" : ""} text-[14px] leading-[21px] ${styles.text}`}
              >
                {toast.message}
              </Typography>
            </div>

            <Button
              unstyled
              aria-label="بستن پیام"
              className={`grid h-full min-h-[67px] w-[49px] shrink-0 place-items-center ${styles.text} focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-current`}
              onClick={onDismiss}
              type="button"
            >
              <LinearCancelSmall aria-hidden="true" className="h-6 w-6" />
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
