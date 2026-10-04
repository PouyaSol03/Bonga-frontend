import { useState } from "react";
import { TopBar } from "../../../../shared/components/TopBar";
import {
  getRouteConsultant,
  getRouteConsultantId,
  type TeamConsultant,
} from "./ConsultantManagementPage";
import { getConsultantRankingLevel } from "../../utils/rankingLevels";
import { ConsultantProfileHeader } from "./consultant-info/ConsultantProfileHeader";
import { ConsultantTabsNav } from "./consultant-info/ConsultantTabsNav";
import { ConsultantInfoTab } from "./consultant-info/ConsultantInfoTab";
import { ConsultantAdsTab } from "./consultant-info/ConsultantAdsTab";
import { ConsultantPerformanceTab } from "./consultant-info/ConsultantPerformanceTab";
import { ConsultantPerformanceChartsView } from "./consultant-info/ConsultantPerformanceChartsView";
import {
  buildConsultantPieCards,
  sampleConsultantAds,
} from "./consultant-info/mockData";
import type { PeriodKey, TabKey } from "./consultant-info/types";

export { ConsultantInfoPageSkeleton } from "./consultant-info/ConsultantInfoSkeleton";

export function ConsultantInfoPage({
  consultantOverride,
}: {
  consultantOverride?: TeamConsultant;
} = {}) {
  const routeConsultant = consultantOverride ?? getRouteConsultant();
  const consultantId =
    routeConsultant.agentId ?? getRouteConsultantId() ?? routeConsultant.id;

  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [performancePeriod, setPerformancePeriod] = useState<PeriodKey>("month");
  const [showPerformanceCharts, setShowPerformanceCharts] = useState(false);

  const consultant: TeamConsultant = {
    ...routeConsultant,
    name:
      routeConsultant.name && routeConsultant.name !== "—"
        ? routeConsultant.name
        : "حسین رفیعی",
    phone: routeConsultant.phone || "09156984578",
    rankingScore: routeConsultant.rankingScore ?? 85,
    adQuota: routeConsultant.adQuota ?? 34,
    renewQuota: routeConsultant.renewQuota ?? 21,
    specialQuota: routeConsultant.specialQuota ?? 11,
    scores: {
      ads: routeConsultant.scores?.ads ?? 51,
      steps: routeConsultant.scores?.steps ?? 21,
      rocket: routeConsultant.scores?.rocket ?? 11,
    },
  };

  const rankingLevel = getConsultantRankingLevel({
    score: consultant.rankingScore ?? 85,
    levelTitle:
      (consultant as unknown as { levelTitle?: string }).levelTitle ?? "مشاور منتخب",
    levelSlug:
      (consultant as unknown as { levelSlug?: string }).levelSlug ?? "selected_agent",
  });

  const isMonth = performancePeriod === "month";
  const consultantPieCards = buildConsultantPieCards(consultant, isMonth);

  if (showPerformanceCharts) {
    return (
      <ConsultantPerformanceChartsView
        cards={consultantPieCards}
        period={performancePeriod}
        onPeriodChange={setPerformancePeriod}
        onBack={() => setShowPerformanceCharts(false)}
      />
    );
  }

  return (
    <section
      className="mx-auto flex h-full min-h-[640px] w-full max-w-[500px] flex-col overflow-hidden bg-surface-container-low text-on-surface"
      dir="rtl"
    >
      <TopBar
        backTo="/account/dashboard/team"
        centerClassName="px-0"
        reserveStartSpace
        title="اطلاعات مشاور"
        titleClassName="text-center text-sm font-semibold leading-5"
      />

      <main className="min-h-0 flex-1 overflow-y-auto">
        <ConsultantProfileHeader consultant={consultant} consultantId={consultantId} />

        <ConsultantTabsNav activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="space-y-2.5 bg-surface-container-low pb-8">
          {activeTab === "info" && (
            <ConsultantInfoTab consultant={consultant} rankingLevel={rankingLevel} />
          )}

          {activeTab === "ads" && (
            <ConsultantAdsTab ads={sampleConsultantAds} />
          )}

          {activeTab === "performance" && (
            <ConsultantPerformanceTab
              onViewCharts={() => setShowPerformanceCharts(true)}
            />
          )}
        </div>
      </main>
    </section>
  );
}
