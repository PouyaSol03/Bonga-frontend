import type { LatLngTuple } from "leaflet";
import { isPointOnSegment, segmentsProperlyIntersect } from "./segmentIntersections";

export function isPointInsideOrOnPolygon(point: LatLngTuple, polygon: LatLngTuple[]) {
  if (polygon.length < 3) return false;

  for (let index = 0; index < polygon.length; index += 1) {
    const nextIndex = (index + 1) % polygon.length;
    if (isPointOnSegment(point, polygon[index], polygon[nextIndex])) return true;
  }

  const [lat, lng] = point;
  let inside = false;

  for (
    let index = 0, previous = polygon.length - 1;
    index < polygon.length;
    previous = index, index += 1
  ) {
    const [currentLat, currentLng] = polygon[index];
    const [previousLat, previousLng] = polygon[previous];
    const intersects =
      currentLat > lat !== previousLat > lat &&
      lng <
        ((previousLng - currentLng) * (lat - currentLat)) /
          (previousLat - currentLat || Number.EPSILON) +
          currentLng;

    if (intersects) inside = !inside;
  }

  return inside;
}

export function segmentStaysInsidePolygon(
  start: LatLngTuple,
  end: LatLngTuple,
  polygon: LatLngTuple[],
) {
  if (!isPointInsideOrOnPolygon(start, polygon) || !isPointInsideOrOnPolygon(end, polygon)) {
    return false;
  }

  for (let index = 0; index < polygon.length; index += 1) {
    const parentStart = polygon[index];
    const parentEnd = polygon[(index + 1) % polygon.length];
    if (segmentsProperlyIntersect(start, end, parentStart, parentEnd)) return false;
  }

  for (let step = 1; step < 16; step += 1) {
    const t = step / 16;
    const point: LatLngTuple = [
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
    ];
    if (!isPointInsideOrOnPolygon(point, polygon)) return false;
  }

  return true;
}

export function isBoundaryInsidePolygon(points: LatLngTuple[], parentPolygon: LatLngTuple[]) {
  if (!points.length || parentPolygon.length < 3) return false;
  if (!points.every((point) => isPointInsideOrOnPolygon(point, parentPolygon))) return false;
  if (points.length === 1) return true;

  const edgeCount = points.length >= 3 ? points.length : points.length - 1;
  for (let index = 0; index < edgeCount; index += 1) {
    const nextIndex = points.length >= 3 ? (index + 1) % points.length : index + 1;
    if (!segmentStaysInsidePolygon(points[index], points[nextIndex], parentPolygon)) return false;
  }

  return true;
}

export function isPointStrictlyInsidePolygon(point: LatLngTuple, polygon: LatLngTuple[]) {
  if (polygon.length < 3) return false;

  for (let index = 0; index < polygon.length; index += 1) {
    if (isPointOnSegment(point, polygon[index], polygon[(index + 1) % polygon.length])) {
      return false;
    }
  }

  return isPointInsideOrOnPolygon(point, polygon);
}

export function segmentEntersPolygon(start: LatLngTuple, end: LatLngTuple, polygon: LatLngTuple[]) {
  if (isPointStrictlyInsidePolygon(start, polygon) || isPointStrictlyInsidePolygon(end, polygon)) {
    return true;
  }

  for (let index = 0; index < polygon.length; index += 1) {
    if (
      segmentsProperlyIntersect(start, end, polygon[index], polygon[(index + 1) % polygon.length])
    ) {
      return true;
    }
  }

  for (let step = 1; step < 20; step += 1) {
    const t = step / 20;
    const point: LatLngTuple = [
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
    ];
    if (isPointStrictlyInsidePolygon(point, polygon)) return true;
  }

  return false;
}

export function polygonsShareInterior(first: LatLngTuple[], second: LatLngTuple[]) {
  if (first.length < 3 || second.length < 3) return false;

  if (first.some((point) => isPointStrictlyInsidePolygon(point, second))) return true;
  if (second.some((point) => isPointStrictlyInsidePolygon(point, first))) return true;

  for (let firstIndex = 0; firstIndex < first.length; firstIndex += 1) {
    const firstStart = first[firstIndex];
    const firstEnd = first[(firstIndex + 1) % first.length];

    for (let secondIndex = 0; secondIndex < second.length; secondIndex += 1) {
      if (
        segmentsProperlyIntersect(
          firstStart,
          firstEnd,
          second[secondIndex],
          second[(secondIndex + 1) % second.length],
        )
      ) {
        return true;
      }
    }
  }

  const firstLats = first.map((point) => point[0]);
  const firstLngs = first.map((point) => point[1]);
  const secondLats = second.map((point) => point[0]);
  const secondLngs = second.map((point) => point[1]);
  const minLat = Math.max(Math.min(...firstLats), Math.min(...secondLats));
  const maxLat = Math.min(Math.max(...firstLats), Math.max(...secondLats));
  const minLng = Math.max(Math.min(...firstLngs), Math.min(...secondLngs));
  const maxLng = Math.min(Math.max(...firstLngs), Math.max(...secondLngs));

  if (minLat >= maxLat || minLng >= maxLng) return false;

  for (let row = 1; row < 8; row += 1) {
    for (let column = 1; column < 8; column += 1) {
      const point: LatLngTuple = [
        minLat + ((maxLat - minLat) * row) / 8,
        minLng + ((maxLng - minLng) * column) / 8,
      ];
      if (isPointStrictlyInsidePolygon(point, first) && isPointStrictlyInsidePolygon(point, second)) {
        return true;
      }
    }
  }

  return false;
}

export function boundaryEntersAnyPolygon(points: LatLngTuple[], polygons: LatLngTuple[][]) {
  for (const polygon of polygons) {
    if (points.some((point) => isPointStrictlyInsidePolygon(point, polygon))) return true;

    if (points.length >= 2) {
      const edgeCount = points.length >= 3 ? points.length : points.length - 1;
      for (let index = 0; index < edgeCount; index += 1) {
        const nextIndex = points.length >= 3 ? (index + 1) % points.length : index + 1;
        if (segmentEntersPolygon(points[index], points[nextIndex], polygon)) return true;
      }
    }

    if (points.length >= 3 && polygonsShareInterior(points, polygon)) return true;
  }

  return false;
}
