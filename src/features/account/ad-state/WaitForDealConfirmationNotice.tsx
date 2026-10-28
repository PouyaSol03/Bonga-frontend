import LinearFlag from "../../../shared/icons/LinearFlag";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { type AdvertisementSubmitResultStatusResponse } from "../../advertisements/api/agency-advertise-assignment.service";
import "../../advertisements/components/AdCard.css";
import { formatExpireDuration } from "../components/AgencyAssignedUserAdView";

export function WaitForDealConfirmationNotice({
  ad: _ad,
  submitResultData,
  isPending,
  onConfirm,
}: {
  ad?: Record<string, unknown>;
  submitResultData?: AdvertisementSubmitResultStatusResponse;
  isPending: boolean;
  onConfirm: (confirmed: boolean) => void;
}) {
  const agencyName = submitResultData?.agency?.name ?? "آژانس";
  const deadlineText =
    submitResultData?.expire || submitResultData?.expires_at || submitResultData?.reason
      ? formatExpireDuration(
          submitResultData.expire,
          submitResultData.expires_at,
          submitResultData.reason || "مهلت پاسخ: ۳ روز",
        )
      : "مهلت پاسخ: ۳ روز";

  return (
    <div className="border-primary bg-primary-container/20 mt-4 rounded-2xl border-2 p-4 text-right shadow-sm">
      <div className="text-primary flex items-center gap-2">
        <LinearFlag className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="semibold"
          className="m-0 text-sm leading-5"
        >
          آیا معامله این ملک با موفقیت انجام شد؟
        </Typography>
      </div>

      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface m-0 mt-2 text-xs leading-5"
      >
        {agencyName} وضعیت این آگهی را «معامله انجام شده» ثبت کرده است. لطفا جهت تایید نهایی و پایان
        فرایند، نتیجه را مشخص نمایید ({deadlineText}).
      </Typography>

      <div className="mt-4 flex gap-2">
        <Button
          unstyled
          className="bg-primary text-on-primary inline-flex h-10 flex-1 items-center justify-center rounded-lg text-xs font-semibold active:opacity-90 disabled:opacity-50"
          disabled={isPending}
          onClick={() => onConfirm(true)}
          type="button"
        >
          بله، معامله انجام شد
        </Button>
        <Button
          unstyled
          className="border-error bg-surface text-error active:bg-error-container inline-flex h-10 flex-1 items-center justify-center rounded-lg border text-xs font-semibold disabled:opacity-50"
          disabled={isPending}
          onClick={() => onConfirm(false)}
          type="button"
        >
          خیر، معامله انجام نشد
        </Button>
      </div>
    </div>
  );
}
