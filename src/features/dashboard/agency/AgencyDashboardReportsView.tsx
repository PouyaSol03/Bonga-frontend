import LinearArrowRight1 from "../../../shared/icons/LinearArrowRight1";
import { AgencyPublishedAdsPieCard } from "./reports/AgencyPublishedAdsPieCard";
import { AgencyViewsBarChartCard } from "./reports/AgencyViewsBarChartCard";
import { AgencyConsultantsBarChartCard } from "./reports/AgencyConsultantsBarChartCard";
import { AgencyRegistrationProgressLineCard } from "./reports/AgencyRegistrationProgressLineCard";
import { AgencyConversionFunnelCard } from "./reports/AgencyConversionFunnelCard";
import { AgencyRankScoreCard } from "./reports/AgencyRankScoreCard";

export interface AgencyDashboardReportsViewProps {
  onBack: () => void;
}

export function AgencyDashboardReportsView({
  onBack,
}: AgencyDashboardReportsViewProps) {
  return (
    <div className="min-h-screen bg-[#F0F0F0] pb-24 [direction:rtl]">
      {/* TopBar */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center bg-[#F0F0F0] px-4">
        <div className="flex items-center gap-2">
          <button
            aria-label="بازگشت به داشبورد"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#1A1A1A] transition hover:bg-black/5 active:scale-95 cursor-pointer border-none bg-transparent"
            onClick={onBack}
            type="button"
          >
            <LinearArrowRight1 className="h-5 w-5" />
          </button>
          <h1 className="text-[16px] font-bold text-[#1A1A1A]">
            گزارش‌ها و نمودارها
          </h1>
        </div>
      </header>

      {/* Main Charts & Analytics */}
      <main className="mx-auto flex max-w-[360px] flex-col gap-3.5 px-4 pt-1">
        {/* 1. Published Ads Pie Chart */}
        <AgencyPublishedAdsPieCard />

        {/* 2. Monthly Ad Views Bar Chart */}
        <AgencyViewsBarChartCard />

        {/* 3. Consultant Performance Grouped Bar Chart */}
        <AgencyConsultantsBarChartCard />

        {/* 4. Ad Registration Progress Line Chart */}
        <AgencyRegistrationProgressLineCard />

        {/* 5. Conversion Funnel */}
        <AgencyConversionFunnelCard />

        {/* 6. Agency Rank & Score */}
        <AgencyRankScoreCard />
      </main>
    </div>
  );
}
