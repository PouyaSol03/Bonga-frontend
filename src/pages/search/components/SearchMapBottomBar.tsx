import "../../../components/AdCard.css";

import type { SearchMapListing } from "../searchMapData";
import { Typography } from "../../../components/ui/Typography";

type SearchMapBottomBarProps = {
  listing: SearchMapListing | null;
  totalCount: number;
};

export function SearchMapBottomBar({
  listing,
  totalCount,
}: SearchMapBottomBarProps) {
  return (
    <aside
      className="absolute inset-x-0 bottom-0 z-[500] bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(26,26,26,0.12)]"
      aria-label="نتیجه انتخاب شده"
      dir="rtl"
    >
      {listing ? (
        <article className="flex min-h-[88px] items-center gap-3">
          <div
            className={`ad-card__image h-[72px] w-[96px] shrink-0 rounded-xl bg-cover bg-center ${
              listing.imageClassName ?? ""
            }`}
            aria-hidden="true"
          />

          <div className="flex min-w-0 flex-1 flex-col gap-1 text-right">
            <div className="flex items-center gap-1">
              <Typography as="span" variant="label" size="medium" weight="medium" className="text-sm font-medium leading-5 text-[#808080]">
                {listing.priceLabel}:
              </Typography>
              <strong className="text-base font-bold leading-6 text-[#0048c4]">
                {listing.priceValue}
              </strong>
            </div>

            <Typography as="h2" variant="title" size="small" weight="medium" className="m-0 truncate text-sm font-medium leading-5 text-[#1a1a1a]">
              {listing.title}
            </Typography>

            <Typography as="p" variant="body" size="small" weight="regular" className="m-0 text-xs font-normal leading-4 text-[#808080]">
              {listing.area} · {listing.rooms} · {listing.year} · {listing.locationLabel}
            </Typography>
          </div>
        </article>
      ) : (
        <div className="flex min-h-[64px] items-center justify-between gap-3">
          <div className="flex flex-col gap-1 text-right">
            <strong className="text-base font-semibold leading-6 text-[#1a1a1a]">
              {totalCount} آگهی روی نقشه
            </strong>
            <Typography as="span" variant="body" size="medium" weight="regular" className="text-sm font-normal leading-5 text-[#808080]">
              برای مشاهده جزئیات، یکی از قیمت‌ها را انتخاب کنید.
            </Typography>
          </div>

          <button
            className="h-10 shrink-0 rounded-[10px] bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            type="button"
          >
            مشاهده لیست
          </button>
        </div>
      )}
    </aside>
  );
}
