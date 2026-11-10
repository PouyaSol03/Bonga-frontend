import { useEffect } from "react";
import type { LatLngTuple } from "leaflet";
import { useMap } from "react-leaflet";

export function MapViewport({ center, points }: { center: LatLngTuple; points: LatLngTuple[] }) {
  const map = useMap();
  const fitSignature = points
    .map((point) => `${point[0].toFixed(5)}:${point[1].toFixed(5)}`)
    .join("|");
  const centerLat = center[0];
  const centerLng = center[1];

  useEffect(() => {
    if (points.length >= 2) {
      map.fitBounds(points, { padding: [42, 42], maxZoom: 15 });
      return;
    }

    map.setView(points[0] ?? [centerLat, centerLng], points.length ? 15 : 13);
  }, [centerLat, centerLng, fitSignature, map]);

  return null;
}

export function MapResizeOnFullscreen({ fullscreen }: { fullscreen: boolean }) {
  const map = useMap();

  useEffect(() => {
    const timer = window.setTimeout(() => map.invalidateSize(), 120);
    return () => window.clearTimeout(timer);
  }, [fullscreen, map]);

  return null;
}
