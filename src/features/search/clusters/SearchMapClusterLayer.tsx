import { memo, useMemo } from "react";
import { useMap } from "react-leaflet";
import type { SearchMapListing, SearchMapListingId } from "../searchMapData";
import { SearchMapMarker } from "../components/SearchMapMarker";
import { SearchMapClusterMarker } from "./SearchMapClusterMarker";
import type { SearchMapSingleItem } from "./searchMapClusterTypes";
import { useSearchMapClusters } from "./useSearchMapClusters";

interface SearchMapClusterLayerProps {
  listings: SearchMapListing[];
  priceMarkerListingIds: Set<SearchMapListingId>;
  seenListingIds: Set<SearchMapListingId>;
  selectedListingId: SearchMapListingId | null;
  onSelectListing: (listing: SearchMapListing) => void;
  maxZoom?: number;
  mapMaxZoom?: number;
  radius?: number;
}

const PRICE_PILL_COLLISION_X = 88;
const PRICE_PILL_COLLISION_Y = 34;
const FAR_ZOOM_PRICE_LIMIT = 6;
const FAR_ZOOM_THRESHOLD = 14;

function SearchMapClusterLayerComponent({
  listings,
  priceMarkerListingIds,
  seenListingIds,
  selectedListingId,
  onSelectListing,
  maxZoom = 16,
  mapMaxZoom = 19,
  radius = 48,
}: SearchMapClusterLayerProps) {
  const map = useMap();
  const { items, zoom, expandCluster } = useSearchMapClusters({
    listings,
    maxZoom,
    mapMaxZoom,
    radius,
  });

  const visiblePriceIds = useMemo(() => {
    const chosen = new Set<string>();
    const placedPoints: Array<{ x: number; y: number }> = [];
    const singles = items.filter((item): item is SearchMapSingleItem => !item.isCluster);
    const isFarZoom = zoom < FAR_ZOOM_THRESHOLD;
    const collisionX = isFarZoom ? 104 : PRICE_PILL_COLLISION_X;
    const collisionY = isFarZoom ? 40 : PRICE_PILL_COLLISION_Y;

    const selectedItem =
      selectedListingId == null
        ? undefined
        : singles.find((item) => String(item.listing.id) === String(selectedListingId));

    if (selectedItem) {
      const point = map.latLngToContainerPoint([selectedItem.latitude, selectedItem.longitude]);
      chosen.add(String(selectedItem.listing.id));
      placedPoints.push({ x: point.x, y: point.y });
    }

    for (const item of singles) {
      if (isFarZoom && chosen.size >= FAR_ZOOM_PRICE_LIMIT) {
        break;
      }

      const idKey = String(item.listing.id);
      if (chosen.has(idKey) || !priceMarkerListingIds.has(item.listing.id)) {
        continue;
      }

      const point = map.latLngToContainerPoint([item.latitude, item.longitude]);
      const overlaps = placedPoints.some(
        (placed) =>
          Math.abs(placed.x - point.x) < collisionX &&
          Math.abs(placed.y - point.y) < collisionY,
      );

      if (!overlaps) {
        chosen.add(idKey);
        placedPoints.push({ x: point.x, y: point.y });
      }
    }

    return chosen;
  }, [items, map, priceMarkerListingIds, selectedListingId, zoom]);

  return (
    <>
      {items.map((item) => {
        if (item.isCluster) {
          return (
            <SearchMapClusterMarker
              key={String(item.id)}
              cluster={item}
              onSelect={expandCluster}
            />
          );
        }

        const listing = item.listing;
        const isSelected =
          selectedListingId != null &&
          String(listing.id) === String(selectedListingId);

        return (
          <SearchMapMarker
            key={String(item.id)}
            listing={listing}
            isPriceVisible={isSelected || visiblePriceIds.has(String(listing.id))}
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
