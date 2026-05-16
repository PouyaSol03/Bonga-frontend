import { DivIcon } from "leaflet";
import { Marker } from "react-leaflet";

import type { SearchMapListing } from "../searchMapData";

type SearchMapMarkerProps = {
  listing: SearchMapListing;
  isSelected: boolean;
  onSelect: (listing: SearchMapListing) => void;
};

export function SearchMapMarker({
  listing,
  isSelected,
  onSelect,
}: SearchMapMarkerProps) {
  const markerIcon = createSearchMarkerIcon(listing.priceValue, isSelected);

  return (
    <Marker
      position={[listing.latitude, listing.longitude]}
      icon={markerIcon}
      eventHandlers={{
        click: () => onSelect(listing),
      }}
    />
  );
}

function createSearchMarkerIcon(priceValue: string, isSelected: boolean) {
  return new DivIcon({
    className: "search-map-marker-wrapper",
    html: `
      <div class="search-map-marker ${isSelected ? "search-map-marker--selected" : ""}">
        ${priceValue}
      </div>
    `,
    iconSize: [96, 42],
    iconAnchor: [48, 42],
  });
}