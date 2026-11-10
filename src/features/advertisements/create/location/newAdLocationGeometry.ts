import {
  getNeighborhoodPolygonPoints,
  type SubNeighborhoodDto,
} from "../../../locations/api/neighborhood.service";

export function getPolygonCenter(points: Array<[number, number]>) {
  if (!points.length) return null;

  let twiceArea = 0;
  let longitudeSum = 0;
  let latitudeSum = 0;

  for (let index = 0; index < points.length; index += 1) {
    const [latitudeA, longitudeA] = points[index];
    const [latitudeB, longitudeB] = points[(index + 1) % points.length];
    const cross = longitudeA * latitudeB - longitudeB * latitudeA;

    twiceArea += cross;
    longitudeSum += (longitudeA + longitudeB) * cross;
    latitudeSum += (latitudeA + latitudeB) * cross;
  }

  if (Math.abs(twiceArea) > Number.EPSILON) {
    return {
      lat: latitudeSum / (3 * twiceArea),
      lng: longitudeSum / (3 * twiceArea),
    };
  }

  const total = points.reduce((sum, [lat, lng]) => ({ lat: sum.lat + lat, lng: sum.lng + lng }), {
    lat: 0,
    lng: 0,
  });

  return {
    lat: total.lat / points.length,
    lng: total.lng / points.length,
  };
}

export function getSubNeighborhoodCenter(subNeighborhood: SubNeighborhoodDto | null) {
  if (!subNeighborhood) return null;

  if (Number.isFinite(subNeighborhood.lat) && Number.isFinite(subNeighborhood.lng)) {
    return {
      lat: Number(subNeighborhood.lat),
      lng: Number(subNeighborhood.lng),
    };
  }

  return getPolygonCenter(
    getNeighborhoodPolygonPoints(subNeighborhood.geofence ?? subNeighborhood.polygon),
  );
}

export function isPointInsidePolygon(
  latitude: number,
  longitude: number,
  points: Array<[number, number]>,
) {
  if (points.length < 3) return false;

  let inside = false;
  for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
    const [latA, lngA] = points[index];
    const [latB, lngB] = points[previous];
    const intersects =
      latA > latitude !== latB > latitude &&
      longitude < ((lngB - lngA) * (latitude - latA)) / (latB - latA || Number.EPSILON) + lngA;

    if (intersects) inside = !inside;
  }

  return inside;
}

export function resolveSubNeighborhoodAtPoint(
  subNeighborhoods: SubNeighborhoodDto[],
  latitude: number,
  longitude: number,
) {
  return (
    subNeighborhoods.find((item) => {
      const points = getNeighborhoodPolygonPoints(item.geofence ?? item.polygon);
      return isPointInsidePolygon(latitude, longitude, points);
    }) ?? null
  );
}
