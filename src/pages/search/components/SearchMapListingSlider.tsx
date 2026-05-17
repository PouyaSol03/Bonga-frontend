import { useLayoutEffect, useRef } from "react";
import type { SearchMapListing } from "../searchMapData";
import {
  SEARCH_MAP_DEMO_PHOTO,
  searchMapCardDemoImages,
} from "../searchMapData";

type SearchMapListingSliderProps = {
  isOpen: boolean;
  listings: SearchMapListing[];
  selectedListingId: number | null;
  onSelectListing: (listing: SearchMapListing) => void;
};

export function SearchMapListingSlider({
  isOpen,
  listings,
  selectedListingId,
  onSelectListing,
}: SearchMapListingSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const orderedListings = selectedListingId
    ? [
        ...listings.filter((listing) => listing.id === selectedListingId),
        ...listings.filter((listing) => listing.id !== selectedListingId),
      ]
    : listings;

  useLayoutEffect(() => {
    if (!isOpen || selectedListingId == null) return;

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const card = scrollEl.querySelector<HTMLElement>(
      `[data-map-slider-card="${selectedListingId}"]`,
    );
    if (!card) return;

    const run = () => {
      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
  }, [isOpen, selectedListingId, listings]);

  return (
    <section
      className={`absolute inset-x-0 bottom-[max(76px,calc(env(safe-area-inset-bottom)+76px))] z-500 transition-all duration-300 ease-out ${
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-8 opacity-0"
      }`}
      aria-label="آگهی‌های روی نقشه"
      dir="rtl"
    >
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain px-3 pb-3 pt-1 scrollbar-none [-ms-overflow-style:none] min-[390px]:gap-3 min-[390px]:px-4 min-[390px]:pb-5 [&::-webkit-scrollbar]:hidden"
      >
        {orderedListings.map((listing) => (
          <MapAdCard
            key={listing.id}
            listing={listing}
            isSelected={listing.id === selectedListingId}
            onClick={() => onSelectListing(listing)}
          />
        ))}
      </div>
    </section>
  );
}

function mapCardPriceDisplay(priceValue: string) {
  return priceValue.replace(/[٫.]/g, "/");
}

function MapAdCard({
  listing,
  isSelected,
  onClick,
}: {
  listing: SearchMapListing;
  isSelected: boolean;
  onClick: () => void;
}) {
  const raw =
    listing.images?.length > 0 ? listing.images : searchMapCardDemoImages;

  const images =
    raw.length >= 4
      ? raw.slice(0, 4)
      : [...raw, ...searchMapCardDemoImages].slice(0, 4);

  return (
    <button
      data-map-slider-card={listing.id}
      className={`flex w-[min(300px,calc(100vw-2.75rem))] shrink-0 snap-center snap-always flex-col overflow-hidden rounded-2xl bg-white p-3 text-right shadow-[0_6px_24px_rgba(26,26,26,0.14)] transition-all duration-200 active:scale-[0.985] min-[390px]:p-4 min-[390px]:shadow-[0_8px_28px_rgba(26,26,26,0.22)] ${
        isSelected
          ? "ring-2 ring-[#0048c4] ring-offset-0 ring-offset-transparent"
          : ""
      }`}
      type="button"
      onClick={onClick}
      dir="rtl"
    >
      <ImageSlider images={images} />

      <div className="mt-2 flex min-h-5 flex-wrap items-baseline justify-start gap-1.5 [direction:rtl] min-[390px]:mt-2.5">
        {listing.priceLabel ? (
          <span className="text-xs font-medium leading-4 text-[#808080] min-[390px]:text-sm min-[390px]:leading-5">
            {listing.priceLabel}:
          </span>
        ) : null}
        <strong className="text-sm font-semibold leading-5 text-[#0048c4] min-[390px]:text-base min-[390px]:leading-6">
          {mapCardPriceDisplay(listing.priceValue)}
        </strong>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-start gap-2.5 text-xs font-medium leading-4 text-[#1a1a1a] [direction:rtl] min-[390px]:mt-2.5 min-[390px]:gap-3 min-[390px]:text-sm min-[390px]:leading-5">
        <PropertyMeta
          className="ad-card__property--area"
          label={listing.area}
        />
        <PropertyMeta
          className="ad-card__property--rooms"
          label={listing.rooms}
        />
        <PropertyMeta
          className="ad-card__property--year"
          label={listing.year}
        />
      </div>

      <h3 className="mt-2 truncate text-right text-xs font-medium leading-5 text-[#1a1a1a] min-[390px]:text-sm min-[390px]:leading-5">
        {listing.title}
      </h3>

      <div className="mt-2 flex min-h-5 flex-row flex-wrap items-center justify-start gap-2 [direction:rtl] min-[390px]:mt-2.5">
        <div className="ad-card__badges inline-flex items-center gap-1">
          <span className="whitespace-nowrap rounded-lg border border-[#ff6d00] px-1.5 py-px text-xs font-medium leading-4 text-[#ff6d00] min-[390px]:px-2 min-[390px]:py-[3px] min-[390px]:text-xs min-[390px]:leading-4">
            فوری
          </span>
        </div>

        <span className="min-w-0 truncate text-xs font-normal leading-4 text-[#808080] min-[390px]:text-sm min-[390px]:leading-5">
          {listing.postedAt} در {listing.locationLabel}
        </span>
      </div>
    </button>
  );
}

function ImageSlider({ images }: { images: string[] }) {
  return (
    <div className="h-16 w-full overflow-hidden min-[390px]:h-20" dir="ltr">
      <div
        className="
          flex h-16 w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth scrollbar-none
          [-ms-overflow-style:none] min-[390px]:h-20 min-[390px]:gap-2.5
        "
        onClick={(event) => {
          event.stopPropagation();
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onTouchStart={(event) => {
          event.stopPropagation();
        }}
      >
        {images.map((src, imageIndex) => (
          <img
            key={`${src}-${imageIndex}`}
            className="h-16 w-[96px] shrink-0 snap-start rounded-lg object-cover min-[390px]:h-20 min-[390px]:w-[120px] min-[390px]:rounded-xl"
            src={src}
            alt=""
            draggable={false}
            loading={imageIndex < 2 ? "eager" : "lazy"}
            onError={(event) => {
              const target = event.currentTarget;

              if (target.dataset.fallback === "1") return;

              target.dataset.fallback = "1";
              target.src = SEARCH_MAP_DEMO_PHOTO;
            }}
          />
        ))}
      </div>
    </div>
  );
}

function PropertyMeta({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <span className={`ad-card__property text-[#4d4d4d] ${className}`}>
      {label}
    </span>
  );
}
