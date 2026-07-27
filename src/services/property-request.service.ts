import { ApiError, api } from "../api/api";
import {
  getActiveAuthRole,
  getStoredAuthSession,
} from "../auth/auth-storage";
import type {
  AdvertisementItem,
  AdvertisementListParams,
  AdvertisementSearchFilters,
} from "./advertisement.service";

export type PropertyRequestOwnerType = "agency" | "user";

export type PropertyRequestFilterValue =
  | boolean
  | number
  | string
  | Array<number | string>;

export type PropertyRequestApiFilter = {
  field: string;
  value: PropertyRequestFilterValue;
};

export type PropertyRequestQuota = {
  limit: number;
  remaining: number;
  used: number;
};

export type PropertySearchRequest = {
  adId?: number | string | null;
  agenciesId?: Array<number | string>;
  createdAt: string;
  filters: Record<string, string>;
  id: string;
  myAgencyId?: number | string | null;
  senderLabel: string;
  senderRole: string;
  title: string;
  updatedAt?: string;
  userId?: number | string | null;
};

export type PropertyRequestCreateInput = {
  filters: PropertyRequestApiFilter[] | Record<string, string>;
  name: string;
};

export type PropertyRequestCreateResult = {
  quota: PropertyRequestQuota;
  request: PropertySearchRequest;
  status: boolean;
};

export type PropertyRequestPage = {
  data: PropertySearchRequest[];
  hasMore: boolean;
  ownerType: PropertyRequestOwnerType;
  page: number;
  perPage: number;
  quota: PropertyRequestQuota;
  registeredCount: number;
  requestLimit: number;
  remaining: number;
  total: number;
};

export type PropertyRequestMatchesPage = {
  data: AdvertisementItem[];
  hasMore: boolean;
  page: number;
  perPage: number;
  total: number;
};

type PropertyRequestsListener = () => void;

type PropertyRequestApiRecord = Record<string, unknown>;

const propertyRequestsListeners = new Set<PropertyRequestsListener>();

// Kept only for the CRM preview screen until a CRM-wide property-request API
// is available. The user and agency request screens no longer use this store.
const mockPropertyRequests: PropertySearchRequest[] = [
  {
    createdAt: "2026-07-20T08:30:00.000Z",
    filters: {
      area_max: "۱۴۰",
      area_min: "۹۰",
      city_id: "mashhad",
      form_code: "sale-apartment",
      neighborhood_id: "الهیه",
      price_max: "۶۰۰۰۰۰۰۰۰۰",
      rooms: "۲_۳",
    },
    id: "mock-property-request-1",
    senderLabel: "آگهی شخصی",
    senderRole: "user",
    title: "آپارتمان دو خوابه در الهیه",
  },
  {
    createdAt: "2026-07-19T15:10:00.000Z",
    filters: {
      area_min: "۱۲۰",
      city_id: "mashhad",
      form_code: "rent-apartment",
      neighborhood_id: "هاشمیه",
      price_max: "۳۰۰۰۰۰۰۰",
      price_min: "۱۵۰۰۰۰۰۰",
      rooms: "۳",
    },
    id: "mock-property-request-2",
    senderLabel: "مشاور مستقل",
    senderRole: "independent_consultant",
    title: "اجاره آپارتمان سه خوابه هاشمیه",
  },
  {
    createdAt: "2026-07-18T11:45:00.000Z",
    filters: {
      area_min: "۲۵۰",
      city_id: "mashhad",
      form_code: "sale-garden-villa",
      has_image: "true",
      query: "باغ ویلا سنددار",
    },
    id: "mock-property-request-3",
    senderLabel: "آگهی شخصی",
    senderRole: "user",
    title: "باغ ویلای سنددار اطراف مشهد",
  },
];

let propertyRequestsStore: PropertySearchRequest[] = [...mockPropertyRequests];

if (typeof window !== "undefined") {
  try {
    window.localStorage.removeItem("bonga-property-search-requests");
  } catch {
    // Legacy browser storage cleanup must not block the requests flow.
  }
}

export const propertyRequestFilterLabels: Record<string, string> = {
  area_max: "حداکثر متراژ",
  area_min: "حداقل متراژ",
  building_age: "سن بنا",
  category_id: "دسته‌بندی",
  city_id: "شهر",
  floor: "طبقه",
  form_code: "نوع آگهی",
  from_code: "نوع آگهی",
  has_image: "دارای تصویر",
  has_video: "دارای ویدئو",
  is_special: "آگهی ویژه",
  neighborhood_id: "محله",
  neighborhoods: "محله",
  price_max: "حداکثر قیمت",
  price_min: "حداقل قیمت",
  published_at: "زمان انتشار",
  query: "عبارت جستجو",
  q: "عبارت جستجو",
  qsearch: "عبارت جستجو",
  rooms: "تعداد اتاق",
};

const ignoredRequestFilterFields = new Set([
  "ad_id",
  "agencies_id",
  "focus",
  "q",
  "qsearch",
  "query",
  "search",
  "my_agency_id",
  "page",
  "per_page",
  "returnTo",
  "role",
  "user_id",
  "view",
]);

const booleanRequestFilterFields = new Set([
  "has_image",
  "has_loan",
  "has_video",
  "is_special",
]);

const numericRequestFilterFields = new Set([
  "area_max",
  "area_min",
  "building_age",
  "loan_amount",
  "loan_installment",
  "price_max",
  "price_min",
]);

const multiRequestFilterFields = new Set([
  "exchange_with",
  "floor",
  "neighborhood_id",
  "neighborhoods",
  "rooms",
]);

function asRecord(value: unknown): PropertyRequestApiRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as PropertyRequestApiRecord)
    : undefined;
}

function readText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function readNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return fallback;
}

function readBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    if (value === "true" || value === "1") return true;
    if (value === "false" || value === "0") return false;
  }

  return fallback;
}

function readIdArray(value: unknown): Array<number | string> {
  if (!Array.isArray(value)) return [];

  const ids: Array<number | string> = [];

  value.forEach((item) => {
    if (typeof item === "string" && item.trim()) {
      ids.push(item.trim());
      return;
    }

    if (typeof item === "number" && Number.isFinite(item)) {
      ids.push(item);
    }
  });

  return ids;
}

function serializeFilterValue(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => readText(item))
      .filter(Boolean)
      .join("_");
  }

  if (typeof value === "boolean") return String(value);
  return readText(value);
}

function normalizeFilters(value: unknown): Record<string, string> {
  if (Array.isArray(value)) {
    return Object.fromEntries(
      value.flatMap((item) => {
        const record = asRecord(item);
        if (!record) return [];

        const field = readText(record.field);
        const serializedValue = serializeFilterValue(record.value);

        return field && serializedValue ? [[field, serializedValue]] : [];
      }),
    );
  }

  const record = asRecord(value);
  if (!record) return {};

  return Object.fromEntries(
    Object.entries(record).flatMap(([key, item]) => {
      const text = serializeFilterValue(item);
      return text ? [[key, text]] : [];
    }),
  );
}

function getRequestSender(ownerType: PropertyRequestOwnerType) {
  if (ownerType === "agency") {
    return {
      senderLabel: "آژانس املاک",
      senderRole: "real_estate_manager",
    };
  }

  const activeRole = getActiveAuthRole(getStoredAuthSession());

  if (activeRole === "independent_consultant") {
    return {
      senderLabel: "مشاور مستقل",
      senderRole: "independent_consultant",
    };
  }

  return {
    senderLabel: "آگهی شخصی",
    senderRole: "user",
  };
}

export function getPropertyRequestScope() {
  const ownerType: PropertyRequestOwnerType =
    getActiveAuthRole(getStoredAuthSession()) === "real_estate_manager"
      ? "agency"
      : "user";

  return {
    basePath: ownerType === "agency" ? "agency/requests" : "me/requests",
    ownerType,
  } as const;
}

export function normalizePropertyRequest(
  value: unknown,
  index = 0,
  ownerType: PropertyRequestOwnerType = "user",
): PropertySearchRequest | null {
  const record = asRecord(value);
  if (!record) return null;

  const inferredOwnerType: PropertyRequestOwnerType =
    record.my_agency_id !== undefined && record.my_agency_id !== null
      ? "agency"
      : ownerType;
  const sender = getRequestSender(inferredOwnerType);
  const id = readText(record.id) || `property-request-${index}`;

  return {
    adId:
      (record.ad_id as number | string | null | undefined) ??
      (record.adId as number | string | null | undefined),
    agenciesId: readIdArray(record.agencies_id ?? record.agenciesId),
    createdAt: readText(record.createdAt ?? record.created_at),
    filters: normalizeFilters(record.filters),
    id,
    myAgencyId:
      (record.my_agency_id as number | string | null | undefined) ??
      (record.myAgencyId as number | string | null | undefined),
    senderLabel: readText(record.senderLabel) || sender.senderLabel,
    senderRole: readText(record.senderRole) || sender.senderRole,
    title:
      readText(record.name ?? record.title) || "درخواست ملک مشابه",
    updatedAt: readText(record.updatedAt ?? record.updated_at),
    userId:
      (record.user_id as number | string | null | undefined) ??
      (record.userId as number | string | null | undefined),
  };
}

function parseRequestFilterValue(field: string, rawValue: string) {
  const value = rawValue.trim();

  if (booleanRequestFilterFields.has(field)) {
    if (value === "true" || value === "1") return true;
    if (value === "false" || value === "0") return false;
  }

  if (multiRequestFilterFields.has(field)) {
    const values = value.split(/[_،,]/).map((item) => item.trim()).filter(Boolean);
    return values.length > 0 ? values : value;
  }

  if (numericRequestFilterFields.has(field) && /^-?\d+(?:\.\d+)?$/.test(value)) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }

  return value;
}

export function buildPropertyRequestFilters(
  filters: Record<string, string>,
): PropertyRequestApiFilter[] {
  const normalizedFilters = { ...filters };

  if (normalizedFilters.form_code) delete normalizedFilters.from_code;
  if (normalizedFilters.neighborhood_id) delete normalizedFilters.neighborhoods;
  delete normalizedFilters.query;
  delete normalizedFilters.q;
  delete normalizedFilters.qsearch;
  delete normalizedFilters.search;

  return Object.entries(normalizedFilters).flatMap(([field, rawValue]) => {
    if (ignoredRequestFilterFields.has(field)) return [];

    const value = rawValue.trim();
    if (!value) return [];

    return [{ field, value: parseRequestFilterValue(field, value) }];
  });
}

function normalizeQuota(value: unknown, fallback: Partial<PropertyRequestQuota> = {}) {
  const record = asRecord(value);
  const limit = readNumber(record?.limit, fallback.limit ?? 3);
  const used = readNumber(record?.used, fallback.used ?? 0);
  const remaining = readNumber(
    record?.remaining,
    fallback.remaining ?? Math.max(0, limit - used),
  );

  return { limit, remaining, used };
}

function ensureSuccessfulResponse(record: PropertyRequestApiRecord | undefined) {
  if (record?.status === false) {
    const message = readText(record.message) || "درخواست با خطا مواجه شد.";
    throw new ApiError(400, message);
  }
}

export async function createPropertyRequest(
  input: PropertyRequestCreateInput,
): Promise<PropertyRequestCreateResult> {
  const scope = getPropertyRequestScope();
  const filters = (Array.isArray(input.filters)
    ? input.filters
    : buildPropertyRequestFilters(input.filters)
  ).filter((filter) => !ignoredRequestFilterFields.has(filter.field));
  const response = await api
    .post("me/requests", {
      json: {
        filters,
        name: input.name.trim() || "درخواست ملک مشابه",
        owner_type: scope.ownerType,
      },
    })
    .json<unknown>();
  const record = asRecord(response);
  const payload = asRecord(record?.data);

  ensureSuccessfulResponse(record);

  const request = normalizePropertyRequest(
    record?.request ?? payload?.request ?? record?.data,
    0,
    scope.ownerType,
  );
  if (!request) {
    throw new ApiError(500, "اطلاعات درخواست ثبت‌شده از سرور دریافت نشد.");
  }

  return {
    quota: normalizeQuota(record?.quota ?? payload?.quota),
    request,
    status: readBoolean(record?.status, true),
  };
}

export async function getPropertyRequests(
  page = 1,
  perPage = 20,
): Promise<PropertyRequestPage> {
  const scope = getPropertyRequestScope();
  const response = await api
    .get(scope.basePath, {
      searchParams: {
        page,
        per_page: perPage,
      },
    })
    .json<unknown>();
  const record = asRecord(response);

  ensureSuccessfulResponse(record);

  const payload = asRecord(record?.data);
  const rawItems = Array.isArray(response)
    ? response
    : Array.isArray(record?.data)
      ? record.data
      : Array.isArray(payload?.data)
        ? payload.data
        : [];
  const data = rawItems
    .map((item, index) => normalizePropertyRequest(item, index, scope.ownerType))
    .filter((item): item is PropertySearchRequest => item !== null);
  const total = readNumber(record?.total ?? payload?.total, data.length);
  const registeredCount = readNumber(
    record?.registered_count ?? payload?.registered_count,
    total,
  );
  const requestLimit = readNumber(
    record?.request_limit ?? payload?.request_limit,
    3,
  );
  const remaining = readNumber(
    record?.remaining ?? payload?.remaining,
    Math.max(0, requestLimit - registeredCount),
  );
  const quota = normalizeQuota(record?.quota ?? payload?.quota, {
    limit: requestLimit,
    remaining,
    used: registeredCount,
  });

  return {
    data,
    hasMore: readBoolean(
      record?.has_more ?? payload?.has_more,
      page * perPage < total,
    ),
    ownerType:
      readText(record?.owner_type ?? payload?.owner_type) === "agency"
        ? "agency"
        : scope.ownerType,
    page: readNumber(record?.page ?? payload?.page, page),
    perPage: readNumber(record?.per_page ?? payload?.per_page, perPage),
    quota,
    registeredCount,
    remaining,
    requestLimit,
    total,
  };
}

export async function renamePropertyRequest(requestId: string, name: string) {
  const scope = getPropertyRequestScope();
  const response = await api
    .patch(`${scope.basePath}/${encodeURIComponent(requestId)}`, {
      json: { name: name.trim() },
    })
    .json<unknown>();
  const record = asRecord(response);
  const payload = asRecord(record?.data);

  ensureSuccessfulResponse(record);

  return (
    normalizePropertyRequest(
      record?.request ?? payload?.request ?? record?.data,
      0,
      scope.ownerType,
    ) ?? null
  );
}

export async function deletePropertyRequest(requestId: string) {
  const scope = getPropertyRequestScope();
  const response = await api
    .delete(`${scope.basePath}/${encodeURIComponent(requestId)}`)
    .json<unknown>();
  const record = asRecord(response);

  ensureSuccessfulResponse(record);

  return {
    id: readText(record?.id) || requestId,
    status: readBoolean(record?.status, true),
  };
}

function isAdvertisementRecord(record: PropertyRequestApiRecord) {
  const hasId =
    typeof record.id === "string" ||
    typeof record.id === "number" ||
    typeof record._id === "string";
  const hasAdvertisementData = [
    record.title,
    record.label,
    record.image,
    record.images,
    record.price,
    record.features,
  ].some((value) => value !== undefined && value !== null);

  return hasId && hasAdvertisementData;
}

function extractAdvertisementItems(value: unknown, depth = 0): AdvertisementItem[] {
  if (depth > 5 || value === null || value === undefined) return [];

  if (Array.isArray(value)) {
    return value.flatMap((item) => extractAdvertisementItems(item, depth + 1));
  }

  const record = asRecord(value);
  if (!record) return [];

  for (const key of [
    "advertises",
    "advertisements",
    "ads",
    "matches",
    "items",
    "list",
    "results",
    "data",
    "result",
    "advertise",
    "advertisement",
    "ad",
  ]) {
    const items = extractAdvertisementItems(record[key], depth + 1);
    if (items.length > 0) return items;
  }

  return isAdvertisementRecord(record) ? [record as AdvertisementItem] : [];
}

function readPaginationRecord(record: PropertyRequestApiRecord | undefined) {
  return (
    asRecord(record?.meta) ??
    asRecord(record?.pagination) ??
    asRecord(record?.data) ??
    record
  );
}

export async function getPropertyRequestMatches(
  requestId: string,
  page = 1,
  perPage = 20,
): Promise<PropertyRequestMatchesPage> {
  const scope = getPropertyRequestScope();
  const response = await api
    .get(`${scope.basePath}/matches`, {
      searchParams: {
        page,
        per_page: perPage,
        request_id: requestId,
      },
    })
    .json<unknown>();
  const record = asRecord(response);

  ensureSuccessfulResponse(record);

  const data = extractAdvertisementItems(response);
  const pagination = readPaginationRecord(record);
  const total = readNumber(pagination?.total, data.length);
  const currentPage = readNumber(
    pagination?.current_page ?? pagination?.page,
    page,
  );
  const resolvedPerPage = readNumber(pagination?.per_page, perPage);
  const lastPage = readNumber(
    pagination?.last_page ?? pagination?.total_pages,
    0,
  );

  return {
    data,
    hasMore:
      lastPage > 0
        ? currentPage < lastPage
        : readBoolean(record?.has_more, currentPage * resolvedPerPage < total),
    page: currentPage,
    perPage: resolvedPerPage,
    total,
  };
}

// CRM preview-only in-memory helpers.
export function loadPropertyRequests(): PropertySearchRequest[] {
  return propertyRequestsStore;
}

export function subscribePropertyRequests(listener: PropertyRequestsListener) {
  propertyRequestsListeners.add(listener);
  return () => {
    propertyRequestsListeners.delete(listener);
  };
}

function publishPropertyRequests(nextRequests: PropertySearchRequest[]) {
  propertyRequestsStore = nextRequests;
  propertyRequestsListeners.forEach((listener) => listener());
}

export function savePropertyRequest(request: PropertySearchRequest) {
  publishPropertyRequests([
    request,
    ...propertyRequestsStore.filter((item) => item.id !== request.id),
  ]);
}

export function removePropertyRequest(requestId: string) {
  publishPropertyRequests(
    propertyRequestsStore.filter((request) => request.id !== requestId),
  );
}

export function updatePropertyRequestTitle(requestId: string, title: string) {
  publishPropertyRequests(
    propertyRequestsStore.map((request) =>
      request.id === requestId ? { ...request, title } : request,
    ),
  );
}

function normalizeBooleanFilter(value: string | undefined) {
  if (!value) return undefined;
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return value;
}

export function createPropertyRequestAdvertisementParams(
  request: PropertySearchRequest | null | undefined,
  perPage = 6,
): AdvertisementListParams | null {
  if (!request) return null;

  const filters = request.filters;
  const searchFilters: AdvertisementSearchFilters = {
    areaMax: filters.area_max,
    areaMin: filters.area_min,
    buildingAge: filters.building_age,
    categoryId: filters.category_id,
    floor: filters.floor,
    formCode: filters.form_code || filters.from_code,
    hasImage: normalizeBooleanFilter(filters.has_image),
    hasVideo: normalizeBooleanFilter(filters.has_video),
    isSpecial: normalizeBooleanFilter(filters.is_special),
    neighborhoodId: filters.neighborhood_id || filters.neighborhoods,
    priceMax: filters.price_max,
    priceMin: filters.price_min,
    publishedAt: filters.published_at,
    query: filters.query || filters.q || filters.qsearch,
    rooms: filters.rooms,
  };
  const hasSearchCriteria =
    Boolean(filters.city_id) ||
    Object.values(searchFilters).some(
      (value) => value !== undefined && value !== null && value !== "",
    );

  if (!hasSearchCriteria) return null;

  return {
    cityId: filters.city_id,
    filters: searchFilters,
    page: 1,
    perPage,
  };
}

export function createPropertyRequestSearchUrl(
  filters: Record<string, string>,
) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (key === "focus" || key === "view") return;
    params.set(key, value);
  });

  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

export function toPersianDigits(value: number | string) {
  return String(value).replace(
    /\d/g,
    (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)] ?? digit,
  );
}

export function formatPropertyRequestValue(value: string) {
  if (value === "true" || value === "1") return "بله";
  if (value === "false" || value === "0") return "خیر";
  return toPersianDigits(value.replace(/_/g, "، "));
}

function toLatinDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function formatCompactToman(value: string) {
  const amount = Number(toLatinDigits(value).replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return formatPropertyRequestValue(value);

  const formatNumber = (number: number) =>
    toPersianDigits(
      new Intl.NumberFormat("en-US", {
        maximumFractionDigits: number % 1 === 0 ? 0 : 1,
      }).format(number),
    );

  if (amount >= 1_000_000_000) return `${formatNumber(amount / 1_000_000_000)} میلیارد تومان`;
  if (amount >= 1_000_000) return `${formatNumber(amount / 1_000_000)} میلیون تومان`;
  return `${toPersianDigits(new Intl.NumberFormat("en-US").format(amount))} تومان`;
}

function formatFormCode(value: string) {
  const normalized = value.trim().toLowerCase();
  const labels: Record<string, string> = {
    "rent-apartment": "اجاره آپارتمان",
    "sale-apartment": "فروش آپارتمان",
    "sale-garden-villa": "فروش باغ ویلا",
    "rent-villa": "اجاره ویلا",
    "sale-villa": "فروش ویلا",
  };

  return labels[normalized] ?? formatPropertyRequestValue(value);
}

function formatRooms(value: string) {
  const roomLabels: Record<string, string> = {
    "0": "بدون اتاق",
    "1": "یک خوابه",
    "2": "دو خوابه",
    "3": "سه خوابه",
    "4": "چهار خوابه",
    "5": "پنج خوابه",
    "2_3": "دو یا سه خوابه",
  };

  return roomLabels[value] ?? `${formatPropertyRequestValue(value)} خوابه`;
}

function formatRange(
  minimum: string | undefined,
  maximum: string | undefined,
  formatter: (value: string) => string,
  prefix: string,
) {
  if (minimum && maximum) return `${prefix} از ${formatter(minimum)} تا ${formatter(maximum)}`;
  if (minimum) return `${prefix} از ${formatter(minimum)}`;
  if (maximum) return `${prefix} تا ${formatter(maximum)}`;
  return "";
}

export function getPropertyRequestDetails(request: PropertySearchRequest) {
  const filters = request.filters;
  const details: string[] = [];
  const formCode = filters.form_code || filters.from_code;
  const neighborhood = filters.neighborhood_id || filters.neighborhoods;

  if (formCode) details.push(formatFormCode(formCode));
  if (neighborhood) details.push(`محله ${formatPropertyRequestValue(neighborhood)}`);
  if (filters.building_age) details.push(`سال ساخت ${formatPropertyRequestValue(filters.building_age)}`);

  const priceRange = formatRange(
    filters.price_min,
    filters.price_max,
    formatCompactToman,
    "قیمت",
  );
  if (priceRange) details.push(priceRange);

  if (filters.rooms) details.push(formatRooms(filters.rooms));

  const areaRange = filters.area_min && filters.area_max
    ? `متراژ از ${formatPropertyRequestValue(filters.area_min)} تا ${formatPropertyRequestValue(filters.area_max)} متر`
    : filters.area_min
      ? `متراژ از ${formatPropertyRequestValue(filters.area_min)} متر`
      : filters.area_max
        ? `متراژ تا ${formatPropertyRequestValue(filters.area_max)} متر`
        : "";
  if (areaRange) details.push(areaRange);

  if (filters.city_id) {
    const cityLabels: Record<string, string> = {
      isfahan: "اصفهان",
      mashhad: "مشهد",
      shiraz: "شیراز",
      tehran: "تهران",
    };
    details.push(`شهر ${cityLabels[filters.city_id.toLowerCase()] ?? formatPropertyRequestValue(filters.city_id)}`);
  }

  const handledKeys = new Set([
    "area_max",
    "area_min",
    "building_age",
    "city_id",
    "form_code",
    "from_code",
    "neighborhood_id",
    "neighborhoods",
    "price_max",
    "price_min",
    "rooms",
  ]);

  Object.entries(filters).forEach(([key, value]) => {
    if (handledKeys.has(key) || key === "focus" || key === "view") return;

    if (key === "has_image") {
      if (value === "true" || value === "1") details.push("دارای تصویر");
      return;
    }
    if (key === "has_video") {
      if (value === "true" || value === "1") details.push("دارای ویدئو");
      return;
    }
    if (key === "is_special") {
      if (value === "true" || value === "1") details.push("آگهی ویژه");
      return;
    }
    if (key === "query" || key === "q" || key === "qsearch") {
      details.push(formatPropertyRequestValue(value));
      return;
    }

    const label = propertyRequestFilterLabels[key] ?? key.replace(/_/g, " ");
    details.push(`${label} ${formatPropertyRequestValue(value)}`);
  });

  return details;
}

export function getCollapsedPropertyRequestDetails(
  request: PropertySearchRequest,
  maxVisibleItems = 6,
) {
  const details = getPropertyRequestDetails(request);
  const safeMaxVisibleItems = Math.max(1, Math.floor(maxVisibleItems));

  if (details.length <= safeMaxVisibleItems) {
    return {
      hiddenCount: 0,
      visibleDetails: details,
    };
  }

  const visibleDetailCount = Math.max(0, safeMaxVisibleItems - 1);

  return {
    hiddenCount: details.length - visibleDetailCount,
    visibleDetails: details.slice(0, visibleDetailCount),
  };
}
