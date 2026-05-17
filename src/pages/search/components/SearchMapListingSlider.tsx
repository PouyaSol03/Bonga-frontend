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
  const orderedListings = selectedListingId
    ? [
        ...listings.filter((listing) => listing.id === selectedListingId),
        ...listings.filter((listing) => listing.id !== selectedListingId),
      ]
    : listings;

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
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-4 pb-5 pt-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
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
      className={`flex h-56 w-[300px] shrink-0 snap-center snap-always flex-col overflow-hidden rounded-[20px] bg-white p-4 text-right shadow-[0_8px_28px_rgba(26,26,26,0.22)] transition-all duration-200 active:scale-[0.985] ${
        isSelected ? "ring-1 ring-[#0048c4]/20" : ""
      }`}
      type="button"
      onClick={onClick}
      dir="rtl"
    >
      <ImageSlider images={images} />

      <div className="mt-7 flex h-5 items-center justify-start">
        <strong className="text-[22px] font-bold leading-5 text-[#0048c4]">
          {mapCardPriceDisplay(listing.priceValue)}
        </strong>
      </div>

      <div className="mt-7 flex h-5 items-center justify-end gap-6 text-base font-medium leading-5 text-[#1a1a1a]">
        <PropertyMeta
          className="ad-card__property--year"
          label={listing.year}
        />
        <PropertyMeta
          className="ad-card__property--rooms"
          label={listing.rooms}
        />
        <PropertyMeta
          className="ad-card__property--area"
          label={listing.area}
        />
      </div>

      <h3 className="mt-2 h-5 truncate text-xl font-medium leading-5 text-[#1a1a1a]">
        {listing.title}
      </h3>

      <div className="mt-2 flex h-5 items-center justify-end gap-2 text-base font-normal leading-5 text-[#808080]">
        <span className="rounded-lg border border-[#f04438]/25 px-1.5 py-px text-base font-medium leading-5 text-[#d92d20]">
          فوری
        </span>

        <span className="h-5 w-px bg-[#cccccc]" aria-hidden="true" />

        <span className="min-w-0 truncate">
          {listing.postedAt} در {listing.locationLabel}
        </span>
      </div>
    </button>
  );
}

function ImageSlider({ images }: { images: string[] }) {
  return (
    <div className="h-20 w-full overflow-hidden" dir="ltr">
      <div
        className="
          flex h-20 w-full snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth
          [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
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
            className="h-20 w-[120px] shrink-0 snap-start rounded-xl object-cover"
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
    <span className={`ad-card__property ${className} text-[#4d4d4d]`}>
      {label}
    </span>
  );
}

function GalleryGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="2.5"
        width="6.5"
        height="6.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="8.5"
        y="2.5"
        width="6"
        height="4.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="8.5"
        y="8.5"
        width="6"
        height="5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <rect
        x="1.5"
        y="10.5"
        width="6.5"
        height="3"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function BuildingGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 14V6.2L8 3l5 3.2V14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.5 14h11M6 14v-3h4v3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 8.5h1M8.5 8.5h1M6.5 10.5h1M8.5 10.5h1"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}
