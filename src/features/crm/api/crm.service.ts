import { ApiError, api, type ApiQueryParams } from "../../../shared/api/api";

export type CrmRecord = Record<string, unknown>;

export type CrmAdvertiseFilters = {
  status?: AdvertiseStatus;
  trackCode?: string;
};

export type AdvertiseStatus =
  | "wait_for_payment"
  | "wait_for_admin"
  | "wait_for_agency"
  | "accepted"
  | "needs_edit"
  | "rejected"
  | "deleted"
  | "expired";

export type CrmReportKind = "advertise" | "user";

export type CrmReportFilters = {
  page?: number;
  perPage?: number;
  search?: string;
};

export type CrmReportListResult = {
  data: CrmRecord[];
  total: number;
  page: number;
  perPage: number;
};

export type CrmConsultantType = "independent" | "dependent";
export type CrmConsultantStatus = "pending" | "accept" | "reject";

export type CrmAgentFilters = {
  type?: CrmConsultantType;
  status?: CrmConsultantStatus;
  search?: string;
  page?: number;
  perPage?: number;
  agencyId?: string;
};

export type CrmConsultantPayload = {
  name: string;
  family: string;
  mobile: string;
  status: CrmConsultantStatus;
  type: CrmConsultantType;
  agency_id: string | number | null;
};

export type CrmAdvertisePayload = {
  category_id?: string;
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
  target_owner_type?: "user" | "agency";
  target_owner_id?: string | number;
  features?: { key: string; value: unknown }[];
};

export type CrmUserFilters = {
  mobile?: string;
  name?: string;
};

export type CrmAgencyFilters = {
  name?: string;
  trusted?: boolean;
};

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

export type CrmPaymentFilters = {
  page?: number;
  perPage?: number;
  status?: number;
  paymentFor?: number;
  paymentType?: number;
  agencyId?: string;
  userId?: string;
  advertiseId?: string;
  packageId?: string;
  fromDate?: string;
  toDate?: string;
};

export type CrmPaymentListResult = {
  data: CrmRecord[];
  total: number;
  page: number;
  perPage: number;
};

export type CrmCheckoutProductPayload = {
  title: string;
  description: string;
  price: number;
  credit_cost: number;
  duration_days: number | null;
  duration_months: number | null;
  is_active: boolean;
  sort_order: number;
  metadata: Record<string, unknown>;
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
  "sub_neighborhood",
  "sub_neighborhoods",
  "subNeighborhood",
  "subNeighborhoods",
  "items",
  "list",
  "packages",
  "payments",
  "transactions",
  "reports",
  "advertise_reports",
  "user_reports",
  "chat_reports",
  "result",
] as const;

export type CrmPackageKind = "panel_subscription" | "credit_bundle";

export type CrmPackagePayload = {
  slug: string;
  kind: CrmPackageKind;
  title: string;
  real_price: number | null;
  discount_percent: number | null;
  duration_days: number | null;
  ad_credit: number | null;
  special_credit: number | null;
  renew_credit: number | null;
  sort_order: number | null;
  is_active: boolean;
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

function findPaginationRecord(payload: unknown): CrmRecord {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {};

  const current = payload as CrmRecord;
  const hasPagination = ["total", "count", "page", "current_page", "per_page", "perPage"].some(
    (key) => current[key] !== undefined,
  );

  if (hasPagination) return current;

  for (const key of ["data", "result", "meta", "pagination"]) {
    const nested = current[key];
    const match = findPaginationRecord(nested);

    if (Object.keys(match).length > 0) return match;
  }

  return {};
}

async function requestCrmReportList(
  endpoint: string,
  filters: Required<Pick<CrmReportFilters, "page" | "perPage">> & Pick<CrmReportFilters, "search">,
) {
  const query = compactSearchParams({
    page: filters.page,
    per_page: filters.perPage,
    search: filters.search?.trim(),
  });

  try {
    return await api.get(endpoint, { searchParams: query }).json<unknown>();
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 405) throw error;

    return api
      .post(endpoint, {
        json: {
          page: filters.page,
          per_page: filters.perPage,
          ...(filters.search?.trim() ? { search: filters.search.trim() } : {}),
        },
      })
      .json<unknown>();
  }
}

export async function listCrmReports(
  kind: CrmReportKind,
  filters: CrmReportFilters = {},
): Promise<CrmReportListResult> {
  const page = filters.page ?? 1;
  const perPage = filters.perPage ?? 20;
  const endpoint =
    kind === "advertise"
      ? "panel/advertise/report/list"
      : "panel/chat/report/list";
  const payload = await requestCrmReportList(endpoint, {
    page,
    perPage,
    search: filters.search,
  });
  const data = normalizeRows(payload);
  const pagination = findPaginationRecord(payload);
  const totalValue = Number(pagination.total ?? pagination.count ?? data.length);
  const pageValue = Number(pagination.page ?? pagination.current_page ?? page);
  const perPageValue = Number(pagination.per_page ?? pagination.perPage ?? perPage);

  return {
    data,
    total: Number.isFinite(totalValue) ? totalValue : data.length,
    page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : page,
    perPage: Number.isFinite(perPageValue) && perPageValue > 0 ? perPageValue : perPage,
  };
}

export async function listCrmPayments(filters: CrmPaymentFilters = {}): Promise<CrmPaymentListResult> {
  const payload = await api.get("panel/payments", {
    searchParams: compactSearchParams({
      page: filters.page ?? 1,
      per_page: filters.perPage ?? 20,
      status: filters.status,
      payment_for: filters.paymentFor,
      payment_type: filters.paymentType,
      agency_id: filters.agencyId?.trim(),
      user_id: filters.userId?.trim(),
      advertise_id: filters.advertiseId?.trim(),
      package_id: filters.packageId?.trim(),
      from_date: filters.fromDate,
      to_date: filters.toDate,
    }),
  }).json<unknown>();

  const record = payload && typeof payload === "object" && !Array.isArray(payload)
    ? payload as CrmRecord
    : {};
  const data = normalizeRows(payload);
  const requestedPage = filters.page ?? 1;
  const requestedPerPage = filters.perPage ?? 20;
  const totalValue = Number(record.total ?? record.count ?? data.length);
  const pageValue = Number(record.page ?? requestedPage);
  const perPageValue = Number(record.per_page ?? record.perPage ?? requestedPerPage);

  return {
    data,
    total: Number.isFinite(totalValue) ? totalValue : data.length,
    page: Number.isFinite(pageValue) && pageValue > 0 ? pageValue : requestedPage,
    perPage: Number.isFinite(perPageValue) && perPageValue > 0 ? perPageValue : requestedPerPage,
  };
}

export async function listCrmAgents(filters: CrmAgentFilters = {}) {
  return normalizeRows(
    await api.get("panel/consultant/list", {
      searchParams: compactSearchParams({
        type: filters.type,
        status: filters.status,
        search: filters.search?.trim(),
        page: filters.page ?? 1,
        per_page: filters.perPage ?? 100,
        agency_id: filters.agencyId?.trim(),
      }),
    }).json<unknown>(),
  );
}

export function createCrmConsultant(payload: CrmConsultantPayload) {
  return api
    .post("panel/consultant", { json: payload })
    .json<unknown>();
}

export function updateCrmConsultant(
  id: string,
  payload: Partial<CrmConsultantPayload>,
) {
  return api
    .patch(`panel/consultant/${encodeURIComponent(id)}`, { json: payload })
    .json<unknown>();
}

export async function listCrmAgencyAgents(agencyId: string) {
  return listCrmAgents({
    agencyId,
    page: 1,
    perPage: 100,
    type: "dependent",
  });
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

function buildCrmAdvertiseFormData(payload: CrmAdvertisePayload, files: File[]) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(payload)) {
    if (value === undefined || value === null) continue;

    if (key === "images") {
      formData.append("existing_images", JSON.stringify(value));
      continue;
    }

    if (Array.isArray(value) || typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      continue;
    }

    formData.append(key, String(value));
  }

  files.forEach((file) => {
    formData.append("images", file, file.name);
  });

  return formData;
}

export async function saveCrmAdvertise(
  id: string | null,
  payload: CrmAdvertisePayload,
  files: File[] = [],
) {
  const formData = buildCrmAdvertiseFormData(payload, files);

  return unwrapRecord(
    await api
      .post(id ? `panel/advertise/update/${id}` : "panel/advertise/create", { body: formData })
      .json<unknown>(),
    ["advertise", "data", "result"],
  );
}

export function updateCrmAdvertiseStatus(id: string, status: AdvertiseStatus, reason?: string) {
  const payload: { reason?: string; status: AdvertiseStatus } = { status };

  if (reason !== undefined) {
    payload.reason = reason.trim();
  }

  return api
    .post(`panel/advertise/status/${id}`, { json: payload })
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

export function toggleCrmUserAuthorization(id: string) {
  return api.get(`panel/user/authorize/${id}`).json<unknown>();
}

export async function listCrmAgencies(filters: CrmAgencyFilters = {}) {
  const searchParams: ApiQueryParams = {
    page: 1,
    per_page: 50,
    name: filters.name?.trim(),
    trusted: filters.trusted,
  };

  return normalizeRows(
    await api.get("panel/agency/list", { searchParams: compactSearchParams(searchParams) }).json<unknown>(),
  );
}

export type CrmAgencyReviewStatus = "accept" | "reject";

export function updateCrmAgencyStatus(id: string, status: CrmAgencyReviewStatus) {
  return api
    .post(`panel/agency/update/${id}`, {
      json: { status },
    })
    .json<unknown>();
}

export function setCrmAgencyTrusted(id: string, isTrusted: boolean) {
  return api
    .post(`panel/agency/trusted/${encodeURIComponent(id)}`, {
      json: { is_trusted: isTrusted },
    })
    .json<unknown>();
}

export async function listCrmPackages() {
  return normalizeRows(await api.get("panel/packages").json<unknown>());
}

export async function getCrmPackage(id: string) {
  return unwrapRecord(
    await api.get(`panel/packages/${encodeURIComponent(id)}`).json<unknown>(),
    ["package", "data", "result"],
  );
}

export function saveCrmPackage(id: string | null, payload: CrmPackagePayload) {
  const request = id
    ? api.patch(`panel/packages/${encodeURIComponent(id)}`, { json: payload })
    : api.post("panel/packages", { json: payload });
  return request.json<unknown>();
}

export function deleteCrmPackage(id: string) {
  return api.delete(`panel/packages/${encodeURIComponent(id)}`).json<unknown>();
}

export async function updateCrmPackageStatus(id: string, isActive: boolean) {
  return unwrapRecord(
    await api.patch(`panel/packages/${encodeURIComponent(id)}/status`, {
      json: { is_active: isActive },
    }).json<unknown>(),
    ["package", "data", "result"],
  );
}

export async function listCrmCheckoutProducts() {
  return normalizeRows(await api.get("panel/advertise-checkout-products").json<unknown>());
}

export async function updateCrmCheckoutProduct(slug: string, payload: CrmCheckoutProductPayload) {
  return unwrapRecord(
    await api.patch(`panel/advertise-checkout-products/${slug}`, { json: payload }).json<unknown>(),
    ["product", "data"],
  );
}

export async function updateCrmCheckoutProductStatus(slug: string, isActive: boolean) {
  return unwrapRecord(
    await api.patch(`panel/advertise-checkout-products/${slug}/status`, {
      json: { is_active: isActive },
    }).json<unknown>(),
    ["product", "data"],
  );
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
    per_page: filters.perPage ?? 50,
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

export async function listCrmSubNeighborhoods(filters: CrmSubNeighborhoodFilters) {
  return normalizeRows(
    await api.get("panel/neighborhood/sub-neighborhood/list", {
      searchParams: compactSearchParams({
        neighborhood_id: Number(filters.neighborhoodId),
        q: filters.q?.trim(),
      }),
    }).json<unknown>(),
  );
}

function subNeighborhoodRequestBody(payload: CrmSubNeighborhoodPayload) {
  // Keep the standalone API contract strict: the sub-neighborhood id belongs
  // only in the update/delete URL and must never be sent in the JSON body.
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
  return api
    .delete(`panel/neighborhood/sub-neighborhood/delete/${id}`)
    .json<unknown>();
}

export async function listCrmAdvertiseForms() {
  return normalizeRows(
    await api.get("public/advertise-form").json<unknown>(),
  );
}
