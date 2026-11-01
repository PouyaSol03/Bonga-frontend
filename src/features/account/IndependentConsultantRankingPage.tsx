import { PageFrame } from "../../shared/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Toast } from "../../shared/components/Toast";
import LinearInfoCircle from "../../shared/icons/LinearInfoCircle";
import LinearRanking from "../../shared/icons/LinearRanking";
import LinearStar from "../../shared/icons/LinearStar";

import { formatOptionalNumber } from "./ranking/rankingHelpers";
import { LevelSummaryCard, MetricSummaryCard } from "./ranking/components/RankingCards";
import { BadgesPanel } from "./ranking/components/BadgesPanel";
import { RankingIndicatorsPanel } from "./ranking/components/RankingIndicatorsPanel";
import { TopConsultantsPanel } from "./ranking/components/TopConsultantsPanel";
import { useConsultantRankingState } from "./ranking/useConsultantRankingState";

export function IndependentConsultantRankingPage({
  backTo: explicitBackTo,
}: {
  backTo?: string;
} = {}) {
  const {
    currentLevel,
    displayLevelTitle,
    indicators,
    isFromDashboard,
    period,
    ranking,
    rankingQuery,
    resolvedBackTo,
    setPeriod,
    setToast,
    toast,
  } = useConsultantRankingState(explicitBackTo);

  return (
    <PageFrame
      className="bg-surface-container text-on-surface flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <LinearInfoCircle className="h-6 w-6" />,
            id: "ranking-info",
            label: "راهنمای نشان‌ها و رتبه",
            to: `/account/ranking/badges/guide${isFromDashboard ? "?from=dashboard" : "?from=account"}`,
          },
        ]}
        backTo={resolvedBackTo}
        className="[&_button]:text-on-surface"
        title="نشان‌ها و رتبه"
      />

      <main className="bg-surface-container min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto px-4 py-4">
        {rankingQuery.isLoading ? (
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
        ) : (
          <>
            <LevelSummaryCard
              image={currentLevel.image}
              levelTitle={displayLevelTitle}
              score={formatOptionalNumber(ranking?.current?.totalScore)}
            />
            <MetricSummaryCard
              icon={<LinearRanking className="text-tertiary h-6 w-6" />}
              iconClassName="bg-tertiary-container/30"
              label="رتبه مشاور"
              value={formatOptionalNumber(ranking?.rank ?? ranking?.current?.rank)}
            />
            <MetricSummaryCard
              icon={<LinearStar className="text-warning h-6 w-6" />}
              iconClassName="bg-warning-container/30"
              label="امتیاز مشاور"
              value={formatOptionalNumber(ranking?.current?.totalScore)}
            />
          </>
        )}
        <BadgesPanel />
        <RankingIndicatorsPanel
          indicators={indicators}
          isLoading={rankingQuery.isLoading || rankingQuery.isFetching}
          period={period}
          setPeriod={setPeriod}
        />
        <TopConsultantsPanel />
      </main>
      <Toast onDismiss={() => setToast(null)} toast={toast} />
    </PageFrame>
  );
}
