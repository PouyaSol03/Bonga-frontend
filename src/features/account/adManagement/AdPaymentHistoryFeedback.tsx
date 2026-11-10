import { Link } from "react-router";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import type { AdvertisementItem } from "../../advertisements/api/advertisement.service";
import {
  adManagementPaths,
  getAdIncreaseVisitsPath,
  type ConsultantAd,
} from "./adManagementData";

export function PaymentHistoryLoading() {
  return (
    <div className="text-outline flex h-full min-h-0 flex-1 items-center justify-center px-4 text-sm leading-5 font-medium">
      در حال دریافت تاریخچه پرداخت...
    </div>
  );
}

export function PaymentHistoryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center px-8 text-center">
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="text-on-surface m-0 text-sm leading-6 font-medium"
      >
        دریافت تاریخچه پرداخت با خطا مواجه شد.
      </Typography>
      <Button
        unstyled
        className="bg-primary text-on-primary mt-4 h-10 rounded-lg px-6 text-sm leading-5 font-medium"
        onClick={onRetry}
        type="button"
      >
        تلاش مجدد
      </Button>
    </div>
  );
}

export function EmptyPaymentHistory({
  ad,
  adId,
  card,
  returnTo,
}: {
  ad?: AdvertisementItem | ConsultantAd;
  adId?: string;
  card?: ConsultantAd;
  returnTo?: string;
}) {
  return (
    <section className="mx-auto flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center px-8 text-center">
      <img src="/vectors/NoPaymentHistory.svg" alt="" />
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0 mt-3 text-base leading-6 font-semibold"
      >
        هیچ تراکنشی برای نمایش وجود ندارد
      </Typography>
      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 max-w-[260px] text-xs leading-5 font-normal"
      >
        پس از اولین پرداخت برای این آگهی، سابقه‌ها در این بخش نمایش داده می‌شود
      </Typography>

      <Link
        className="bg-primary text-on-primary mt-4 inline-flex h-10 min-w-[112px] items-center justify-center gap-2 rounded-lg px-4 text-sm leading-5 font-medium no-underline"
        state={{
          ad: card ?? ad,
          card,
          paymentFlow: "upgrade",
          paymentHistoryReturnTo: window.location.pathname,
          returnTo,
          tab: "status",
        }}
        to={adId ? getAdIncreaseVisitsPath(adId) : adManagementPaths.payment}
      >
        <Typography as="span" variant="body" size="medium" weight="regular">
          افزایش بازدید
        </Typography>
        <LinearArrowLeft1 className="h-4 w-4" />
        {adId ? (
          <Typography as="span" variant="body" size="medium" weight="regular" className="sr-only">
            برای آگهی {adId}
          </Typography>
        ) : null}
      </Link>
    </section>
  );
}
