import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router";
import { PageFrame } from "../../../shared/layout/PageFrame";
import LinearInfoCircle from "../../../shared/icons/LinearInfoCircle";
import LinearRanking from "../../../shared/icons/LinearRanking";
import LinearStar from "../../../shared/icons/LinearStar";
import { TopBar } from "../../../shared/components/TopBar";
import { Toast, type ToastItem } from "../../../shared/components/Toast";
import { getApiErrorMessage } from "../../../shared/api/api";
import {
  useV2RankingSummaryQuery,
  useV2RankingLeaderboardQuery,
  useV2RankingProgressQuery,
} from "../api/v2/ranking-v2.hooks";
import { getAgencyRankingLevel, formatRankingLevelTitle } from "../utils/rankingLevels";
import { LevelSummaryCard, MetricSummaryCard } from "./LevelSummaryCards";
import { AgencyBadgesPanel } from "./AgencyBadgesPanel";
import { SummaryCardsSkeleton } from "./SummaryCardsSkeleton";
import { RankingIndicatorsPanel, type RankingPeriod } from "./RankingIndicatorsPanel";
import { TopAgenciesPanel } from "./TopAgenciesPanel";
import {
  formatOptionalNumber,
  mapLeaderboard,
  buildAgencyIndicators,
} from "./agencyRankingHelpers";

const DASHBOARD_BADGES_GUIDE_PATH = "/account/dashboard/ranking/badges/guide";
const DASHBOARD_LEVELS_GUIDE_PATH = "/account/dashboard/ranking/levels/guide";

export function AgencyDashboardRankingPage({
  backTo: explicitBackTo,
}: {
  backTo?: string;
} = {}) {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isFromDashboard =
    searchParams.get("from") === "dashboard" ||
    (location.state as { from?: string } | null)?.from === "dashboard" ||
    (location.state as { from?: string } | null)?.from === "/account/dashboard";

  const resolvedBackTo = explicitBackTo ?? (isFromDashboard ? "/account/dashboard" : "/account");
  const guideSuffix = isFromDashboard ? "?from=dashboard" : "?from=account";

  const [period, setPeriod] = useState<RankingPeriod>("ماه");
  const v2SummaryQuery = useV2RankingSummaryQuery(period === "هفته" ? "week" : "month");
  const v2LeaderboardQuery = useV2RankingLeaderboardQuery(10);
  useV2RankingProgressQuery("12m");
  const [toast, setToast] = useState<ToastItem | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (v2SummaryQuery.isError) {
      setToast({
        variant: "error",
        message: getApiErrorMessage(
          v2SummaryQuery.error,
          "دریافت اطلاعات رتبه‌بندی با خطا مواجه شد.",
        ),
        title: "خطا",
      });
    } else if (v2SummaryQuery.isSuccess && v2SummaryQuery.data?.message) {
      setToast({
        variant: "info",
        message: v2SummaryQuery.data.message,
      });
    }
  }, [
    v2SummaryQuery.error,
    v2SummaryQuery.isError,
    v2SummaryQuery.isSuccess,
    v2SummaryQuery.data?.message,
  ]);

  const v2Summary = v2SummaryQuery.data?.data;
  const workSummary = v2Summary?.workSummary;
  const currentTotalScore = v2Summary?.current?.total_score ?? v2Summary?.current?.totalScore;
  const currentRank = v2Summary?.rank ?? v2Summary?.current?.rank;
  const currentLevelSlug = v2Summary?.current?.level_slug ?? v2Summary?.current?.levelSlug;
  const currentLevelTitle = v2Summary?.current?.level_title ?? v2Summary?.current?.levelTitle;

  const currentLevel = getAgencyRankingLevel({
    levelSlug: currentLevelSlug,
    levelTitle: currentLevelTitle,
    score: currentTotalScore,
  });

  const displayLevelTitle = formatRankingLevelTitle({
    isAgency: true,
    levelSlug: currentLevelSlug,
    levelTitle: currentLevelTitle,
    score: currentTotalScore,
  });

  const rawLeaderboard = v2LeaderboardQuery.data?.data ?? v2LeaderboardQuery.data?.list;
  const leaderboard = mapLeaderboard(rawLeaderboard, v2Summary?.topEntities);
  const rawMetrics = v2Summary?.current?.raw_metrics as Record<string, number> | undefined;
  const indicators = buildAgencyIndicators(rawMetrics, workSummary);

  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <LinearInfoCircle className="h-6 w-6" />,
            id: "ranking-info",
            label: "راهنمای نشان‌ها و رتبه",
            to: `${DASHBOARD_BADGES_GUIDE_PATH}${guideSuffix}`,
          },
        ]}
        backTo={resolvedBackTo}
        className="bg-surface-container"
        contentClassName="px-1"
        title="نشان‌ها و رتبه"
      />

      <main className="bg-surface-container min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto px-4 pt-4 pb-6">
        {v2SummaryQuery.isLoading ? (
          <SummaryCardsSkeleton />
        ) : (
          <>
            <LevelSummaryCard
              guideTo={`${DASHBOARD_LEVELS_GUIDE_PATH}${guideSuffix}`}
              image={currentLevel.image}
              levelTitle={displayLevelTitle}
              score={formatOptionalNumber(currentTotalScore)}
            />
            <MetricSummaryCard
              icon={<LinearRanking className="text-tertiary h-6 w-6" />}
              iconClassName="bg-tertiary-container/30"
              label="رتبه آژانس"
              value={formatOptionalNumber(currentRank)}
            />
            <MetricSummaryCard
              icon={<LinearStar className="text-warning h-6 w-6" />}
              iconClassName="bg-warning-container/30"
              label="امتیاز آژانس"
              value={formatOptionalNumber(currentTotalScore)}
            />
          </>
        )}

        <AgencyBadgesPanel />

        <RankingIndicatorsPanel
          indicators={indicators}
          isLoading={v2SummaryQuery.isLoading || v2SummaryQuery.isFetching}
          period={period}
          setPeriod={setPeriod}
        />

        <TopAgenciesPanel
          agencies={leaderboard}
          isLoading={v2LeaderboardQuery.isLoading}
        />
      </main>

      <Toast onDismiss={() => setToast(null)} toast={toast} />
    </PageFrame>
  );
}
