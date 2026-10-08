import LinearViewOn from "../../../../../shared/icons/LinearViewOn";
import LinearCall from "../../../../../shared/icons/LinearCall";
import LinearBubbleChat from "../../../../../shared/icons/LinearBubbleChat";
import { LinearDocumentSearch } from "../../../../../shared/icons/LinearDocumentSearch";
import { toPersianNumber } from "../../../../../shared/lib/numberUtils";
import { Typography } from "../../../../../shared/ui/Typography";
import { useAdPerformanceSummaryQuery } from "../../api/adPerformanceApi";

export interface ViewAdPerformanceKpiCardsProps {
  adId?: string | number;
  views?: number | string;
  impressions?: number | string;
  calls?: number | string;
  chats?: number | string;
  sourceAd?: Record<string, unknown>;
  className?: string;
}

export function ViewAdPerformanceKpiCards({
  adId,
  views,
  impressions,
  calls,
  chats,
  sourceAd,
  className = "",
}: ViewAdPerformanceKpiCardsProps) {
  const { data: summary, isLoading } = useAdPerformanceSummaryQuery(adId, sourceAd);

  if (isLoading) {
    return (
      <section
        aria-label="شاخص‌های عملکرد آگهی"
        className={`w-full bg-surface-container-lowest p-4 [direction:rtl] ${className}`}
      >
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex h-[107px] min-w-0 animate-pulse flex-col items-center justify-center rounded-2xl bg-surface-container p-3"
            />
          ))}
        </div>
      </section>
    );
  }

  const viewsVal = toPersianNumber(views ?? summary?.views_count ?? 0);
  const impressionsVal = toPersianNumber(impressions ?? summary?.search_impressions_count ?? 0);
  const callsVal = toPersianNumber(calls ?? summary?.calls_count ?? 0);
  const chatsVal = toPersianNumber(chats ?? summary?.chats_count ?? 0);

  const cards = [
    { icon: <LinearViewOn className="h-6 w-6 text-on-surface-var" />, label: "بازدید", value: viewsVal },
    { icon: <LinearDocumentSearch className="h-6 w-6 text-on-surface-var" />, label: "نمایش", value: impressionsVal },
    { icon: <LinearCall className="h-6 w-6 text-on-surface-var" />, label: "تماس", value: callsVal },
    { icon: <LinearBubbleChat className="h-6 w-6 text-on-surface-var" />, label: "چت", value: chatsVal },
  ];

  return (
    <section
      aria-label="شاخص‌های عملکرد آگهی"
      className={`w-full bg-surface-container-lowest p-4 [direction:rtl] ${className}`}
    >
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="flex h-[107px] min-w-0 flex-col items-center justify-center rounded-2xl border border-surface-container bg-surface-container-lowest p-3 text-center shadow-2xs"
          >
            <div className="flex h-6 w-6 items-center justify-center">
              {card.icon}
            </div>
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="medium"
              className="mt-2 mb-1 text-[15px] font-bold text-on-surface leading-tight"
            >
              {card.value}
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-xs font-normal text-on-surface-var"
            >
              {card.label}
            </Typography>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ViewAdPerformanceKpiCards;
