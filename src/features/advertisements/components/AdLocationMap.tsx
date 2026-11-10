import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { DivIcon } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { searchMapTileConfig } from "../../search/searchMapData";

type AdLocationMapProps = {
  className?: string;
  latitude: number;
  longitude: number;
  title?: string;
};

function createAdMarkerIcon() {
  return new DivIcon({
    className: "ad-location-marker-icon",
    html: `
      <svg aria-hidden="true" width="31" height="42" viewBox="0 0 31 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="15.5" cy="40.5" rx="6" ry="1.5" fill="var(--on-surface)" fill-opacity="0.12"/>
        <path d="M20.738 30.061C26.721 27.916 31 22.199 31 15.484C31 6.932 24.06 0 15.5 0S0 6.932 0 15.484c0 6.715 4.279 12.431 10.261 14.577 2.136.868 3.947 2.591 3.947 4.778v3.87a1.292 1.292 0 0 0 2.584 0v-3.87c0-2.187 1.811-3.91 3.946-4.778Z" fill="var(--tertiary)"/>
        <circle cx="15.5" cy="15" r="6" fill="var(--surface-container-lowest)"/>
      </svg>
    `,
    iconAnchor: [15.5, 42],
    iconSize: [31, 42],
  });
}

export function AdLocationMap({
  className = "",
  latitude,
  longitude,
  title = "موقعیت روی نقشه",
}: AdLocationMapProps) {
  const markerIcon = useMemo(() => createAdMarkerIcon(), []);

  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    return null;
  }

  return (
    <div
      aria-label={title}
      className={`border-outline-var bg-surface-container relative h-[198px] overflow-hidden rounded-2xl border ${className}`}
    >
      <MapContainer
        key={`${latitude}-${longitude}`}
        attributionControl={false}
        center={[latitude, longitude]}
        className="h-full w-full"
        doubleClickZoom={false}
        dragging={false}
        keyboard={false}
        preferCanvas
        scrollWheelZoom={false}
        touchZoom={false}
        zoom={15}
        zoomControl={false}
      >
        <TileLayer
          attribution={searchMapTileConfig.attribution}
          className={searchMapTileConfig.className}
          maxZoom={searchMapTileConfig.maxZoom}
          minZoom={searchMapTileConfig.minZoom}
          tms={searchMapTileConfig.isTms}
          url={searchMapTileConfig.urlTemplate}
        />
        <Marker icon={markerIcon} interactive={false} position={[latitude, longitude]} />
      </MapContainer>
    </div>
  );
}
