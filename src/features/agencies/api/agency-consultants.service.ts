import { api, apiV2 } from "../../../shared/api/api";
import type {
  AddAgencyConsultantPayload,
  AgencyConsultantDetailApiResponse,
  AgencyConsultantDto,
  AgencyConsultantRequestDecisionPayload,
  AgencyConsultantsApiResponse,
  AgencyConsultantsPage,
  AgencyConsultantsParams,
  DeactivateAgencyConsultantPayload,
  UpdateAgencyConsultantPayload,
} from "./agency-consultants-types";
import { normalizeAgencyConsultant, toNumber } from "./agency.service";

export function agencyConsultantPath(agentId: number | string, subPath?: string): string {
  const base = `consultants/${encodeURIComponent(String(agentId))}`;
  return subPath ? `${base}/${subPath}` : base;
}

export async function getMyAgencyConsultants({
  page = 1,
  perPage = 100,
  query,
  status = "all",
}: AgencyConsultantsParams = {}): Promise<AgencyConsultantsPage> {
  const searchParams: Record<string, string | number> = { page, per_page: perPage };
  if (query?.trim()) searchParams.query = query.trim();
  if (status) searchParams.status = status;

  const response = await apiV2
    .get("consultants", { searchParams })
    .json<AgencyConsultantsApiResponse>();
  const data = (response.data ?? [])
    .map(normalizeAgencyConsultant)
    .filter((item): item is AgencyConsultantDto => Boolean(item));

  return {
    data,
    page: Math.max(1, toNumber(response.page, page)),
    perPage: Math.max(1, toNumber(response.per_page, perPage)),
    total: Math.max(0, toNumber(response.total, data.length)),
  };
}

export async function getMyAgencyConsultant(
  agentId: number | string,
): Promise<AgencyConsultantDto> {
  const response = await apiV2
    .get(agencyConsultantPath(agentId))
    .json<AgencyConsultantDetailApiResponse>();
  const source = (response.consultant ?? response.data ?? response) as Record<string, unknown>;
  const consultant = normalizeAgencyConsultant({
    ...source,
    ad_quota: source.ad_quota ?? response.ad_quota,
    agency_membership: source.agency_membership ?? response.agency_membership,
    member: source.member ?? response.member,
    membership: source.membership ?? response.membership,
    membership_state: source.membership_state ?? response.membership_state,
    metrics: source.metrics ?? response.metrics,
    permissions: source.permissions ?? response.permissions,
    quotas: source.quotas ?? response.quotas,
    renew_quota: source.renew_quota ?? response.renew_quota,
    special_quota: source.special_quota ?? response.special_quota,
  } as Parameters<typeof normalizeAgencyConsultant>[0]);

  if (!consultant) throw new Error("اطلاعات مشاور معتبر نیست.");
  return consultant;
}

export async function addMyAgencyConsultant({
  adQuota,
  agentId,
  permissions,
  renewQuota,
  role,
  specialQuota,
}: AddAgencyConsultantPayload) {
  return apiV2.post("consultants", {
    context: { allowNonJsonResponse: true },
    headers: { Accept: "*/*" },
    json: {
      ad_quota: Math.max(0, Math.trunc(adQuota)),
      consultant_id: Number.isFinite(Number(agentId)) ? Number(agentId) : agentId,
      permissions,
      renew_quota: Math.max(0, Math.trunc(renewQuota)),
      role,
      special_quota: Math.max(0, Math.trunc(specialQuota)),
    },
  });
}

export async function respondToAgencyConsultantRequest({
  agentId,
  decision,
}: AgencyConsultantRequestDecisionPayload) {
  return api.patch(
    `me/agent/agency-requests/${encodeURIComponent(String(agentId))}/${decision}`,
    {
      context: { allowNonJsonResponse: true },
      headers: { Accept: "*/*" },
    },
  );
}

export async function cancelMyAgencyConsultantRequest(agentId: number | string) {
  return apiV2.delete(agencyConsultantPath(agentId, "request"), {
    context: { allowNonJsonResponse: true },
    headers: { Accept: "*/*" },
  });
}

export async function updateMyAgencyConsultant({
  adQuota,
  agentId,
  permissions,
  renewQuota,
  role,
  specialQuota,
}: UpdateAgencyConsultantPayload) {
  return apiV2.patch(agencyConsultantPath(agentId), {
    context: { allowNonJsonResponse: true },
    headers: { Accept: "*/*" },
    json: {
      ad_quota: Math.max(0, Math.trunc(adQuota)),
      permissions,
      renew_quota: Math.max(0, Math.trunc(renewQuota)),
      role: role === "manager" ? 2 : 1,
      special_quota: Math.max(0, Math.trunc(specialQuota)),
    },
  });
}

export async function deactivateMyAgencyConsultant({
  agentId,
  transferTo,
  transferUserId,
}: DeactivateAgencyConsultantPayload) {
  const transferPayload =
    transferTo === "agency"
      ? { transfer_to: "agency" as const }
      : {
          transfer_to: "member" as const,
          transfer_user_id: Number.isFinite(Number(transferUserId))
            ? Number(transferUserId)
            : transferUserId,
        };

  return apiV2.delete(agencyConsultantPath(agentId), {
    context: { allowNonJsonResponse: true },
    headers: { Accept: "*/*" },
    json: transferPayload,
  });
}


