import type { ReactNode } from "react";

import {
  AdCardAreaIcon,
  AdCardRoomsIcon,
  AdCardYearIcon,
} from "../../../components/AdCardIcons";
import { RouteLink } from "../../../routes/RouteLink";
import type { SearchMapListing } from "../searchMapData";
import { SEARCH_MAP_DEMO_PHOTO } from "../searchMapData";

type SearchMapPreviewCardProps = {
  isSelected: boolean;
  listing: SearchMapListing;
};

const previewImageCount = 3;

function getAdNavigationState() {
  return {
    from: `${window.location.pathname}${window.location.search}`,
  };
}

export function SearchMapPreviewCard({
  isSelected,
  listing,
}: SearchMapPreviewCardProps) {
  const images = normalizePreviewImages(listing.images);

  return (
    <RouteLink
      data-map-slider-card={String(listing.id)}
      aria-current={isSelected ? "true" : undefined}
      className="flex h-[216px] w-[min(360px,calc(100vw-28px))] shrink-0 snap-center flex-col overflow-hidden rounded-2xl bg-white p-3 text-right no-underline shadow-[0_4px_16px_rgba(0,0,0,0.10)]"
      state={getAdNavigationState()}
      to={`/ads/${listing.id}`}
      dir="rtl"
    >
      <PreviewImages images={images} title={listing.title} />

      <div className="mt-2 flex min-h-5 items-baseline justify-start [direction:rtl]">
        <strong className="truncate text-base font-semibold leading-6 text-[#0048c4]">
          {mapCardPriceDisplay(listing.priceValue)}
        </strong>
      </div>

      <div className="mt-1.5 flex min-h-6 flex-wrap items-center justify-start gap-3 text-[13px] font-medium leading-5 text-[#1a1a1a] [direction:rtl]">
        <PropertyMeta icon={<AdCardAreaIcon className="h-5 w-5" />} label={listing.area} />
        <PropertyMeta icon={<AdCardRoomsIcon className="h-5 w-5" />} label={listing.rooms} />
        <PropertyMeta icon={<AdCardYearIcon className="h-5 w-5" />} label={listing.year} />
      </div>

      <h3 className="mt-1.5 truncate text-right text-[15px] font-medium leading-6 text-[#1a1a1a]">
        {listing.title}
      </h3>

      <div className="hidden">
        {listing.badges?.length ? (
          <div className="inline-flex items-center gap-1">
            {listing.badges.map((badge) => (
              <span
                className={`whitespace-nowrap rounded-lg border px-1.5 py-px text-xs font-medium leading-4 ${
                  badge === "فوری"
                    ? "border-[#ff6d00] text-[#ff6d00]"
                    : "border-[#11a366] text-[#11a366]"
                }`}
                key={badge}
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        <span className="min-w-0 truncate text-xs font-normal leading-5 text-[#808080]">
          {[listing.postedAt, listing.locationLabel ? `در ${listing.locationLabel}` : ""]
            .filter(Boolean)
            .join(" ")}
        </span>
      </div>
    </RouteLink>
  );
}

function normalizePreviewImages(images: string[]) {
  const safeImages = images.length > 0 ? images : [SEARCH_MAP_DEMO_PHOTO];

  return safeImages.slice(0, previewImageCount);
}

function PreviewImages({ images, title }: { images: string[]; title: string }) {
  return (
    <div className="flex h-[92px] w-full gap-3 overflow-hidden rounded-xl" dir="rtl">
      {images.map((src, index) => (
        <img
          key={`${src}-${index}`}
          className="h-[92px] w-[140px] shrink-0 rounded-xl object-cover"
          src={src}
          alt={index === 0 ? title : ""}
          draggable={false}
          loading={index === 0 ? "eager" : "lazy"}
          onError={(event) => {
            const target = event.currentTarget;

            if (target.dataset.fallback === "1") return;

            target.dataset.fallback = "1";
            target.src = SEARCH_MAP_DEMO_PHOTO;
          }}
        />
      ))}
    </div>
  );
}

function mapCardPriceDisplay(priceValue: string) {
  return priceValue.replace(/[٫.]/g, "/");
}

function PropertyMeta({
  icon,
  label,
}: {
  icon: ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-[#4d4d4d]">
      {icon}
      <span className="text-[#1a1a1a]">{label}</span>
    </span>
  );
}
