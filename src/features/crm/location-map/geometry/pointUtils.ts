import type { LatLngTuple } from "leaflet";
import type { CrmRecord } from "../../api/crm.service";
import { getNeighborhoodPolygonPoints } from "../../../locations/api/neighborhood.service";
import type { SubNeighborhoodRecord } from "../types";

export function pointsToGeoJson(points: LatLngTuple[]) {
  if (points.length < 3) return null;

  const coordinates = points.map(([lat, lng]) => [lng, lat]);
  coordinates.push([...coordinates[0]]);

  return { type: "Polygon", coordinates: [coordinates] };
}

export function polygonCenter(points: LatLngTuple[], fallback: LatLngTuple): LatLngTuple {
  if (!points.length) return fallback;

  const totals = points.reduce<LatLngTuple>(
    (current, point) => [current[0] + point[0], current[1] + point[1]],
    [0, 0],
  );

  return [
    Number((totals[0] / points.length).toFixed(7)),
    Number((totals[1] / points.length).toFixed(7)),
  ];
}

export function samePoint(first: LatLngTuple, second: LatLngTuple, epsilon = 0.0000001) {
  return Math.abs(first[0] - second[0]) <= epsilon && Math.abs(first[1] - second[1]) <= epsilon;
}

export function getNeighborhoodPoints(neighborhood: CrmRecord) {
  return getNeighborhoodPolygonPoints(
    neighborhood.polygon ?? neighborhood.geofence,
  ) as LatLngTuple[];
}

export function getSubNeighborhoodPoints(subNeighborhood: SubNeighborhoodRecord) {
  return getNeighborhoodPolygonPoints(
    subNeighborhood.geofence ?? subNeighborhood.polygon,
  ) as LatLngTuple[];
}

export function getEdgeMidpoint(start: LatLngTuple, end: LatLngTuple): LatLngTuple {
  return [(start[0] + end[0]) / 2, (start[1] + end[1]) / 2];
}
