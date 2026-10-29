import { api, type ApiQueryParams } from "../../../../shared/api/api";
import { compactSearchParams, normalizeRows, type CrmRecord } from "./crmBase";

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

export type CrmUserFilters = {
  mobile?: string;
  name?: string;
  nationalnumber?: string;
};

export type CrmAgencyFilters = {
  name?: string;
  trusted?: boolean;
};

export type CrmAgencyReviewStatus = "accept" | "reject";

export async function listCrmAgents(filters: CrmAgentFilters = {}) {
  return normalizeRows(
    await api
      .get("panel/consultant/list", {
        searchParams: compactSearchParams({
          type: filters.type,
          status: filters.status,
          search: filters.search?.trim(),
          page: filters.page ?? 1,
          per_page: filters.perPage ?? 100,
          agency_id: filters.agencyId?.trim(),
        }),
      })
      .json<unknown>(),
  );
}

export function createCrmConsultant(payload: CrmConsultantPayload) {
  return api.post("panel/consultant", { json: payload }).json<unknown>();
}

export function updateCrmConsultant(id: string, payload: Partial<CrmConsultantPayload>) {
  return api.patch(`panel/consultant/${encodeURIComponent(id)}`, { json: payload }).json<unknown>();
}

export async function listCrmAgencyAgents(agencyId: string) {
  return listCrmAgents({
    agencyId,
    page: 1,
    perPage: 100,
    type: "dependent",
  });
}

export async function listCrmUsers(filters: CrmUserFilters = {}) {
  const searchParams: ApiQueryParams = {
    page: 1,
    per_page: 50,
    mobile: filters.mobile?.trim(),
    name: filters.name?.trim(),
    nationalnumber: filters.nationalnumber?.trim(),
  };

  return normalizeRows(
    await api
      .get("panel/user/list", { searchParams: compactSearchParams(searchParams) })
      .json<unknown>(),
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

export function updateCrmUserAuthorization(
  id: string,
  status: "accept" | "reject" | "toggle",
  reason?: string,
) {
  return api.post(`panel/user/authorize/${id}`, { json: { reason, status } }).json<unknown>();
}

export function chargeCrmUserBalance(id: string | number, amount: number) {
  return api.post(`panel/user/charge-balance/${id}`, { json: { amount } }).json<unknown>();
}

export async function listCrmAgencies(filters: CrmAgencyFilters = {}) {
  const searchParams: ApiQueryParams = {
    page: 1,
    per_page: 50,
    name: filters.name?.trim(),
    trusted: filters.trusted,
  };

  return normalizeRows(
    await api
      .get("panel/agency/list", { searchParams: compactSearchParams(searchParams) })
      .json<unknown>(),
  );
}

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
