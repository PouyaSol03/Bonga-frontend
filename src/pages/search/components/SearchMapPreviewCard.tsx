import { AdCard, type AdCardData } from "../../../components/AdCard";
import type { SearchMapListing } from "../searchMapData";
import { SEARCH_MAP_FALLBACK_IMAGE } from "../searchMapData";

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
  return (
    <AdCard
      ad={searchMapListingToPreviewAdCardData(listing)}
      isSelected={isSelected}
      mapPreviewFallbackImage={SEARCH_MAP_FALLBACK_IMAGE}
      mapPreviewImages={normalizePreviewImages(listing.images)}
      mapSliderCardId={listing.id}
      state={getAdNavigationState()}
      to={`/ads/${listing.id}`}
      variant="mapPreview"
    />
  );
}

function searchMapListingToPreviewAdCardData(listing: SearchMapListing): AdCardData {
  return {
    id: listing.id,
    agency: listing.agencyName,
    status: "",
    imageCount: String(listing.images.length || 1),
    priceLabelPrimary: "",
    pricePrimary: mapCardPriceDisplay(listing.priceValue),
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

function normalizePreviewImages(images: string[]) {
  const safeImages = images.length > 0 ? images : [SEARCH_MAP_FALLBACK_IMAGE];

  return safeImages.slice(0, previewImageCount);
}

function mapCardPriceDisplay(priceValue: string) {
  return priceValue.replace(/[٫.]/g, "/");
}
