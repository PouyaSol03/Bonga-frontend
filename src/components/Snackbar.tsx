export type SnackbarVariant = "error" | "success" | "info";

type SnackbarProps = {
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
    background: "bg-[#fff7f0]",
    border: "border-[#ff6d00]",
    text: "text-[#ff6d00]",
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
};

export function Snackbar({
  className = "top-[72px]",
  message,
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
        <button
          aria-label="بستن پیام"
          className={`mt-1 grid h-12 w-12 shrink-0 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-current ${styles.text}`}
          onClick={onDismiss}
          type="button"
        >
          <CloseIcon />
        </button>

        <div className={`min-w-0 flex-1 px-3 py-3 text-right [direction:rtl] ${styles.text}`}>
          <p className="m-0 text-sm font-semibold leading-5">{title}</p>
          <p className="m-0 mt-1 text-sm font-normal leading-5">{message}</p>
        </div>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M9 9l6 6m0-6-6 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}
