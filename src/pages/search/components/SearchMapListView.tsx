import { AdCard } from "../../../components/AdCard";
import type { AdCardData } from "../../../components/AdCard";
import type { SearchMapListing } from "../searchMapData";

type SearchMapListViewProps = {
  listings: SearchMapListing[];
  onMapClick: () => void;
};

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function toFaCount(n: number): string {
  const safe = Math.max(0, Math.floor(n));
  return String(safe).replace(/\d/g, (d) => FA_DIGITS[Number(d)] ?? d);
}

function searchMapListingToAdCardData(listing: SearchMapListing): AdCardData {
  const imageCount = listing.images?.length ?? 0;

  return {
    id: listing.id,
    agency: listing.agencyName,
    status: "",
    imageCount: toFaCount(imageCount > 0 ? imageCount : 1),
    priceLabelPrimary: "",
    pricePrimary: listing.priceValue.replace(/[٫.]/g, "/"),
    priceLabelSecondary: "",
    priceSecondary: "",
    area: listing.area,
    rooms: listing.rooms,
    year: listing.year,
    title: listing.title,
    timeAndLocation: `${listing.postedAt} در ${listing.locationLabel}`,
    imageClassName: listing.imageClassName ?? "",
    badges: ["فوری"],
  };
}

export function SearchMapListView({
  listings,
  onMapClick,
}: SearchMapListViewProps) {
  return (
    <>
      <main
        className="min-h-0 flex-1 overflow-y-auto bg-white pb-24 pt-28"
        aria-label="لیست آگهی‌ها"
        dir="rtl"
      >
        <div className="flex flex-col">
          {listings.map((listing) => (
            <AdCard
              key={listing.id}
              ad={searchMapListingToAdCardData(listing)}
            />
          ))}
        </div>
      </main>

      <button
        className="absolute bottom-[max(80px,calc(env(safe-area-inset-bottom)+80px))] left-1/2 z-520 flex h-10 min-w-[99px] -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-[#0048c4] px-4 text-xl font-bold leading-6 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        type="button"
        onClick={onMapClick}
      >
        <span>نقشه</span>
        <MapLocationIcon />
      </button>
    </>
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
