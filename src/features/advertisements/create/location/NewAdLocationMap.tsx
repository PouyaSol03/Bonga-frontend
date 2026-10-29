import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import type { NewAdMapCenter } from "./newAdLocationStorage";

export function NewAdLocationMap({
  center,
  onCenterChange,
}: {
  center: NewAdMapCenter;
  onCenterChange: (center: NewAdMapCenter) => void;
}) {
  const map = useMap();

  useMapEvents({
    moveend: () => {
      const nextCenter = map.getCenter();

      onCenterChange({
        lat: nextCenter.lat,
        lng: nextCenter.lng,
        zoom: map.getZoom(),
      });
    },
    zoomend: () => {
      const nextCenter = map.getCenter();

      onCenterChange({
        lat: nextCenter.lat,
        lng: nextCenter.lng,
        zoom: map.getZoom(),
      });
    },
  });

  useEffect(() => {
    map.setView([center.lat, center.lng], center.zoom, {
      animate: true,
    });
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
