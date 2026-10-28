import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";
import { ClockIcon } from "./StateIcons";

export function WaitForStopNotice({
  isPending,
  onCancelStop,
}: {
  isPending: boolean;
  onCancelStop: () => void;
}) {
  return (
    <div className="border-warning bg-warning-container mt-4 rounded-2xl border p-4 text-right">
      <div className="text-warning flex items-center gap-2">
        <ClockIcon className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="medium"
          className="m-0 text-sm leading-5 font-medium"
        >
          در انتظار تایید توقف انتشار
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface m-0 mt-2 text-xs leading-5"
      >
        درخواست توقف انتشار این آگهی برای آژانس ارسال شده و آگهی پس از بررسی آژانس از حالت انتشار
        خارج خواهد شد.
      </Typography>

      <Button
        unstyled
        className="border-outline-var bg-surface text-on-surface active:bg-surface-container mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg border text-xs font-medium disabled:opacity-50"
        disabled={isPending}
        onClick={onCancelStop}
        type="button"
      >
        {isPending ? "در حال انصراف..." : "انصراف از درخواست توقف"}
      </Button>
    </div>
  );
}
