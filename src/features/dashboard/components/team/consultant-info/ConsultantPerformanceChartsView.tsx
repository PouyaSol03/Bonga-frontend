import { TopBar } from "../../../../../shared/components/TopBar";
import { ProgressLineChartCard } from "../../home/DashboardHomeOverview";
import { ConsultantPieCard } from "./ConsultantPieCard";
import { MONTHLY_PROGRESS_DATA, YEARLY_PROGRESS_DATA } from "./mockData";
import type { ConsultantPieDatum, PeriodKey } from "./types";

interface ConsultantPerformanceChartsViewProps {
  cards: ConsultantPieDatum[];
  period: PeriodKey;
  onPeriodChange: (p: PeriodKey) => void;
  onBack: () => void;
}

export function ConsultantPerformanceChartsView({
  cards,
  period,
  onPeriodChange,
  onBack,
}: ConsultantPerformanceChartsViewProps) {
  return (
    <section
      className="mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-surface-container-low text-on-surface"
      dir="rtl"
    >
      <TopBar
        onBack={onBack}
        centerClassName="px-0"
        reserveStartSpace
        title="نمودار عملکرد مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto space-y-2.5 bg-surface-container-low pb-8">
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
      </main>
    </section>
  );
}
