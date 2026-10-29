import { useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { searchMapTileConfig } from "../../../search/searchMapData";
import { Typography } from "../../../../shared/ui/Typography";
import { Section } from "./AgencyProfileFields";
import type { AgencyProfileMapCenter } from "../types";

export function LocationSection({
  mapCenter,
  onMapCenterChange,
}: {
  mapCenter: AgencyProfileMapCenter;
  onMapCenterChange: (center: AgencyProfileMapCenter) => void;
}) {
  return (
    <Section title="موقعیت">
      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="text-on-surface mt-4 text-right text-sm font-medium"
      >
        برای تعیین موقعیت بر روی نقشه لمس کنید:
      </Typography>
      <div className="bg-surface-container-low relative mt-3 h-[220px] w-full overflow-hidden rounded-xl">
        <MapContainer
          attributionControl={false}
          center={[mapCenter.lat, mapCenter.lng]}
          className="bg-surface-container-low z-0 h-full w-full"
          maxZoom={searchMapTileConfig.maxZoom}
          minZoom={searchMapTileConfig.minZoom}
          preferCanvas
          scrollWheelZoom
          touchZoom
          zoom={mapCenter.zoom}
          zoomControl={false}
        >
          <TileLayer
            attribution={searchMapTileConfig.attribution}
            className={searchMapTileConfig.className}
            maxZoom={searchMapTileConfig.maxZoom}
            tms={searchMapTileConfig.isTms}
            url={searchMapTileConfig.urlTemplate}
          />
          <AgencyProfileMapController center={mapCenter} onCenterChange={onMapCenterChange} />
        </MapContainer>

        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="pointer-events-none absolute top-1/2 left-1/2 z-[450] -translate-x-1/2 -translate-y-full"
        >
          <MapPickerPinIcon />
        </Typography>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-[450] flex justify-end">
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="bg-surface-container-lowest/95 text-on-surface-var rounded-lg px-2.5 py-1 text-xs leading-5 font-medium shadow-sm"
          >
            {mapCenter.lat.toFixed(5)}, {mapCenter.lng.toFixed(5)}
          </Typography>
        </div>
      </div>
    </Section>
  );
}

function AgencyProfileMapController({
  center,
  onCenterChange,
}: {
  center: AgencyProfileMapCenter;
  onCenterChange: (center: AgencyProfileMapCenter) => void;
}) {
  const map = useMap();

  useMapEvents({
    moveend: () => {
      const nextCenter = map.getCenter();
      onCenterChange({ lat: nextCenter.lat, lng: nextCenter.lng, zoom: map.getZoom() });
    },
    zoomend: () => {
      const nextCenter = map.getCenter();
      onCenterChange({ lat: nextCenter.lat, lng: nextCenter.lng, zoom: map.getZoom() });
    },
  });

  useEffect(() => {
    map.setView([center.lat, center.lng], center.zoom, { animate: true });
  }, [center.lat, center.lng, center.zoom, map]);

  useEffect(() => {
    map.invalidateSize();

    const timer = window.setTimeout(() => {
      map.invalidateSize();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [map]);

  return null;
}

function MapPickerPinIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[42px] w-[31px] drop-shadow-[0_8px_14px_rgba(26,26,26,0.18)]"
      fill="none"
      viewBox="0 0 31 42"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="15"
        cy="40.5"
        fill="currentColor"
        className="text-on-surface"
        fillOpacity="0.12"
        rx="6"
        ry="1.5"
      />
      <path
        d="M20.7379 30.0613C26.7208 27.9158 31 22.199 31 15.4839C31 6.93237 24.0604 0 15.5 0C6.93959 0 0 6.93237 0 15.4839C0 22.1987 4.27872 27.9152 10.2612 30.061C12.3965 30.9288 14.2083 32.6522 14.2083 34.8387V38.7097C14.2083 39.4223 14.7866 40 15.5 40C16.2133 40 16.7916 39.4223 16.7916 38.7097V34.8387C16.7916 32.6525 18.6029 30.9292 20.7379 30.0613Z"
        className="fill-tertiary"
      />
      <path
        d="M15.5 21C17.16 21 18.575 20.415 19.745 19.245C20.915 18.075 21.5 16.66 21.5 15C21.5 13.34 20.915 11.925 19.745 10.755C18.575 9.585 17.16 9 15.5 9C13.84 9 12.425 9.585 11.255 10.755C10.085 11.925 9.5 13.34 9.5 15C9.5 16.66 10.085 18.075 11.255 19.245C12.425 20.415 13.84 21 15.5 21Z"
        className="fill-on-tertiary"
      />
    </svg>
  );
}
