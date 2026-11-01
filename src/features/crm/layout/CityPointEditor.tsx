import { useEffect, useMemo, useState } from "react";
import { Typography } from "../../../shared/ui/Typography";
import type { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, useMapEvents } from "react-leaflet";
import { searchMapTileConfig } from "../../search/searchMapData";
import { parseMapPointValue } from "./mapFormatters";

export function CityPointEditor({
  onChange,
  value,
}: {
  onChange: (value: { lat: number; lng: number }) => void;
  value: string;
}) {
  const initialPoint = useMemo(() => parseMapPointValue(value), [value]);
  const [point, setPoint] = useState<LatLngTuple>([initialPoint.lat, initialPoint.lng]);

  useEffect(() => {
    setPoint([initialPoint.lat, initialPoint.lng]);
  }, [initialPoint.lat, initialPoint.lng]);

  const selectPoint = (nextPoint: LatLngTuple) => {
    const normalized = {
      lat: Number(nextPoint[0].toFixed(7)),
      lng: Number(nextPoint[1].toFixed(7)),
    };

    setPoint([normalized.lat, normalized.lng]);
    onChange(normalized);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#cccccc] bg-white">
      <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-4 py-3">
        <Typography
          as="p"
          variant="body"
          size="medium"
          weight="regular"
          className="m-0 text-sm leading-6 text-[#4d4d4d]"
        >
          نقشه را جابه‌جا کنید تا نشانگر روی موقعیت دقیق آژانس قرار بگیرد.
        </Typography>
      </div>
      <div className="relative h-[340px] w-full overflow-hidden">
        <MapContainer
          attributionControl={false}
          center={point}
          className="h-full w-full"
          scrollWheelZoom
          zoom={15}
          zoomControl={false}
        >
          <TileLayer
            attribution={searchMapTileConfig.attribution}
            className={searchMapTileConfig.className}
            maxZoom={searchMapTileConfig.maxZoom}
            tms={searchMapTileConfig.isTms}
            url={searchMapTileConfig.urlTemplate}
          />
          <MapCenterCollector onSelect={selectPoint} />
        </MapContainer>
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="pointer-events-none absolute top-1/2 left-1/2 z-[500] -translate-x-1/2 -translate-y-full"
        >
          <MapPickerPinIcon />
        </Typography>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-[#e5e5e5] px-4 py-3 text-sm">
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="font-medium text-[#4d4d4d]"
        >
          مختصات انتخاب‌شده
        </Typography>
        <strong className="font-mono text-[#0048c4]" dir="ltr">
          {point[0].toFixed(6)}, {point[1].toFixed(6)}
        </strong>
      </div>
    </div>
  );
}
export function MapCenterCollector({ onSelect }: { onSelect: (point: LatLngTuple) => void }) {
  useMapEvents({
    moveend(event) {
      const center = event.target.getCenter();
      onSelect([center.lat, center.lng]);
    },
  });

  return null;
}

export function MapPickerPinIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-[42px] w-[31px] drop-shadow-[0_8px_14px_rgba(26,26,26,0.18)]"
      fill="none"
      viewBox="0 0 31 42"
    >
      <ellipse cx="15" cy="40.5" fill="#1A1A1A" fillOpacity=".12" rx="6" ry="1.5" />
      <path
        d="M20.738 30.061C26.721 27.916 31 22.199 31 15.484 31 6.932 24.06 0 15.5 0S0 6.932 0 15.484c0 6.715 4.279 12.431 10.261 14.577 2.136.868 3.947 2.591 3.947 4.778v3.87a1.292 1.292 0 0 0 2.584 0v-3.87c0-2.187 1.811-3.91 3.946-4.778Z"
        fill="#11A366"
      />
      <circle cx="15.5" cy="15" r="6" fill="white" />
    </svg>
  );
}
