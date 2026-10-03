import { Typography } from "../../../../shared/ui/Typography";
import LinearAnalytics from "../../../../shared/icons/LinearAnalytics";

export interface DashboardChartEmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export function DashboardChartEmptyState({
  title = "داده‌ای برای نمایش وجود ندارد",
  description,
  className = "",
}: DashboardChartEmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-10 px-4 text-center ${className}`}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container text-on-surface-var mb-3">
        <LinearAnalytics className="h-6 w-6" />
      </div>
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="text-on-surface text-sm"
      >
        {title}
      </Typography>
      {description && (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="mt-1 text-on-surface-var text-xs max-w-[260px]"
        >
          {description}
        </Typography>
      )}
    </div>
  );
}
