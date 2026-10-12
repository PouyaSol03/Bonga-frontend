import { LatLngBounds } from "leaflet";
import { useEffect, useMemo } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import type { AgencyDirectoryMapItem } from "./AgencyMap.types";

export function AgencyMapController({
  center,
  items,
  onMapClick,
}: {
  center?: { latitude: number; longitude: number };
  items: AgencyDirectoryMapItem[];
  onMapClick: () => void;
}) {
  const map = useMap();
  const coordinates = useMemo(
    () =>
      items
        .filter(
          (item) =>
            item.latitude !== undefined &&
            item.longitude !== undefined &&
            Number.isFinite(item.latitude) &&
            Number.isFinite(item.longitude) &&
            item.latitude >= 24 &&
            item.latitude <= 40 &&
            item.longitude >= 44 &&
            item.longitude <= 64,
        )
        .map(
          (item) =>
            [item.latitude as number, item.longitude as number] as [
              number,
              number,
            ],
        ),
    [items],
  );

  useMapEvents({
    click: onMapClick,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();

      if (coordinates.length === 0) {
        if (center) {
          map.setView([center.latitude, center.longitude], 14, { animate: false });
        }
        return;
      }

      if (coordinates.length === 1) {
        map.setView(coordinates[0], 15, { animate: false });
        return;
      }

      const bounds = new LatLngBounds(coordinates);
      map.fitBounds(bounds, {
        animate: false,
        maxZoom: 16,
        paddingBottomRight: [36, 170],
        paddingTopLeft: [36, 36],
      });
    }, 60);

    return () => clearTimeout(timer);
  }, [center, coordinates, map]);

  return null;
}
