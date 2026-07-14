import { api, getApiAssetUrl, publicApi } from "../api/api";

export type AgencySort = "score" | "rank" | "newest" | "oldest";

export type PublicAgencyDto = {
  address?: string;
  created_at?: string;
  id: string;
  img?: string;
  level_slug?: string;
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

export type AgencyConsultantMetrics = {
  publishedAdvertises: number;
  rankingScore: number;
  renewUsed: number;
  specialUsed: number;
};

export type AgencyConsultantDto = {
  avatar?: string;
  isActive: boolean;
  metrics: AgencyConsultantMetrics;
  mobile: string;
  name: string;
  role: string;
  roleId: number;
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

export type UpdateAgencyConsultantPayload = {
  isActive: boolean;
  role: number;
  userId: number | string;
};

export type DeactivateAgencyConsultantPayload = {
  reason: string;
  userId: number | string;
};

type PublicAgencyApiItem = {
  address?: unknown;
  created_at?: unknown;
  id?: unknown;
  img?: unknown;
  level_slug?: unknown;
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

type AgencyConsultantApiItem = {
  avatar?: unknown;
  is_active?: unknown;
  metrics?: {
    published_advertises?: unknown;
    ranking_score?: unknown;
    renew_used?: unknown;
    special_used?: unknown;
  };
  mobile?: unknown;
  name?: unknown;
  role?: unknown;
  role_id?: unknown;
  user_id?: unknown;
};

type AgencyConsultantsApiResponse = {
  data?: AgencyConsultantApiItem[];
  page?: unknown;
  per_page?: unknown;
  status?: boolean;
  total?: unknown;
};

type AgencyConsultantDetailApiResponse = {
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

function toStringArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
}

function toAssetUrl(value: unknown) {
  const path = toText(value);

  return path ? getApiAssetUrl(path) : undefined;
}

function normalizeAgency(item: PublicAgencyApiItem): PublicAgencyDto | null {
  const id = String(item.id ?? "").trim();
  const name = toText(item.name);

  if (!id || !name) return null;

  return {
    address: toText(item.address) || undefined,
    created_at: toText(item.created_at) || undefined,
    id,
    img: toAssetUrl(item.img),
    level_slug: toText(item.level_slug) || undefined,
    logo: toAssetUrl(item.logo),
    name,
    neighborhood_ids: toStringArray(item.neighborhood_ids),
    rank: toNumber(item.rank),
    score: toNumber(item.score),
  };
}

function normalizeAgencyConsultant(
  item: AgencyConsultantApiItem,
): AgencyConsultantDto | null {
  const userId = toNumber(item.user_id, Number.NaN);
  const name = toText(item.name);

  if (!Number.isFinite(userId) || !name) return null;

  return {
    avatar: toAssetUrl(item.avatar),
    isActive: item.is_active === true || item.is_active === 1 || item.is_active === "1",
    metrics: {
      publishedAdvertises: Math.max(
        0,
        toNumber(item.metrics?.published_advertises),
      ),
      rankingScore: Math.max(0, toNumber(item.metrics?.ranking_score)),
      renewUsed: Math.max(0, toNumber(item.metrics?.renew_used)),
      specialUsed: Math.max(0, toNumber(item.metrics?.special_used)),
    },
    mobile: toText(item.mobile),
    name,
    role: toText(item.role),
    roleId: toNumber(item.role_id),
    userId,
  };
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
  userId: number | string,
): Promise<AgencyConsultantDto> {
  const response = await api
    .get(`me/agency/consultants/${encodeURIComponent(String(userId))}`)
    .json<AgencyConsultantDetailApiResponse>();
  const consultant = normalizeAgencyConsultant(
    response.consultant ?? response.data ?? {},
  );

  if (!consultant) {
    throw new Error("اطلاعات مشاور معتبر نیست.");
  }

  return consultant;
}

export async function updateMyAgencyConsultant({
  isActive,
  role,
  userId,
}: UpdateAgencyConsultantPayload): Promise<AgencyConsultantDto | null> {
  const response = await api
    .patch(`me/agency/consultants/${encodeURIComponent(String(userId))}`, {
      json: {
        is_active: isActive,
        role,
      },
    })
    .json<AgencyConsultantDetailApiResponse>();

  return response.consultant || response.data
    ? normalizeAgencyConsultant(response.consultant ?? response.data ?? {})
    : null;
}

export async function deactivateMyAgencyConsultant({
  reason,
  userId,
}: DeactivateAgencyConsultantPayload) {
  return api
    .delete(`me/agency/consultants/${encodeURIComponent(String(userId))}`, {
      json: { reason: reason.trim() },
    })
    .json<{ status?: boolean }>();
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
