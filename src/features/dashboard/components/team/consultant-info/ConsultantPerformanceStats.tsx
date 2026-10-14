import { Typography } from "../../../../../shared/ui/Typography";
import { ConsultantPeriodDropdown, type PerformancePeriod } from "./ConsultantPeriodDropdown";

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
    <article className="bg-surface-container-lowest w-full px-4 py-3.5">
      <div className="border-outline-var flex items-center justify-between border-b pb-3">
        <Typography
          variant="title"
          size="small"
          weight="semibold"
          className="text-on-surface font-bold"
        >
          آمار فعالیت
        </Typography>
        <ConsultantPeriodDropdown period={period} onSelectPeriod={onSelectPeriod} />
      </div>

      <div className="grid grid-cols-2 gap-y-4 py-3 text-center">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center justify-center gap-1.5">
                <div className="bg-surface-container-high h-6 w-14 animate-pulse rounded-md" />
                <div className="bg-surface-container-high h-3.5 w-16 animate-pulse rounded" />
              </div>
            ))
          : stats.map((stat) => (
              <div key={stat.id} className="flex flex-col items-center justify-center">
                <Typography
                  variant="title"
                  size="large"
                  weight="semibold"
                  className="text-on-surface font-bold"
                >
                  {stat.value}
                </Typography>
                <Typography
                  variant="body"
                  size="small"
                  weight="regular"
                  className="text-on-surface-var mt-0.5 text-xs"
                >
                  {stat.label}
                </Typography>
              </div>
            ))}
      </div>
    </article>
  );
}
