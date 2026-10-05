import { useState } from "react";
import { Typography } from "../../../../../shared/ui/Typography";
import { toPersianNumber } from "../../../../../shared/lib/numberUtils";
import {
  useAgencyConsultantActivityFeedQuery,
  useAgencyConsultantActivityStatsQuery,
} from "../../../../agencies/api/agency.hooks";
import { ConsultantBannerChartIllustration } from "./ConsultantBannerChartIllustration";
import { ConsultantPerformanceStats } from "./ConsultantPerformanceStats";
import { ConsultantPerformanceActivitiesList } from "./ConsultantPerformanceActivitiesList";
import type { PerformancePeriod } from "./ConsultantPeriodDropdown";
import { formatRelativeTime } from "./timeUtils";
import type { ActivityFilterType, ConsultantActivityItem } from "./types";

interface ConsultantPerformanceSummaryProps {
  agentId?: number | string;
  onViewCharts: () => void;
}

export function ConsultantPerformanceSummary({
  agentId,
  onViewCharts,
}: ConsultantPerformanceSummaryProps) {
  const [selectedFilter, setSelectedFilter] = useState<ActivityFilterType>("all");
  const [statsPeriod, setStatsPeriod] = useState<PerformancePeriod>("month");
  const [feedPeriod, setFeedPeriod] = useState<PerformancePeriod>("week");

  // 1. Top section: activity counters (independent period and cache)
  const statsQuery = useAgencyConsultantActivityStatsQuery({
    agentId: agentId ?? "",
    enabled: Boolean(agentId),
    period: statsPeriod,
  });

  // 2. Bottom section: activity feed (independent period and filters)
  const feedQuery = useAgencyConsultantActivityFeedQuery({
    agentId: agentId ?? "",
    enabled: Boolean(agentId),
    period: feedPeriod,
    type: selectedFilter,
  });

  const statsData = statsQuery.data?.stats;
  const statsList = [
    {
      id: "ad",
      label: "آگهی",
      value: statsData?.ad !== undefined ? toPersianNumber(statsData.ad) : "۰",
    },
    {
      id: "response",
      label: "پاسخ به مشتری",
      value:
        statsData?.response !== null && statsData?.response !== undefined
          ? toPersianNumber(statsData.response)
          : "—",
    },
    {
      id: "visit",
      label: "بازدید سرنخ",
      value:
        statsData?.visit !== null && statsData?.visit !== undefined
          ? toPersianNumber(statsData.visit)
          : "—",
    },
    {
      id: "followup",
      label: "پیگیری سرنخ",
      value:
        statsData?.followup !== null && statsData?.followup !== undefined
          ? toPersianNumber(statsData.followup)
          : "—",
    },
  ];

  const rawActivities = feedQuery.data?.activities ?? [];
  const activities: ConsultantActivityItem[] = rawActivities.map((act) => ({
    id: String(act.id),
    subtitle: act.subtitle,
    timeAgo: formatRelativeTime(act.created_at),
    title: act.title,
    type: (act.type || "ad") as ActivityFilterType,
  }));

  return (
    <div className="space-y-2.5">
      <section className="w-full bg-surface-container-lowest p-4">
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="font-bold text-on-surface">
          نمودارها
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="mt-0.5 text-on-surface-var">
          تحلیل عملکرد مشاور
        </Typography>

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-outline-var bg-surface-container-lowest p-3.5 shadow-2xs">
          <button
            type="button"
            onClick={onViewCharts}
            className="cursor-pointer rounded-xl bg-primary/10 px-4 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary/15 active:scale-98"
          >
            مشاهده نمودارها
          </button>
          <ConsultantBannerChartIllustration />
        </div>
      </section>

      <ConsultantPerformanceStats
        isLoading={statsQuery.isLoading}
        onSelectPeriod={setStatsPeriod}
        period={statsPeriod}
        stats={statsList}
      />

      <ConsultantPerformanceActivitiesList
        activities={activities}
        isLoading={feedQuery.isLoading}
        onFilterChange={setSelectedFilter}
        onSelectPeriod={setFeedPeriod}
        period={feedPeriod}
        selectedFilter={selectedFilter}
      />
    </div>
  );
}
