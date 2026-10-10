import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";

export interface ExpiringAdItem {
  id: string;
  title: string;
  agencyOrConsultant: string;
  roleTitle?: string;
  timeRemaining: string;
  imageUrl?: string;
  adId?: string;
  to?: string;
}

export interface DashboardExpiringAdCardProps {
  ad: ExpiringAdItem;
}

export function DashboardExpiringAdCard({ ad }: DashboardExpiringAdCardProps) {
  const targetLink =
    ad.to || (ad.adId ? `/account/dashboard/ads?adId=${ad.adId}` : `/account/dashboard/ads`);

  return (
    <RouteLink
      to={targetLink}
      className="flex flex-col justify-between rounded-[12px] bg-surface-container-lowest p-4 border border-outline-variant transition-transform active:scale-[0.99] [direction:rtl]"
    >
      {/* Top row: Image + Title + Subtitle + Arrow */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={ad.imageUrl || "/figma/dashboard/expiring-ad-thumb.jpg"}
            alt={ad.title}
            className="h-12 w-[72px] shrink-0 rounded-[4px] object-cover bg-surface-container"
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
              className="truncate text-sm font-bold text-on-surface"
            >
              {ad.title}
            </Typography>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-on-surface-var">
              <Typography
                as="span"
                variant="label"
                size="small"
                weight="medium"
                className="text-xs text-on-surface-var"
              >
                {ad.agencyOrConsultant}
              </Typography>
              {ad.roleTitle && (
                <>
                  <span className="h-2 w-[1px] bg-outline-variant" />
                  <Typography
                    as="span"
                    variant="label"
                    size="small"
                    weight="medium"
                    className="text-xs text-on-surface-var"
                  >
                    {ad.roleTitle}
                  </Typography>
                </>
              )}
            </div>
          </div>
        </div>

        <LinearArrowLeft1 className="h-4 w-4 shrink-0 text-on-surface-var" />
      </div>

      {/* Dashed Divider */}
      <div className="my-3 border-t border-dashed border-outline-variant" />

      {/* Bottom row: Expiry label (right) + Time remaining (left) */}
      <div className="flex items-center justify-between">
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className="text-xs text-on-surface-var"
        >
          انقضا
        </Typography>

        <Typography
          as="span"
          variant="label"
          size="small"
          weight="semibold"
          className="text-xs font-bold text-error"
        >
          {ad.timeRemaining}
        </Typography>
      </div>
    </RouteLink>
  );
}
export default DashboardExpiringAdCard;
