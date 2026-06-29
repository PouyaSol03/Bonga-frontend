import { DivIcon } from "leaflet";
import { Marker } from "react-leaflet";

import type { SearchMapDotMarker, SearchMapListing } from "../searchMapData";

type SearchMapListingMarkerProps = {
  listing: SearchMapListing;
  isSeen: boolean;
  isSelected: boolean;
  onSelect: (listing: SearchMapListing) => void;
};

type SearchMapDotMarkerProps = {
  marker: SearchMapDotMarker;
  listing?: never;
  isSeen?: never;
  isSelected?: never;
  onSelect?: never;
};

type SearchMapMarkerProps = SearchMapListingMarkerProps | SearchMapDotMarkerProps;

export function SearchMapMarker(props: SearchMapMarkerProps) {
  if ("marker" in props) {
    const markerIcon = createSearchStaticDotIcon();

    return (
      <Marker
        position={[props.marker.latitude, props.marker.longitude]}
        icon={markerIcon}
        zIndexOffset={0}
      />
    );
  }

  const { listing, isSeen, isSelected, onSelect } = props;
  const markerIcon = createSearchListingIcon(listing.priceValue, isSelected, isSeen);

  return (
    <Marker
      position={[listing.latitude, listing.longitude]}
      icon={markerIcon}
      zIndexOffset={isSelected ? 10_000 : 1_000}
      eventHandlers={{
        click: (event) => {
          onSelect(listing);
          event.originalEvent?.stopPropagation?.();
        },
      }}
    />
  );
}

function escapeMarkerText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createSearchListingIcon(priceValue: string, isSelected: boolean, isSeen: boolean) {
  const safePriceValue = escapeMarkerText(priceValue);
  const markerClasses = [
    "search-map-listing-marker",
    isSelected ? "search-map-listing-marker--selected" : "",
    isSeen ? "search-map-listing-marker--seen" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return new DivIcon({
    className: "search-map-marker-wrapper",
    html: `
      <div class="${markerClasses}">
        <span class="search-map-dot search-map-listing-marker__dot"></span>
        <span class="search-map-marker">
          ${safePriceValue}
        </span>
      </div>
    `,
    iconSize: [120, 42],
    iconAnchor: [60, 24],
  });
}

function createSearchStaticDotIcon() {
  return new DivIcon({
    className: "search-map-marker-wrapper",
    html: '<div class="search-map-dot"></div>',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}
