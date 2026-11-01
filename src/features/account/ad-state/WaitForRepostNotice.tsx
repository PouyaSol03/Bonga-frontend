import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { type AdvertisementReRegisterStatusResponse } from "../../advertisements/api/agency-advertise-assignment.service";
import "../../advertisements/components/AdCard.css";
import { formatExpireDuration } from "../components/AgencyAssignedUserAdView";
import { readDeadlineRemaining } from "./deadlineModel";
import { AlertIcon } from "./StateIcons";

export function WaitForRepostNotice({
  ad,
  reRegisterData,
  onRepost,
}: {
  ad?: Record<string, unknown>;
  reRegisterData?: AdvertisementReRegisterStatusResponse;
  onRepost: () => void;
}) {
  const fallbackRemaining = readDeadlineRemaining(
    ad?.delete_reason && typeof ad.delete_reason === "object"
      ? (ad.delete_reason as Record<string, unknown>).repost_deadline
      : undefined,
    7,
    ad?.updated_at ?? ad?.updatedAt,
  );
  const repostRemaining =
    reRegisterData?.expire || reRegisterData?.expires_at || reRegisterData?.reason
      ? formatExpireDuration(
          reRegisterData.expire,
          reRegisterData.expires_at,
          reRegisterData.reason || fallbackRemaining,
        )
      : fallbackRemaining;

  return (
    <div className="border-warning bg-warning-container mt-4 rounded-2xl border p-4 text-right">
      <div className="text-warning flex items-center gap-2">
        <AlertIcon className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="medium"
          className="m-0 text-sm leading-5 font-medium"
        >
          در انتظار انتشار مجدد
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface m-0 mt-2 text-xs leading-5"
      >
        واگذاری این آگهی لغو شده است. شما ۷ روز فرصت دارید تا این آگهی را به آژانس دیگری واگذار کنید
        یا با پرداخت هزینه، مستقیماً منتشر نمایید.
      </Typography>

      <div className="border-outline-var text-outline mt-3 flex items-center justify-between border-t border-dashed pt-3 text-xs [direction:ltr]">
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="medium"
          className="text-on-surface [direction:rtl]"
        >
          {repostRemaining}
        </Typography>
        <span className="[direction:rtl]">مهلت انتشار مجدد:</span>
      </div>

      <Button
        unstyled
        className="bg-primary text-on-primary mt-3 inline-flex h-10 w-full items-center justify-center rounded-lg text-xs font-medium active:opacity-90"
        onClick={onRepost}
        type="button"
      >
        انتشار مجدد آگهی
      </Button>
    </div>
  );
}
