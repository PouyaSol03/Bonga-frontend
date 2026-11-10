import { TopBar } from "../../../../shared/components/TopBar";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
export function CheckoutStatusPage({
  backTo,
  isLoading = false,
  message,
  onRetry,
  title,
}: {
  backTo: string;
  isLoading?: boolean;
  message: string;
  onRetry?: () => void;
  title: string;
}) {
  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo={backTo} title={title} />
      <main className="mx-auto flex min-h-0 w-full flex-1 flex-col items-center justify-center px-6 text-center">
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="medium"
          className="text-on-surface-var m-0 text-sm leading-6 font-medium"
        >
          {message}
        </Typography>
        {onRetry ? (
          <Button
            unstyled
            className="bg-primary text-on-primary mt-4 h-10 rounded-lg px-5 text-sm font-medium"
            onClick={onRetry}
            type="button"
          >
            تلاش دوباره
          </Button>
        ) : isLoading ? (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="border-primary-container border-t-primary mt-4 h-8 w-8 animate-spin rounded-full border-2"
          />
        ) : null}
      </main>
    </PageFrame>
  );
}
