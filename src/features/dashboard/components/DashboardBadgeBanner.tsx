import type { ComponentType } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearStar from "../../../shared/icons/LinearStar";

export interface DashboardBadgeBannerProps {
  badgeName?: string;
  categoryLabel?: string;
  to?: string;
  icon?: ComponentType<{ className?: string }>;
  iconBgClass?: string;
  iconTextClass?: string;
}

export function DashboardBadgeBanner({
  badgeName = "ستاره بی‌رقیب",
  categoryLabel = "نشان مشاور",
  to = "/account/dashboard/ranking",
  icon: Icon = LinearStar,
  iconBgClass = "bg-[#FFF9E6]",
  iconTextClass = "text-[#FFB100]",
}: DashboardBadgeBannerProps) {
  return (
    <RouteLink
      className="flex h-[64px] items-center justify-between rounded-[16px] bg-white px-4 shadow-sm transition hover:bg-neutral-50 active:scale-[0.99] no-underline [direction:rtl]"
      to={to}
    >
      <div className="flex items-center gap-3">
        {/* Visual Badge Icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBgClass} ${iconTextClass}`}
        >
          <Icon className="h-6 w-6" />
        </div>

        {/* Text with Typography */}
        <div className="flex flex-col">
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-[#808080]"
          >
            {categoryLabel}
          </Typography>
          <Typography
            as="span"
            variant="title"
            size="small"
            weight="semibold"
            className="text-[#1A1A1A]"
          >
            {badgeName}
          </Typography>
        </div>
      </div>

      <LinearArrowLeft1 className="h-4 w-4 text-[#8C8C8C]" />
    </RouteLink>
  );
}
