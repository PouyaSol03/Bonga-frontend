import { useState } from "react";
import { Typography } from "../../../../../shared/ui/Typography";
import {
  ACTIVITY_FILTERS,
  CONSULTANT_ACTIVITIES,
  CONSULTANT_ACTIVITY_STATS,
} from "./activityMockData";
import {
  ActivityItemIcon,
  ChevronDownSmIcon,
} from "./ConsultantActivityIcons";
import { ConsultantBannerChartIllustration } from "./ConsultantBannerChartIllustration";
import type { ActivityFilterType } from "./types";

interface ConsultantPerformanceSummaryProps {
  onViewCharts: () => void;
}

export function ConsultantPerformanceSummary({
  onViewCharts,
}: ConsultantPerformanceSummaryProps) {
  const [selectedFilter, setSelectedFilter] = useState<ActivityFilterType>("all");

  const filteredActivities =
    selectedFilter === "all"
      ? CONSULTANT_ACTIVITIES
      : CONSULTANT_ACTIVITIES.filter((act) => act.type === selectedFilter);

  return (
    <div className="w-full bg-surface pb-6">
      {/* 1. Header & Banner Card */}
      <div className="bg-surface px-4 pt-4 pb-2">
        <Typography as="h2" variant="title" size="medium" weight="semibold" className="font-bold text-[#1A1A1A]">
          نمودارها
        </Typography>
        <Typography as="p" variant="body" size="small" weight="regular" className="mt-0.5 text-[#808080]">
          تحلیل عملکرد مشاور
        </Typography>
      </div>

      <div className="mx-4 mt-2 flex items-center justify-between rounded-2xl border border-[#F0F0F0] bg-surface p-3.5 shadow-2xs">
        <button
          type="button"
          onClick={onViewCharts}
          className="rounded-xl bg-[#0048C4]/[0.08] px-4 py-2.5 text-xs font-semibold text-[#0048C4] transition hover:bg-[#0048C4]/15 active:scale-98"
        >
          مشاهده نمودارها
        </button>
        <ConsultantBannerChartIllustration />
      </div>

      {/* 2. Activity Statistics */}
      <div className="mt-4 border-y border-[#F0F0F0] bg-surface px-4 py-3.5">
        <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-3">
          <Typography variant="title" size="small" weight="semibold" className="font-bold text-[#1A1A1A]">
            آمار فعالیت
          </Typography>
          <button type="button" className="flex items-center gap-1 text-xs text-[#4D4D4D]">
            در هفته
            <ChevronDownSmIcon />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-y-4 py-3 text-center">
          {CONSULTANT_ACTIVITY_STATS.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-center">
              <Typography variant="title" size="large" weight="semibold" className="font-bold text-[#1A1A1A]">
                {stat.value}
              </Typography>
              <Typography variant="body" size="small" weight="regular" className="mt-0.5 text-xs text-[#808080]">
                {stat.label}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Activity Details */}
      <div className="border-b border-[#F0F0F0] bg-surface px-4 py-3.5">
        <div className="flex items-center justify-between border-b border-[#F0F0F0] pb-3">
          <Typography variant="title" size="small" weight="semibold" className="font-bold text-[#1A1A1A]">
            جزییات فعالیت‌ها
          </Typography>
          <button type="button" className="flex items-center gap-1 text-xs text-[#4D4D4D]">
            در هفته
            <ChevronDownSmIcon />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
          {ACTIVITY_FILTERS.map((filter) => {
            const active = selectedFilter === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setSelectedFilter(filter.key)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs transition ${
                  active
                    ? "border border-[#0048C4] bg-[#0048C4]/15 font-medium text-[#0048C4]"
                    : "border border-[#CCCCCC] bg-surface text-[#4D4D4D] hover:bg-surface-container-low"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* List of items */}
        <div className="divide-y divide-[#F0F0F0]">
          {filteredActivities.map((act) => (
            <div key={act.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <ActivityItemIcon type={act.type} />
                <div className="text-right">
                  <Typography variant="body" size="medium" weight="medium" className="font-medium text-[#1A1A1A]">
                    {act.title}
                  </Typography>
                  <Typography variant="body" size="small" weight="regular" className="mt-0.5 text-xs text-[#808080]">
                    {act.subtitle}
                  </Typography>
                </div>
              </div>
              <Typography variant="body" size="small" weight="regular" className="shrink-0 text-xs text-[#808080]">
                {act.timeAgo}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
