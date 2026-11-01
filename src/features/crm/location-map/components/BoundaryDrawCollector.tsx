import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import { useMapEvents } from "react-leaflet";

export function BoundaryDrawCollector({
  enabled,
  onAdd,
}: {
  enabled: boolean;
  onAdd: (map: LeafletMap, point: LatLngTuple) => void;
}) {
  useMapEvents({
    click(event) {
      if (!enabled) return;

      const rawPoint: LatLngTuple = [event.latlng.lat, event.latlng.lng];
      onAdd(event.target as LeafletMap, rawPoint);
    },
  });

  return null;
}
