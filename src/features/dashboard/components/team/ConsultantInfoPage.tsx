import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TopBar } from "../../../../shared/components/TopBar";
import { Typography } from "../../../../shared/ui/Typography";
import {
  getRouteConsultant,
  getRouteConsultantId,
  mapAgencyConsultantToTeamConsultant,
  type TeamConsultant,
} from "./ConsultantManagementPage";
import { useAgencyConsultantQuery } from "../../../agencies/api/agency.hooks";
import { getConsultantRankingLevel } from "../../utils/rankingLevels";
import { ConsultantProfileHeader } from "./consultant-info/ConsultantProfileHeader";
import { ConsultantTabsNav } from "./consultant-info/ConsultantTabsNav";
import { ConsultantInfoTab } from "./consultant-info/ConsultantInfoTab";
import { ConsultantAdsTab } from "./consultant-info/ConsultantAdsTab";
import { ConsultantPerformanceTab } from "./consultant-info/ConsultantPerformanceTab";
import { ConsultantPerformanceChartsView } from "./consultant-info/ConsultantPerformanceChartsView";
import { ConsultantAdsFilterView } from "./consultant-info/ConsultantAdsFilterView";
import { ConsultantInfoPageSkeleton } from "./consultant-info/ConsultantInfoSkeleton";
import {
  emptyConsultantAdsFilterState,
  type ConsultantAdsFilterState,
} from "./consultant-info/consultantAdsFilterTypes";
import type { TabKey } from "./consultant-info/types";

export { ConsultantInfoPageSkeleton } from "./consultant-info/ConsultantInfoSkeleton";

export function ConsultantInfoPage({
  consultantOverride,
}: {
  consultantOverride?: TeamConsultant;
} = {}) {
  const routeConsultantId = getRouteConsultantId();
  const routeConsultant = consultantOverride ?? getRouteConsultant();
  const consultantId =
    consultantOverride?.agentId ??
    consultantOverride?.id ??
    routeConsultantId ??
    routeConsultant.agentId ??
    routeConsultant.id;

  const consultantQuery = useAgencyConsultantQuery({
    agentId: consultantId,
    enabled: Boolean(consultantId),
  });

  const [activeTab, setActiveTab] = useState<TabKey>("info");
  const [showPerformanceCharts, setShowPerformanceCharts] = useState(false);
  const [showAdsFilter, setShowAdsFilter] = useState(false);
  const [adsFilters, setAdsFilters] = useState<ConsultantAdsFilterState>(
    emptyConsultantAdsFilterState,
  );

  const consultant: TeamConsultant = consultantQuery.data
    ? mapAgencyConsultantToTeamConsultant(consultantQuery.data)
    : routeConsultant;

  const rankingLevel = getConsultantRankingLevel({
    score: consultant.rankingScore ?? 0,
    levelTitle:
      consultant.levelTitle ??
      (consultant as unknown as { levelTitle?: string }).levelTitle ??
      "مشاور جدید",
    levelSlug:
      consultant.levelSlug ??
      (consultant as unknown as { levelSlug?: string }).levelSlug ??
      "agent",
  });

  if (
    consultantQuery.isLoading &&
    (!consultantQuery.data && (!routeConsultant.name || routeConsultant.name === "—"))
  ) {
    return <ConsultantInfoPageSkeleton />;
  }

  if (consultantQuery.isError && !consultantQuery.data) {
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
        <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <Typography
            as="p"
            variant="body"
            size="large"
            weight="medium"
            className="text-on-surface"
          >
            مشاور مورد نظر یافت نشد یا دسترسی لازم وجود ندارد.
          </Typography>
        </main>
      </section>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {showPerformanceCharts ? (
        <motion.div
          key="charts"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="h-full w-full"
        >
          <ConsultantPerformanceChartsView
            agentId={consultantId}
            onBack={() => setShowPerformanceCharts(false)}
          />
        </motion.div>
      ) : showAdsFilter ? (
        <motion.div
          key="filter"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="h-full w-full"
        >
          <ConsultantAdsFilterView
            agentId={consultantId}
            initialFilters={adsFilters}
            onApply={(newFilters) => {
              setAdsFilters(newFilters);
              setShowAdsFilter(false);
            }}
            onBack={() => setShowAdsFilter(false)}
          />
        </motion.div>
      ) : (
        <motion.section
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
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

          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <ConsultantProfileHeader consultant={consultant} consultantId={consultantId} />

            <ConsultantTabsNav activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="flex flex-1 flex-col bg-surface-container-low">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="flex flex-1 flex-col space-y-2.5"
                >
                  {activeTab === "info" && (
                    <ConsultantInfoTab consultant={consultant} rankingLevel={rankingLevel} />
                  )}

                  {activeTab === "ads" && (
                    <ConsultantAdsTab
                      agentId={consultantId}
                      filters={adsFilters}
                      onFiltersChange={setAdsFilters}
                      onOpenFilter={() => setShowAdsFilter(true)}
                    />
                  )}

                  {activeTab === "performance" && (
                    <ConsultantPerformanceTab
                      agentId={consultantId}
                      onViewCharts={() => setShowPerformanceCharts(true)}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
