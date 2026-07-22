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
