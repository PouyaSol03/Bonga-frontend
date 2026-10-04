import { ProgressLineChartCard } from "../../home/DashboardHomeOverview";
import { ConsultantPieCard } from "./ConsultantPieCard";
import { MONTHLY_PROGRESS_DATA, YEARLY_PROGRESS_DATA } from "./mockData";
import type { ConsultantPieDatum, PeriodKey } from "./types";

export function ConsultantPerformanceTab({
  cards,
  period,
  onPeriodChange,
}: {
  cards: ConsultantPieDatum[];
  period: PeriodKey;
  onPeriodChange: (p: PeriodKey) => void;
}) {
  return (
    <div className="space-y-2.5">
      {cards.map((card, index) => (
        <ConsultantPieCard
          card={card}
          key={card.title}
          period={period}
          onPeriodChange={onPeriodChange}
          showTooltip={index === 0}
        />
      ))}

      <div className="w-full bg-surface-container-lowest">
        <ProgressLineChartCard
          data={period === "year" ? YEARLY_PROGRESS_DATA : MONTHLY_PROGRESS_DATA}
          period={period}
          onPeriodChange={(p) => onPeriodChange(p as PeriodKey)}
          title="نمودار پیشرفت ثبت آگهی"
          valueSuffix=" آگهی"
        />
      </div>
    </div>
  );
}
