import { PageFrame } from "../../../../shared/layout/PageFrame";
import { TopBar } from "../../../../shared/components/TopBar";
import type { AdSummary, ChartConfig } from "./types";
import { AdSummaryHeader } from "./AdSummaryHeader";
import { VisitBarChart } from "./VisitBarChart";
import { ErrorNotice, InlineNotice } from "./StatisticsNotices";

export function ManagerAdVisitStatisticsView({
  backTo,
  charts,
  isError,
  isLoading,
  onRetry,
  returnTo,
  summary,
}: {
  backTo: string;
  charts: ChartConfig[];
  isError: boolean;
  isLoading: boolean;
  onRetry: () => void;
  returnTo?: string;
  summary: AdSummary;
}) {
  return (
    <PageFrame
      className="bg-surface-container text-on-surface flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{ returnTo, tab: "status" }}
        backTo={backTo}
        className="[&_a]:text-on-surface"
        title="جزییات آمار آگهی"
      />

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <AdSummaryHeader summary={summary} />
        {isLoading ? <InlineNotice text="در حال دریافت آمار آگهی..." /> : null}
        {isError ? <ErrorNotice onRetry={onRetry} /> : null}

        <div className="bg-surface-container h-2" aria-hidden="true" />
        {charts.map((chart, index) => (
          <div key={chart.title}>
            {index > 0 ? <div className="bg-surface-container h-2" aria-hidden="true" /> : null}
            <VisitBarChart chart={chart} mode="manager" />
          </div>
        ))}
      </main>
    </PageFrame>
  );
}
