import { ApiError, api, baseUrl, getApiAssetUrl, publicApi } from "../../../shared/api/api";
import { buildAdvertisementMapRequestPath } from "./advertisement-map-query";

export type AdvertisementStatus =
  | "wait_for_payment"
  | "wait_for_admin"
  | "wait_for_agency"
  | "accepted"
  | "needs_edit"
  | "rejected"
  | "deleted"
  | "expired";

export type AdvertisementFeature = {
  key?: string;
  label: string;
  value: unknown;
};

export type AdvertisementImage = {
  // Detail endpoints normalize to url/is_main. Legacy list serializers may still
  // expose path/src, so keep those aliases typed without using them in ViewAd.
  is_main?: boolean;
  path?: string;
  src?: string;
  url?: string;
};

export type AdvertisementLocationEntity = {
  id?: number | string;
  name?: string;
};

export type AdvertisementAgency = {
  _id?: number | string;
  id?: number | string;
  location?: string;
  logo?: string | null;
  name?: string;
  rank?: number | string | null;
  rating_score?: number | string | null;
};

export type AdvertisementAgent = {
  _id?: number | string;
  agency_id?: number | string | null;
  agency_name?: string;
  id?: number | string;
  name?: string;
  rank?: number | string | null;
  rating_score?: number | string | null;
};

export type AdvertisementContacts = {
  chat?: boolean;
  instagram?: string;
  phone?: string;
  telegram?: string;
  whatsapp?: string;
};

export type AdvertisementSocial = {
  instagram?: string;
  telegram?: string;
  whatsapp?: string;
};

export type AdvertisementItem = Record<string, unknown> & {
  _id?: string;
  agency?: AdvertisementAgency | string | null;
  agency_id?: number | string | null;
  agent?: AdvertisementAgent | null;
  agent_id?: number | string | null;
  area?: string | number;
  badges?: string[];
  city?: AdvertisementLocationEntity | null;
  city_id?: number | string | null;
  city_name?: string;
  category_neighborhood?: string | null;
  contact_type?: string[];
  contacts?: AdvertisementContacts | null;
  created_at?: string;
  description?: string;
  district?: AdvertisementLocationEntity | null;
  district_name?: string;
  features?: AdvertisementFeature[];
  form_code?: string;
  form_neighborhood_title?: string | null;
  id?: string | number;
  image?: string;
  images?: AdvertisementImage[];
  is_bookmarked?: boolean;
  is_mine?: boolean;
  label?: string;
  lat?: number | string | null;
  lng?: number | string | null;
  loan?: {
    amount?: string | number | null;
    installment?: string | number | null;
  } | null;
  location_label?: string | null;
  neighborhood?: AdvertisementLocationEntity | null;
  neighborhood_id?: number | string | null;
  neighborhood_name?: string;
  owner_type?: string;
  price?: string | number;
  price_label?: string;
  published_days?: string | number | null;
  published_date?: string | number | null;
  published_time_ago?: string | number;
  rooms?: string | number;
  short_description?: string;
  social?: AdvertisementSocial | null;
  status?: AdvertisementStatus | string;
  status_code?: number;
  status_label?: string;
  sub_neighborhood?: AdvertisementLocationEntity | null;
  sub_neighborhood_id?: number | string | null;
  title?: string;
  updated_at?: string;
  video?: string | null;
  virtual_tour_link?: string | null;
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

type TopViewedAdvertisementsResponse =
  | {
    data?: AdvertisementItem[];
    status?: boolean;
  }
  | AdvertisementItem[];

type AdvertisementShowResponse = {
  data: AdvertisementItem;
  status: boolean;
};

type AdvertisementAccountShowResponse =
  | {
    advertise?: AdvertisementItem;
    category?: string;
    data?: AdvertisementItem;
    status?: boolean;
  }
  | AdvertisementItem;

type AdvertisementCreateResponse =
  | {
    advertise?: AdvertisementItem;
    data?: AdvertisementItem;
    result?: AdvertisementItem;
    status?: boolean;
  }
  | AdvertisementItem;

export type AdvertiseFormOption = {
  label: string;
  value: boolean | number | string;
};

export type AdvertiseFormField = {
  dependsOn?: string;
  key: string;
  label: string;
  options: AdvertiseFormOption[];
  optionsEndpoint?: string;
  required: boolean;
  type: string;
  unit: string;
};

export type AdvertiseFormDefinition = {
  code: string;
  fields: AdvertiseFormField[];
  title?: string;
};

export type AdvertisementCheckoutItem = {
  credit_cost?: number;
  free_quota?: {
    available?: boolean;
    remaining?: number;
  } | null;
  price?: number;
  product: string;
  required?: boolean;
  selected?: boolean;
};

export type AdvertisementCheckoutPaymentMethod = {
  action?: string | null;
  available?: boolean;
  balance?: number;
  method: string;
  remaining?: number;
  required?: number;
  shortage?: number;
};

export type AdvertisementCheckout = {
  advertise_id: number | string;
  context?: {
    advertise_status?: number | string;
    agency_id?: number | string | null;
    roles?: string[];
    user_id?: number | string;
  };
  items: AdvertisementCheckoutItem[];
  payment_methods: AdvertisementCheckoutPaymentMethod[];
  state?: string;
  status?: boolean;
  summary: {
    credit_cost?: number;
    items_count?: number;
    payable_amount?: number;
    total_price?: number;
  };
};

type AdvertisementCheckoutResponse =
  | AdvertisementCheckout
  | {
    data?: AdvertisementCheckout;
    result?: AdvertisementCheckout;
    status?: boolean;
  };

export type AdvertisementCheckoutPaymentMethodCode =
  | "free_quota"
  | "gateway"
  | "package_credit"
  | "wallet";

export type AgencyAdvertisementCheckoutPaymentMethodCode =
  | "ad_credit"
  | "by_consultant"
  | "free_quota"
  | "gateway"
  | "wallet";

export type SubmitAdvertisementCheckoutPayload = {
  advertiseId: string;
  items: string[];
  paymentMethod: AdvertisementCheckoutPaymentMethodCode;
};

export type SubmitAdvertisementCheckoutResult = {
  paymentUrl: string | null;
  response: unknown;
};

export type SubmitAgencyAdvertisementCheckoutPayload = {
  advertiseId: string;
  items: string[];
  paymentMethod: AgencyAdvertisementCheckoutPaymentMethodCode;
};

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
  cityId?: string;
  filters?: AdvertisementSearchFilters;
  geofence?: string;
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
  cityId?: string;
  filters?: AdvertisementSearchFilters;
  page?: number;
  perPage?: number;
};

export type AdvertisementSearchFilters = {
  areaMax?: string | number;
  areaMin?: string | number;
  buildingAge?: string;
  categoryId?: string;
  floor?: string;
  formCode?: string;
  hasImage?: boolean | string;
  hasVideo?: boolean | string;
  isSpecial?: boolean | string;
  neighborhoodId?: string;
  priceMax?: string | number;
  priceMin?: string | number;
  publishedAt?: string;
  query?: string;
  rooms?: string;
};

export type AdvertisementPage = {
  data: AdvertisementItem[];
  hasNextPage: boolean;
  page: number;
  total: number;
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

type SearchParamValue = boolean | number | string;

function compactSearchParams(params: Record<string, unknown>): Record<string, SearchParamValue> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string") return value.trim().length > 0;
      if (typeof value === "boolean" || typeof value === "number") return true;

      return false;
    }),
  ) as Record<string, SearchParamValue>;
}

function buildAdvertiseSearchParams(filters?: AdvertisementSearchFilters) {
  if (!filters) return {};

  return compactSearchParams({
    area_max: filters.areaMax,
    area_min: filters.areaMin,
    building_age: filters.buildingAge,
    category_id: filters.categoryId,
    floor: filters.floor,
    form_code: filters.formCode,
    from_code: filters.formCode,
    has_image: filters.hasImage,
    has_video: filters.hasVideo,
    is_special: filters.isSpecial,
    neighborhood_id: filters.neighborhoodId,
    neighborhoods: filters.neighborhoodId,
    price_max: filters.priceMax,
    price_min: filters.priceMin,
    published_at: filters.publishedAt,
    query: filters.query,
    rooms: filters.rooms,
  });
}

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

function readFeatureValue(item: AdvertisementItem, labels: string[]) {
  const features = Array.isArray(item.features) ? item.features : [];
  const feature = features.find((candidate) =>
    labels.some((label) => candidate.label?.includes(label)),
  );

  return feature?.value;
}

function formatFeatureUnit(value: unknown, unit: string, fallback = "-") {
  const text = toText(value);

  return text ? `${text} ${unit}` : fallback;
}

function formatBuildingAge(value: unknown, fallback = "-") {
  const text = toText(value);

  if (!text) return fallback;
  if (text.includes("سال") || text.includes("نوساز")) return text;

  return `${text} سال`;
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
  const description = toText(item.description ?? item.short_description);
  const area = readFeatureValue(item, ["area", "متراژ"]) ?? item.area;
  const rooms = readFeatureValue(item, ["rooms", "اتاق", "خواب"]) ?? item.rooms;
  const buildingAge = readFeatureValue(item, ["building_age", "سال ساخت"]) ?? item.year;

  return {
    id: item.id ?? item._id ?? index + 1,
    agency: toText(item.agency),
    area: formatFeatureUnit(area, "متر"),
    badges: Array.isArray(item.badges) ? item.badges : [],
    imageClassName: image ? "" : `ad-card__image--${(index % 4) + 1}`,
    imageCount: String(images.length || (image ? 1 : 0)),
    imageUrl: image ? getApiAssetUrl(image) : undefined,
    priceLabelPrimary: toText(item.price_label),
    priceLabelSecondary: "",
    pricePrimary: formatPrice(item.price),
    priceSecondary: "",
    rooms: formatFeatureUnit(rooms, "اتاق"),
    status: "",
    timeAndLocation: description || (location ? `در ${location}` : ""),
    title: toText(item.title ?? item.label, "آگهی ملک"),
    year: formatBuildingAge(buildingAge),
  };
}

export async function getTopViewedAdvertisements(): Promise<AdvertisementItem[]> {
  const response = await publicApi
    .get("public/advertise/top-viewed")
    .json<TopViewedAdvertisementsResponse>();

  return Array.isArray(response) ? response : response.data ?? [];
}

export async function getAdvertisementList({
  cityId,
  filters,
  page = 1,
  perPage = defaultPerPage,
}: AdvertisementListParams) {
  const response = await publicApi
    .get("public/advertise", {
      searchParams: compactSearchParams({
        ...buildAdvertiseSearchParams(filters),
        city_id: cityId,
        page,
        per_page: perPage,
      }),
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
    total: typeof total === "number" ? total : data.length,
  } satisfies AdvertisementPage;
}

function unwrapAdvertisementShowResponse(
  response: AdvertisementShowResponse,
): AdvertisementItem {
  if (response?.data && typeof response.data === "object") {
    return response.data;
  }

  throw new ApiError(500, "ساختار اطلاعات آگهی از سرور قابل استفاده نیست.");
}

export async function getAdvertisementDetail(id: string): Promise<AdvertisementItem> {
  // Use the authenticated client even for the public endpoint. When a token is
  // present it is sent so backend can calculate is_mine/is_bookmarked; without
  // a token this still behaves as a normal public request.
  const response = await api
    .get(`public/advertise/${encodeURIComponent(id)}`)
    .json<AdvertisementShowResponse>();

  return unwrapAdvertisementShowResponse(response);
}

export async function getAdvertisementPreview(id: string): Promise<AdvertisementItem> {
  const response = await api
    .get(`me/advertise/preview/${encodeURIComponent(id)}`)
    .json<AdvertisementShowResponse>();

  // Preview and public detail now share the exact { status, data } model.
  return unwrapAdvertisementShowResponse(response);
}

export async function getAgencyAdvertisementPreview(id: string): Promise<AdvertisementItem> {
  const response = await api
    .get(`me/agency/preview/${encodeURIComponent(id)}`)
    .json<AdvertisementShowResponse>();

  return unwrapAdvertisementShowResponse(response);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : null;
}

function normalizeAdvertiseFormOption(value: unknown): AdvertiseFormOption | null {
  const record = asRecord(value);
  if (!record) return null;

  const optionValue = record.value;
  if (typeof optionValue !== "string" && typeof optionValue !== "number" && typeof optionValue !== "boolean") {
    return null;
  }

  const label = typeof record.label === "string" && record.label.trim()
    ? record.label.trim()
    : String(optionValue);

  return { label, value: optionValue };
}

function normalizeAdvertiseFormField(value: unknown): AdvertiseFormField | null {
  const record = asRecord(value);
  if (!record) return null;

  const key = typeof record.key === "string" ? record.key.trim() : "";
  if (!key) return null;

  const options = Array.isArray(record.options)
    ? record.options
        .map(normalizeAdvertiseFormOption)
        .filter((item): item is AdvertiseFormOption => item !== null)
    : [];

  return {
    dependsOn: typeof record.dependsOn === "string" ? record.dependsOn : undefined,
    key,
    label: typeof record.label === "string" ? record.label : key,
    options,
    optionsEndpoint: typeof record.optionsEndpoint === "string" ? record.optionsEndpoint : undefined,
    required: record.required === true,
    type: typeof record.type === "string" ? record.type : "",
    unit: typeof record.unit === "string" ? record.unit : "",
  };
}

function normalizeAdvertiseFormDefinition(value: unknown, requestedCode = ""): AdvertiseFormDefinition | null {
  const record = asRecord(value);
  if (!record) return null;

  const fieldsValue = record.fields ?? record.inputs ?? record.dynamic_fields ?? record.dynamicFields;
  if (!Array.isArray(fieldsValue)) return null;

  const fields = fieldsValue
    .map(normalizeAdvertiseFormField)
    .filter((item): item is AdvertiseFormField => item !== null);
  const codeCandidates = [record.code, record.form_code, record.formCode, record.slug];
  const code = codeCandidates.find((item): item is string => typeof item === "string" && item.trim().length > 0)?.trim() ?? requestedCode;

  return {
    code,
    fields,
    title: typeof record.title === "string" ? record.title : undefined,
  };
}

function unwrapAdvertiseFormDefinition(response: unknown, requestedCode: string): AdvertiseFormDefinition {
  const direct = normalizeAdvertiseFormDefinition(response, requestedCode);
  if (direct) return direct;

  if (Array.isArray(response)) {
    const fields = response
      .map(normalizeAdvertiseFormField)
      .filter((item): item is AdvertiseFormField => item !== null);

    if (fields.length === response.length && fields.length > 0) {
      return { code: requestedCode, fields };
    }

    for (const item of response) {
      const form = normalizeAdvertiseFormDefinition(item, requestedCode);
      if (form && (!requestedCode || form.code === requestedCode)) return form;
    }
  }

  const record = asRecord(response);
  const candidates = record ? [record.data, record.result, record.form, record.advertise_form] : [];

  for (const candidate of candidates) {
    const normalized = normalizeAdvertiseFormDefinition(candidate, requestedCode);
    if (normalized) return normalized;

    if (Array.isArray(candidate)) {
      for (const item of candidate) {
        const form = normalizeAdvertiseFormDefinition(item, requestedCode);
        if (form && (!requestedCode || form.code === requestedCode)) return form;
      }
    }
  }

  throw new ApiError(500, "ساختار فرم ثبت آگهی از سرور قابل استفاده نیست.");
}

export async function getAdvertiseFormDefinition(formCode: string) {
  const normalizedCode = formCode.trim();
  if (!normalizedCode) throw new ApiError(400, "کد فرم آگهی مشخص نیست.");

  const response = await publicApi
    .get(`public/advertise-form/${encodeURIComponent(normalizedCode)}`)
    .json<unknown>();

  return unwrapAdvertiseFormDefinition(response, normalizedCode);
}

export async function getMyAdvertisementDetail(id: string): Promise<AdvertisementItem> {
  const response = await api
    .get(`me/advertise/get/${encodeURIComponent(id)}`)
    .json<AdvertisementAccountShowResponse>();

  const advertise = "advertise" in response
    ? asRecord(response.advertise) as AdvertisementItem | null
    : null;
  if (advertise) {
    const category = typeof response.category === "string" ? response.category.trim() : "";

    return category
      ? {
          ...advertise,
          category,
          category_title: advertise.category_title ?? category,
        }
      : advertise;
  }

  if ("data" in response && response.data) return response.data as AdvertisementItem;
  return response as AdvertisementItem;
}

export async function createAdvertisement(payload: FormData) {
  const response = await api
    .post("me/advertise/create", {
      body: payload,
    })
    .json<AdvertisementCreateResponse>();

  const createdAdvertise = "data" in response && response.data
    ? response.data as AdvertisementItem
    : "result" in response && response.result
      ? response.result as AdvertisementItem
      : "advertise" in response && response.advertise
        ? response.advertise as AdvertisementItem
        : response as AdvertisementItem;

  return createdAdvertise;
}

function unwrapAdvertisementCheckoutResponse(
  response: AdvertisementCheckoutResponse,
): AdvertisementCheckout {
  if ("items" in response && Array.isArray(response.items)) {
    return response;
  }

  if ("data" in response && response.data && Array.isArray(response.data.items)) {
    return response.data;
  }

  if ("result" in response && response.result && Array.isArray(response.result.items)) {
    return response.result;
  }

  throw new ApiError(500, "اطلاعات پرداخت آگهی از سرور دریافت نشد.");
}

function normalizeCheckoutUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;

  const normalizedValue = value.trim();

  if (!/^https?:\/\//i.test(normalizedValue) && !normalizedValue.startsWith("/")) {
    return null;
  }

  try {
    const fallbackOrigin =
      typeof window !== "undefined" ? window.location.origin : "http://localhost";
    const resolvedBaseUrl = baseUrl
      ? new URL(baseUrl, fallbackOrigin).toString()
      : fallbackOrigin;
    const url = new URL(normalizedValue, resolvedBaseUrl);

    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    return url.toString();
  } catch {
    return null;
  }
}

function findCheckoutPaymentUrl(value: unknown, depth = 0): string | null {
  if (depth > 4) return null;

  const directUrl = normalizeCheckoutUrl(value);

  if (directUrl) return directUrl;
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;

  for (const key of [
    "payment_url",
    "paymentUrl",
    "gateway_url",
    "gatewayUrl",
    "redirect_url",
    "redirectUrl",
    "url",
  ]) {
    const url = normalizeCheckoutUrl(record[key]);

    if (url) return url;
  }

  for (const key of ["data", "result", "payment", "intent", "gateway"]) {
    const nestedUrl = findCheckoutPaymentUrl(record[key], depth + 1);

    if (nestedUrl) return nestedUrl;
  }

  return null;
}

export async function getAdvertisementCheckout(advertiseId: string) {
  const response = await api
    .get(`me/advertise/checkout/${encodeURIComponent(advertiseId)}`)
    .json<AdvertisementCheckoutResponse>();

  if (response && typeof response === "object" && !Array.isArray(response)) {
    const record = response as Record<string, unknown>;
    if (record.status === false) {
      throw new ApiError(
        400,
        typeof record.message === "string" && record.message.trim()
          ? record.message
          : "دریافت اطلاعات پرداخت آگهی با خطا مواجه شد.",
        undefined,
        { code: typeof record.code === "string" ? record.code : undefined },
      );
    }
  }

  return unwrapAdvertisementCheckoutResponse(response);
}

export async function getAgencyAdvertisementCheckout(advertiseId: string) {
  const response = await api
    .get(`me/agency/advertise/checkout/${encodeURIComponent(advertiseId)}`)
    .json<AdvertisementCheckoutResponse>();

  if (response && typeof response === "object" && !Array.isArray(response)) {
    const record = response as Record<string, unknown>;
    if (record.status === false) {
      throw new ApiError(
        400,
        typeof record.message === "string" && record.message.trim()
          ? record.message
          : "دریافت اطلاعات پرداخت آگهی تخصیصی با خطا مواجه شد.",
        undefined,
        { code: typeof record.code === "string" ? record.code : undefined },
      );
    }
  }

  return unwrapAdvertisementCheckoutResponse(response);
}

export async function submitAdvertisementCheckout({
  advertiseId,
  items,
  paymentMethod,
}: SubmitAdvertisementCheckoutPayload): Promise<SubmitAdvertisementCheckoutResult> {
  const response = await api
    .post(`me/advertise/checkout/${encodeURIComponent(advertiseId)}`, {
      json: {
        items,
        payment_method: paymentMethod,
      },
    })
    .json<unknown>();

  if (response && typeof response === "object" && !Array.isArray(response)) {
    const record = response as Record<string, unknown>;

    if (record.status === false) {
      throw new ApiError(
        400,
        typeof record.message === "string" && record.message.trim()
          ? record.message
          : "پرداخت آگهی با خطا مواجه شد.",
        undefined,
        { code: typeof record.code === "string" ? record.code : undefined },
      );
    }
  }

  return {
    paymentUrl: findCheckoutPaymentUrl(response),
    response,
  };
}

export async function submitAgencyAdvertisementCheckout({
  advertiseId,
  items,
  paymentMethod,
}: SubmitAgencyAdvertisementCheckoutPayload): Promise<SubmitAdvertisementCheckoutResult> {
  const response = await api
    .post(`me/agency/advertise/checkout/${encodeURIComponent(advertiseId)}`, {
      json: {
        items,
        payment_method: paymentMethod,
      },
    })
    .json<unknown>();

  if (response && typeof response === "object" && !Array.isArray(response)) {
    const record = response as Record<string, unknown>;

    if (record.status === false) {
      throw new ApiError(
        400,
        typeof record.message === "string" && record.message.trim()
          ? record.message
          : "پرداخت آگهی تخصیصی با خطا مواجه شد.",
        undefined,
        { code: typeof record.code === "string" ? record.code : undefined },
      );
    }
  }

  return {
    paymentUrl: findCheckoutPaymentUrl(response),
    response,
  };
}

export async function getAdvertisementMap({
  cityId,
  east,
  filters,
  geofence,
  limit = 100,
  north,
  south,
  west,
}: AdvertisementMapParams) {
  const searchParams = compactSearchParams({
    ...buildAdvertiseSearchParams(filters),
    ...(cityId ? { city_id: cityId } : {}),
    east,
    geofence,
    limit,
    north,
    south,
    west,
  });
  const response = await publicApi
    .get(buildAdvertisementMapRequestPath(searchParams))
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
  return api
    .post(`public/advertise/report/add/${advertiseId}`, {
      json: {
        description,
        report_reason_id: reportReasonId,
      },
    })
    .json<ApiMutationResponse>();
}
