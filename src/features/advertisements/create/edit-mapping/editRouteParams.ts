import type { AdvertisementItem } from "../../api/advertisement.service";
import { getAdvertisementFeatures, normalizeLookupText } from "./featureReaders";
import { readFormCode } from "./specMappers";

export type EditRouteParams = {
  category: string;
  label: string;
  transaction: "sale" | "rent" | "project";
};

export const editRouteParamsByFormCode: Record<string, EditRouteParams> = {
  // Sale
  "sale-apartment": { category: "apartment", transaction: "sale", label: "آپارتمان" },
  "sale-villa-house": { category: "villa-house", transaction: "sale", label: "خانه، ویلا" },
  "sale-garden-villa": { category: "garden-villa", transaction: "sale", label: "باغ و ویلا" },
  "sale-land": { category: "land", transaction: "sale", label: "زمین، ملک کلنگی" },
  "sale-office": { category: "office", transaction: "sale", label: "اداری" },
  "sale-commercial": { category: "commercial-unit", transaction: "sale", label: "تجاری" },
  "sale-factory": { category: "factory-workshop", transaction: "sale", label: "صنعتی" },
  "sale-warehouse": { category: "warehouse", transaction: "sale", label: "انبار، سوله" },
  "sale-hotel": { category: "hotel-apartment", transaction: "sale", label: "هتل، اقامتگاه" },

  // Rent
  "rent-apartment": { category: "apartment", transaction: "rent", label: "آپارتمان" },
  "rent-villa-house": { category: "villa-house", transaction: "rent", label: "خانه، ویلا" },
  "rent-garden-villa": { category: "garden-villa", transaction: "rent", label: "باغ و ویلا" },
  "rent-office": { category: "office", transaction: "rent", label: "اداری" },
  "rent-commercial": { category: "commercial-unit", transaction: "rent", label: "تجاری" },
  "rent-factory-workshop": { category: "factory-workshop", transaction: "rent", label: "صنعتی" },
  "rent-warehouse": { category: "warehouse", transaction: "rent", label: "انبار، سوله" },
  "rent-land": { category: "land", transaction: "rent", label: "زمین، ملک کلنگی" },
  "rent-hotel": { category: "hotel-apartment", transaction: "rent", label: "هتل، اقامتگاه" },

  // Daily Rent
  "daily-apartment-suite": { category: "daily-apartment-suite", transaction: "rent", label: "آپارتمان، سوئیت" },
  "daily-garden-villa": { category: "daily-garden-villa", transaction: "rent", label: "ویلا، باغ" },
  "daily-hotel": { category: "daily-hotel-apartment", transaction: "rent", label: "هتل، اقامتگاه" },
  "daily-office-booth": { category: "daily-workspace", transaction: "rent", label: "دفترکار، غرفه" },

  // Project
  "presale-special": { category: "project-presale", transaction: "project", label: "پیش فروش، فروش پروژه" },
  partnership: { category: "project-partnership", transaction: "project", label: "مشارکت" },

  // Legacy / snake_case aliases
  daily_hotel: { category: "daily-hotel-apartment", transaction: "rent", label: "هتل، اقامتگاه" },
  daily_house_villa: { category: "daily-garden-villa", transaction: "rent", label: "ویلا، باغ" },
  daily_residential: { category: "daily-apartment-suite", transaction: "rent", label: "آپارتمان، سوئیت" },
  daily_suite: { category: "daily-apartment-suite", transaction: "rent", label: "آپارتمان، سوئیت" },
  daily_apartment_suite: { category: "daily-apartment-suite", transaction: "rent", label: "آپارتمان، سوئیت" },
  daily_garden_villa: { category: "daily-garden-villa", transaction: "rent", label: "ویلا، باغ" },
  daily_office_booth: { category: "daily-workspace", transaction: "rent", label: "دفترکار، غرفه" },
  daily_workspace: { category: "daily-workspace", transaction: "rent", label: "دفترکار، غرفه" },
  pre_sale: { category: "project-presale", transaction: "project", label: "پیش فروش، فروش پروژه" },
  presale_special: { category: "project-presale", transaction: "project", label: "پیش فروش، فروش پروژه" },
  rent_commercial: { category: "commercial-unit", transaction: "rent", label: "تجاری" },
  rent_industrial: { category: "factory-workshop", transaction: "rent", label: "صنعتی" },
  rent_factory: { category: "factory-workshop", transaction: "rent", label: "صنعتی" },
  rent_factory_workshop: { category: "factory-workshop", transaction: "rent", label: "صنعتی" },
  rent_warehouse: { category: "warehouse", transaction: "rent", label: "انبار، سوله" },
  rent_hotel: { category: "hotel-apartment", transaction: "rent", label: "هتل، اقامتگاه" },
  rent_office: { category: "office", transaction: "rent", label: "اداری" },
  rent_residential: { category: "apartment", transaction: "rent", label: "آپارتمان" },
  rent_apartment: { category: "apartment", transaction: "rent", label: "آپارتمان" },
  rent_short_term: { category: "daily-apartment-suite", transaction: "rent", label: "آپارتمان، سوئیت" },
  rent_land: { category: "land", transaction: "rent", label: "زمین، ملک کلنگی" },
  rent_villa: { category: "villa-house", transaction: "rent", label: "خانه، ویلا" },
  rent_villa_house: { category: "villa-house", transaction: "rent", label: "خانه، ویلا" },
  rent_garden_villa: { category: "garden-villa", transaction: "rent", label: "باغ و ویلا" },
  sale_commercial: { category: "commercial-unit", transaction: "sale", label: "تجاری" },
  sale_industrial: { category: "factory-workshop", transaction: "sale", label: "صنعتی" },
  sale_factory: { category: "factory-workshop", transaction: "sale", label: "صنعتی" },
  sale_factory_workshop: { category: "factory-workshop", transaction: "sale", label: "صنعتی" },
  sale_warehouse: { category: "warehouse", transaction: "sale", label: "انبار، سوله" },
  sale_hotel: { category: "hotel-apartment", transaction: "sale", label: "هتل، اقامتگاه" },
  sale_land: { category: "land", transaction: "sale", label: "زمین، ملک کلنگی" },
  sale_office: { category: "office", transaction: "sale", label: "اداری" },
  sale_old_house: { category: "land", transaction: "sale", label: "زمین، ملک کلنگی" },
  sale_residential: { category: "apartment", transaction: "sale", label: "آپارتمان" },
  sale_apartment: { category: "apartment", transaction: "sale", label: "آپارتمان" },
  sale_villa: { category: "villa-house", transaction: "sale", label: "خانه، ویلا" },
  sale_villa_house: { category: "villa-house", transaction: "sale", label: "خانه، ویلا" },
  sale_garden_villa: { category: "garden-villa", transaction: "sale", label: "باغ و ویلا" },
};

export function getEditAdId(routeState: {
  ad?: { id?: number | string; _id?: number | string } | null;
  card?: { id?: number | string } | null;
}) {
  const params = new URLSearchParams(window.location.search);
  const queryAdId = params.get("adId");
  const stateAdId = routeState.ad?.id ?? routeState.ad?._id ?? routeState.card?.id;

  return queryAdId || (stateAdId === undefined || stateAdId === null ? null : String(stateAdId));
}

export function isCrmAdvertiseSource() {
  return new URLSearchParams(window.location.search).get("editSource") === "crm";
}

function resolveFromCategoryText(text: string): EditRouteParams | null {
  const normalized = text.trim();
  if (!normalized) return null;

  const isRent = normalized.includes("اجاره");
  const isDaily = normalized.includes("روزانه");
  const isProject =
    normalized.includes("پروژه") ||
    normalized.includes("مشارکت") ||
    normalized.includes("پیش فروش");
  const isSale = !isRent && !isProject;

  if (isProject) {
    if (normalized.includes("مشارکت")) return editRouteParamsByFormCode["partnership"];
    return editRouteParamsByFormCode["presale-special"];
  }

  if (isDaily) {
    if (normalized.includes("ویلا") || normalized.includes("باغ")) {
      return editRouteParamsByFormCode["daily-garden-villa"];
    }
    if (normalized.includes("هتل") || normalized.includes("اقامت")) {
      return editRouteParamsByFormCode["daily-hotel"];
    }
    if (
      normalized.includes("دفتر") ||
      normalized.includes("غرفه") ||
      normalized.includes("کار")
    ) {
      return editRouteParamsByFormCode["daily-office-booth"];
    }
    return editRouteParamsByFormCode["daily-apartment-suite"];
  }

  if (isRent) {
    if (
      normalized.includes("صنعتی") ||
      normalized.includes("کارگاه") ||
      normalized.includes("کارخانه")
    ) {
      return editRouteParamsByFormCode["rent-factory-workshop"];
    }
    if (normalized.includes("انبار") || normalized.includes("سوله")) {
      return editRouteParamsByFormCode["rent-warehouse"];
    }
    if (normalized.includes("زمین") || normalized.includes("کلنگی")) {
      return editRouteParamsByFormCode["rent-land"];
    }
    if (normalized.includes("تجاری") || normalized.includes("مغازه")) {
      return editRouteParamsByFormCode["rent-commercial"];
    }
    if (normalized.includes("اداری") || normalized.includes("دفتر")) {
      return editRouteParamsByFormCode["rent-office"];
    }
    if (normalized.includes("هتل") || normalized.includes("اقامت")) {
      return editRouteParamsByFormCode["rent-hotel"];
    }
    if (normalized.includes("باغ")) return editRouteParamsByFormCode["rent-garden-villa"];
    if (normalized.includes("ویلا") || normalized.includes("خانه")) {
      return editRouteParamsByFormCode["rent-villa-house"];
    }
    return editRouteParamsByFormCode["rent-apartment"];
  }

  if (isSale) {
    if (
      normalized.includes("صنعتی") ||
      normalized.includes("کارگاه") ||
      normalized.includes("کارخانه")
    ) {
      return editRouteParamsByFormCode["sale-factory"];
    }
    if (normalized.includes("انبار") || normalized.includes("سوله")) {
      return editRouteParamsByFormCode["sale-warehouse"];
    }
    if (normalized.includes("زمین") || normalized.includes("کلنگی")) {
      return editRouteParamsByFormCode["sale-land"];
    }
    if (normalized.includes("تجاری") || normalized.includes("مغازه")) {
      return editRouteParamsByFormCode["sale-commercial"];
    }
    if (normalized.includes("اداری") || normalized.includes("دفتر")) {
      return editRouteParamsByFormCode["sale-office"];
    }
    if (normalized.includes("هتل") || normalized.includes("اقامت")) {
      return editRouteParamsByFormCode["sale-hotel"];
    }
    if (normalized.includes("باغ")) return editRouteParamsByFormCode["sale-garden-villa"];
    if (normalized.includes("ویلا") || normalized.includes("خانه")) {
      return editRouteParamsByFormCode["sale-villa-house"];
    }
    return editRouteParamsByFormCode["sale-apartment"];
  }

  return null;
}

export function resolveEditRouteParams(
  source?: AdvertisementItem | Record<string, unknown> | string | null,
): EditRouteParams | null {
  if (!source) return null;

  if (typeof source === "string") {
    const trimmed = source.trim();
    const normalized = normalizeLookupText(trimmed);
    const kebab = normalized.replace(/_/g, "-");
    const directMatch = editRouteParamsByFormCode[normalized] ?? editRouteParamsByFormCode[kebab];
    if (directMatch) return directMatch;
    return resolveFromCategoryText(trimmed);
  }

  const record = source as Record<string, unknown>;
  const features = getAdvertisementFeatures(record as AdvertisementItem);
  const rawCode =
    readFormCode(record as AdvertisementItem, features) ||
    (typeof record.formCode === "string" ? record.formCode : undefined) ||
    (typeof record.form_code === "string" ? record.form_code : undefined);

  if (rawCode) {
    const normalized = normalizeLookupText(rawCode);
    const kebab = normalized.replace(/_/g, "-");
    const match = editRouteParamsByFormCode[normalized] ?? editRouteParamsByFormCode[kebab];
    if (match) return match;
  }

  const categoryCandidate = [
    record.category,
    record.category_name,
    record.category_title,
    record.categoryTitle,
    record.title,
  ].find((v): v is string => typeof v === "string" && Boolean(v.trim()));

  if (categoryCandidate) {
    return resolveFromCategoryText(categoryCandidate);
  }

  return null;
}

export function getEditRouteParamsFromAd(ad: AdvertisementItem) {
  return resolveEditRouteParams(ad);
}

export function syncEditRouteParams(ad: AdvertisementItem) {
  const routeParams = getEditRouteParamsFromAd(ad);
  const searchParams = new URLSearchParams(window.location.search);
  let changed = false;

  Object.entries(routeParams ?? {}).forEach(([key, value]) => {
    if (searchParams.get(key) === value) return;

    searchParams.set(key, value);
    changed = true;
  });

  const publisherType = normalizeLookupText(ad.publisher_type);
  if (
    ["user", "agency", "agent"].includes(publisherType) &&
    searchParams.get("publisherType") !== publisherType
  ) {
    searchParams.set("publisherType", publisherType);
    changed = true;
  }

  if (publisherType === "agency" || publisherType === "agent") {
    if (searchParams.get("registrantType") !== "personal") {
      searchParams.set("registrantType", "personal");
      changed = true;
    }
  }

  if (searchParams.get("edit") !== "true") {
    searchParams.set("edit", "true");
    changed = true;
  }

  if (changed) {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}?${searchParams.toString()}`,
    );
  }

  return changed;
}
