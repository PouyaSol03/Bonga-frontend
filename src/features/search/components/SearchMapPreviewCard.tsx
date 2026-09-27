import { AdCard, type AdCardData } from "../../advertisements/components/AdCard";
import type { SearchMapListing } from "../searchMapData";

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
    imageCount: String(listing.images.length),
    priceLabelPrimary: "",
    pricePrimary: mapCardPriceDisplay(listing.priceValue),
    priceLabelSecondary: "",
    priceSecondary: listing.priceSecondary ? mapCardPriceDisplay(listing.priceSecondary) : "",
    area: listing.area,
    rooms: listing.rooms,
    year: listing.year,
    landArea: listing.landArea,
    documentType: listing.documentType,
    commercialPosition: listing.commercialPosition,
    landPosition: listing.landPosition,
    floor: listing.floor,
    buildingArea: listing.buildingArea,
    capacity: listing.capacity,
    stars: listing.stars,
    rentalPeriod: listing.rentalPeriod,
    category: listing.category,
    formCode: listing.formCode,
    projectType: listing.projectType,
    totalFloors: listing.totalFloors,
    totalUnits: listing.totalUnits,
    builderShare: listing.builderShare,
    currentStatus: listing.currentStatus,
    title: listing.title,
    timeAndLocation: listing.postedAt || (listing.locationLabel ? `در ${listing.locationLabel}` : ""),
    imageClassName: listing.imageClassName ?? "",
    imageUrl: listing.imageSrc,
    badges: listing.badges ?? [],
  };
}

function normalizePreviewImages(images: string[]) {
  return images.slice(0, previewImageCount);
}

function mapCardPriceDisplay(priceValue: string) {
  return priceValue.replace(/[٫.]/g, "/");
}
