import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

export function AgencyMapController({
  center,
  onMapClick,
}: {
  center: { latitude: number; longitude: number };
  onMapClick: () => void;
}) {
  const map = useMap();

  useMapEvents({
    click: onMapClick,
  });

  useEffect(() => {
    map.invalidateSize();
    map.setView([center.latitude, center.longitude], 13, { animate: false });

    const timer = setTimeout(() => {
      map.invalidateSize();
      map.setView([center.latitude, center.longitude], 13, { animate: false });
    }, 100);

    return () => clearTimeout(timer);
  }, [center.latitude, center.longitude, map]);

  return null;
}
