import { useCallback, useEffect } from "react";
import { DivIcon } from "leaflet";
import { Circle, MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import type { BrowserLocation } from "../../../lib/browserLocation";
import { SearchMapMarker } from "./SearchMapMarker";
import type {
  SearchMapBounds,
  SearchMapCenter,
  SearchMapDotMarker,
  SearchMapListing,
  SearchMapListingId,
  SearchMapTileConfig,
} from "../searchMapData";

type SearchMapViewProps = {
  center: SearchMapCenter;
  listings: SearchMapListing[];
  dotMarkers?: SearchMapDotMarker[];
  seenListingIds: Set<SearchMapListingId>;
  selectedListingId: SearchMapListingId | null;
  tileConfig: SearchMapTileConfig;
  userLocation?: BrowserLocation | null;
  onBoundsChange: (bounds: SearchMapBounds) => void;
  onMapClick: () => void;
  onSelectListing: (listing: SearchMapListing) => void;
};

function getMapBounds(map: ReturnType<typeof useMap>): SearchMapBounds {
  const bounds = map.getBounds();

  return {
    east: bounds.getEast(),
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    west: bounds.getWest(),
  };
}

function createUserLocationIcon() {
  return new DivIcon({
    className: "search-map-marker-wrapper",
    html: '<div class="search-map-user-marker"><span></span></div>',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function SearchMapController({
  center,
  onBoundsChange,
  onMapClick,
}: {
  center: SearchMapCenter;
  onBoundsChange: (bounds: SearchMapBounds) => void;
  onMapClick: () => void;
}) {
  const map = useMap();
  const emitBounds = useCallback(() => {
    onBoundsChange(getMapBounds(map));
  }, [map, onBoundsChange]);

  useMapEvents({
    click: onMapClick,
    moveend: emitBounds,
    zoomend: emitBounds,
  });

  useEffect(() => {
    map.invalidateSize();
    emitBounds();

    const timer = window.setTimeout(() => {
      map.invalidateSize();
      emitBounds();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [emitBounds, map]);

  useEffect(() => {
    map.setView([center.latitude, center.longitude], center.zoom, {
      animate: true,
    });
  }, [center.latitude, center.longitude, center.zoom, map]);

  return null;
}

export function SearchMapView({
  center,
  listings,
  dotMarkers = [],
  seenListingIds,
  selectedListingId,
  tileConfig,
  userLocation,
  onBoundsChange,
  onMapClick,
  onSelectListing,
}: SearchMapViewProps) {
  return (
    <MapContainer
      className="relative z-0 h-full min-h-[320px] w-full bg-[#f5f5f5]"
      center={[center.latitude, center.longitude]}
      zoom={center.zoom}
      minZoom={tileConfig.minZoom}
      maxZoom={tileConfig.maxZoom}
      zoomControl={false}
      attributionControl={false}
      preferCanvas
    >
      <TileLayer
        url={tileConfig.urlTemplate}
        attribution={tileConfig.attribution}
        tms={tileConfig.isTms}
      />

      <SearchMapController
        center={center}
        onBoundsChange={onBoundsChange}
        onMapClick={onMapClick}
      />

      {dotMarkers.map((marker) => (
        <SearchMapMarker key={marker.id} marker={marker} />
      ))}

      {listings.map((listing) => (
        <SearchMapMarker
          key={listing.id}
          listing={listing}
          isSeen={seenListingIds.has(listing.id)}
          isSelected={String(listing.id) === String(selectedListingId)}
          onSelect={onSelectListing}
        />
      ))}

      {userLocation ? (
        <>
          {userLocation.accuracy ? (
            <Circle
              center={[userLocation.latitude, userLocation.longitude]}
              pathOptions={{
                color: "#0048c4",
                fillColor: "#0048c4",
                fillOpacity: 0.08,
                opacity: 0.18,
                weight: 1,
              }}
              radius={Math.min(userLocation.accuracy, 250)}
            />
          ) : null}
          <Marker
            icon={createUserLocationIcon()}
            position={[userLocation.latitude, userLocation.longitude]}
            zIndexOffset={20_000}
          />
        </>
      ) : null}
    </MapContainer>
  );
}
