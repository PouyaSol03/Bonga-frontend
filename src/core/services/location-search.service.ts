import { publicApi } from "../api/api";
import type { NeighborhoodDto, SubNeighborhoodDto } from "./neighborhood.service";

type LocationSearchRecord = Record<string, unknown>;

type LocationSearchResponse =
  | LocationSearchRecord
  | LocationSearchRecord[]
  | {
      data?: unknown;
      items?: unknown;
      locations?: unknown;
      results?: unknown;
      status?: boolean;
    };

export type LocationSearchByQueryParams = {
  cityId: string;
  query: string;
};

export type LocationSearchByCoordinatesParams = {
  cityId: string;
  lat: number;
  lng: number;
};

function toPostgresInteger(value: string | number, field: string) {
  const number = typeof value === "number" ? value : Number(String(value).trim());

  if (!Number.isInteger(number) || number <= 0) {
    throw new Error(`${field} must be a positive PostgreSQL integer.`);
  }

  return number;
}

function asRecord(value: unknown): LocationSearchRecord | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as LocationSearchRecord)
    : null;
}

function readRecord(record: LocationSearchRecord, key: string) {
  return asRecord(record[key]);
}

function readString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }

  return "";
}

function readNumber(...values: unknown[]) {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;

    const number = typeof value === "number" ? value : Number(value);
    if (Number.isFinite(number)) return number;
  }

  return undefined;
}

function normalizeCoordinateLocationSearchItem(value: unknown): NeighborhoodDto | null {
  const item = asRecord(value);
  if (!item) return null;

  const neighborhood =
    readRecord(item, "neighborhood") ??
    readRecord(item, "parent_neighborhood") ??
    readRecord(item, "parentNeighborhood");

  const id = readString(
    item.neighborhood_id,
    item.neighborhoodId,
    neighborhood?.id,
    neighborhood?._id,
    item.id,
    item._id,
  );
  const name = readString(
    neighborhood?.name,
    item.neighborhood_name,
    item.neighborhoodName,
    item.parent_neighborhood_name,
    item.parentNeighborhoodName,
    item.name,
    item.title,
    item.label,
    item.address,
  );

  if (!id || !name) return null;

  const location =
    readRecord(item, "location") ??
    readRecord(item, "coordinates") ??
    readRecord(item, "point");
  const coordinateArray = Array.isArray(item.coordinates)
    ? item.coordinates
    : Array.isArray(location?.coordinates)
      ? location.coordinates
      : [];

  const lat = readNumber(
    item.lat,
    item.latitude,
    item.y,
    location?.lat,
    location?.latitude,
    coordinateArray[1],
    neighborhood?.lat,
    neighborhood?.latitude,
  );
  const lng = readNumber(
    item.lng,
    item.lon,
    item.long,
    item.longitude,
    item.x,
    location?.lng,
    location?.lon,
    location?.longitude,
    coordinateArray[0],
    neighborhood?.lng,
    neighborhood?.lon,
    neighborhood?.longitude,
  );

  const cityId = readString(
    item.city_id,
    item.cityId,
    neighborhood?.city_id,
    neighborhood?.cityId,
  );

  return {
    id,
    name,
    lat,
    lng,
    city_id: cityId || undefined,
    // Coordinate lookup may return a sub-neighborhood as the top-level item.
    // Never expose that temporary boundary as the selected neighborhood.
    // The parent neighborhood boundary is hydrated from /public/neighborhood/{id}.
    geofence:
      neighborhood?.geofence ??
      neighborhood?.polygon ??
      item.neighborhood_geofence ??
      item.neighborhoodGeofence ??
      item.neighborhood_polygon ??
      item.neighborhoodPolygon,
    matched_by: Array.isArray(item.matched_by) ? item.matched_by.map(String) : undefined,
    polygon:
      neighborhood?.polygon ??
      neighborhood?.geofence ??
      item.neighborhood_polygon ??
      item.neighborhoodPolygon ??
      item.neighborhood_geofence ??
      item.neighborhoodGeofence,
    sub_neighborhoods:
      (item.sub_neighborhoods as NeighborhoodDto["sub_neighborhoods"]) ??
      (neighborhood?.sub_neighborhoods as NeighborhoodDto["sub_neighborhoods"]),
    sub_neighbors:
      (item.sub_neighbors as NeighborhoodDto["sub_neighbors"]) ??
      (neighborhood?.sub_neighbors as NeighborhoodDto["sub_neighbors"]) ??
      (item.sub_neighborhoods as NeighborhoodDto["sub_neighbors"]) ??
      (neighborhood?.sub_neighborhoods as NeighborhoodDto["sub_neighbors"]),
  };
}

function normalizeMatchedSubNeighborhood(
  item: LocationSearchRecord,
  neighborhood: LocationSearchRecord | null,
): SubNeighborhoodDto | null {
  const matchedSubNeighborhoods =
    item.matched_sub_neighborhoods ??
    item.matchedSubNeighborhoods ??
    item.sub_neighborhood_matches ??
    item.subNeighborhoodMatches;
  const firstMatchedSubNeighborhood = Array.isArray(matchedSubNeighborhoods)
    ? asRecord(matchedSubNeighborhoods[0])
    : null;
  const nested =
    readRecord(item, "sub_neighborhood") ??
    readRecord(item, "subNeighborhood") ??
    readRecord(item, "subneighborhood") ??
    readRecord(item, "sub_neighbor") ??
    readRecord(item, "subNeighbor") ??
    readRecord(item, "subneighbor") ??
    readRecord(item, "matched_sub_neighborhood") ??
    readRecord(item, "matchedSubNeighborhood") ??
    readRecord(item, "matched_subneighborhood") ??
    readRecord(neighborhood ?? {}, "sub_neighborhood") ??
    readRecord(neighborhood ?? {}, "subNeighborhood") ??
    readRecord(neighborhood ?? {}, "subneighborhood") ??
    readRecord(neighborhood ?? {}, "matched_sub_neighborhood") ??
    readRecord(neighborhood ?? {}, "matchedSubNeighborhood") ??
    firstMatchedSubNeighborhood;

  const matchedBy = Array.isArray(item.matched_by)
    ? item.matched_by.map((value) => String(value).toLowerCase())
    : [];
  const resultType = readString(
    item.type,
    item.kind,
    item.entity_type,
    item.entityType,
    item.result_type,
    item.resultType,
  ).toLowerCase();
  const hasExplicitSubNeighborhoodFields = Boolean(
    item.sub_neighborhood_id ??
    item.subNeighborhoodId ??
    item.subneighborhood_id ??
    item.subneighborhoodId ??
    item.matched_sub_neighborhood_id ??
    item.matchedSubNeighborhoodId ??
    item.sub_neighborhood_name ??
    item.subNeighborhoodName ??
    item.subneighborhood_name ??
    item.subneighborhoodName ??
    item.matched_sub_neighborhood_name ??
    item.matchedSubNeighborhoodName,
  );
  const matchedBySubNeighborhood = matchedBy.some(
    (value) =>
      value.includes("sub_neighborhood") ||
      value.includes("sub-neighborhood") ||
      value.includes("sub_neighbor") ||
      value.includes("sub-neighbor") ||
      value.includes("subneighbor") ||
      value.includes("subneighborhood"),
  );
  const resultIsSubNeighborhood =
    resultType.includes("sub_neighborhood") ||
    resultType.includes("sub-neighborhood") ||
    resultType.includes("sub_neighbor") ||
    resultType.includes("sub-neighbor") ||
    resultType.includes("subneighbor") ||
    resultType.includes("subneighborhood");
  const itemIsSubNeighborhood =
    hasExplicitSubNeighborhoodFields || matchedBySubNeighborhood || resultIsSubNeighborhood;

  const rawSubNeighborhoods =
    item.sub_neighborhoods ??
    item.subNeighborhoods ??
    item.sub_neighbors ??
    item.subNeighbors;
  const onlySubNeighborhood =
    itemIsSubNeighborhood && Array.isArray(rawSubNeighborhoods) && rawSubNeighborhoods.length === 1
      ? asRecord(rawSubNeighborhoods[0])
      : null;
  const source = nested ?? onlySubNeighborhood ?? (itemIsSubNeighborhood ? item : null);

  const id = readString(
    item.sub_neighborhood_id,
    item.subNeighborhoodId,
    item.subneighborhood_id,
    item.subneighborhoodId,
    item.matched_sub_neighborhood_id,
    item.matchedSubNeighborhoodId,
    source?.id,
    source?._id,
  );
  const name = readString(
    item.sub_neighborhood_name,
    item.subNeighborhoodName,
    item.subneighborhood_name,
    item.subneighborhoodName,
    item.matched_sub_neighborhood_name,
    item.matchedSubNeighborhoodName,
    source?.name,
    source?.title,
    source?.label,
  );

  if (!id && !name) return null;

  const location = source
    ? readRecord(source, "location") ??
      readRecord(source, "coordinates") ??
      readRecord(source, "point")
    : null;
  const coordinateArray = Array.isArray(source?.coordinates)
    ? source.coordinates
    : Array.isArray(location?.coordinates)
      ? location.coordinates
      : [];

  const lat = readNumber(
    item.sub_neighborhood_lat,
    item.subNeighborhoodLat,
    item.subneighborhood_lat,
    item.subneighborhoodLat,
    item.matched_sub_neighborhood_lat,
    item.matchedSubNeighborhoodLat,
    source?.lat,
    source?.latitude,
    location?.lat,
    location?.latitude,
    coordinateArray[1],
  );
  const lng = readNumber(
    item.sub_neighborhood_lng,
    item.subNeighborhoodLng,
    item.sub_neighborhood_lon,
    item.subNeighborhoodLon,
    item.subneighborhood_lng,
    item.subneighborhoodLng,
    item.subneighborhood_lon,
    item.subneighborhoodLon,
    item.matched_sub_neighborhood_lng,
    item.matchedSubNeighborhoodLng,
    source?.lng,
    source?.lon,
    source?.long,
    source?.longitude,
    location?.lng,
    location?.lon,
    location?.longitude,
    coordinateArray[0],
  );

  const geofence =
    item.sub_neighborhood_geofence ??
    item.subNeighborhoodGeofence ??
    item.subneighborhood_geofence ??
    item.subneighborhoodGeofence ??
    item.matched_sub_neighborhood_geofence ??
    item.matchedSubNeighborhoodGeofence ??
    item.sub_neighborhood_polygon ??
    item.subNeighborhoodPolygon ??
    item.subneighborhood_polygon ??
    item.subneighborhoodPolygon ??
    source?.geofence ??
    source?.polygon;

  return {
    geofence,
    id: id || undefined,
    lat,
    lng,
    name: name || "",
    polygon:
      item.sub_neighborhood_polygon ??
      item.subNeighborhoodPolygon ??
      item.subneighborhood_polygon ??
      item.subneighborhoodPolygon ??
      source?.polygon ??
      source?.geofence,
  };
}

function normalizeLocationSearchItem(value: unknown): NeighborhoodDto | null {
  const item = asRecord(value);
  if (!item) return null;

  const neighborhood =
    readRecord(item, "neighborhood") ??
    readRecord(item, "parent_neighborhood") ??
    readRecord(item, "parentNeighborhood");

  const matchedSubNeighborhood = normalizeMatchedSubNeighborhood(item, neighborhood);
  const id = readString(
    item.neighborhood_id,
    item.neighborhoodId,
    item.parent_neighborhood_id,
    item.parentNeighborhoodId,
    item.parent_id,
    item.parentId,
    neighborhood?.id,
    neighborhood?._id,
    item.id,
    item._id,
  );
  const name = readString(
    item.neighborhood_name,
    item.neighborhoodName,
    item.parent_neighborhood_name,
    item.parentNeighborhoodName,
    neighborhood?.name,
    item.name,
    item.title,
    item.label,
    item.address,
  );

  if (!id || !name) return null;

  const location =
    readRecord(item, "location") ??
    readRecord(item, "coordinates") ??
    readRecord(item, "point");
  const coordinateArray = Array.isArray(item.coordinates)
    ? item.coordinates
    : Array.isArray(location?.coordinates)
      ? location.coordinates
      : [];

  const lat = readNumber(
    item.lat,
    item.latitude,
    item.y,
    location?.lat,
    location?.latitude,
    coordinateArray[1],
    neighborhood?.lat,
    neighborhood?.latitude,
  );
  const lng = readNumber(
    item.lng,
    item.lon,
    item.long,
    item.longitude,
    item.x,
    location?.lng,
    location?.lon,
    location?.longitude,
    coordinateArray[0],
    neighborhood?.lng,
    neighborhood?.lon,
    neighborhood?.longitude,
  );

  const cityId = readString(
    item.city_id,
    item.cityId,
    neighborhood?.city_id,
    neighborhood?.cityId,
  );
  const parentGeofence =
    neighborhood?.geofence ??
    neighborhood?.polygon ??
    item.neighborhood_geofence ??
    item.neighborhoodGeofence ??
    item.neighborhood_polygon ??
    item.neighborhoodPolygon;

  return {
    id,
    name,
    lat,
    lng,
    city_id: cityId || undefined,
    geofence:
      parentGeofence ??
      (matchedSubNeighborhood ? undefined : item.geofence ?? item.polygon),
    matched_by: Array.isArray(item.matched_by) ? item.matched_by.map(String) : undefined,
    matched_sub_neighborhood: matchedSubNeighborhood,
    polygon:
      parentGeofence ??
      (matchedSubNeighborhood ? undefined : item.polygon ?? item.geofence),
    sub_neighborhoods:
      (item.sub_neighborhoods as NeighborhoodDto["sub_neighborhoods"]) ??
      (neighborhood?.sub_neighborhoods as NeighborhoodDto["sub_neighborhoods"]),
    sub_neighbors:
      (item.sub_neighbors as NeighborhoodDto["sub_neighbors"]) ??
      (neighborhood?.sub_neighbors as NeighborhoodDto["sub_neighbors"]) ??
      (item.sub_neighborhoods as NeighborhoodDto["sub_neighbors"]) ??
      (neighborhood?.sub_neighborhoods as NeighborhoodDto["sub_neighbors"]),
  };
}

type LocationSearchNormalizer = (value: unknown) => NeighborhoodDto | null;

function unwrapLocationSearchItems(
  response: LocationSearchResponse,
  normalizeItem: LocationSearchNormalizer,
): NeighborhoodDto[] {
  if (Array.isArray(response)) {
    return response
      .map(normalizeItem)
      .filter((item): item is NeighborhoodDto => item !== null);
  }

  const record = asRecord(response);
  if (!record) return [];

  const candidates = [
    record.data,
    record.results,
    record.result,
    record.items,
    record.locations,
    record.location,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
        .map(normalizeItem)
        .filter((item): item is NeighborhoodDto => item !== null);
    }

    const nestedRecord = asRecord(candidate);
    if (nestedRecord) {
      const nestedItems = unwrapLocationSearchItems(nestedRecord, normalizeItem);
      if (nestedItems.length) return nestedItems;
    }
  }

  const single = normalizeItem(record);
  return single ? [single] : [];
}

async function requestLocationSearch(
  params:
    | { cityId: string; query: string }
    | { cityId: string; lat: number; lng: number },
) {
  const cityId = toPostgresInteger(params.cityId, "city_id");
  const searchParams =
    "query" in params
      ? {
          city_id: cityId,
          query: params.query.trim(),
        }
      : {
          city_id: cityId,
          lat: params.lat,
          lng: params.lng,
        };

  const response = await publicApi
    .get("public/location-search", { searchParams })
    .json<LocationSearchResponse>();

  return unwrapLocationSearchItems(
    response,
    "query" in params
      ? normalizeLocationSearchItem
      : normalizeCoordinateLocationSearchItem,
  );
}

export async function searchLocationsByQuery({
  cityId,
  query,
}: LocationSearchByQueryParams) {
  if (!query.trim()) return [];

  return requestLocationSearch({ cityId, query });
}

export async function searchLocationByCoordinates({
  cityId,
  lat,
  lng,
}: LocationSearchByCoordinatesParams) {
  const locations = await requestLocationSearch({ cityId, lat, lng });
  return locations[0] ?? null;
}
