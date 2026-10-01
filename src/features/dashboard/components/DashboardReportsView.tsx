import { TopBar } from "../../../shared/components/TopBar";
import type { DashboardRole } from "./DashboardQuickAccessGrid";
import type { DashboardOverview } from "../api/dashboard.service";
import {
  DashboardPublishedAdsPieCard,
  DashboardViewsBarChartCard,
  DashboardConsultantsBarChartCard,
  DashboardRegistrationProgressLineCard,
  DashboardConversionFunnelCard,
  DashboardRankScoreCard,
} from "./reports";

export interface DashboardReportsViewProps {
  role?: DashboardRole;
  dashboard?: DashboardOverview | null;
  onBack: () => void;
}

export function DashboardReportsView({
  role = "REAL_ESTATE_CONSULTANT",
  dashboard,
  onBack,
}: DashboardReportsViewProps) {
  const isManager = role === "REAL_ESTATE_MANAGER";

  return (
    <div className="min-h-full bg-surface-container-low pb-6 [direction:rtl]">
      {/* TopBar - Registered to App TopBar without notifications */}
      <TopBar
        actions={[]}
        backTo="/account/dashboard"
        onBack={onBack}
        title="گزارش‌ها و نمودارها"
      />

      {/* Main Charts & Analytics - 16px (gap-4) between each card */}
      <main className="w-full flex flex-col gap-4">
        {/* 1. Published Ads Pie Chart */}
        <DashboardPublishedAdsPieCard
          role={role}
          totalCount={dashboard?.publishedAdvertises?.total}
          data={
            dashboard?.publishedAdvertises?.breakdown?.length
              ? dashboard.publishedAdvertises.breakdown.map((b, i) => ({
                  name: b.label || b.type,
                  value: b.count,
                  color: ["#F38E8A", "#FDE080", "#A9B8EA", "#34D399", "#818CF8"][
                    i % 5
                  ],
                }))
              : undefined
          }
        />

        {/* 2. Monthly Ad Views Bar Chart */}
        <DashboardViewsBarChartCard />

        {/* 3. Consultant Performance Grouped Bar Chart (Agency Manager Only) */}
        {isManager && (
          <DashboardConsultantsBarChartCard
            data={
              dashboard?.consultantActivity?.length
                ? dashboard.consultantActivity.map((c) => ({
                    name: c.name,
                    ads: c.advertiseCount,
                    updates: c.renewCount,
                    specials: c.specialCount,
                  }))
                : undefined
            }
          />
        )}

        {/* 4. Ad Registration Progress Line Chart */}
        <DashboardRegistrationProgressLineCard
          data={
            dashboard?.advertiseRegistrationProgress?.length
              ? dashboard.advertiseRegistrationProgress.map((item) => ({
                  month: item.month,
                  ads: item.count,
                }))
              : undefined
          }
        />

        {/* 5. Conversion Funnel */}
        <DashboardConversionFunnelCard />

        {/* 6. Rank & Score */}
        <DashboardRankScoreCard
          role={role}
          rank={
            dashboard?.ranking?.rank ??
            dashboard?.ranking?.current?.rank ??
            undefined
          }
          score={dashboard?.ranking?.current?.totalScore}
          badgeName={dashboard?.ranking?.current?.levelTitle}
          badgesTo={isManager ? "/account/dashboard/ranking" : "/account/ranking"}
        />
      </main>
    </div>
  );
}
