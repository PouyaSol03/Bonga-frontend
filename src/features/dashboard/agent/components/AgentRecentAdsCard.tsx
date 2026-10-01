import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearRuler from "../../../../shared/icons/LinearRuler";
import LinearBed from "../../../../shared/icons/LinearBed";
import LinearCalendar from "../../../../shared/icons/LinearCalendar";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";

export interface AgentRecentAdItem {
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

export interface AgentRecentAdsCardProps {
  ad?: AgentRecentAdItem;
  viewAllTo?: string;
}

const defaultAd: AgentRecentAdItem = {
  id: "ad_sayyad",
  title: "۱۴۰متر*تکواحدی ابتدای صیاد*فول امکانات",
  price: "۷٫۶۵۰ میلیارد تومان",
  area: 140,
  rooms: 3,
  buildYear: 1395,
  timeLocation: "۱ ساعت پیش در صیاد شیرازی",
  imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
  to: "/account/manage-ads",
};

export function AgentRecentAdsCard({
  ad = defaultAd,
  viewAllTo = "/account/manage-ads",
}: AgentRecentAdsCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#1A1A1A]">
          آخرین آگهی‌ها
        </h2>
        <RouteLink
          className="flex items-center gap-1 text-[12px] font-medium text-[#0048C4] hover:underline"
          to={viewAllTo}
        >
          <span>مشاهده همه</span>
          <LinearArrowLeft1 className="h-3.5 w-3.5" />
        </RouteLink>
      </div>

      {/* Listing Card */}
      <RouteLink className="flex flex-col no-underline" to={ad.to}>
        {/* Media Thumbnail */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[10px] bg-neutral-100">
          <img
            alt={ad.title}
            className="h-full w-full object-cover"
            loading="lazy"
            src={ad.imageUrl}
          />
        </div>

        {/* Price */}
        <div className="mt-3 text-[15px] font-bold text-[#0048C4]">
          {ad.price}
        </div>

        {/* Specs row */}
        <div className="mt-2 flex items-center gap-4 text-[12px] text-[#757575]">
          <div className="flex items-center gap-1">
            <LinearRuler className="h-3.5 w-3.5" />
            <span>{toPersianNumber(ad.area)} متر</span>
          </div>
          <div className="flex items-center gap-1">
            <LinearBed className="h-3.5 w-3.5" />
            <span>{toPersianNumber(ad.rooms)} اتاق</span>
          </div>
          <div className="flex items-center gap-1">
            <LinearCalendar className="h-3.5 w-3.5" />
            <span>{toPersianNumber(ad.buildYear)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-2 text-[13px] font-semibold text-[#1A1A1A]">
          {ad.title}
        </h3>

        {/* Location & Time */}
        <p className="mt-1 text-[11px] text-[#8C8C8C]">
          {ad.timeLocation}
        </p>
      </RouteLink>

      {/* Pagination dots indicator */}
      <div className="mt-3 flex items-center justify-center gap-1.5">
        <span className="h-1.5 w-4 rounded-full bg-[#1A1A1A]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#D1D5DB]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#D1D5DB]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#D1D5DB]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#D1D5DB]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#D1D5DB]" />
        <span className="h-1.5 w-1.5 rounded-full bg-[#D1D5DB]" />
      </div>
    </section>
  );
}
