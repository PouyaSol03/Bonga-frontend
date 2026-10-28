import { Typography } from "../../../shared/ui/Typography";
import "../../advertisements/components/AdCard.css";
import { ClockIcon } from "../ad-state/StateIcons";

export function ManagerDealConfirmationNotice() {
  return (
    <div className="border-primary bg-primary-container/20 mt-4 rounded-2xl border p-4 text-right">
      <div className="text-primary flex items-center gap-2">
        <ClockIcon className="h-5 w-5 shrink-0" />
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="medium"
          className="m-0 text-sm leading-5 font-medium"
        >
          در انتظار تایید معامله توسط مشتری
        </Typography>
      </div>
      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface m-0 mt-2 text-xs leading-5"
      >
        نتیجه معامله ثبت شده و پیام تایید برای مشتری ارسال شده است (مهلت پاسخ مشتری: ۳ روز).
      </Typography>
    </div>
  );
}
