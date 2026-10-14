import { Typography } from "../../../../../shared/ui/Typography";
import { toPersianNumber } from "../../../../../shared/lib/numberUtils";

export function ConsultantActivityCard({
  activeAds,
  activeRequests,
  recentAds,
  views,
  calls,
}: {
  activeAds: number;
  activeRequests?: number | null;
  recentAds?: number;
  views?: number;
  calls?: number | null;
}) {
  const resolvedRequests = activeRequests !== undefined ? activeRequests : calls;
  return (
    <article className="bg-surface-container-lowest w-full px-4 py-2">
      <div className="flex items-center justify-between py-5">
        <Typography
          as="span"
          variant="body"
          size="large"
          weight="regular"
          className="text-on-surface"
        >
          آگهی‌های فعال
        </Typography>
        <Typography
          as="span"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-on-surface"
        >
          {toPersianNumber(activeAds)}
        </Typography>
      </div>
      {recentAds !== undefined ? (
        <>
          <div className="bg-outline-var/40 h-px w-full" />
          <div className="flex items-center justify-between py-5">
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="medium"
              className="text-on-surface"
            >
              ثبت ۳۰ روز اخیر
            </Typography>
            <Typography
              as="span"
              variant="title"
              size="medium"
              weight="semibold"
              className="text-on-surface"
            >
              {toPersianNumber(recentAds)}
            </Typography>
          </div>
        </>
      ) : null}
      {views !== undefined ? (
        <>
          <div className="bg-outline-var/40 h-px w-full" />
          <div className="flex items-center justify-between py-5">
            <Typography
              as="span"
              variant="body"
              size="large"
              weight="regular"
              className="text-on-surface"
            >
              مجموع بازدیدها
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="large"
              weight="semibold"
              className="text-on-surface"
            >
              {toPersianNumber(views)}
            </Typography>
          </div>
        </>
      ) : null}
      <div className="bg-outline-var/40 h-px w-full" />
      <div className="flex items-center justify-between py-5">
        <Typography
          as="span"
          variant="body"
          size="large"
          weight="regular"
          className="text-on-surface"
        >
          درخواست های فعال
        </Typography>
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="semibold"
          className="text-on-surface"
        >
          {resolvedRequests !== null && resolvedRequests !== undefined
            ? toPersianNumber(resolvedRequests)
            : "—"}
        </Typography>
      </div>
    </article>
  );
}
