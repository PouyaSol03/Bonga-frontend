import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearBuilding3 from "../../../../shared/icons/LinearBuilding3";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";

export interface AgencyBadgeBannerProps {
  badgeName?: string;
  categoryLabel?: string;
  to?: string;
}

export function AgencyBadgeBanner({
  badgeName = "آژانس برتر منطقه‌ای",
  categoryLabel = "نشان آژانس",
  to = "/account/dashboard/ranking",
}: AgencyBadgeBannerProps) {
  return (
    <RouteLink
      className="flex h-[64px] items-center justify-between rounded-[16px] bg-white px-4 shadow-sm transition hover:bg-neutral-50 active:scale-[0.99] no-underline [direction:rtl]"
      to={to}
    >
      <div className="flex items-center gap-3">
        {/* Visual Building Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0048C4]/10 text-[#0048C4]">
          <LinearBuilding3 className="h-6 w-6" />
        </div>

        {/* Text */}
        <div className="flex flex-col">
          <span className="text-[11px] font-normal text-[#757575]">
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
