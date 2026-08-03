import { publicApi } from "../api/api";

export type SubNeighborhoodDto = {
  geofence?: unknown;
  id?: string | number;
  name: string;
  polygon?: unknown;
};

export type NeighborhoodGeoPoint = [latitude: number, longitude: number];

export type NeighborhoodDto = {
  _id?: string;
  city_id?: string | number;
  geofence?: unknown;
  id?: string | number;
  lat?: number;
  lng?: number;
  name: string;
  polygon?: unknown;
  sub_neighbors?: SubNeighborhoodDto[] | string[] | string;
};

type NeighborhoodListResponse =
  | {
      data?: NeighborhoodDto[];
      status?: boolean;
    }
  | NeighborhoodDto[];



type SubNeighborhoodListResponse =
  | {
      data?: SubNeighborhoodDto[];
      status?: boolean;
    }
  | SubNeighborhoodDto[];

type NeighborhoodInfoResponse =
  | {
      data?: NeighborhoodDto | NeighborhoodDto[];
      neighborhood?: NeighborhoodDto;
      status?: boolean;
    }
  | NeighborhoodDto
  | NeighborhoodDto[];

export type NeighborhoodListParams = {
  cityId: string;
  page?: number;
  perPage?: number;
  q?: string;
};

export type NeighborhoodInfoWithLocParams = {
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

function normalizeNeighborhood(neighborhood: NeighborhoodDto): NeighborhoodDto {
  return {
    ...neighborhood,
    id: String(neighborhood.id ?? neighborhood._id ?? ""),
  };
}

function unwrapNeighborhoodList(response: NeighborhoodListResponse) {
  const data = Array.isArray(response) ? response : response.data ?? [];

  return data.map(normalizeNeighborhood).filter((item) => item.id && item.name);
}

function unwrapNeighborhoodInfo(response: NeighborhoodInfoResponse) {
  if (Array.isArray(response)) return response[0] ? normalizeNeighborhood(response[0]) : null;

  if (!response || typeof response !== "object") return null;

  if ("name" in response) return normalizeNeighborhood(response as NeighborhoodDto);

  const data = response.data;

  if (Array.isArray(data)) return data[0] ? normalizeNeighborhood(data[0]) : null;
  if (data && typeof data === "object") return normalizeNeighborhood(data as NeighborhoodDto);
  if (response.neighborhood) return normalizeNeighborhood(response.neighborhood);

  return null;
}

export async function getNeighborhoodList({
  cityId,
  page,
  perPage,
  q = "",
}: NeighborhoodListParams) {
  const response = await publicApi
    .get("public/neighborhood/list", {
      searchParams: {
        city_id: toPostgresInteger(cityId, "city_id"),
        page,
        per_page: perPage,
        q,
      },
    })
    .json<NeighborhoodListResponse>();

  return unwrapNeighborhoodList(response);
}

export async function getNeighborhoodInfoWithLoc({
  cityId,
  lat,
  lng,
}: NeighborhoodInfoWithLocParams) {
  const response = await publicApi
    .post("public/neighborhood/infoWithLoc", {
      json: {
        city_id: toPostgresInteger(cityId, "city_id"),
        lat,
        lng,
      },
    })
    .json<NeighborhoodInfoResponse>();

  return unwrapNeighborhoodInfo(response);
}

export async function getSubNeighborhoodList(neighborhoodId: string | number) {
  const response = await publicApi
    .get("public/neighborhood/sub-neighborhood/list", {
      searchParams: {
        neighborhood_id: toPostgresInteger(neighborhoodId, "neighborhood_id"),
      },
    })
    .json<SubNeighborhoodListResponse>();

  const data = Array.isArray(response) ? response : response.data ?? [];

  return data
    .flatMap((item, index) => normalizeSubNeighborhood(item, index))
    .filter((item) => item.id !== undefined && item.id !== null && item.name);
}

function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== "string") return value;

  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return value;
  }
}

function coordinatePairToPoint(value: unknown): NeighborhoodGeoPoint | null {
  if (!Array.isArray(value) || value.length < 2) return null;

  const first = Number(value[0]);
  const second = Number(value[1]);
  if (!Number.isFinite(first) || !Number.isFinite(second)) return null;

  // GeoJSON coordinates are [longitude, latitude].
  if (Math.abs(first) <= 180 && Math.abs(second) <= 90) {
    return [second, first];
  }

  return null;
}

export function getNeighborhoodPolygonPoints(value: unknown): NeighborhoodGeoPoint[] {
  const parsed = parseMaybeJson(value);
  if (!parsed) return [];

  if (Array.isArray(parsed)) {
    const directPoints = parsed
      .map(coordinatePairToPoint)
      .filter((point): point is NeighborhoodGeoPoint => point !== null);

    if (directPoints.length >= 3) return directPoints;

    const firstRing = Array.isArray(parsed[0]) ? parsed[0] : [];
    return firstRing
      .map(coordinatePairToPoint)
      .filter((point): point is NeighborhoodGeoPoint => point !== null);
  }

  if (typeof parsed !== "object") return [];

  const record = parsed as Record<string, unknown>;
  const coordinates = Array.isArray(record.coordinates) ? record.coordinates : [];
  const firstRing = Array.isArray(coordinates[0]) ? coordinates[0] : coordinates;

  return firstRing
    .map(coordinatePairToPoint)
    .filter((point): point is NeighborhoodGeoPoint => point !== null);
}

export function getNeighborhoodSubNeighborhoods(neighborhood: NeighborhoodDto): SubNeighborhoodDto[] {
  const value = neighborhood.sub_neighbors;
  if (!value) return [];

  if (typeof value === "string") {
    const parsed = parseMaybeJson(value);
    if (parsed !== value && Array.isArray(parsed)) {
      return parsed.flatMap((item, index) => normalizeSubNeighborhood(item, index));
    }

    return value
      .split(/[،,|]/)
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name, index) => ({ id: `legacy-${index + 1}`, name }));
  }

  return value.flatMap((item, index) => normalizeSubNeighborhood(item, index));
}

function normalizeSubNeighborhood(value: unknown, index: number): SubNeighborhoodDto[] {
  if (typeof value === "string") {
    const name = value.trim();
    return name ? [{ id: `legacy-${index + 1}`, name }] : [];
  }

  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;
  const nameValue = record.name ?? record.title ?? record.label;
  const name = typeof nameValue === "string" ? nameValue.trim() : "";
  if (!name) return [];

  return [{
    geofence: record.geofence ?? record.polygon,
    id: String(record.id ?? record._id ?? `legacy-${index + 1}`),
    name,
    polygon: record.polygon,
  }];
}
