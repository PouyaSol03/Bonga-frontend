import { Typography } from "../../../shared/ui/Typography";
import { Link } from "react-router";
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
    ad.to || (ad.adId ? `/account/my-ads/${encodeURIComponent(String(ad.adId))}/state-ad` : "/account/manage-ads");

  return (
    <Link
      to={targetLink}
      className="bg-surface-container-lowest border-outline-variant flex flex-col justify-between rounded-[12px] border p-4 transition-transform [direction:rtl] active:scale-[0.99]"
    >
      {/* Top row: Image + Title + Subtitle + Arrow */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={ad.imageUrl || "/figma/dashboard/expiring-ad-thumb.jpg"}
            alt={ad.title}
            className="bg-surface-container h-12 w-[72px] shrink-0 rounded-[4px] object-cover"
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
              className="text-on-surface truncate text-sm font-bold"
            >
              {ad.title}
            </Typography>
            <div className="text-on-surface-var mt-1 flex items-center gap-1.5 text-xs">
              <Typography
                as="span"
                variant="label"
                size="small"
                weight="medium"
                className="text-on-surface-var text-xs"
              >
                {ad.agencyOrConsultant}
              </Typography>
              {ad.roleTitle && (
                <>
                  <span className="bg-outline-variant h-2 w-[1px]" />
                  <Typography
                    as="span"
                    variant="label"
                    size="small"
                    weight="medium"
                    className="text-on-surface-var text-xs"
                  >
                    {ad.roleTitle}
                  </Typography>
                </>
              )}
            </div>
          </div>
        </div>

        <LinearArrowLeft1 className="text-on-surface-var h-4 w-4 shrink-0" />
      </div>

      {/* Dashed Divider */}
      <div className="border-outline-variant my-3 border-t border-dashed" />

      {/* Bottom row: Expiry label (right) + Time remaining (left) */}
      <div className="flex items-center justify-between">
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className="text-on-surface-var text-xs"
        >
          انقضا
        </Typography>

        <Typography
          as="span"
          variant="label"
          size="small"
          weight="semibold"
          className="text-error text-xs font-bold"
        >
          {ad.timeRemaining}
        </Typography>
      </div>
    </Link>
  );
}
export default DashboardExpiringAdCard;
