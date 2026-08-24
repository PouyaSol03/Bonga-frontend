import { api, getApiAssetUrl, publicApi } from "../../../shared/api/api";
import type { AdvertisementItem } from "../../advertisements/api/advertisement.service";

export type AgencySort = "score" | "rank" | "newest" | "oldest";

export type PublicAgencyDto = {
  address?: string;
  created_at?: string;
  id: string;
  img?: string;
  lat?: number;
  level_slug?: string;
  lng?: number;
  logo?: string;
  name: string;
  neighborhood_ids: string[];
  rank: number;
  score: number;
};

export type PublicAgencyPage = {
  data: PublicAgencyDto[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

export type PublicAgencyListParams = {
  neighborhoodId?: string;
  page?: number;
  perPage?: number;
  search?: string;
  sort?: AgencySort;
};

export type PublicAgentListDto = {
  agencyId?: string;
  agency?: PublicAgentAgencySummary;
  avatar?: string;
  family?: string;
  fullName: string;
  id: string;
  levelSlug?: string;
  levelTitle?: string;
  mobile?: string;
  name?: string;
  rank?: number;
  role?: string;
  score?: number;
  status?: string;
  userId?: string;
};

export type PublicAgentsPage = {
  data: PublicAgentListDto[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

export type PublicAgentListParams = {
  agencyId?: number | string;
  page?: number;
  perPage?: number;
  search?: string;
  sort?: AgencySort;
};

export type AgencyConsultantPermissions = {
  manage_advertises: boolean;
  manage_consultants: boolean;
  manage_credits: boolean;
  manage_requests: boolean;
  support: boolean;
};

type AgencyConsultantSettingsPayload = {
  adQuota: number;
  permissions: AgencyConsultantPermissions | Record<string, boolean>;
  renewQuota: number;
  role: "consultant" | "manager";
  specialQuota: number;
};

export type AddAgencyConsultantPayload = AgencyConsultantSettingsPayload & {
  agentId: number | string;
};

export type AgencyConsultantRequestDecision = "accept" | "reject";

export type AgencyConsultantRequestDecisionPayload = {
  agentId: number | string;
  decision: AgencyConsultantRequestDecision;
};

export type AgencyConsultantMetrics = {
  publishedAdvertises: number;
  rank?: number;
  rankingScore: number;
  renewUsed: number;
  specialUsed: number;
};

export type AgencyConsultantPeriodActivity = {
  advertiseRegistrationProgress: Array<{ month: string; value: number }>;
  period: string;
  publishedAdvertises: number;
  renewUsed: number;
  specialUsed: number;
};

export type AgencyConsultantDto = {
  adQuota: number;
  agentId?: number;
  requestId?: number;
  avatar?: string;
  isActive: boolean;
  metrics: AgencyConsultantMetrics;
  mobile: string;
  name: string;
  permissions: AgencyConsultantPermissions;
  periodActivity?: AgencyConsultantPeriodActivity;
  renewQuota: number;
  role: string;
  roleId: number;
  specialQuota: number;
  userId: number;
};

export type AgencyConsultantsPage = {
  data: AgencyConsultantDto[];
  page: number;
  perPage: number;
  total: number;
};

export type AgencyConsultantsParams = {
  page?: number;
  perPage?: number;
};

export type UpdateAgencyConsultantPayload = AgencyConsultantSettingsPayload & {
  agentId: number | string;
};

export type DeactivateAgencyConsultantPayload = {
  agentId: number | string;
  transferTo: "agency" | "member";
  transferUserId?: number | string;
};

type PublicAgencyApiItem = {
  address?: unknown;
  created_at?: unknown;
  id?: unknown;
  _id?: unknown;
  img?: unknown;
  lat?: unknown;
  level_slug?: unknown;
  lng?: unknown;
  logo?: unknown;
  name?: unknown;
  neighborhood_ids?: unknown;
  rank?: unknown;
  score?: unknown;
};

type PublicAgencyApiResponse = {
  data?: PublicAgencyApiItem[];
  page?: unknown;
  per_page?: unknown;
  status?: boolean;
  total?: unknown;
};

type PublicAgentListApiItem = {
  _id?: unknown;
  agency?: unknown;
  agency_id?: unknown;
  avatar?: unknown;
  family?: unknown;
  full_name?: unknown;
  id?: unknown;
  level_slug?: unknown;
  level_title?: unknown;
  mobile?: unknown;
  name?: unknown;
  phonenumber?: unknown;
  rank?: unknown;
  role?: unknown;
  score?: unknown;
  status?: unknown;
  user_id?: unknown;
};

type PublicAgentsApiResponse = {
  data?: PublicAgentListApiItem[];
  page?: unknown;
  per_page?: unknown;
  status?: boolean;
  total?: unknown;
};

type AgencyConsultantApiItem = {
  _id?: unknown;
  ad_quota?: unknown;
  agency_membership?: unknown;
  agent_id?: unknown;
  avatar?: unknown;
  full_name?: unknown;
  id?: unknown;
  is_active?: unknown;
  member?: unknown;
  membership?: unknown;
  membership_state?: unknown;
  metrics?: {
    published_advertises?: unknown;
    rank?: unknown;
    ranking_score?: unknown;
    renew_used?: unknown;
    special_used?: unknown;
  };
  mobile?: unknown;
  name?: unknown;
  permissions?: unknown;
  period_activity?: unknown;
  quotas?: unknown;
  renew_quota?: unknown;
  role?: unknown;
  role_id?: unknown;
  request_id?: unknown;
  special_quota?: unknown;
  user?: unknown;
  user_id?: unknown;
};

type AgencyConsultantsApiResponse = {
  data?: AgencyConsultantApiItem[];
  page?: unknown;
  per_page?: unknown;
  status?: boolean;
  total?: unknown;
};

type AgencyConsultantDetailApiResponse = AgencyConsultantApiItem & {
  consultant?: AgencyConsultantApiItem;
  data?: AgencyConsultantApiItem;
  status?: boolean;
};

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function toOptionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return undefined;

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
}

function toStringArray(value: unknown) {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  return values
    .flatMap((item) => String(item ?? "").split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

function toAssetUrl(value: unknown) {
  const path = toText(value);

  return path ? getApiAssetUrl(path) : undefined;
}

function normalizeAgency(item: PublicAgencyApiItem): PublicAgencyDto | null {
  const id = String(item.id ?? item._id ?? "").trim();
  const name = toText(item.name);

  if (!id || !name) return null;

  return {
    address: toText(item.address) || undefined,
    created_at: toText(item.created_at) || undefined,
    id,
    img: toAssetUrl(item.img),
    lat: toOptionalNumber(item.lat),
    level_slug: toText(item.level_slug) || undefined,
    lng: toOptionalNumber(item.lng),
    logo: toAssetUrl(item.logo),
    name,
    neighborhood_ids: toStringArray(item.neighborhood_ids),
    rank: toNumber(item.rank),
    score: toNumber(item.score),
  };
}

function normalizePublicAgentListItem(
  item: PublicAgentListApiItem,
): PublicAgentListDto | null {
  const id = firstText(item.id, item._id);
  const name = toText(item.name);
  const family = toText(item.family);
  const fullName = firstText(
    item.full_name,
    [name, family].filter(Boolean).join(" "),
  );

  if (!id || !fullName) return null;

  const agencyRecord = asRecord(item.agency);
  const agencyId = firstText(item.agency_id, agencyRecord.id, agencyRecord._id);
  const agencyName = firstText(agencyRecord.name, agencyRecord.title);
  const agency: PublicAgentAgencySummary | undefined =
    agencyId || agencyName
      ? {
          address: firstText(agencyRecord.address) || undefined,
          id: agencyId || undefined,
          logo: toAssetUrl(agencyRecord.logo ?? agencyRecord.img),
          name: agencyName || undefined,
        }
      : undefined;

  return {
    agencyId: agencyId || undefined,
    agency,
    avatar: toAssetUrl(item.avatar),
    family: family || undefined,
    fullName,
    id,
    levelSlug: toText(item.level_slug) || undefined,
    levelTitle: toText(item.level_title) || undefined,
    mobile: firstText(item.mobile, item.phonenumber) || undefined,
    name: name || undefined,
    rank: Number.isFinite(Number(item.rank)) ? Math.max(0, Number(item.rank)) : undefined,
    role: toText(item.role) || undefined,
    score: Number.isFinite(Number(item.score)) ? Math.max(0, Number(item.score)) : undefined,
    status: toText(item.status) || undefined,
    userId: firstText(item.user_id) || undefined,
  };
}

function normalizePermissionFlag(value: unknown) {
  return value === true || value === 1 || value === "1";
}

function normalizeAgencyConsultantPermissions(
  value: unknown,
): AgencyConsultantPermissions {
  const permissions = asRecord(value);

  return {
    manage_advertises: normalizePermissionFlag(permissions.manage_advertises),
    manage_consultants: normalizePermissionFlag(permissions.manage_consultants),
    manage_credits: normalizePermissionFlag(permissions.manage_credits),
    manage_requests: normalizePermissionFlag(permissions.manage_requests),
    support: normalizePermissionFlag(permissions.support),
  };
}

function normalizeAgencyConsultant(
  item: AgencyConsultantApiItem,
): AgencyConsultantDto | null {
  const membership = asRecord(
    item.membership ??
      item.membership_state ??
      item.member ??
      item.agency_membership,
  );
  const user = asRecord(item.user);
  const quotas = asRecord(item.quotas ?? membership.quotas);
  const agentId = toNumber(item.agent_id ?? item.id ?? item._id, Number.NaN);
  const userId = toNumber(item.user_id ?? user.id ?? user._id, Number.NaN);
  const name = firstText(item.name, item.full_name, user.full_name, user.name);
  const isActiveValue = item.is_active ?? membership.is_active;
  const periodActivity = asRecord(item.period_activity);
  const rawRegistrationProgress = Array.isArray(
    periodActivity.advertise_registration_progress,
  )
    ? periodActivity.advertise_registration_progress
    : [];

  if (!Number.isFinite(userId) || !name) return null;

  return {
    adQuota: Math.max(
      0,
      toNumber(item.ad_quota ?? membership.ad_quota ?? quotas.ad_quota),
    ),
    agentId: Number.isFinite(agentId) ? agentId : undefined,
    avatar: toAssetUrl(item.avatar ?? user.avatar),
    isActive: normalizePermissionFlag(isActiveValue),
    metrics: {
      publishedAdvertises: Math.max(
        0,
        toNumber(item.metrics?.published_advertises),
      ),
      rank: toOptionalNumber(item.metrics?.rank),
      rankingScore: Math.max(0, toNumber(item.metrics?.ranking_score)),
      renewUsed: Math.max(0, toNumber(item.metrics?.renew_used)),
      specialUsed: Math.max(0, toNumber(item.metrics?.special_used)),
    },
    mobile: firstText(item.mobile, user.mobile),
    name,
    permissions: normalizeAgencyConsultantPermissions(
      item.permissions ?? membership.permissions,
    ),
    periodActivity:
      Object.keys(periodActivity).length > 0
        ? {
            advertiseRegistrationProgress: rawRegistrationProgress
              .map((entry) => {
                const row = asRecord(entry);
                const month = firstText(row.month, row.bucket);
                if (!month) return null;
                return {
                  month,
                  value: Math.max(0, toNumber(row.count ?? row.value)),
                };
              })
              .filter(
                (entry): entry is { month: string; value: number } =>
                  entry !== null,
              ),
            period: firstText(periodActivity.period),
            publishedAdvertises: Math.max(
              0,
              toNumber(periodActivity.published_advertises),
            ),
            renewUsed: Math.max(0, toNumber(periodActivity.renew_used)),
            specialUsed: Math.max(0, toNumber(periodActivity.special_used)),
          }
        : undefined,
    renewQuota: Math.max(
      0,
      toNumber(item.renew_quota ?? membership.renew_quota ?? quotas.renew_quota),
    ),
    role: firstText(item.role, membership.role),
    roleId: toNumber(item.role_id ?? membership.role_id),
    requestId: toOptionalNumber(item.request_id),
    specialQuota: Math.max(
      0,
      toNumber(
        item.special_quota ?? membership.special_quota ?? quotas.special_quota,
      ),
    ),
    userId,
  };
}


export type PublicAgencyDetailDto = PublicAgencyDto & {
  active_advertises_count: number;
  about_us?: string;
  agency_type?: number;
  consultants: AgencyConsultantDto[];
  instagram?: string;
  phone1?: string;
  phone2?: string;
  phone3?: string;
  recent_advertises: AdvertisementItem[];
  telegram?: string;
  whatsapp?: string;
  working_hours?: string;
};

export type PublicAgentAgencySummary = {
  address?: string;
  id?: string;
  logo?: string;
  name?: string;
};

export type PublicAgentDetailDto = {
  active_advertises_count: number;
  about_us?: string;
  agencyId?: string;
  agency?: PublicAgentAgencySummary;
  avatar?: string;
  id: string;
  instagram?: string;
  level_slug?: string;
  level_title?: string;
  mobile?: string;
  name: string;
  neighborhood_ids: string[];
  rank: number;
  recent_advertises: AdvertisementItem[];
  role?: string;
  score: number;
  status?: string;
  telegram?: string;
  userId?: string;
  whatsapp?: string;
};

type PublicAgencyDetailApiResponse = {
  agency?: Record<string, unknown>;
  data?: Record<string, unknown>;
  status?: boolean;
};

type PublicAgentDetailApiResponse = {
  agent?: Record<string, unknown>;
  consultant?: Record<string, unknown>;
  data?: Record<string, unknown>;
  status?: boolean;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }

    const text = toText(value);
    if (text) return text;
  }

  return "";
}

function firstNumber(fallback: number, ...values: unknown[]) {
  for (const value of values) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

function readAdvertises(...values: unknown[]): AdvertisementItem[] {
  for (const value of values) {
    if (Array.isArray(value)) return value as AdvertisementItem[];
  }

  return [];
}

function readSocialValue(record: Record<string, unknown>, key: string) {
  const profile = asRecord(record.profile);
  const social = asRecord(record.social);
  const contactSocial = asRecord(record.contact_social);
  const contacts = asRecord(record.contacts);

  return firstText(
    record[key],
    profile[key],
    social[key],
    contactSocial[key],
    contacts[key],
  );
}

function normalizePublicAgencyDetail(
  item: Record<string, unknown>,
): PublicAgencyDetailDto | null {
  const base = normalizeAgency(item);
  if (!base) return null;

  const consultants = Array.isArray(item.consultants)
    ? item.consultants
        .map((consultant) => normalizeAgencyConsultant(asRecord(consultant)))
        .filter((consultant): consultant is AgencyConsultantDto => Boolean(consultant))
    : [];

  return {
    ...base,
    active_advertises_count: Math.max(
      0,
      firstNumber(0, item.active_advertises_count, item.active_advertise_count),
    ),
    about_us: firstText(item.about_us, item.about, item.description) || undefined,
    agency_type: Number.isFinite(Number(item.agency_type))
      ? Number(item.agency_type)
      : undefined,
    consultants,
    instagram: readSocialValue(item, "instagram") || undefined,
    lat: toOptionalNumber(item.lat),
    lng: toOptionalNumber(item.lng),
    phone1: firstText(item.phone1, item.phone) || undefined,
    phone2: firstText(item.phone2) || undefined,
    phone3: firstText(item.phone3, item.landline) || undefined,
    recent_advertises: readAdvertises(
      item.recent_advertises,
      item.recent_ads,
      item.advertises,
    ),
    working_hours: firstText(item.working_hours) || undefined,
  };
}

function normalizePublicAgentDetail(
  item: Record<string, unknown>,
): PublicAgentDetailDto | null {
  const profile = asRecord(item.profile);
  const user = asRecord(item.user);
  const ranking = asRecord(item.ranking_summary ?? item.ranking);
  const currentRanking = asRecord(ranking.current);
  const level = asRecord(ranking.level);
  const agencyRecord = asRecord(item.agency ?? item.agency_summary);
  const id = firstText(item.id, item._id);
  const composedName = [
    firstText(profile.name, user.name),
    firstText(profile.family, user.family),
  ].filter(Boolean).join(" ").trim();
  const directName = [firstText(item.name), firstText(item.family)]
    .filter(Boolean)
    .join(" ")
    .trim();
  const name = firstText(item.full_name, directName, composedName);

  if (!id || !name) return null;

  const agencyId = firstText(item.agency_id, agencyRecord.id, agencyRecord._id);
  const agencyName = firstText(agencyRecord.name, agencyRecord.title);
  const agency: PublicAgentAgencySummary | undefined =
    agencyId || agencyName
      ? {
          address: firstText(agencyRecord.address) || undefined,
          id: agencyId || undefined,
          logo: toAssetUrl(agencyRecord.logo ?? agencyRecord.img),
          name: agencyName || undefined,
        }
      : undefined;

  return {
    active_advertises_count: Math.max(
      0,
      firstNumber(
        0,
        item.active_advertises_count,
        item.active_advertise_count,
        item.published_advertises_count,
        item.active_ads_count,
      ),
    ),
    about_us: firstText(
      item.about_us,
      item.about,
      item.bio,
      item.description,
      profile.about_us,
      profile.bio,
    ) || undefined,
    agencyId: agencyId || undefined,
    agency,
    avatar: toAssetUrl(item.avatar ?? item.img ?? profile.avatar ?? user.avatar),
    id,
    instagram: readSocialValue(item, "instagram") || undefined,
    level_slug: firstText(
      item.level_slug,
      item.level,
      ranking.level_slug,
      currentRanking.level_slug,
      level.slug,
    ) || undefined,
    level_title: firstText(
      item.level_title,
      ranking.level_title,
      currentRanking.level_title,
      level.title,
      level.name,
    ) || undefined,
    mobile: firstText(
      item.mobile,
      item.phonenumber,
      item.phone,
      profile.mobile,
      profile.phone,
      user.mobile,
      user.phone,
    ) || undefined,
    name,
    neighborhood_ids: toStringArray(
      item.neighborhood_ids ??
        item.activity_neighborhood_ids ??
        profile.neighborhood_ids ??
        item.neighborhood_id,
    ),
    rank: Math.max(
      0,
      firstNumber(0, item.rank, item.ranking_rank, ranking.rank, currentRanking.rank),
    ),
    recent_advertises: readAdvertises(
      item.recent_advertises,
      item.recent_ads,
      item.advertises,
    ),
    role: firstText(item.role) || undefined,
    score: Math.max(
      0,
      firstNumber(
        0,
        item.score,
        item.ranking_score,
        ranking.score,
        ranking.total_score,
        currentRanking.score,
        currentRanking.total_score,
      ),
    ),
    status: firstText(item.status) || undefined,
    telegram: readSocialValue(item, "telegram") || undefined,
    userId: firstText(item.user_id, user.id, user._id) || undefined,
    whatsapp: readSocialValue(item, "whatsapp") || undefined,
  };
}

export async function addMyAgencyConsultant({
  adQuota,
  agentId,
  permissions,
  renewQuota,
  role,
  specialQuota,
}: AddAgencyConsultantPayload) {
  return api.post("me/agency/consultants", {
    context: { allowNonJsonResponse: true },
    headers: { Accept: "*/*" },
    json: {
      ad_quota: Math.max(0, Math.trunc(adQuota)),
      agent_id: Number.isFinite(Number(agentId)) ? Number(agentId) : agentId,
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
  return api.delete(
    `me/agency/consultants/${encodeURIComponent(String(agentId))}/request`,
    {
      context: { allowNonJsonResponse: true },
      headers: { Accept: "*/*" },
    },
  );
}

export async function getMyAgencyConsultants({
  page = 1,
  perPage = 100,
}: AgencyConsultantsParams = {}): Promise<AgencyConsultantsPage> {
  const response = await api
    .get("me/agency/consultants", {
      searchParams: {
        page,
        per_page: perPage,
      },
    })
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
  const response = await api
    .get(`me/agency/consultants/${encodeURIComponent(String(agentId))}`)
    .json<AgencyConsultantDetailApiResponse>();
  const source = response.consultant ?? response.data ?? response;
  const consultant = normalizeAgencyConsultant({
    ...source,
    ad_quota: source.ad_quota ?? response.ad_quota,
    agency_membership:
      source.agency_membership ?? response.agency_membership,
    member: source.member ?? response.member,
    membership: source.membership ?? response.membership,
    membership_state:
      source.membership_state ?? response.membership_state,
    metrics: source.metrics ?? response.metrics,
    permissions: source.permissions ?? response.permissions,
    quotas: source.quotas ?? response.quotas,
    renew_quota: source.renew_quota ?? response.renew_quota,
    special_quota: source.special_quota ?? response.special_quota,
  });

  if (!consultant) {
    throw new Error("اطلاعات مشاور معتبر نیست.");
  }

  return consultant;
}

export async function updateMyAgencyConsultant({
  adQuota,
  agentId,
  permissions,
  renewQuota,
  role,
  specialQuota,
}: UpdateAgencyConsultantPayload) {
  return api.patch(
    `me/agency/consultants/${encodeURIComponent(String(agentId))}`,
    {
      context: { allowNonJsonResponse: true },
      headers: { Accept: "*/*" },
      json: {
        ad_quota: Math.max(0, Math.trunc(adQuota)),
        permissions,
        renew_quota: Math.max(0, Math.trunc(renewQuota)),
        role: role === "manager" ? 2 : 1,
        special_quota: Math.max(0, Math.trunc(specialQuota)),
      },
    },
  );
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

  return api.delete(
    `me/agency/consultants/${encodeURIComponent(String(agentId))}`,
    {
      context: { allowNonJsonResponse: true },
      headers: { Accept: "*/*" },
      json: transferPayload,
    },
  );
}

export async function getPublicAgents({
  agencyId,
  page = 1,
  perPage = 20,
  search,
  sort,
}: PublicAgentListParams = {}): Promise<PublicAgentsPage> {
  const response = await publicApi
    .get("public/agents", {
      searchParams: {
        agency_id: agencyId,
        page,
        per_page: perPage,
        search: search?.trim() || undefined,
        sort,
      },
    })
    .json<PublicAgentsApiResponse>();
  const data = (response.data ?? [])
    .map(normalizePublicAgentListItem)
    .filter((item): item is PublicAgentListDto => Boolean(item));
  const resolvedPage = Math.max(1, toNumber(response.page, page));
  const resolvedPerPage = Math.max(1, toNumber(response.per_page, perPage));
  const total = Math.max(0, toNumber(response.total, data.length));

  return {
    data,
    hasNextPage: resolvedPage * resolvedPerPage < total,
    page: resolvedPage,
    perPage: resolvedPerPage,
    total,
  };
}

export async function getPublicTrustedAgencies(): Promise<PublicAgencyDto[]> {
  const response = await publicApi
    .get("public/agencies/trusted")
    .json<PublicAgencyApiResponse>();

  return (response.data ?? [])
    .map(normalizeAgency)
    .filter((item): item is PublicAgencyDto => Boolean(item));
}

export async function getPublicAgencies({
  neighborhoodId,
  page = 1,
  perPage = 20,
  search,
  sort,
}: PublicAgencyListParams): Promise<PublicAgencyPage> {
  const response = await publicApi
    .get("public/agencies", {
      searchParams: {
        neighborhood_id: neighborhoodId,
        page,
        per_page: perPage,
        search,
        sort,
      },
    })
    .json<PublicAgencyApiResponse>();

  const data = (response.data ?? [])
    .map(normalizeAgency)
    .filter((item): item is PublicAgencyDto => Boolean(item));
  const resolvedPage = Math.max(1, toNumber(response.page, page));
  const resolvedPerPage = Math.max(1, toNumber(response.per_page, perPage));
  const total = Math.max(0, toNumber(response.total, data.length));

  return {
    data,
    hasNextPage: resolvedPage * resolvedPerPage < total,
    page: resolvedPage,
    perPage: resolvedPerPage,
    total,
  };
}

export async function getPublicAgencyDetail(
  id: number | string,
): Promise<PublicAgencyDetailDto> {
  const response = await publicApi
    .get(`public/agencies/${encodeURIComponent(String(id))}`)
    .json<PublicAgencyDetailApiResponse>();
  const data = asRecord(response.data);
  const agencyRecord = asRecord(response.agency ?? data.agency ?? response.data);
  const agency = normalizePublicAgencyDetail({
    id,
    ...data,
    ...agencyRecord,
  });

  if (!agency) {
    throw new Error("اطلاعات آژانس معتبر نیست.");
  }

  return agency;
}

export async function getPublicAgentDetail(
  id: number | string,
): Promise<PublicAgentDetailDto> {
  const response = await publicApi
    .get(`public/agents/${encodeURIComponent(String(id))}`)
    .json<PublicAgentDetailApiResponse>();
  const root = asRecord(response);
  const data = asRecord(response.data);
  const nestedAgent = asRecord(
    response.agent ??
      response.consultant ??
      data.agent ??
      data.consultant ??
      data.profile ??
      response.data,
  );
  const agent = normalizePublicAgentDetail({
    id,
    ...root,
    ...data,
    ...nestedAgent,
    agency:
      nestedAgent.agency ??
      nestedAgent.agency_summary ??
      data.agency ??
      data.agency_summary ??
      root.agency ??
      root.agency_summary,
    ranking_summary:
      nestedAgent.ranking_summary ??
      nestedAgent.ranking ??
      data.ranking_summary ??
      data.ranking ??
      root.ranking_summary ??
      root.ranking,
    recent_advertises:
      nestedAgent.recent_advertises ??
      nestedAgent.recent_ads ??
      data.recent_advertises ??
      data.recent_ads ??
      root.recent_advertises ??
      root.recent_ads,
  });

  if (!agent) {
    throw new Error("اطلاعات مشاور معتبر نیست.");
  }

  return agent;
}

