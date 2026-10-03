import { useState } from "react";
import { TopBar } from "../../../shared/components/TopBar";
import type { DashboardRole } from "./DashboardQuickAccessGrid";
import type { DashboardOverview, DashboardRolePersona } from "../api/dashboard.service";
import {
  useDashboardReportsPublishedAdsQuery,
  useDashboardReportsViewsQuery,
  useDashboardReportsConsultantsActivityQuery,
  useDashboardReportsRegistrationProgressQuery,
  useDashboardReportsConversionFunnelQuery,
  useDashboardReportsRankingScoreQuery,
} from "../api/dashboard.hooks";
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
  const persona: DashboardRolePersona = isManager
    ? "agency"
    : role === "REAL_ESTATE_CONSULTANT"
      ? "agent_in_agency"
      : "agent";

  const [publishedPeriod, setPublishedPeriod] = useState<"month" | "year">("month");
  const [viewsPeriod, setViewsPeriod] = useState<"month" | "year">("year");
  const [consultantsPeriod, setConsultantsPeriod] = useState<"month" | "year">("month");
  const [regPeriod, setRegPeriod] = useState<"month" | "year">("month");
  const [funnelPeriod] = useState<string>("30d");

  // Call the official reports & analytics endpoints
  const publishedAdsQuery = useDashboardReportsPublishedAdsQuery(persona, publishedPeriod);
  const viewsQuery = useDashboardReportsViewsQuery(persona, viewsPeriod);
  const consultantsQuery = useDashboardReportsConsultantsActivityQuery(consultantsPeriod, {
    enabled: isManager,
  });
  const regProgressQuery = useDashboardReportsRegistrationProgressQuery(persona, regPeriod);
  const funnelQuery = useDashboardReportsConversionFunnelQuery(persona, funnelPeriod);
  const rankingScoreQuery = useDashboardReportsRankingScoreQuery(persona);

  const publishedBreakdown =
    publishedAdsQuery.data?.breakdown && publishedAdsQuery.data.breakdown.length > 0
      ? publishedAdsQuery.data.breakdown
      : dashboard?.publishedAdvertises?.breakdown;

  const publishedPieData = publishedBreakdown?.map((b, i) => ({
    name: b.label || b.type,
    value: b.count,
    color: ["#F38E8A", "#FDE080", "#A9B8EA", "#34D399", "#818CF8"][i % 5],
  }));

  const consultantsItems =
    consultantsQuery.data?.items && consultantsQuery.data.items.length > 0
      ? consultantsQuery.data.items.map((c) => ({
          name: c.name,
          ads: c.ads,
          updates: c.updates,
          specials: c.specials,
        }))
      : dashboard?.consultantActivity?.map((c) => ({
          name: c.name,
          ads: c.advertiseCount,
          updates: c.renewCount,
          specials: c.specialCount,
        }));

  const registrationItems =
    regProgressQuery.data?.items && regProgressQuery.data.items.length > 0
      ? regProgressQuery.data.items.map((item) => ({
          month: item.label,
          ads: item.count,
        }))
      : dashboard?.advertiseRegistrationProgress?.map((item) => ({
          month: item.month,
          ads: item.count,
        }));

  const funnelStages = funnelQuery.data?.stages?.map((st) => ({
    id: st.id,
    label: st.label,
    count: st.count,
    percentage: st.percentage,
    badgeText: st.badgeText,
    value: String(st.count),
  }));

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
          totalCount={publishedAdsQuery.data?.total ?? dashboard?.publishedAdvertises?.total}
          data={publishedPieData}
          period={publishedPeriod}
          periodLabel={publishedPeriod === "year" ? "امسال" : "این ماه"}
          onPeriodChange={setPublishedPeriod}
        />

        {/* 2. Monthly Ad Views Bar Chart */}
        <DashboardViewsBarChartCard
          data={viewsQuery.data?.items?.map((it) => ({ month: it.label, views: it.views }))}
          period={viewsPeriod}
          periodLabel={viewsPeriod === "year" ? "امسال" : "این ماه"}
          trendText={viewsQuery.data?.trendLabel}
          onPeriodChange={setViewsPeriod}
        />

        {/* 3. Consultant Performance Grouped Bar Chart (Agency Manager Only) */}
        {isManager && (
          <DashboardConsultantsBarChartCard
            data={consultantsItems}
            totalAds={consultantsQuery.data?.totalAds}
            period={consultantsPeriod}
            periodLabel={consultantsPeriod === "year" ? "امسال" : "این ماه"}
            onPeriodChange={setConsultantsPeriod}
          />
        )}

        {/* 4. Ad Registration Progress Line Chart */}
        <DashboardRegistrationProgressLineCard
          data={registrationItems}
          period={regPeriod}
          periodLabel={regPeriod === "year" ? "امسال" : "این ماه"}
          growthText={regProgressQuery.data?.trendLabel}
          onPeriodChange={setRegPeriod}
        />

        {/* 5. Conversion Funnel */}
        <DashboardConversionFunnelCard
          stages={funnelStages}
          isLoading={funnelQuery.isLoading}
        />

        {/* 6. Rank & Score */}
        <DashboardRankScoreCard
          role={role}
          rank={
            rankingScoreQuery.data?.rank ??
            dashboard?.ranking?.rank ??
            dashboard?.ranking?.current?.rank ??
            undefined
          }
          score={rankingScoreQuery.data?.score ?? dashboard?.ranking?.current?.totalScore}
          badgeName={rankingScoreQuery.data?.levelTitle ?? dashboard?.ranking?.current?.levelTitle}
          badgesTo={
            rankingScoreQuery.data?.guideUrl ||
            (isManager ? "/account/dashboard/ranking" : "/account/ranking")
          }
          deltaRank={rankingScoreQuery.data?.rankChangeLastMonth}
          pointsNeeded={rankingScoreQuery.data?.pointsNeeded}
          targetRank={rankingScoreQuery.data?.targetRank}
        />
      </main>
    </div>
  );
}
