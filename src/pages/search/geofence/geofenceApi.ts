import type { GeofenceCoordinate, GeofenceResult } from "./geofenceTypes";

const apiCoordinatePrecision = 6;

function coordinatesAreEqual(
  first: GeofenceCoordinate,
  second: GeofenceCoordinate,
) {
  return first[0] === second[0] && first[1] === second[1];
}

function formatApiCoordinate(value: number) {
  return value
    .toFixed(apiCoordinatePrecision)
    .replace(/\.0+$/, "")
    .replace(/(\.\d*?)0+$/, "$1");
}

/**
 * The drawing uses GeoJSON's longitude,latitude order. The map API expects
 * latitude,longitude pairs joined with pipes and does not need the repeated
 * closing point.
 */
export function serializeGeofenceForApi(result: GeofenceResult) {
  const coordinates = result.simplifiedCoordinates;
  const firstCoordinate = coordinates[0];
  const lastCoordinate = coordinates.at(-1);

  if (!firstCoordinate || !lastCoordinate) return undefined;

  const apiCoordinates = coordinatesAreEqual(firstCoordinate, lastCoordinate)
    ? coordinates.slice(0, -1)
    : coordinates;

  if (apiCoordinates.length < 3) return undefined;

  return apiCoordinates
    .map(
      ([longitude, latitude]) =>
        `${formatApiCoordinate(latitude)},${formatApiCoordinate(longitude)}`,
    )
    .join("|");
}
