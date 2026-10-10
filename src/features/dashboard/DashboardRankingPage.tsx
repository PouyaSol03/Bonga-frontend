import { useState } from "react";
import { PageFrame } from "../../shared/layout/PageFrame";
import LinearClockAlarm from "../../shared/icons/LinearClockAlarm";
import LinearInfoCircle from "../../shared/icons/LinearInfoCircle";
import LinearLike from "../../shared/icons/LinearLike";
import LinearPercenTeam from "../../shared/icons/LinearPercenTeam";
import LinearRanking from "../../shared/icons/LinearRanking";
import LinearStar from "../../shared/icons/LinearStar";
import { TopBar } from "../../shared/components/TopBar";
import {
  useV2RankingSummaryQuery,
  useV2RankingLeaderboardQuery,
  useV2RankingProgressQuery,
} from "./api/v2/ranking-v2.hooks";
import { getActiveAuthRole, getStoredAuthSession } from "../../shared/auth/auth-storage";
import { INDEPENDENT_CONSULTANT, REAL_ESTATE_CONSULTANT } from "../../shared/constants/roles.constants";
import { IndependentConsultantRankingPage } from "../account/IndependentConsultantRankingPage";
import { getAgencyRankingLevel, formatRankingLevelTitle } from "./utils/rankingLevels";
import { LevelSummaryCard, MetricSummaryCard } from "./ranking/LevelSummaryCards";
import { AgencyBadgesPanel } from "./ranking/AgencyBadgesPanel";
import { RankingIndicatorsPanel, type AgencyIndicator, type RankingPeriod } from "./ranking/RankingIndicatorsPanel";
import { TopAgenciesPanel } from "./ranking/TopAgenciesPanel";
import type { V2LeaderboardItem } from "./api/v2/ranking-v2.service";

function formatOptionalNumber(value: number | null | undefined) {
  return value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(value);
}

const DASHBOARD_BADGES_GUIDE_PATH = "/account/dashboard/ranking/badges/guide";

export function DashboardRankingPage() {
  const activeRole = getActiveAuthRole(getStoredAuthSession());

  if (activeRole === REAL_ESTATE_CONSULTANT || activeRole === INDEPENDENT_CONSULTANT) {
    return <IndependentConsultantRankingPage />;
  }

  return <AgencyDashboardRankingPage />;
}

function AgencyDashboardRankingPage() {
  const [period, setPeriod] = useState<RankingPeriod>("ماه");
  const v2SummaryQuery = useV2RankingSummaryQuery(period === "هفته" ? "week" : "month");
  const v2LeaderboardQuery = useV2RankingLeaderboardQuery(10);
  useV2RankingProgressQuery("12m");

  const v2Summary = v2SummaryQuery.data?.data;
  const workSummary = v2Summary?.workSummary;
  const currentTotalScore = v2Summary?.current?.total_score ?? v2Summary?.current?.totalScore;
  const currentRank = v2Summary?.rank ?? v2Summary?.current?.rank;
  const currentLevelSlug = v2Summary?.current?.level_slug ?? v2Summary?.current?.levelSlug;
  const currentLevelTitle = v2Summary?.current?.level_title ?? v2Summary?.current?.levelTitle;

  const currentLevel = getAgencyRankingLevel({
    score: currentTotalScore,
    levelTitle: currentLevelTitle,
    levelSlug: currentLevelSlug,
  });

  const displayLevelTitle = formatRankingLevelTitle({
    isAgency: true,
    score: currentTotalScore,
    levelTitle: currentLevelTitle,
    levelSlug: currentLevelSlug,
  });

  const rawLeaderboard: V2LeaderboardItem[] | undefined = v2LeaderboardQuery.data?.data ?? v2LeaderboardQuery.data?.list;
  const leaderboard = rawLeaderboard
    ? rawLeaderboard.map((item: V2LeaderboardItem, idx: number) => {
        const name = item.agency_name || item.agent_name || item.name || `آژانس ${idx + 1}`;
        const score = item.score ?? item.total_score ?? item.totalScore ?? 0;
        const rank = item.rank ?? idx + 1;
        const entityId = String(item.agency_id || item.agent_id || idx);

        return {
          entityId,
          levelSlug: item.level_slug || "",
          levelTitle: item.level_title || "",
          name,
          rank,
          totalScore: score,
        };
      })
    : (v2Summary?.topEntities ?? []);

  const indicators: AgencyIndicator[] = [
    {
      Icon: LinearClockAlarm,
      id: "published-ads",
      label: "آگهی‌های منتشرشده",
      value: formatOptionalNumber(workSummary?.publishedAdvertises),
    },
    {
      Icon: LinearPercenTeam,
      id: "active-consultants",
      label: "مشاوران دارای فعالیت",
      value: formatOptionalNumber(workSummary?.activeConsultants),
    },
    {
      Icon: LinearLike,
      id: "renewed-ads",
      label: "بروزرسانی آگهی‌ها",
      value: formatOptionalNumber(workSummary?.renewedAdvertises),
    },
    {
      Icon: LinearPercenTeam,
      id: "special-ads",
      label: "آگهی‌های ویژه",
      value: formatOptionalNumber(workSummary?.specialAdvertises),
    },
  ];

  return (
    <PageFrame
      className="relative mx-auto flex h-full min-h-0 w-full max-w-[500px] flex-col overflow-hidden bg-surface-container text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <LinearInfoCircle className="h-6 w-6" />,
            id: "ranking-info",
            label: "راهنمای نشان‌ها و رتبه",
            to: DASHBOARD_BADGES_GUIDE_PATH,
          },
        ]}
        backTo="/account/dashboard"
        className="bg-surface-container"
        contentClassName="px-1"
        title="نشان‌ها و رتبه"
      />

      <main className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden bg-surface-container px-4 pb-6 pt-4">
        <LevelSummaryCard
          image={currentLevel.image}
          levelTitle={displayLevelTitle}
          score={formatOptionalNumber(currentTotalScore)}
        />
        <MetricSummaryCard
          icon={<LinearRanking className="h-6 w-6 text-tertiary" />}
          iconClassName="bg-tertiary-container/30"
          label="رتبه آژانس"
          value={formatOptionalNumber(currentRank)}
        />
        <MetricSummaryCard
          icon={<LinearStar className="h-6 w-6 text-warning" />}
          iconClassName="bg-warning-container/30"
          label="امتیاز آژانس"
          value={formatOptionalNumber(currentTotalScore)}
        />
        <AgencyBadgesPanel />
        <RankingIndicatorsPanel indicators={indicators} period={period} setPeriod={setPeriod} />
        <TopAgenciesPanel
          agencies={leaderboard}
          isLoading={v2LeaderboardQuery.isLoading || v2SummaryQuery.isLoading}
        />
      </main>
    </PageFrame>
  );
}
