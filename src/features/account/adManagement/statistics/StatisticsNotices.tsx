import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";

export function InlineNotice({ text }: { text: string }) {
  return (
    <div className="bg-surface-container-lowest text-outline px-4 py-3 text-center text-xs leading-5 font-medium">
      {text}
    </div>
  );
}

export function ErrorNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-warning-container/30 text-warning mx-4 my-3 rounded-lg px-3 py-2 text-center text-xs leading-5 font-medium">
      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0">
        دریافت آمار آگهی با خطا مواجه شد.
      </Typography>
      <Button
        unstyled
        className="text-primary mt-1 border-0 text-xs font-semibold"
        onClick={onRetry}
        type="button"
      >
        تلاش دوباره
      </Button>
    </div>
  );
}
