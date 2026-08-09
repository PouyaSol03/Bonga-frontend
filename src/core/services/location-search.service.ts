import { publicApi } from "../api/api";
import type { NeighborhoodDto } from "./neighborhood.service";

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

function normalizeLocationSearchItem(value: unknown): NeighborhoodDto | null {
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
    item.name,
    item.title,
    item.label,
    item.address,
    item.neighborhood_name,
    item.neighborhoodName,
    neighborhood?.name,
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
    geofence:
      item.geofence ??
      item.polygon ??
      neighborhood?.geofence ??
      neighborhood?.polygon,
    polygon:
      item.polygon ??
      item.geofence ??
      neighborhood?.polygon ??
      neighborhood?.geofence,
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

function unwrapLocationSearchItems(response: LocationSearchResponse): NeighborhoodDto[] {
  if (Array.isArray(response)) {
    return response
      .map(normalizeLocationSearchItem)
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
        .map(normalizeLocationSearchItem)
        .filter((item): item is NeighborhoodDto => item !== null);
    }

    const nestedRecord = asRecord(candidate);
    if (nestedRecord) {
      const nestedItems = unwrapLocationSearchItems(nestedRecord);
      if (nestedItems.length) return nestedItems;
    }
  }

  const single = normalizeLocationSearchItem(record);
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

  return unwrapLocationSearchItems(response);
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
