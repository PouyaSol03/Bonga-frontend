import { memo, useMemo } from "react";
import { DivIcon, DomEvent } from "leaflet";
import { Marker } from "react-leaflet";

import type { SearchMapDotMarker, SearchMapListing } from "../searchMapData";

type SearchMapListingMarkerProps = {
  listing: SearchMapListing;
  latitude?: number;
  longitude?: number;
  isPriceVisible: boolean;
  isSeen: boolean;
  isSelected: boolean;
  onSelect: (listing: SearchMapListing) => void;
};

type SearchMapDotMarkerProps = {
  marker: SearchMapDotMarker;
  listing?: never;
  latitude?: never;
  longitude?: never;
  isSeen?: never;
  isSelected?: never;
  onSelect?: never;
};

type SearchMapMarkerProps = SearchMapListingMarkerProps | SearchMapDotMarkerProps;

const staticDotIcon = new DivIcon({
  className: "search-map-marker-wrapper search-map-marker-wrapper--static",
  html: '<div class="search-map-dot search-map-dot--static"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function ListingMapMarker({
  listing,
  latitude,
  longitude,
  isSeen,
  isSelected,
  isPriceVisible,
  onSelect,
}: SearchMapListingMarkerProps) {
  const isPrice = isPriceVisible || isSelected;
  const isNew = Boolean(listing.isNew);
  const markerIcon = useMemo(() => {
    return isPrice
      ? createSearchPricePillIcon(listing.priceValue, isSelected, isSeen, isNew)
      : createSearchDotIcon(isSelected, isSeen);
  }, [isNew, isPrice, listing.priceValue, isSelected, isSeen]);

  return (
    <Marker
      position={[latitude ?? listing.latitude, longitude ?? listing.longitude]}
      icon={markerIcon}
      zIndexOffset={isSelected ? 100_000 : isPrice ? 5_000 : 1_000}
      eventHandlers={{
        click: (event) => {
          if (event.originalEvent) {
            DomEvent.stop(event.originalEvent);
          }
          onSelect(listing);
        },
      }}
    />
  );
}

function SearchMapMarkerComponent(props: SearchMapMarkerProps) {
  if ("marker" in props) {
    return (
      <Marker
        position={[props.marker.latitude, props.marker.longitude]}
        icon={staticDotIcon}
        interactive={false}
        zIndexOffset={0}
      />
    );
  }

  return (
    <ListingMapMarker
      listing={props.listing}
      latitude={props.latitude}
      longitude={props.longitude}
      isSeen={props.isSeen}
      isSelected={props.isSelected}
      isPriceVisible={props.isPriceVisible}
      onSelect={props.onSelect}
    />
  );
}

export const SearchMapMarker = memo(SearchMapMarkerComponent);

function escapeMarkerText(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createSearchDotIcon(isSelected: boolean, isSeen: boolean) {
  const dotClasses = [
    "search-map-dot",
    isSelected ? "search-map-dot--selected" : "",
    isSeen ? "search-map-dot--seen" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return new DivIcon({
    className: "search-map-marker-wrapper search-map-marker-wrapper--dot",
    html: `
      <div class="search-map-dot-hit-area">
        <span class="${dotClasses}"></span>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export function createSearchPricePillIcon(
  priceValue: string,
  isSelected: boolean,
  isSeen: boolean,
  isNew = false,
) {
  const safePriceValue = escapeMarkerText(priceValue);
  const pillClasses = [
    "search-map-marker",
    isSelected ? "search-map-marker--selected" : "",
    isSeen ? "search-map-marker--seen" : "",
  ]
    .filter(Boolean)
    .join(" ");
  const newBadgeHtml = isNew ? '<span class="search-map-marker__new-badge">جدید</span>' : "";

  return new DivIcon({
    className: "search-map-marker-wrapper search-map-marker-wrapper--price",
    html: `
      <div class="search-map-price-hit-area">
        <div class="${pillClasses}">
          ${newBadgeHtml}
          <span>${safePriceValue}</span>
          <span class="search-map-marker__arrow"></span>
        </div>
      </div>
    `,
    iconSize: [100, 40],
    iconAnchor: [50, 40],
  });
}
