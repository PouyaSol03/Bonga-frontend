import { useState, useEffect } from "react";
import { PageFrame } from "../../shared/layout/PageFrame";
import LinearClockAlarm from "../../shared/icons/LinearClockAlarm";
import LinearInfoCircle from "../../shared/icons/LinearInfoCircle";
import LinearLike from "../../shared/icons/LinearLike";
import LinearPercenTeam from "../../shared/icons/LinearPercenTeam";
import LinearRanking from "../../shared/icons/LinearRanking";
import LinearStar from "../../shared/icons/LinearStar";
import { TopBar } from "../../shared/components/TopBar";
import { Toast, type ToastItem } from "../../shared/components/Toast";
import { getApiErrorMessage } from "../../shared/api/api";
import {
  useV2RankingSummaryQuery,
  useV2RankingLeaderboardQuery,
  useV2RankingProgressQuery,
} from "./api/v2/ranking-v2.hooks";
import { getActiveAuthRole, getStoredAuthSession } from "../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
} from "../../shared/constants/roles.constants";
import { IndependentConsultantRankingPage } from "../account/IndependentConsultantRankingPage";
import { getAgencyRankingLevel, formatRankingLevelTitle } from "./utils/rankingLevels";
import { LevelSummaryCard, MetricSummaryCard } from "./ranking/LevelSummaryCards";
import { AgencyBadgesPanel } from "./ranking/AgencyBadgesPanel";
import {
  RankingIndicatorsPanel,
  type AgencyIndicator,
  type RankingPeriod,
} from "./ranking/RankingIndicatorsPanel";
import { TopAgenciesPanel } from "./ranking/TopAgenciesPanel";
import type { V2LeaderboardItem } from "./api/v2/ranking-v2.service";

function formatOptionalNumber(value: number | null | undefined) {
  return value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(value);
}

const DASHBOARD_BADGES_GUIDE_PATH = "/account/dashboard/ranking/badges/guide";

export function BadgesPanelSkeleton() {
  return (
    <section
      className="bg-surface-container-lowest animate-pulse rounded-2xl p-4"
      aria-label="بارگذاری نشان‌ها"
    >
      <div className="flex h-7 items-center justify-between [direction:ltr]">
        <div className="bg-surface-container-high h-4 w-12 rounded" />
        <div className="bg-surface-container-high h-5 w-20 rounded" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 [direction:ltr]">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="border-outline-var bg-surface-container-lowest flex h-[186px] w-full flex-col items-center rounded-lg border pt-6"
          >
            <div className="bg-surface-container-high h-[72px] w-[72px] rounded-full" />
            <div className="bg-surface-container-high mt-2 h-6 w-20 rounded" />
            <div className="bg-surface-container-high mt-2 h-3 w-14 rounded" />
            <div className="bg-surface-container-high mt-4 h-1 w-[92px] rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function RankingIndicatorsPanelSkeleton() {
  return (
    <section
      className="bg-surface-container-lowest animate-pulse rounded-2xl p-4"
      aria-label="بارگذاری شاخص‌ها"
    >
      <div className="flex h-7 items-center justify-between [direction:ltr]">
        <div className="bg-surface-container-high h-6 w-16 rounded" />
        <div className="bg-surface-container-high h-5 w-28 rounded" />
      </div>
      <div className="mt-6 space-y-4">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="border-outline-var flex min-h-20 items-center justify-between rounded-lg border px-4 py-3 [direction:ltr]"
          >
            <div className="bg-surface-container-high h-6 w-10 rounded" />
            <div className="bg-surface-container-high h-5 w-32 rounded" />
            <div className="bg-surface-container-high h-12 w-12 rounded-2xl" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function TopEntitiesPanelSkeleton({ title = "۱۰ برتر" }: { title?: string } = {}) {
  return (
    <section
      className="bg-surface-container-lowest animate-pulse rounded-2xl p-4"
      aria-label="بارگذاری لیست برتر"
    >
      <div className="bg-surface-container-high h-5 w-28 rounded">
        <span className="sr-only">{title}</span>
      </div>
      <div className="mt-4 space-y-2">
        <div className="bg-surface-container-high/60 h-7 w-full rounded" />
        <div className="bg-outline-var h-px" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-container-high/40 h-10 w-full rounded-lg" />
        ))}
      </div>
    </section>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className="animate-pulse space-y-4 [direction:rtl]">
      <div className="bg-surface-container-lowest flex h-20 items-center justify-between rounded-2xl px-4 [direction:ltr]">
        <div className="bg-surface-container-high h-12 w-28 rounded" />
        <div className="bg-surface-container-high h-12 w-12 rounded-full" />
      </div>
      <div className="bg-surface-container-lowest flex h-20 items-center justify-between rounded-2xl px-4 [direction:ltr]">
        <div className="bg-surface-container-high h-7 w-12 rounded" />
        <div className="flex items-center gap-2 [direction:rtl]">
          <div className="bg-surface-container-high h-10 w-10 rounded-2xl" />
          <div className="bg-surface-container-high h-5 w-20 rounded" />
        </div>
      </div>
      <div className="bg-surface-container-lowest flex h-20 items-center justify-between rounded-2xl px-4 [direction:ltr]">
        <div className="bg-surface-container-high h-7 w-12 rounded" />
        <div className="flex items-center gap-2 [direction:rtl]">
          <div className="bg-surface-container-high h-10 w-10 rounded-2xl" />
          <div className="bg-surface-container-high h-5 w-20 rounded" />
        </div>
      </div>
    </div>
  );
}

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

  const rawLeaderboard: V2LeaderboardItem[] | undefined =
    v2LeaderboardQuery.data?.data ?? v2LeaderboardQuery.data?.list;
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

  const rawMetrics = v2Summary?.current?.raw_metrics;

  const indicators: AgencyIndicator[] = [
    {
      Icon: LinearClockAlarm,
      id: "published-ads",
      label: "آگهی‌های منتشرشده",
      value: formatOptionalNumber(rawMetrics?.published_ads ?? workSummary?.publishedAdvertises),
    },
    {
      Icon: LinearPercenTeam,
      id: "active-consultants",
      label: "مشاوران دارای فعالیت",
      value: formatOptionalNumber(rawMetrics?.active_consultants ?? workSummary?.activeConsultants),
    },
    {
      Icon: LinearLike,
      id: "renewed-ads",
      label: "بروزرسانی آگهی‌ها",
      value: formatOptionalNumber(rawMetrics?.updated_ads ?? workSummary?.renewedAdvertises),
    },
    {
      Icon: LinearPercenTeam,
      id: "special-ads",
      label: "آگهی‌های ویژه",
      value: formatOptionalNumber(rawMetrics?.special_ads ?? workSummary?.specialAdvertises),
    },
  ];

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
            to: DASHBOARD_BADGES_GUIDE_PATH,
          },
        ]}
        backTo="/account/dashboard"
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
        {v2SummaryQuery.isLoading ? (
          <RankingIndicatorsPanelSkeleton />
        ) : (
          <RankingIndicatorsPanel indicators={indicators} period={period} setPeriod={setPeriod} />
        )}
        <TopAgenciesPanel
          agencies={leaderboard}
          isLoading={v2LeaderboardQuery.isLoading || v2SummaryQuery.isLoading}
        />
      </main>
      <Toast onDismiss={() => setToast(null)} toast={toast} />
    </PageFrame>
  );
}
