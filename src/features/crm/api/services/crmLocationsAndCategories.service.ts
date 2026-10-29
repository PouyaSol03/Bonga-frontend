import { api, type ApiQueryParams } from "../../../../shared/api/api";
import {
  compactSearchParams,
  normalizeRows,
  type CrmRecord,
} from "./crmBase";

export type CrmCityFilters = {
  query?: string;
};

export type CrmNeighborhoodFilters = {
  cityId: string;
  perPage?: number;
};

export type CrmSubNeighborhoodFilters = {
  neighborhoodId: string;
  q?: string;
};

export type CrmSubNeighborhoodPayload = {
  neighborhood_id: number;
  name: string;
  geofence: unknown;
};

export async function listCrmCategories() {
  return normalizeRows(await api.get("panel/category/list").json<unknown>());
}

export function saveCrmCategory(id: string | null, payload: CrmRecord) {
  return api
    .post(id ? `panel/category/update/${id}` : "panel/category/create", {
      json: payload,
    })
    .json<unknown>();
}

export async function listCrmCities(filters: CrmCityFilters = {}) {
  const searchParams: ApiQueryParams = {
    page: 1,
    per_page: 50,
    q: filters.query?.trim(),
  };

  return normalizeRows(
    await api
      .get("panel/city/list", { searchParams: compactSearchParams(searchParams) })
      .json<unknown>(),
  );
}

export function saveCrmCity(id: string | null, payload: CrmRecord) {
  return api
    .post(id ? `panel/city/update/${id}` : "panel/city/create", {
      json: payload,
    })
    .json<unknown>();
}

export function deleteCrmCity(id: string) {
  return api.delete(`panel/city/delete/${id}`).json<unknown>();
}

export async function listCrmNeighborhoods(filters: CrmNeighborhoodFilters) {
  const searchParams: ApiQueryParams = {
    page: 1,
    per_page: filters.perPage ?? 50,
    city_id: filters.cityId,
  };

  return normalizeRows(
    await api
      .get("panel/neighborhood/list", { searchParams: compactSearchParams(searchParams) })
      .json<unknown>(),
  );
}

export function saveCrmNeighborhood(id: string | null, payload: CrmRecord) {
  return api
    .post(id ? `panel/neighborhood/update/${id}` : "panel/neighborhood/create", {
      json: payload,
    })
    .json<unknown>();
}

export function deleteCrmNeighborhood(id: string) {
  return api.delete(`panel/neighborhood/delete/${id}`).json<unknown>();
}

export async function listCrmSubNeighborhoods(filters: CrmSubNeighborhoodFilters) {
  return normalizeRows(
    await api
      .get("panel/neighborhood/sub-neighborhood/list", {
        searchParams: compactSearchParams({
          neighborhood_id: Number(filters.neighborhoodId),
          q: filters.q?.trim(),
        }),
      })
      .json<unknown>(),
  );
}

function subNeighborhoodRequestBody(payload: CrmSubNeighborhoodPayload) {
  return {
    neighborhood_id: payload.neighborhood_id,
    name: payload.name,
    geofence: payload.geofence,
  };
}

export function createCrmSubNeighborhood(payload: CrmSubNeighborhoodPayload) {
  return api
    .post("panel/neighborhood/sub-neighborhood/create", {
      json: subNeighborhoodRequestBody(payload),
    })
    .json<unknown>();
}

export function updateCrmSubNeighborhood(id: string, payload: CrmSubNeighborhoodPayload) {
  return api
    .post(`panel/neighborhood/sub-neighborhood/update/${id}`, {
      json: subNeighborhoodRequestBody(payload),
    })
    .json<unknown>();
}

export function deleteCrmSubNeighborhood(id: string) {
  return api.delete(`panel/neighborhood/sub-neighborhood/delete/${id}`).json<unknown>();
}
