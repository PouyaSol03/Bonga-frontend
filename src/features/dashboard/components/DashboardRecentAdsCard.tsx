import { Typography } from "../../../shared/ui/Typography";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import LinearRuler from "../../../shared/icons/LinearRuler";
import LinearBed from "../../../shared/icons/LinearBed";
import LinearCalendar from "../../../shared/icons/LinearCalendar";
import { toPersianNumber } from "../../../shared/lib/numberUtils";

export interface DashboardRecentAdItem {
  id: string;
  title: string;
  price: string;
  area: number;
  rooms: number;
  buildYear: number;
  timeLocation: string;
  imageUrl: string;
  to: string;
}

export interface DashboardRecentAdsCardProps {
  ad?: DashboardRecentAdItem;
  viewAllTo?: string;
  title?: string;
}

const defaultAd: DashboardRecentAdItem = {
  id: "ad_sayyad",
  title: "۱۴۰متر*تکواحدی ابتدای صیاد*فول امکانات",
  price: "۷٫۶۵۰ میلیارد تومان",
  area: 140,
  rooms: 3,
  buildYear: 1395,
  timeLocation: "۱ ساعت پیش در صیاد شیرازی",
  imageUrl:
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
  to: "/account/manage-ads",
};

export function DashboardRecentAdsCard({
  ad = defaultAd,
  viewAllTo = "/account/manage-ads",
  title = "آخرین آگهی‌ها",
}: DashboardRecentAdsCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-surface-container-lowest p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="semibold"
          className="text-on-surface"
        >
          {title}
        </Typography>
        <RouteLink
          className="flex items-center gap-1 text-primary hover:underline"
          to={viewAllTo}
        >
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-primary"
          >
            مشاهده همه
          </Typography>
          <LinearArrowLeft1 className="h-3.5 w-3.5" />
        </RouteLink>
      </div>

      {/* Listing Card */}
      <RouteLink className="flex flex-col no-underline" to={ad.to}>
        {/* Media Thumbnail */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[10px] bg-surface-container">
          <img
            alt={ad.title}
            className="h-full w-full object-cover"
            loading="lazy"
            src={ad.imageUrl}
          />
        </div>

        {/* Price */}
        <Typography
          variant="title"
          size="medium"
          weight="semibold"
          className="mt-3 text-primary"
        >
          {ad.price}
        </Typography>

        {/* Specs row */}
        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center gap-1">
            <LinearRuler className="h-3.5 w-3.5 text-outline" />
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-on-surface-var"
            >
              {toPersianNumber(ad.area)} متر
            </Typography>
          </div>
          <div className="flex items-center gap-1">
            <LinearBed className="h-3.5 w-3.5 text-outline" />
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-on-surface-var"
            >
              {toPersianNumber(ad.rooms)} اتاق
            </Typography>
          </div>
          <div className="flex items-center gap-1">
            <LinearCalendar className="h-3.5 w-3.5 text-outline" />
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="medium"
              className="text-on-surface-var"
            >
              {toPersianNumber(ad.buildYear)}
            </Typography>
          </div>
        </div>

        {/* Title */}
        <Typography
          as="h3"
          variant="title"
          size="small"
          weight="semibold"
          className="mt-2 text-on-surface line-clamp-1"
        >
          {ad.title}
        </Typography>

        {/* Location & Time */}
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="mt-1 text-outline"
        >
          {ad.timeLocation}
        </Typography>
      </RouteLink>

      {/* Pagination dots indicator */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        <span className="h-1.5 w-4 rounded-full bg-on-surface" />
        <span className="h-1.5 w-1.5 rounded-full bg-surface-container-highest" />
        <span className="h-1.5 w-1.5 rounded-full bg-surface-container-highest" />
        <span className="h-1.5 w-1.5 rounded-full bg-surface-container-highest" />
        <span className="h-1.5 w-1.5 rounded-full bg-surface-container-highest" />
        <span className="h-1.5 w-1.5 rounded-full bg-surface-container-highest" />
        <span className="h-1.5 w-1.5 rounded-full bg-surface-container-highest" />
      </div>
    </section>
  );
}
