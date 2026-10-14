import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

export function NotificationActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      unstyled
      className="border-outline-var bg-surface-container-lowest text-on-surface focus-visible:outline-primary/40 active:bg-surface-container flex items-center gap-1 rounded-lg border px-4 py-1.5 !text-xs leading-4 !font-medium focus-visible:outline-3 focus-visible:outline-offset-2"
      onClick={onClick}
      type="button"
    >
      <Typography as="span" variant="body" size="medium" weight="regular">
        {label}
      </Typography>
      <ChevronLeftIcon className="h-4 w-4" />
    </Button>
  );
}
