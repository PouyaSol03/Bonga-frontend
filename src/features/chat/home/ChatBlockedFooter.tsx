import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";

export function ChatBlockedFooter({
  blockedMe,
  isPending,
  onUnblock,
}: {
  blockedMe: boolean;
  isPending: boolean;
  onUnblock: () => void;
}) {
  return (
    <footer className="bg-surface-container-lowest shrink-0 px-4 pt-2 pb-4">
      <div className="bg-surface-container flex min-h-[52px] items-center justify-between gap-3 rounded-full p-1 [direction:ltr]">
        {blockedMe ? (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-outline min-w-0 flex-1 px-3 text-right text-sm leading-5 font-normal"
            dir="rtl"
          >
            این کاربر شما را مسدود کرده است
          </Typography>
        ) : (
          <>
            <Button
              unstyled
              className="bg-primary focus-visible:outline-primary/40 h-11 min-w-[132px] shrink-0 rounded-full px-4 text-sm leading-5 font-semibold text-white focus-visible:outline-3 focus-visible:outline-offset-2 disabled:cursor-wait disabled:opacity-60"
              disabled={isPending}
              onClick={onUnblock}
              type="button"
            >
              {isPending ? "در حال انجام..." : "رفع مسدودیت"}
            </Button>
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="text-outline min-w-0 flex-1 px-2 text-right text-sm leading-5 font-normal"
              dir="rtl"
            >
              این کاربر را مسدود کرده اید
            </Typography>
          </>
        )}
      </div>
    </footer>
  );
}
