import { DivIcon } from "leaflet";
import { Marker } from "react-leaflet";

import type { SearchMapDotMarker, SearchMapListing } from "../searchMapData";

type SearchMapListingMarkerProps = {
  listing: SearchMapListing;
  isSelected: boolean;
  onSelect: (listing: SearchMapListing) => void;
};

type SearchMapDotMarkerProps = {
  marker: SearchMapDotMarker;
  listing?: never;
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
      />
    );
  }

  const { listing, isSelected, onSelect } = props;
  const markerIcon =
    listing.showPriceMarker === false
      ? createSearchStaticDotIcon(isSelected)
      : createSearchListingIcon(listing.priceValue, isSelected);

  return (
    <Marker
      position={[listing.latitude, listing.longitude]}
      icon={markerIcon}
      zIndexOffset={isSelected ? 1000 : 0}
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

function formatMarkerPrice(priceValue: string) {
  return priceValue.replace(/[٫.]/g, "/");
}

function createSearchListingIcon(priceValue: string, isSelected: boolean) {
  const safePriceValue = escapeMarkerText(formatMarkerPrice(priceValue));

  return new DivIcon({
    className: "search-map-marker-wrapper",
    html: `
      <div class="search-map-listing-marker ${isSelected ? "search-map-listing-marker--selected" : ""}" dir="rtl">
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

function createSearchStaticDotIcon(isSelected = false) {
  return new DivIcon({
    className: "search-map-marker-wrapper",
    html: `<div class="search-map-dot${isSelected ? " search-map-dot--selected" : ""}"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
}
