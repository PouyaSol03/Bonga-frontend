import type { ComponentType } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearRanking from "../../../shared/icons/LinearRanking";

export interface DashboardBadgeBannerProps {
  badgeName?: string;
  categoryLabel?: string;
  to?: string;
  icon?: ComponentType<{ className?: string }>;
  iconBgClass?: string;
  iconTextClass?: string;
}

export function DashboardBadgeBanner({
  badgeName = "مشاور تازه‌کار",
  categoryLabel = "سطح مشاور",
  to = "/account/dashboard/ranking",
  icon: Icon = LinearRanking,
  iconBgClass = "bg-[#FFF4E5] dark:bg-[#3D2500]",
  iconTextClass = "text-[#FF8D00] dark:text-[#FFAA33]",
}: DashboardBadgeBannerProps) {
  return (
    <RouteLink
      className="flex h-[64px] items-center justify-between rounded-[16px] bg-surface-container-lowest px-4 shadow-sm transition hover:bg-surface-container-low active:scale-[0.99] no-underline [direction:rtl]"
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
            className="text-on-surface-var"
          >
            {categoryLabel}
          </Typography>
          <Typography
            as="span"
            variant="title"
            size="small"
            weight="semibold"
            className="text-on-surface"
          >
            {badgeName}
          </Typography>
        </div>
      </div>

      <LinearArrowLeft1 className="h-4 w-4 text-on-surface-var" />
    </RouteLink>
  );
}
