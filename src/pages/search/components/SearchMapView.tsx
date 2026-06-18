import { useCallback, useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
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
  selectedListingId: SearchMapListingId | null;
  tileConfig: SearchMapTileConfig;
  onBoundsChange: (bounds: SearchMapBounds) => void;
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

function SearchMapController({
  center,
  onBoundsChange,
}: {
  center: SearchMapCenter;
  onBoundsChange: (bounds: SearchMapBounds) => void;
}) {
  const map = useMap();
  const emitBounds = useCallback(() => {
    onBoundsChange(getMapBounds(map));
  }, [map, onBoundsChange]);

  useMapEvents({
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
  selectedListingId,
  tileConfig,
  onBoundsChange,
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

      <SearchMapController center={center} onBoundsChange={onBoundsChange} />

      {dotMarkers.map((marker) => (
        <SearchMapMarker key={marker.id} marker={marker} />
      ))}

      {listings.map((listing) => (
        <SearchMapMarker
          key={listing.id}
          listing={listing}
          isSelected={listing.id === selectedListingId}
          onSelect={onSelectListing}
        />
      ))}
    </MapContainer>
  );
}
