import type {
  AdvertisementListParams,
  AdvertisementSearchFilters,
} from "./advertisement.service";

export type PropertySearchRequest = {
  createdAt: string;
  filters: Record<string, string>;
  id: string;
  senderLabel: string;
  senderRole: string;
  title: string;
};

type PropertyRequestsListener = () => void;

const propertyRequestsListeners = new Set<PropertyRequestsListener>();

// Temporary in-memory examples for the requests UI. Replace this seed with the
// property-requests API response when that endpoint is connected.
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

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function readText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function normalizeFilters(value: unknown) {
  const record = asRecord(value);
  if (!record) return {};

  return Object.fromEntries(
    Object.entries(record).flatMap(([key, item]) => {
      const text = readText(item);
      return text ? [[key, text]] : [];
    }),
  );
}

export function normalizePropertyRequest(
  value: unknown,
  index = 0,
): PropertySearchRequest | null {
  const record = asRecord(value);
  if (!record) return null;

  const id = readText(record.id) || `property-request-${index}`;

  return {
    createdAt: readText(record.createdAt ?? record.created_at),
    filters: normalizeFilters(record.filters),
    id,
    senderLabel: readText(record.senderLabel) || "کاربر",
    senderRole: readText(record.senderRole) || "user",
    title: readText(record.title) || "درخواست ملک مشابه",
  };
}

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

export function getPropertyRequestDetails(request: PropertySearchRequest) {
  return Object.entries(request.filters)
    .filter(([key]) => key !== "focus" && key !== "view")
    .map(([key, value]) => {
      const label = propertyRequestFilterLabels[key] ?? key.replace(/_/g, " ");
      return `${label}: ${formatPropertyRequestValue(value)}`;
    });
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
