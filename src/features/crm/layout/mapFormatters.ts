import type { LatLngTuple } from "leaflet";
import { DEFAULT_CENTER } from "./constants";

export function parseMapPointValue(value: string) {
  try {
    const point = JSON.parse(value) as { lat?: unknown; lng?: unknown };
    const lat = Number(point.lat);
    const lng = Number(point.lng);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  } catch {
    return { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] };
  }

  return { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] };
}
export function polygonStringToPoints(value: string): LatLngTuple[] {
  if (!value.trim()) return [];

  try {
    const polygon = JSON.parse(value) as { coordinates?: unknown };
    const coordinates = Array.isArray(polygon.coordinates) ? polygon.coordinates : [];
    const firstRing = Array.isArray(coordinates[0]) ? coordinates[0] : [];
    const points = firstRing
      .map((coordinate) => {
        if (!Array.isArray(coordinate) || coordinate.length < 2) return null;
        const longitude = Number(coordinate[0]);
        const latitude = Number(coordinate[1]);
        return Number.isFinite(latitude) && Number.isFinite(longitude)
          ? ([latitude, longitude] as LatLngTuple)
          : null;
      })
      .filter((point): point is LatLngTuple => point !== null);

    if (points.length > 1) {
      const first = points[0];
      const last = points[points.length - 1];
      if (first[0] === last[0] && first[1] === last[1]) points.pop();
    }

    return points;
  } catch {
    return [];
  }
}

export function pointsToPolygonString(points: LatLngTuple[]) {
  if (points.length < 3) return "";

  const coordinates = points.map(([latitude, longitude]) => [longitude, latitude]);
  coordinates.push([...coordinates[0]]);

  return JSON.stringify({ type: "Polygon", coordinates: [coordinates] }, null, 2);
}
