import type {
  AdvertisementListParams,
  AdvertisementSearchFilters,
} from "../../advertisements/api/advertisement.service";
import type { PropertySearchRequest } from "./property-request-types";
import {
  cityLabels,
  formCodeLabels,
  propertyRequestCategoryLabels,
  propertyRequestFilterLabels,
  roomLabels,
} from "./property-request-constants";

export { propertyRequestCategoryLabels, propertyRequestFilterLabels };

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

  const formatNumber = (num: number) =>
    toPersianDigits(
      new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(num),
    ).replace(/[٫.]/g, "/");

  if (amount >= 1_000_000_000_000) return `${formatNumber(amount / 1_000_000_000_000)} همت تومان`;
  if (amount >= 1_000_000_000) return `${formatNumber(amount / 1_000_000_000)} میلیارد تومان`;
  if (amount >= 1_000_000) return `${formatNumber(amount / 1_000_000)} میلیون تومان`;
  return `${toPersianDigits(new Intl.NumberFormat("en-US").format(amount))} تومان`;
}

export function formatCategory(value: string) {
  const normalized = value.trim().toLowerCase();
  return propertyRequestCategoryLabels[normalized] ?? formatPropertyRequestValue(value);
}

function formatRange(
  min: string | undefined,
  max: string | undefined,
  formatter: (v: string) => string,
  prefix: string,
) {
  if (min && max) return `${prefix} از ${formatter(min)} تا ${formatter(max)}`;
  if (min) return `${prefix} از ${formatter(min)}`;
  if (max) return `${prefix} تا ${formatter(max)}`;
  return "";
}

export function getPropertyRequestDetails(request: PropertySearchRequest) {
  const filters = request.filters;
  const details: string[] = [];
  const formCode = filters.form_code || filters.from_code;
  const categoryId = filters.category_id;
  const neighborhood = filters.neighborhood_id || filters.neighborhoods;

  if (formCode && categoryId) {
    const formattedForm = formCodeLabels[formCode.trim().toLowerCase()] ?? formatPropertyRequestValue(formCode);
    const formattedCat = formatCategory(categoryId);
    if (["فروش", "اجاره", "پیش‌فروش", "مشارکت", "معاوضه", "اجاره روزانه"].includes(formattedForm)) {
      details.push(`${formattedForm} ${formattedCat}`);
    } else if (formattedForm.includes(formattedCat)) {
      details.push(formattedForm);
    } else {
      details.push(formattedForm, formattedCat);
    }
  } else if (formCode) {
    details.push(formCodeLabels[formCode.trim().toLowerCase()] ?? formatPropertyRequestValue(formCode));
  } else if (categoryId) {
    details.push(formatCategory(categoryId));
  }

  if (neighborhood) details.push(`محله ${formatPropertyRequestValue(neighborhood)}`);
  if (filters.building_age) details.push(`سال ساخت ${formatPropertyRequestValue(filters.building_age)}`);

  const priceRange = formatRange(filters.price_min, filters.price_max, formatCompactToman, "قیمت");
  if (priceRange) details.push(priceRange);
  if (filters.rooms) details.push(roomLabels[filters.rooms] ?? `${formatPropertyRequestValue(filters.rooms)} خوابه`);

  const areaRange = filters.area_min && filters.area_max
    ? `متراژ از ${formatPropertyRequestValue(filters.area_min)} تا ${formatPropertyRequestValue(filters.area_max)} متر`
    : filters.area_min
      ? `متراژ از ${formatPropertyRequestValue(filters.area_min)} متر`
      : filters.area_max
        ? `متراژ تا ${formatPropertyRequestValue(filters.area_max)} متر`
        : "";
  if (areaRange) details.push(areaRange);

  if (filters.city_id) {
    details.push(`شهر ${cityLabels[filters.city_id.toLowerCase()] ?? formatPropertyRequestValue(filters.city_id)}`);
  }

  const handled = new Set([
    "area_max", "area_min", "building_age", "category_id", "city_id",
    "form_code", "from_code", "neighborhood_id", "neighborhoods",
    "price_max", "price_min", "rooms", "focus", "view",
  ]);

  Object.entries(filters).forEach(([key, val]) => {
    if (handled.has(key)) return;
    if (key === "has_image" && (val === "true" || val === "1")) details.push("دارای تصویر");
    else if (key === "has_video" && (val === "true" || val === "1")) details.push("دارای ویدئو");
    else if (key === "is_special" && (val === "true" || val === "1")) details.push("آگهی ویژه");
    else if (key === "query" || key === "q" || key === "qsearch") details.push(formatPropertyRequestValue(val));
    else {
      const label = propertyRequestFilterLabels[key] ?? key.replace(/_/g, " ");
      details.push(`${label} ${formatPropertyRequestValue(val)}`);
    }
  });

  return details;
}

export function getCollapsedPropertyRequestDetails(
  request: PropertySearchRequest,
  maxVisibleItems = 6,
) {
  const details = getPropertyRequestDetails(request);
  const safeMax = Math.max(1, Math.floor(maxVisibleItems));
  if (details.length <= safeMax) {
    return { hiddenCount: 0, visibleDetails: details };
  }
  const visibleCount = Math.max(0, safeMax - 1);
  return {
    hiddenCount: details.length - visibleCount,
    visibleDetails: details.slice(0, visibleCount),
  };
}

export function createPropertyRequestAdvertisementParams(
  request: PropertySearchRequest | null | undefined,
  perPage = 6,
): AdvertisementListParams | null {
  if (!request) return null;
  const filters = request.filters;
  const normBool = (v?: string) => v === "true" || v === "1" ? true : v === "false" || v === "0" ? false : undefined;
  const searchFilters: AdvertisementSearchFilters = {
    areaMax: filters.area_max,
    areaMin: filters.area_min,
    buildingAge: filters.building_age,
    categoryId: filters.category_id,
    floor: filters.floor,
    formCode: filters.form_code || filters.from_code,
    hasImage: normBool(filters.has_image),
    hasVideo: normBool(filters.has_video),
    isSpecial: normBool(filters.is_special),
    neighborhoodId: filters.neighborhood_id || filters.neighborhoods,
    priceMax: filters.price_max,
    priceMin: filters.price_min,
    publishedAt: filters.published_at,
    query: filters.query || filters.q || filters.qsearch,
    rooms: filters.rooms,
  };
  const hasCriteria = Boolean(filters.city_id) || Object.values(searchFilters).some(Boolean);
  if (!hasCriteria) return null;
  return { cityId: filters.city_id, filters: searchFilters, page: 1, perPage };
}
