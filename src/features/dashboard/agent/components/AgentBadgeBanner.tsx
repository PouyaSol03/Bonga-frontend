import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearStar from "../../../../shared/icons/LinearStar";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";

export interface AgentBadgeBannerProps {
  badgeName?: string;
  categoryLabel?: string;
  to?: string;
}

export function AgentBadgeBanner({
  badgeName = "ستاره بی‌رقیب",
  categoryLabel = "نشان مشاور",
  to = "/account/dashboard/ranking",
}: AgentBadgeBannerProps) {
  return (
    <RouteLink
      className="flex h-[64px] items-center justify-between rounded-[16px] bg-white px-4 shadow-sm transition hover:bg-neutral-50 active:scale-[0.99] no-underline [direction:rtl]"
      to={to}
    >
      <div className="flex items-center gap-3">
        {/* Visual Badge Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF9E6] text-[#FFB100]">
          <LinearStar className="h-6 w-6 text-[#FFB100]" />
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <span className="text-[11px] font-normal text-[#808080]">
            {categoryLabel}
          </span>
          <span className="text-[14px] font-bold text-[#1A1A1A]">
            {badgeName}
          </span>
        </div>
      </div>

      <LinearArrowLeft1 className="h-4 w-4 text-[#8C8C8C]" />
    </RouteLink>
  );
}
