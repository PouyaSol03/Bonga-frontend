import type { SearchMapListing } from "../searchMapData";

type SearchMapListViewProps = {
  listings: SearchMapListing[];
  onMapClick: () => void;
};

export function SearchMapListView({
  listings,
  onMapClick,
}: SearchMapListViewProps) {
  return (
    <>
      <main
        className="min-h-0 flex-1 overflow-y-auto bg-white px-4 pt-32 pb-24"
        aria-label="لیست آگهی‌ها"
        dir="rtl"
      >
        <div className="flex flex-col gap-7">
          {listings.map((listing) => (
            <SearchListAdCard key={listing.id} listing={listing} />
          ))}
        </div>
      </main>

      <button
        className="absolute bottom-[max(80px,calc(env(safe-area-inset-bottom)+80px))] left-1/2 z-[520] flex h-10 min-w-[99px] -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-[#0048c4] px-4 text-xl font-bold leading-6 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        type="button"
        onClick={onMapClick}
      >
        <span>نقشه</span>
        <MapLocationIcon />
      </button>
    </>
  );
}

function SearchListAdCard({ listing }: { listing: SearchMapListing }) {
  return (
    <article className="border-b-8 border-[#f0f0f0] pb-6 text-right last:border-b-0">
      <div className="relative aspect-328/255 overflow-hidden rounded-2xl">
        <img
          className="h-full w-full object-cover"
          src={listing.imageSrc}
          alt={listing.title}
        />
      </div>

      <div className="mt-5 flex flex-col">
        <div className="flex items-start justify-start gap-1 text-[#0048c4]">
          <strong className="text-[24px] font-bold leading-7">
            {listing.priceValue}
          </strong>
          {listing.priceUnit ? (
            <span className="mt-5 text-base font-bold leading-5">
              {listing.priceUnit}
            </span>
          ) : null}
        </div>

        <div className="mt-6 flex items-center justify-end gap-7 text-xl font-medium leading-6 text-[#1a1a1a]">
          <PropertyMeta className="ad-card__property--year" label={listing.year} />
          <PropertyMeta className="ad-card__property--rooms" label={listing.rooms} />
          <PropertyMeta className="ad-card__property--area" label={listing.area} />
        </div>

        <h2 className="mt-5 line-clamp-1 text-[22px] font-medium leading-8 text-[#1a1a1a]">
          {listing.title}
        </h2>

        <div className="mt-4 flex items-center justify-end gap-3 text-lg font-normal leading-7 text-[#999999]">
          <span className="rounded-xl border border-[#f04438] px-3 py-1 text-lg font-medium leading-7 text-[#f04438]">
            فوری
          </span>
          <span className="h-8 w-px bg-[#cccccc]" aria-hidden="true" />
          <span>
            {listing.postedAt} در {listing.locationLabel}
          </span>
        </div>
      </div>
    </article>
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

function MapLocationIcon() {
  return (
    <svg
      className="h-6 w-6 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 5.5 9 3l6 2.5L20 3v15.5L15 21l-6-2.5L4 21V5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 3v15.5M15 5.5V21"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M17.5 8.5c0 2.4-3.5 6-3.5 6s-3.5-3.6-3.5-6a3.5 3.5 0 1 1 7 0Z"
        fill="#0048c4"
        stroke="white"
        strokeWidth="1.4"
      />
      <circle cx="14" cy="8.5" r="1.1" fill="white" />
    </svg>
  );
}
