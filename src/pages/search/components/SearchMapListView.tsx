import LinearMapsLocation from "../../../components/(icons)/LinearMapsLocation";
import { AdCard } from "../../../components/AdCard";
import type { AdCardData } from "../../../components/AdCard";
import { AdCardSkeleton } from "../../../components/AdCardSkeleton";
import SearchErrors from "../../home/components/SearchErrors";
import type { SearchMapListing } from "../searchMapData";

type SearchMapListViewProps = {
  hasEmptyResults?: boolean;
  isLoading?: boolean;
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
    timeAndLocation: [listing.postedAt, listing.locationLabel ? `در ${listing.locationLabel}` : ""]
      .filter(Boolean)
      .join(" "),
    imageClassName: listing.imageClassName ?? "",
    imageUrl: listing.imageSrc,
    badges: listing.badges ?? [],
  };
}

export function SearchMapListView({
  hasEmptyResults = false,
  isLoading = false,
  listings,
  onMapClick,
}: SearchMapListViewProps) {
  return (
    <>
      <main
        className="absolute inset-0 z-0 min-h-0 overflow-y-auto overscroll-contain bg-[#f0f0f0] pt-14"
        aria-label="لیست آگهی‌ها"
        dir="rtl"
      >
        <div className="flex flex-col gap-3 bg-[#f0f0f0]">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <AdCardSkeleton key={index} />
              ))
            : hasEmptyResults
              ? (
                <div className="min-h-[calc(100vh-11rem)] bg-white">
                  <SearchErrors variant="not-found" />
                </div>
              )
            : listings.map((listing) => (
                <AdCard
                  key={listing.id}
                  ad={searchMapListingToAdCardData(listing)}
                  to={`/ads/${listing.id}`}
                />
              ))}
        </div>
      </main>

      <button
        className="absolute bottom-4 left-1/2 z-520 flex h-10 min-w-[99px] -translate-x-1/2 items-center justify-center gap-2 rounded-2xl bg-[#0048c4] px-4 text-xl font-bold leading-6 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        type="button"
        onClick={onMapClick}
      >
        <LinearMapsLocation className="h-6 w-6"/>
        <span>نقشه</span>
      </button>
    </>
  );
}

