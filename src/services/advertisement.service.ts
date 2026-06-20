import { api, getApiAssetUrl, publicApi } from "../api/api";

export type AdvertisementItem = Record<string, unknown> & {
  _id?: string;
  agency?: string;
  area?: string | number;
  badges?: string[];
  city?: { name?: string };
  city_name?: string;
  created_at?: string;
  district?: { name?: string };
  district_name?: string;
  id?: string | number;
  image?: string;
  images?: Array<string | { path?: string; url?: string }>;
  features?: Array<{ label?: string; value?: unknown }>;
  label?: string;
  neighborhood?: { name?: string };
  neighborhood_name?: string;
  published_hours_ago?: number | string;
  short_description?: string;
  price?: string | number;
  price_label?: string;
  rooms?: string | number;
  title?: string;
  updated_at?: string;
  year?: string | number;
};

type PaginationMeta = {
  current_page?: number;
  last_page?: number;
  page?: number;
  per_page?: number;
  total?: number;
  total_pages?: number;
};

type AdvertisementListResponse =
  | {
      data?: AdvertisementItem[];
      meta?: PaginationMeta;
      pagination?: PaginationMeta;
      status?: boolean;
    }
  | AdvertisementItem[];

type AdvertisementShowResponse =
  | {
      data?: AdvertisementItem;
      status?: boolean;
    }
  | AdvertisementItem;

type AdvertisementCreateResponse =
  | {
      data?: AdvertisementItem;
      status?: boolean;
    }
  | AdvertisementItem;

type ApiMutationResponse<T = unknown> = {
  data?: T;
  message?: string;
  status?: boolean;
};

export type AdvertisementMapBounds = {
  east: number;
  north: number;
  south: number;
  west: number;
};

export type AdvertisementMapParams = AdvertisementMapBounds & {
  categoryId?: string;
  cityId?: string;
  limit?: number;
};

type AdvertisementMapResponse =
  | {
      advertises?: AdvertisementItem[];
      data?: unknown;
      items?: AdvertisementItem[];
      list?: AdvertisementItem[];
      result?: unknown;
      results?: AdvertisementItem[];
      status?: boolean;
    }
  | AdvertisementItem[];

export type AdvertiseFeedbackPayload = {
  response_speed: boolean;
  area_knowledge: boolean;
  honesty: boolean;
  effective_followup: boolean;
  ads_are_updated: boolean;
};

export type SubmitAdvertiseFeedbackPayload = {
  advertiseId: string;
  feedback: AdvertiseFeedbackPayload;
};

export type AdvertiseReportReason = {
  created_at?: string;
  id: string;
  name: string;
  updated_at?: string;
};

type AdvertiseReportReasonsResponse =
  | {
      data?: AdvertiseReportReason[];
      list?: AdvertiseReportReason[];
      status?: boolean;
    }
  | AdvertiseReportReason[];

export type SubmitAdvertiseReportPayload = {
  advertiseId: string;
  description: string;
  reportReasonId: string;
};

export type AdvertisementListParams = {
  categoryId?: string;
  cityId?: string;
  page?: number;
  perPage?: number;
};

export type AdvertisementPage = {
  data: AdvertisementItem[];
  hasNextPage: boolean;
  page: number;
};

export type AdvertisementCardData = {
  id: number | string;
  title: string;
  agency: string;
  status: string;
  imageCount: string;
  priceLabelPrimary: string;
  pricePrimary: string;
  priceLabelSecondary: string;
  priceSecondary: string;
  area: string;
  rooms: string;
  year: string;
  timeAndLocation: string;
  imageClassName: string;
  imageUrl?: string;
  badges: string[];
};

const defaultPerPage = 10;

function toNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value.replace(/[^\d.]/g, ""));
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function toText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return fallback;
}

function formatPrice(value: unknown) {
  const numericValue = toNumber(value);

  if (numericValue === undefined) return toText(value, "توافقی");

  if (numericValue >= 1_000_000_000) {
    return `${new Intl.NumberFormat("fa-IR", {
      maximumFractionDigits: 1,
    }).format(numericValue / 1_000_000_000)} میلیارد`;
  }

  if (numericValue >= 1_000_000) {
    return `${new Intl.NumberFormat("fa-IR", {
      maximumFractionDigits: 1,
    }).format(numericValue / 1_000_000)} میلیون`;
  }

  return new Intl.NumberFormat("fa-IR").format(numericValue);
}

function readFeature(item: AdvertisementItem, labels: string[], fallback: string) {
  const features = Array.isArray(item.features) ? item.features : [];
  const feature = features.find((candidate) =>
    labels.some((label) => candidate.label?.includes(label)),
  );

  return toText(feature?.value, fallback);
}

function readNestedText(item: AdvertisementItem, keys: string[]) {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "string" && value.trim()) return value;

    if (value && typeof value === "object" && "name" in value) {
      const name = (value as { name?: unknown }).name;

      if (typeof name === "string" && name.trim()) return name;
    }
  }

  return "";
}

function readImages(item: AdvertisementItem) {
  const images = Array.isArray(item.images) ? item.images : [];

  return images
    .map((image) => {
      if (typeof image === "string") return image;

      return image.url ?? image.path ?? "";
    })
    .filter(Boolean);
}

function extractAdvertisementItems(payload: unknown): AdvertisementItem[] {
  if (Array.isArray(payload)) return payload as AdvertisementItem[];

  if (!payload || typeof payload !== "object") return [];

  const response = payload as {
    advertises?: unknown;
    data?: unknown;
    items?: unknown;
    list?: unknown;
    result?: unknown;
    results?: unknown;
  };

  const directCandidates = [
    response.advertises,
    response.list,
    response.items,
    response.results,
    response.data,
  ];

  for (const candidate of directCandidates) {
    if (Array.isArray(candidate)) return candidate as AdvertisementItem[];
  }

  for (const candidate of [response.data, response.result]) {
    const nestedItems = extractAdvertisementItems(candidate);

    if (nestedItems.length > 0) return nestedItems;
  }

  return [];
}


export function mapAdvertisementToAdCard(
  item: AdvertisementItem,
  index: number,
): AdvertisementCardData {
  const images = readImages(item);
  const location = readNestedText(item, [
    "neighborhood",
    "neighborhood_name",
    "district",
    "district_name",
    "city",
    "city_name",
  ]);
  const image = toText(item.image || images[0]);
  const publishedHoursAgo = toNumber(item.published_hours_ago);

  return {
    id: item.id ?? item._id ?? index + 1,
    agency: toText(item.agency),
    area: readFeature(item, ["متراژ"], item.area ? `${toText(item.area)} متر` : "-"),
    badges: Array.isArray(item.badges) ? item.badges : [],
    imageClassName: image ? "" : `ad-card__image--${(index % 4) + 1}`,
    imageCount: String(images.length || (image ? 1 : 0)),
    imageUrl: image ? getApiAssetUrl(image) : undefined,
    priceLabelPrimary: toText(item.price_label),
    priceLabelSecondary: "",
    pricePrimary: formatPrice(item.price),
    priceSecondary: "",
    rooms: readFeature(item, ["اتاق", "خواب"], item.rooms ? `${toText(item.rooms)} اتاق` : "-"),
    status: "",
    timeAndLocation:
      publishedHoursAgo !== undefined
        ? `${new Intl.NumberFormat("fa-IR").format(publishedHoursAgo)} ساعت پیش${location ? ` در ${location}` : ""}`
        : location
          ? `در ${location}`
          : "",
    title: toText(item.title ?? item.label, "آگهی ملک"),
    year: readFeature(item, ["سال ساخت"], toText(item.year, "-")),
  };
}

export async function getAdvertisementList({
  categoryId,
  cityId,
  page = 1,
  perPage = defaultPerPage,
}: AdvertisementListParams) {
  const response = await publicApi
    .get("public/advertise", {
      searchParams: {
        category_id: categoryId,
        city_id: cityId,
        page,
        per_page: perPage,
      },
    })
    .json<AdvertisementListResponse>();
  const data = Array.isArray(response) ? response : response.data ?? [];
  const meta = Array.isArray(response)
    ? undefined
    : response.meta ?? response.pagination;
  const currentPage = meta?.current_page ?? meta?.page ?? page;
  const lastPage = meta?.last_page ?? meta?.total_pages;
  const total = meta?.total;
  const resolvedPerPage = meta?.per_page ?? perPage;

  return {
    data,
    hasNextPage:
      typeof lastPage === "number"
        ? currentPage < lastPage
        : typeof total === "number"
          ? currentPage * resolvedPerPage < total
          : data.length >= perPage,
    page: currentPage,
  } satisfies AdvertisementPage;
}

export async function getAdvertisementDetail(id: string) {
  const response = await publicApi
    .get(`public/advertise/${id}`)
    .json<AdvertisementShowResponse>();

  return "data" in response && response.data
    ? (response.data as AdvertisementItem)
    : (response as AdvertisementItem);
}

export async function createAdvertisement(payload: FormData) {
  const response = await api
    .post("me/advertise/create", {
      body: payload,
    })
    .json<AdvertisementCreateResponse>();

  return "data" in response && response.data
    ? (response.data as AdvertisementItem)
    : (response as AdvertisementItem);
}

export async function getAdvertisementMap({
  categoryId,
  cityId,
  east,
  limit = 100,
  north,
  south,
  west,
}: AdvertisementMapParams) {
  const response = await publicApi
    .get("public/advertise/map", {
      searchParams: {
        category_id: categoryId,
        ...(cityId ? { city_id: cityId } : {}),
        _ts: Date.now(),
        east,
        limit,
        north,
        south,
        west,
      },
    })
    .json<AdvertisementMapResponse>();

  return extractAdvertisementItems(response);
}

export function submitAdvertiseFeedback({
  advertiseId,
  feedback,
}: SubmitAdvertiseFeedbackPayload) {
  return api
    .post(`me/advertise/feedback/${advertiseId}`, { json: feedback })
    .json<ApiMutationResponse>();
}

export async function getAdvertiseReportReasons() {
  const response = await publicApi
    .get("public/advertise/report-reasons/list")
    .json<AdvertiseReportReasonsResponse>();

  if (Array.isArray(response)) return response;

  if (Array.isArray(response.list)) return response.list;
  if (Array.isArray(response.data)) return response.data;

  return [];
}

export function submitAdvertiseReport({
  advertiseId,
  description,
  reportReasonId,
}: SubmitAdvertiseReportPayload) {
  return publicApi
    .post(`public/advertise/report/add/${advertiseId}`, {
      json: {
        description,
        report_reason_id: reportReasonId,
      },
    })
    .json<ApiMutationResponse>();
}
