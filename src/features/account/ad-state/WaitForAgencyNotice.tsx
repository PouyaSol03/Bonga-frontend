import { readText } from "../../../shared/lib/textUtils";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";
import { getAgencyAssignmentStartDate, readAgencyDeadlineRemaining } from "./deadlineModel";
import { ClockIcon } from "./StateIcons";

export function WaitForAgencyNotice({
  ad,
  onCancelAssignment,
}: {
  ad?: Record<string, unknown>;
  onCancelAssignment: () => void;
}) {
  const agencyName =
    readText(
      ad?.assigned_agency_name ??
        ad?.agency_name ??
        (ad?.agency && typeof ad.agency === "object"
          ? (ad.agency as Record<string, unknown>).name
          : undefined),
    ) || "آژانس املاک";
  const agencyStartDate = getAgencyAssignmentStartDate(ad);
  const deadlineRemaining = readAgencyDeadlineRemaining(agencyStartDate);

  return (
    <div className="border-warning bg-warning-container/30 mt-4 rounded-2xl border p-4 text-right">
      <div className="text-warning flex items-center gap-2">
        <ClockIcon className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="medium"
          className="m-0 text-sm leading-5 font-medium"
        >
          در انتظار بررسی و تایید {agencyName}
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 text-xs leading-5"
      >
        آگهی شما با موفقیت برای این آژانس ارسال شده است. مهلت بررسی آژانس حداکثر ۲۴ ساعت است. در
        صورت تمایل می‌توانید پیش از تایید آژانس، با آژانس ارتباط بگیرید یا واگذاری را لغو کنید.
      </Typography>

      <div className="border-outline-var text-outline mt-3 flex items-center justify-between border-t border-dashed pt-3 text-xs [direction:ltr]">
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="medium"
          className="text-on-surface [direction:rtl]"
        >
          {deadlineRemaining}
        </Typography>
        <span className="[direction:rtl]">مهلت باقی‌مانده تایید آژانس:</span>
      </div>

      <Button
        unstyled
        className="border-error text-error active:bg-error-container mt-3 inline-flex h-9 w-full items-center justify-center rounded-lg border bg-transparent text-xs font-medium"
        onClick={onCancelAssignment}
        type="button"
      >
        لغو واگذاری به آژانس
      </Button>
    </div>
  );
}
