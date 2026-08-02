import LinearMapsLocation from "../../../shared/icons/LinearMapsLocation";
import { AdCard } from "../../../shared/components/AdCard";
import type { AdCardData } from "../../../shared/components/AdCard";
import { AdCardSkeleton } from "../../../shared/components/AdCardSkeleton";
import { SearchNoResultsRequestCard } from "./SearchNoResultsRequestCard";
import type { SearchMapListing } from "../searchMapData";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

type SearchMapListViewProps = {
  hasEmptyResults?: boolean;
  isLoading?: boolean;
  listings: SearchMapListing[];
  onMapClick: () => void;
  onRequestSubmit?: (title: string) => void;
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
    timeAndLocation: listing.postedAt || (listing.locationLabel ? `در ${listing.locationLabel}` : ""),
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
  onRequestSubmit,
}: SearchMapListViewProps) {
  return (
    <>
      <main
        className="absolute inset-0 z-0 flex min-h-0 flex-col overflow-y-auto overscroll-contain bg-white pb-20 pt-[60px]"
        aria-label="لیست آگهی‌ها"
        dir="rtl"
      >
        <div className={`flex min-h-full flex-col ${hasEmptyResults ? "bg-white" : "bg-[#f0f0f0]"}`}>
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <AdCardSkeleton
                  className="shrink-0 border-b-[12px] border-[#f0f0f0] last:border-b-0"
                  key={index}
                />
              ))
            : hasEmptyResults
              ? (
                <div className="flex flex-1 flex-col bg-white pt-3">
                  <SearchNoResultsRequestCard className="mx-4" onSubmit={onRequestSubmit} />
                </div>
              )
            : listings.map((listing) => (
                <AdCard
                  className="shrink-0 border-b-[12px] border-[#f0f0f0] last:border-b-0"
                  key={listing.id}
                  ad={searchMapListingToAdCardData(listing)}
                  to={`/ads/${listing.id}`}
                />
              ))}
        </div>
      </main>

      <Button unstyled
        className="absolute bottom-4 left-1/2 z-[520] flex -translate-x-1/2 items-center justify-center gap-2 rounded-xl bg-[#0048c4] px-4 py-2 text-sm font-bold leading-5 text-white shadow-[0_10px_26px_rgba(0,72,196,0.24)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
        type="button"
        onClick={onMapClick}
      >
        <LinearMapsLocation className="h-6 w-6" />
        <Typography as="span" variant="label" size="large" weight="medium">نقشه</Typography>
      </Button>
    </>
  );
}

