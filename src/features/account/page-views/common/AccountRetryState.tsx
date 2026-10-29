import { RequestErrorState } from "../../../../shared/components/ErrorState";
import { Typography } from "../../../../shared/ui/Typography";

export function AccountRetryState({
  error,
  message,
  onRetry,
}: {
  error?: unknown;
  message: string;
  onRetry?: () => void;
}) {
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <>
      <div className="bg-surface-container-lowest fixed inset-0 z-[999]">
        <RequestErrorState error={error} className="h-full" onRetry={onRetry ?? reloadPage} />
      </div>
      <Typography as="p" variant="body" size="medium" weight="regular" className="sr-only">
        {message}
      </Typography>
    </>
  );
}
