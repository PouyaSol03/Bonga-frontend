import type { LatLngTuple } from "leaflet";

export function orientation(a: LatLngTuple, b: LatLngTuple, c: LatLngTuple) {
  const value = (b[1] - a[1]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[1] - a[1]);
  if (Math.abs(value) <= 0.00000002) return 0;
  return value > 0 ? 1 : -1;
}

export function segmentsProperlyIntersect(
  a: LatLngTuple,
  b: LatLngTuple,
  c: LatLngTuple,
  d: LatLngTuple,
) {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  return o1 !== 0 && o2 !== 0 && o3 !== 0 && o4 !== 0 && o1 !== o2 && o3 !== o4;
}

export function isPointOnSegment(point: LatLngTuple, start: LatLngTuple, end: LatLngTuple) {
  const [py, px] = point;
  const [ay, ax] = start;
  const [by, bx] = end;
  const cross = (px - ax) * (by - ay) - (py - ay) * (bx - ax);
  if (Math.abs(cross) > 0.00000002) return false;

  const dot = (px - ax) * (bx - ax) + (py - ay) * (by - ay);
  if (dot < 0) return false;

  const squaredLength = (bx - ax) ** 2 + (by - ay) ** 2;
  return dot <= squaredLength;
}
