import type { SearchMapListing } from "../searchMapData";

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
  return (
    <section
      className={`absolute inset-x-0 bottom-[max(82px,calc(env(safe-area-inset-bottom)+82px))] z-[500] transition-all duration-300 ease-out sm:bottom-[max(96px,calc(env(safe-area-inset-bottom)+96px))] ${
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0"
      }`}
      aria-label="آگهی‌های روی نقشه"
      dir="rtl"
    >
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
        {listings.map((listing) => (
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

function MapAdCard({
  listing,
  isSelected,
  onClick,
}: {
  listing: SearchMapListing;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex w-[312px] shrink-0 snap-center flex-col rounded-2xl bg-white p-3 text-right shadow-[0_8px_28px_rgba(26,26,26,0.16)] transition-transform active:scale-[0.98] sm:w-[360px] ${
        isSelected ? "ring-2 ring-[#0048c4]" : ""
      }`}
      type="button"
      onClick={onClick}
    >
      <div className="flex gap-3 overflow-hidden">
        <div
          className={`ad-card__image h-[96px] w-[132px] shrink-0 rounded-xl bg-cover bg-center sm:h-[104px] sm:w-[148px] ${
            listing.imageClassName ?? ""
          }`}
          aria-hidden="true"
        />

        <div
          className={`ad-card__image h-[96px] w-[132px] shrink-0 rounded-xl bg-cover bg-center sm:h-[104px] sm:w-[148px] ${
            listing.imageClassName ?? ""
          }`}
          aria-hidden="true"
        />
      </div>

      <div className="mt-3 flex items-center justify-start gap-1">
        <strong className="text-base font-bold leading-6 text-[#0048c4] sm:text-lg">
          {listing.priceValue}
        </strong>
      </div>

      <div className="mt-2 flex items-center justify-start gap-4 text-xs font-medium leading-4 text-[#1a1a1a] sm:text-sm sm:leading-5">
        <span>{listing.area}</span>
        <span>{listing.rooms}</span>
        <span>{listing.year}</span>
      </div>

      <h3 className="mt-3 line-clamp-1 text-sm font-medium leading-5 text-[#1a1a1a] sm:text-base sm:leading-6">
        {listing.title}
      </h3>

      <div className="mt-3 flex items-center justify-start gap-2">
        <span className="rounded-lg border border-[#ff6d00] px-2 py-1 text-xs font-medium leading-4 text-[#ff6d00]">
          فوری
        </span>

        <span className="h-5 w-px bg-[#cccccc]" aria-hidden="true" />

        <span className="min-w-0 truncate text-xs font-normal leading-4 text-[#808080] sm:text-sm sm:leading-5">
          ۱ ساعت پیش در {listing.locationLabel}
        </span>
      </div>
    </button>
  );
}
