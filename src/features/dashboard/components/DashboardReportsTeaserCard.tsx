import { Typography } from "../../../shared/ui/Typography";

export interface DashboardReportsTeaserCardProps {
  onViewReports: () => void;
  title?: string;
  subtitle?: string;
  actionText?: string;
}

export function DashboardReportsTeaserCard({
  onViewReports,
  title = "گزارش‌ها و نمودارها",
  subtitle = "تحلیل عملکرد آگهی‌ها و مشاورین",
  actionText = "مشاهده گزارش‌ها",
}: DashboardReportsTeaserCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-surface-container-lowest p-4 shadow-sm [direction:rtl]">
      {/* Header with Typography */}
      <Typography
        as="h2"
        variant="title"
        size="small"
        weight="semibold"
        className="text-on-surface"
      >
        {title}
      </Typography>
      <Typography
        as="p"
        variant="body"
        size="small"
        weight="regular"
        className="mt-0.5 text-outline"
      >
        {subtitle}
      </Typography>

      {/* Content box with mini chart & action button */}
      <div className="mt-3 flex items-center justify-between rounded-[12px] border border-surface-container-highest bg-surface-container-lowest p-3">
        {/* Decorative mini chart illustration */}
        <div className="flex h-12 items-end gap-1.5 px-2">
          <div className="h-6 w-2 rounded-t-sm bg-primary-container" />
          <div className="h-9 w-2 rounded-t-sm bg-primary-container" />
          <div className="h-7 w-2 rounded-t-sm bg-primary-container" />
          <div className="h-11 w-2 rounded-t-sm bg-primary" />
          <div className="h-8 w-2 rounded-t-sm bg-primary-container" />
          <div className="h-10 w-2 rounded-t-sm bg-primary-container" />
          <div className="h-5 w-2 rounded-t-sm bg-primary-container" />
        </div>

        {/* Action Button with Typography */}
        <button
          className="flex h-9 items-center justify-center rounded-[10px] bg-primary-container px-4 transition hover:opacity-90 active:scale-95 cursor-pointer border-none"
          onClick={onViewReports}
          type="button"
        >
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="semibold"
            className="text-primary"
          >
            {actionText}
          </Typography>
        </button>
      </div>
    </section>
  );
}
