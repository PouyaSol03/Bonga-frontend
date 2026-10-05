import { Typography } from "../../../../../shared/ui/Typography";
import { Chip } from "../../../../../shared/ui/Chip";
import { ActivityItemIcon } from "./ConsultantActivityIcons";
import {
  ConsultantPeriodDropdown,
  type PerformancePeriod,
} from "./ConsultantPeriodDropdown";
import type { ActivityFilterType, ConsultantActivityItem } from "./types";

export const ACTIVITY_FILTERS: { key: ActivityFilterType; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "ad", label: "آگهی" },
  { key: "response", label: "پاسخ به مشتری" },
  { key: "visit", label: "بازدید" },
  { key: "followup", label: "پیگیری" },
];

export function ConsultantPerformanceActivitiesList({
  activities,
  isLoading,
  onFilterChange,
  onSelectPeriod,
  period,
  selectedFilter,
}: {
  activities: ConsultantActivityItem[];
  isLoading: boolean;
  onFilterChange: (filter: ActivityFilterType) => void;
  onSelectPeriod: (period: PerformancePeriod) => void;
  period: PerformancePeriod;
  selectedFilter: ActivityFilterType;
}) {
  return (
    <article className="w-full bg-surface-container-lowest px-4 py-3.5">
      <div className="flex items-center justify-between border-b border-outline-var pb-3">
        <Typography variant="title" size="small" weight="semibold" className="font-bold text-on-surface">
          جزئیات فعالیت‌ها
        </Typography>
        <ConsultantPeriodDropdown
          period={period}
          onSelectPeriod={onSelectPeriod}
        />
      </div>

      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3">
        {ACTIVITY_FILTERS.map((filter) => {
          const active = selectedFilter === filter.key;
          return (
            <Chip
              key={filter.key}
              selected={active}
              onClick={() => onFilterChange(filter.key)}
              className="shrink-0"
            >
              {filter.label}
            </Chip>
          );
        })}
      </div>

      {isLoading ? (
        <div className="divide-y divide-outline-var">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-surface-container-high" />
                <div className="space-y-1.5 text-right">
                  <div className="h-4 w-32 animate-pulse rounded bg-surface-container-high" />
                  <div className="h-3 w-20 animate-pulse rounded bg-surface-container-high" />
                </div>
              </div>
              <div className="h-3 w-10 shrink-0 animate-pulse rounded bg-surface-container-high" />
            </div>
          ))}
        </div>
      ) : activities.length > 0 ? (
        <div className="divide-y divide-outline-var">
          {activities.map((act) => (
            <div key={act.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <ActivityItemIcon type={act.type} />
                <div className="text-right">
                  <Typography variant="body" size="medium" weight="medium" className="font-medium text-on-surface">
                    {act.title}
                  </Typography>
                  <Typography variant="body" size="small" weight="regular" className="mt-0.5 text-xs text-on-surface-var">
                    {act.subtitle}
                  </Typography>
                </div>
              </div>
              <Typography variant="body" size="small" weight="regular" className="shrink-0 text-xs text-on-surface-var">
                {act.timeAgo}
              </Typography>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Typography variant="body" size="small" weight="medium" className="text-outline">
            فعالیتی برای این فیلتر ثبت نشده است.
          </Typography>
        </div>
      )}
    </article>
  );
}
