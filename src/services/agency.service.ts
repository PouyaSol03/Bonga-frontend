import { getApiAssetUrl, publicApi } from "../api/api";

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
