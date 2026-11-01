import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";
import { ClockIcon } from "./StateIcons";

export function PendingReviewNotice() {
  return (
    <div className="border-warning bg-warning-container mt-4 rounded-lg border px-4 py-3 text-right">
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface m-0 text-sm leading-7 font-normal"
      >
        این آگهی در صف بررسی سامانه قرار دارد.
      </Typography>
      <Typography as="p" variant="body" size="medium" weight="regular">
        پس از تایید، آگهی به صورت خودکار منتشر می‌شود.
      </Typography>

      <div className="border-outline-var mt-3 border-t border-dashed pt-3">
        <div className="flex h-6 items-center justify-between gap-4 text-xs leading-4 font-normal [direction:ltr]">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface [direction:rtl]"
          >
            بین 1 تا 6 ساعت
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="text-on-surface-var inline-flex items-center gap-2 [direction:rtl]"
          >
            <ClockIcon className="h-5 w-5" />
            زمان تقریبی بررسی:
          </Typography>
        </div>
      </div>
    </div>
  );
}
