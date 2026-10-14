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
        className={`bg-surface-container-lowest w-full p-4 [direction:rtl] ${className}`}
      >
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-surface-container flex h-[107px] min-w-0 animate-pulse flex-col items-center justify-center rounded-2xl p-3"
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
    {
      icon: <LinearViewOn className="text-on-surface-var h-6 w-6" />,
      label: "بازدید",
      value: viewsVal,
    },
    {
      icon: <LinearDocumentSearch className="text-on-surface-var h-6 w-6" />,
      label: "نمایش",
      value: impressionsVal,
    },
    {
      icon: <LinearCall className="text-on-surface-var h-6 w-6" />,
      label: "تماس",
      value: callsVal,
    },
    {
      icon: <LinearBubbleChat className="text-on-surface-var h-6 w-6" />,
      label: "چت",
      value: chatsVal,
    },
  ];

  return (
    <section
      aria-label="شاخص‌های عملکرد آگهی"
      className={`bg-surface-container-lowest w-full p-4 [direction:rtl] ${className}`}
    >
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="border-surface-container bg-surface-container-lowest flex h-[107px] min-w-0 flex-col items-center justify-center rounded-2xl border p-3 text-center shadow-2xs"
          >
            <div className="flex h-6 w-6 items-center justify-center">{card.icon}</div>
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="medium"
              className="text-on-surface mt-2 mb-1 text-[15px] leading-tight font-bold"
            >
              {card.value}
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-on-surface-var text-xs font-normal"
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
