import { publicApi } from "../../../shared/api/api";
import {
  asRecord,
  firstNumber,
  firstText,
  readAdvertises,
  readSocialValue,
  toAssetUrl,
  toNumber,
  toOptionalNumber,
  toStringArray,
  toText,
} from "./agency-helpers";
import { normalizeAgencyConsultant } from "./agency-consultants-normalizer";
import type { AgencyConsultantDto } from "./agency-consultants-types";
import type {
  PublicAgencyApiItem,
  PublicAgencyApiResponse,
  PublicAgencyDetailApiResponse,
  PublicAgencyDetailDto,
  PublicAgencyDto,
  PublicAgencyListParams,
  PublicAgencyPage,
} from "./agency-public.types";

export function normalizeAgency(item: PublicAgencyApiItem): PublicAgencyDto | null {
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

export function normalizePublicAgencyDetail(
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
