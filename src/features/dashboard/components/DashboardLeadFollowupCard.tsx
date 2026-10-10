import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import { toPersianNumber } from "../../../shared/lib/numberUtils";

export interface LeadFollowupItem {
  id: string;
  title: string;
  consultantName: string;
  roleTitle?: string;
  followupCount: number;
  visitCount: number;
  imageUrl?: string;
  adId?: string;
  to?: string;
}

export interface DashboardLeadFollowupCardProps {
  item: LeadFollowupItem;
}

export function DashboardLeadFollowupCard({ item }: DashboardLeadFollowupCardProps) {
  const targetLink =
    item.to ||
    (item.adId ? `/account/dashboard/requests?adId=${item.adId}` : "/account/dashboard/requests");

  return (
    <div className="flex flex-col justify-between rounded-[12px] bg-white p-4 border border-[#CCCCCC]/40 [direction:rtl]">
      {/* Top row: Image (right) + Info (left) */}
      <div className="flex items-center gap-3">
        <img
          src={item.imageUrl || "/figma/dashboard/lead-apartment.jpg"}
          alt={item.title}
          className="h-12 w-[72px] shrink-0 rounded-[4px] object-cover bg-gray-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&auto=format&fit=crop&q=80";
          }}
        />

        <div className="flex flex-1 flex-col truncate text-right">
          <Typography
            as="h3"
            variant="label"
            size="medium"
            weight="semibold"
            className="truncate text-sm font-bold text-[#1A1A1A]"
          >
            {item.title}
          </Typography>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-[#808080]">
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-xs text-[#808080]"
            >
              {item.consultantName}
            </Typography>
            {item.roleTitle && (
              <>
                <span className="h-2 w-[1px] bg-[#CCCCCC]" />
                <Typography
                  as="span"
                  variant="label"
                  size="small"
                  weight="medium"
                  className="text-xs text-[#808080]"
                >
                  {item.roleTitle}
                </Typography>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom row: Stats (right) + Button (left) - No divider line */}
      <div className="mt-4 flex items-center justify-between">
        {/* Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="semibold"
              className="text-xs font-bold text-[#1A1A1A]"
            >
              {toPersianNumber(item.followupCount)}
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-xs text-[#4D4D4D]"
            >
              پیگیری
            </Typography>
          </div>

          <div className="h-5 w-[1px] bg-[#CCCCCC]" />

          <div className="flex items-center gap-1">
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="semibold"
              className="text-xs font-bold text-[#1A1A1A]"
            >
              {toPersianNumber(item.visitCount)}
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-xs text-[#4D4D4D]"
            >
              بازدید
            </Typography>
          </div>
        </div>

        {/* Action Button: سرنخ آگهی < */}
        <RouteLink
          to={targetLink}
          className="flex items-center gap-1.5 rounded-[10px] border border-[#0048C4] px-3.5 py-2 text-xs font-medium text-[#0048C4] transition-colors active:bg-[#0048C4]/10"
        >
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-xs font-semibold text-[#0048C4]"
          >
            سرنخ آگهی
          </Typography>
          <LinearArrowLeft1 className="h-3.5 w-3.5 text-[#0048C4]" />
        </RouteLink>
      </div>
    </div>
  );
}
export default DashboardLeadFollowupCard;
