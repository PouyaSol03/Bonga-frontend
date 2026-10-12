import { memo } from "react";
import type { SearchMapListing, SearchMapListingId } from "../searchMapData";
import { SearchMapMarker } from "../components/SearchMapMarker";
import { SearchMapClusterMarker } from "./SearchMapClusterMarker";
import { useSearchMapClusters } from "./useSearchMapClusters";

interface SearchMapClusterLayerProps {
  listings: SearchMapListing[];
  priceMarkerListingIds: Set<SearchMapListingId>;
  seenListingIds: Set<SearchMapListingId>;
  selectedListingId: SearchMapListingId | null;
  onSelectListing: (listing: SearchMapListing) => void;
  maxZoom?: number;
  radius?: number;
}

function SearchMapClusterLayerComponent({
  listings,
  priceMarkerListingIds,
  seenListingIds,
  selectedListingId,
  onSelectListing,
  maxZoom = 17,
  radius = 60,
}: SearchMapClusterLayerProps) {
  const items = useSearchMapClusters({
    listings,
    maxZoom,
    radius,
  });

  return (
    <>
      {items.map((item) => {
        if (item.isCluster) {
          return <SearchMapClusterMarker key={String(item.id)} cluster={item} />;
        }

        const listing = item.listing;
        const isSelected =
          selectedListingId != null &&
          String(listing.id) === String(selectedListingId);

        return (
          <SearchMapMarker
            key={String(item.id)}
            listing={listing}
            isPriceVisible={isSelected || priceMarkerListingIds.has(listing.id)}
            isSeen={seenListingIds.has(listing.id)}
            isSelected={isSelected}
            onSelect={onSelectListing}
          />
        );
      })}
    </>
  );
}

export const SearchMapClusterLayer = memo(SearchMapClusterLayerComponent);
