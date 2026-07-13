import { api, type ApiQueryParams } from "../api/api";

export type CrmRecord = Record<string, unknown>;

export type CrmAdvertiseFilters = {
  status?: number;
  trackCode?: string;
};

export type CrmAdvertisePayload = {
  category_id: string;
  form_code: string;
  title: string;
  neighborhood_id: string;
  lat: number;
  lng: number;
  contact_type: string[];
  owner_phone: string;
  description: string;
  owner_type: string;
  virtual_tour_link: string;
  images: string[];
};

export type CrmUserFilters = {
  mobile?: string;
  name?: string;
};

export type CrmAgencyFilters = {
  name?: string;
};

export type CrmCityFilters = {
  query?: string;
};

export type CrmNeighborhoodFilters = {
  cityId: string;
};

const rowContainerKeys = [
  "data",
  "advertise",
  "advertises",
  "users",
  "agencies",
  "categories",
  "cities",
  "neighborhoods",
  "items",
  "list",
  "packages",
  "result",
] as const;

export type CrmPackageKind = "panel_subscription" | "credit_bundle";

export type CrmPackagePayload = {
  title: string;
  kind: CrmPackageKind;
  real_price: number;
  discount_percent?: number;
  ad_credit?: number;
  special_credit?: number;
  renew_credit?: number;
  start_date?: string;
  end_date?: string;
  gift?: boolean;
};

export type CrmCostPayload = {
  ad_price: number;
  special_price: number;
  update_price: number;
};

function compactSearchParams(params: ApiQueryParams) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  ) as Record<string, string | number | boolean>;
}

function normalizeRows(payload: unknown): CrmRecord[] {
  if (Array.isArray(payload)) return payload as CrmRecord[];
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;

  for (const key of rowContainerKeys) {
    const value = record[key];

    if (Array.isArray(value)) return value as CrmRecord[];
  }

  for (const key of rowContainerKeys) {
    const value = record[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nestedRows = normalizeRows(value);

      if (nestedRows.length > 0) return nestedRows;
    }
  }

  return [];
}

function unwrapRecord(payload: unknown, keys: string[]): CrmRecord {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {};

  let current = payload as CrmRecord;
  const visited = new Set<CrmRecord>();

  while (!visited.has(current)) {
    visited.add(current);
    let next: CrmRecord | null = null;

    for (const key of keys) {
      const value = current[key];

      if (value && typeof value === "object" && !Array.isArray(value)) {
        next = value as CrmRecord;
        break;
      }
    }

    if (!next) return current;
    current = next;
  }

  return current;
}

export function getCrmRecordId(record: CrmRecord) {
  const value = record.id ?? record._id;
  return value === undefined || value === null ? "" : String(value);
}

export async function listCrmAdvertises(filters: CrmAdvertiseFilters = {}) {
  const body: Record<string, unknown> = {
    page: 1,
    per_page: 50,
  };

  if (filters.status !== undefined) body.status = filters.status;
  if (filters.trackCode?.trim()) body.track_code = filters.trackCode.trim();

  return normalizeRows(
    await api.post("panel/advertise/list", { json: body }).json<unknown>(),
  );
}

export async function getCrmAdvertise(id: string) {
  return unwrapRecord(
    await api.get(`panel/advertise/show/${id}`).json<unknown>(),
    ["advertise", "data", "result"],
  );
}

export async function saveCrmAdvertise(id: string | null, payload: CrmAdvertisePayload) {
  return unwrapRecord(
    await api
      .post(id ? `panel/advertise/update/${id}` : "panel/advertise/create", { json: payload })
      .json<unknown>(),
    ["advertise", "data", "result"],
  );
}

export function updateCrmAdvertiseStatus(id: string, status: number) {
  return api
    .post(`panel/advertise/status/${id}`, { json: { status } })
    .json<unknown>();
}

export async function listCrmUsers(filters: CrmUserFilters = {}) {
  const searchParams: ApiQueryParams = {
    page: 1,
    per_page: 50,
    mobile: filters.mobile?.trim(),
    name: filters.name?.trim(),
  };

  return normalizeRows(
    await api.get("panel/user/list", { searchParams: compactSearchParams(searchParams) }).json<unknown>(),
  );
}

export function saveCrmUser(id: string | null, payload: CrmRecord) {
  return api
    .post(id ? `panel/user/update/${id}` : "panel/user/create", {
      json: payload,
    })
    .json<unknown>();
}

export function toggleCrmUserStatus(id: string) {
  return api.get(`panel/user/status/${id}`).json<unknown>();
}

export async function listCrmAgencies(filters: CrmAgencyFilters = {}) {
  const searchParams: ApiQueryParams = {
    page: 1,
    per_page: 50,
    name: filters.name?.trim(),
  };

  return normalizeRows(
    await api.get("panel/agency/list", { searchParams: compactSearchParams(searchParams) }).json<unknown>(),
  );
}

export function saveCrmAgency(id: string | null, payload: CrmRecord) {
  return api
    .post(id ? `panel/agency/update/${id}` : "panel/agency/create", {
      json: payload,
    })
    .json<unknown>();
}

export function deleteCrmAgency(id: string) {
  return api.delete(`panel/agency/delete/${id}`).json<unknown>();
}

export async function listCrmPackages() {
  return normalizeRows(await api.get("panel/package/list").json<unknown>());
}

export function saveCrmPackage(id: string | null, payload: CrmPackagePayload) {
  return api.post(id ? `panel/package/update/${id}` : "panel/package/create", { json: payload }).json<unknown>();
}

export function deleteCrmPackage(id: string) {
  return api.delete(`panel/package/delete/${id}`).json<unknown>();
}

export async function getCrmCosts() {
  return unwrapRecord(await api.get("panel/cost/show").json<unknown>(), ["cost", "costs", "data"]);
}

export function updateCrmCosts(payload: CrmCostPayload) {
  return api.post("panel/cost/update", { json: payload }).json<unknown>();
}

export async function listCrmCategories() {
  return normalizeRows(
    await api.get("panel/category/list").json<unknown>(),
  );
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
    await api.get("panel/city/list", { searchParams: compactSearchParams(searchParams) }).json<unknown>(),
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
    per_page: 50,
    city_id: filters.cityId,
  };

  return normalizeRows(
    await api.get("panel/neighborhood/list", { searchParams: compactSearchParams(searchParams) }).json<unknown>(),
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

export async function listCrmAdvertiseForms() {
  return normalizeRows(
    await api.get("public/advertise-form").json<unknown>(),
  );
}
