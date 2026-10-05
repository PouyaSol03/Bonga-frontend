import { Typography } from "../../../../../shared/ui/Typography";
import {
  ConsultantPeriodDropdown,
  type PerformancePeriod,
} from "./ConsultantPeriodDropdown";

export function ConsultantPerformanceStats({
  isLoading,
  onSelectPeriod,
  period,
  stats,
}: {
  isLoading?: boolean;
  onSelectPeriod: (period: PerformancePeriod) => void;
  period: PerformancePeriod;
  stats: { id: string; label: string; value: string }[];
}) {
  return (
    <article className="w-full bg-surface-container-lowest px-4 py-3.5">
      <div className="flex items-center justify-between border-b border-outline-var pb-3">
        <Typography variant="title" size="small" weight="semibold" className="font-bold text-on-surface">
          آمار فعالیت
        </Typography>
        <ConsultantPeriodDropdown
          period={period}
          onSelectPeriod={onSelectPeriod}
        />
      </div>

      <div className="grid grid-cols-2 gap-y-4 py-3 text-center">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center justify-center gap-1.5">
              <div className="h-6 w-14 animate-pulse rounded-md bg-surface-container-high" />
              <div className="h-3.5 w-16 animate-pulse rounded bg-surface-container-high" />
            </div>
          ))
        ) : (
          stats.map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-center">
              <Typography variant="title" size="large" weight="semibold" className="font-bold text-on-surface">
                {stat.value}
              </Typography>
              <Typography variant="body" size="small" weight="regular" className="mt-0.5 text-xs text-on-surface-var">
                {stat.label}
              </Typography>
            </div>
          ))
        )}
      </div>
    </article>
  );
}
