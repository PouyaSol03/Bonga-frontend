import type { LatLngTuple, Map as LeafletMap } from "leaflet";
import type { BoundaryItem } from "./types";
import { SNAP_DISTANCE_PX } from "./constants";

export function layerDistance(map: LeafletMap, first: LatLngTuple, second: LatLngTuple) {
  return map.latLngToLayerPoint(first).distanceTo(map.latLngToLayerPoint(second));
}

export function projectedPointOnSegment(
  map: LeafletMap,
  point: LatLngTuple,
  start: LatLngTuple,
  end: LatLngTuple,
): LatLngTuple {
  const pointPx = map.latLngToLayerPoint(point);
  const startPx = map.latLngToLayerPoint(start);
  const endPx = map.latLngToLayerPoint(end);
  const dx = endPx.x - startPx.x;
  const dy = endPx.y - startPx.y;
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return start;

  const t = Math.max(
    0,
    Math.min(1, ((pointPx.x - startPx.x) * dx + (pointPx.y - startPx.y) * dy) / lengthSquared),
  );
  const projected = map.layerPointToLatLng([startPx.x + t * dx, startPx.y + t * dy]);
  return [projected.lat, projected.lng];
}

export function closestValidPoint(
  map: LeafletMap,
  requestedPoint: LatLngTuple,
  anchorPoint: LatLngTuple | null,
  constraintPolygons: LatLngTuple[][],
  isValid: (point: LatLngTuple) => boolean,
) {
  if (isValid(requestedPoint)) return requestedPoint;

  const candidates: LatLngTuple[] = [];

  if (anchorPoint) {
    let low = 0;
    let high = 1;
    let best: LatLngTuple | null = null;

    for (let iteration = 0; iteration < 28; iteration += 1) {
      const t = (low + high) / 2;
      const candidate: LatLngTuple = [
        anchorPoint[0] + (requestedPoint[0] - anchorPoint[0]) * t,
        anchorPoint[1] + (requestedPoint[1] - anchorPoint[1]) * t,
      ];

      if (isValid(candidate)) {
        best = candidate;
        low = t;
      } else {
        high = t;
      }
    }

    if (best) candidates.push(best);
  }

  constraintPolygons.forEach((polygon) => {
    polygon.forEach((start, index) => {
      const end = polygon[(index + 1) % polygon.length];
      candidates.push(start, projectedPointOnSegment(map, requestedPoint, start, end));
    });
  });

  let bestPoint: LatLngTuple | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  candidates.forEach((candidate) => {
    if (!isValid(candidate)) return;
    const distance = layerDistance(map, requestedPoint, candidate);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestPoint = candidate;
    }
  });

  return bestPoint;
}

export function closestSnapPoint(map: LeafletMap, point: LatLngTuple, boundaries: BoundaryItem[]) {
  const clickPoint = map.latLngToLayerPoint(point);
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestPoint: LatLngTuple | null = null;

  const consider = (candidate: LatLngTuple) => {
    const candidatePoint = map.latLngToLayerPoint(candidate);
    const distance = clickPoint.distanceTo(candidatePoint);
    if (distance > SNAP_DISTANCE_PX) return;
    if (distance < bestDistance) {
      bestDistance = distance;
      bestPoint = candidate;
    }
  };

  boundaries.forEach((boundary) => {
    boundary.points.forEach(consider);

    boundary.points.forEach((start, index) => {
      const end = boundary.points[(index + 1) % boundary.points.length];
      const startPoint = map.latLngToLayerPoint(start);
      const endPoint = map.latLngToLayerPoint(end);
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const lengthSquared = dx * dx + dy * dy;
      if (!lengthSquared) return;

      const t = Math.max(
        0,
        Math.min(
          1,
          ((clickPoint.x - startPoint.x) * dx + (clickPoint.y - startPoint.y) * dy) / lengthSquared,
        ),
      );
      const projected = map.layerPointToLatLng([startPoint.x + t * dx, startPoint.y + t * dy]);
      consider([projected.lat, projected.lng]);
    });
  });

  return bestPoint ?? point;
}
