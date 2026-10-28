import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { type AdvertisementArchiveStatusResponse } from "../../advertisements/api/agency-advertise-assignment.service";
import "../../advertisements/components/AdCard.css";
import { formatExpireDuration } from "../components/AgencyAssignedUserAdView";
import { readDeadlineRemaining } from "./deadlineModel";
import { ClockIcon } from "./StateIcons";

export function ArchivedNotice({
  ad,
  archiveData,
  isPending,
  onRestore,
}: {
  ad?: Record<string, unknown>;
  archiveData?: AdvertisementArchiveStatusResponse;
  isPending: boolean;
  onRestore: () => void;
}) {
  const fallbackRemaining = readDeadlineRemaining(
    ad?.delete_reason && typeof ad.delete_reason === "object"
      ? (ad.delete_reason as Record<string, unknown>).archive_deadline
      : undefined,
    30,
    ad?.updated_at ?? ad?.updatedAt,
  );
  const archiveRemaining =
    archiveData?.expire || archiveData?.expires_at || archiveData?.reason
      ? formatExpireDuration(
          archiveData.expire,
          archiveData.expires_at,
          archiveData.reason || fallbackRemaining,
        )
      : fallbackRemaining;

  return (
    <div className="border-outline-var bg-surface mt-4 rounded-2xl border p-4 text-right">
      <div className="text-outline flex items-center gap-2">
        <ClockIcon className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="medium"
          className="text-on-surface m-0 text-sm leading-5 font-medium"
        >
          آگهی بایگانی شده
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 text-xs leading-5"
      >
        مهلت انتشار مجدد این آگهی به پایان رسیده و آگهی به بایگانی منتقل شده است. تا ۱ ماه می‌توانید
        آگهی را بازیابی کنید. پس از آن برای همیشه حذف خواهد شد.
      </Typography>

      <div className="border-outline-var text-outline mt-3 flex items-center justify-between border-t border-dashed pt-3 text-xs [direction:ltr]">
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="medium"
          className="text-on-surface [direction:rtl]"
        >
          {archiveRemaining}
        </Typography>
        <span className="[direction:rtl]">مهلت بازیابی از بایگانی:</span>
      </div>

      <Button
        unstyled
        className="border-primary bg-surface-container-lowest text-primary active:bg-primary-container mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg border text-xs font-medium disabled:opacity-50"
        disabled={isPending}
        onClick={onRestore}
        type="button"
      >
        {isPending ? "در حال بازیابی..." : "بازیابی و بازگشت به آگهی‌های در انتظار"}
      </Button>
    </div>
  );
}
