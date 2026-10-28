import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";

export function PublicPreviewLoadingState() {
  return (
    <div className="animate-pulse space-y-2">
      <section className="bg-surface-container-lowest px-4 pt-5 pb-5 text-center">
        <div className="bg-surface-container-high mx-auto h-20 w-20 rounded-full" />
        <div className="bg-surface-container-high mx-auto mt-4 h-7 w-40 rounded-lg" />
        <div className="bg-surface-container mx-auto mt-3 h-6 w-28 rounded-full" />
        <div className="mt-6 grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="bg-surface-container h-12 rounded-lg" key={index} />
          ))}
        </div>
      </section>
      <div className="bg-surface-container-lowest h-14" />
      <div className="bg-surface-container-lowest h-48" />
    </div>
  );
}

export function PublicPreviewErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto flex min-h-[420px] w-full flex-col items-center justify-center px-6 text-center">
      <div className="bg-error-container/20 text-error grid h-14 w-14 place-items-center rounded-full text-2xl">
        !
      </div>
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0 mt-4 text-base font-bold"
      >
        دریافت اطلاعات ناموفق بود
      </Typography>
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-outline m-0 mt-2 max-w-sm text-sm leading-6"
      >
        {message}
      </Typography>
      <Button
        unstyled
        className="bg-primary text-on-primary mt-5 h-10 rounded-xl px-6 text-sm font-semibold"
        onClick={onRetry}
        type="button"
      >
        تلاش دوباره
      </Button>
    </div>
  );
}
