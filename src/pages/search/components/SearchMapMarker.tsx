import { DivIcon } from "leaflet";
import { Marker } from "react-leaflet";

import type { SearchMapDotMarker, SearchMapListing } from "../searchMapData";

type SearchMapListingMarkerProps = {
  listing: SearchMapListing;
  isPriceVisible: boolean;
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
  const markerIcon = createSearchListingIcon(
    props.isPriceVisible ? listing.priceValue : "",
    props.isPriceVisible,
    isSelected,
    isSeen,
  );

  return (
    <Marker
      key={`${listing.id}-${isSelected ? "selected" : "idle"}-${props.isPriceVisible ? "price" : "dot"}-${isSeen ? "seen" : "new"}`}
      position={[listing.latitude, listing.longitude]}
      icon={markerIcon}
      zIndexOffset={isSelected ? 10_000 : props.isPriceVisible ? 5_000 : 1_000}
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

function createSearchListingIcon(
  priceValue: string,
  isPriceVisible: boolean,
  isSelected: boolean,
  isSeen: boolean,
) {
  const safePriceValue = escapeMarkerText(priceValue);
  const priceMarkerHtml = isPriceVisible
    ? `
        <span class="search-map-marker">
          ${safePriceValue}
        </span>
      `
    : "";
  const markerClasses = [
    "search-map-listing-marker",
    isSelected ? "search-map-listing-marker--selected" : "",
    isPriceVisible ? "search-map-listing-marker--price-visible" : "",
    isSeen ? "search-map-listing-marker--seen" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return new DivIcon({
    className: "search-map-marker-wrapper",
    html: `
      <div class="${markerClasses}">
        <span class="search-map-dot search-map-listing-marker__dot"></span>
        ${priceMarkerHtml}
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
