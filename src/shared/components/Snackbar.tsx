import LinearCancelSmall from "../icons/LinearCancelSmall";
import { Typography } from "../ui/Typography";
import { Button } from "../ui/Button";

export type SnackbarVariant = "error" | "success" | "info" | "warning";

type SnackbarProps = {
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  message: string;
  onDismiss: () => void;
  title: string;
  variant?: SnackbarVariant;
};

const snackbarStyles: Record<
  SnackbarVariant,
  { background: string; border: string; text: string }
> = {
  error: {
    background: "bg-[#ffebed]",
    border: "border-[#ee3623]",
    text: "text-[#ee3623]",
  },
  info: {
    background: "bg-[#f3f7ff]",
    border: "border-[#0048c4]",
    text: "text-[#0048c4]",
  },
  success: {
    background: "bg-[#effaf5]",
    border: "border-[#11a366]",
    text: "text-[#11a366]",
  },
  warning: {
    background: "bg-[#fff8e1]",
    border: "border-[#ffb100]",
    text: "text-[#ff6d00]",
  },
};

export function Snackbar({
  actionLabel,
  className = "top-[72px]",
  message,
  onAction,
  onDismiss,
  title,
  variant = "error",
}: SnackbarProps) {
  const styles = snackbarStyles[variant];

  return (
    <div
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={`absolute inset-x-4 z-[80] ${className}`}
      role={variant === "error" ? "alert" : "status"}
    >
      <div
        className={`flex min-h-[84px] items-start overflow-hidden rounded-lg border [direction:ltr] ${styles.background} ${styles.border}`}
      >
        <Button unstyled
          aria-label="بستن پیام"
          className={`mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-current ${styles.text}`}
          onClick={onDismiss}
          type="button"
        >
          <LinearCancelSmall aria-hidden="true" className="h-6 w-6" />
        </Button>

        <div className={`min-w-0 flex-1 px-3 py-3 text-right [direction:rtl] ${styles.text}`}>
          <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm font-semibold leading-5">{title}</Typography>
          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-1 text-sm font-normal leading-5">{message}</Typography>
          {actionLabel && onAction ? (
            <Button unstyled
              className={`mt-3 h-9 rounded-[10px] border px-4 text-sm font-medium leading-5 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-current ${styles.border} ${styles.text}`}
              onClick={onAction}
              type="button"
            >
              {actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
