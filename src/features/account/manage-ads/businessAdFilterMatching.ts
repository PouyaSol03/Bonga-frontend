import type { AdvertisementItem } from "../../advertisements/api/advertisement.service";
import type {
  AdManagementFilters,
  AdManagementPropertyType,
  AdManagementSelectedNeighborhood,
} from "../adManagement/adManagementData";

export function matchesTransaction(
  adTitle: string,
  filters: AdManagementFilters,
  sourceAd?: AdvertisementItem | Record<string, unknown>,
): boolean {
  if (!filters.transaction) return true;
  const formCode = String(sourceAd?.form_code ?? "").toLowerCase();
  if (formCode) {
    if (filters.transaction === "rent") {
      return formCode.startsWith("rent-") || formCode.startsWith("daily-");
    }
    if (filters.transaction === "sale") {
      return formCode.startsWith("sale-") || (formCode.startsWith("presale-") && !formCode.includes("project"));
    }
    if (filters.transaction === "project") {
      return formCode.includes("project") || formCode.includes("partnership") || formCode.includes("presale");
    }
  }

  const category = String(sourceAd?.category ?? "");
  if (category) {
    if (filters.transaction === "rent" && (category.includes("اجاره") || category.includes("روزانه"))) return true;
    if (filters.transaction === "sale" && category.includes("فروش")) return true;
    if (filters.transaction === "project" && (category.includes("پروژه") || category.includes("مشارکت") || category.includes("پیش فروش"))) return true;
  }

  if (filters.transaction === "rent") return adTitle.includes("اجاره");
  if (filters.transaction === "sale") return adTitle.includes("فروش") || !adTitle.includes("اجاره");
  return adTitle.includes("پروژه");
}

export const PROPERTY_KEYWORDS: Record<string, string[]> = {
  apartment: ["آپارتمان", "سوئیت", "سوییت"], "daily-apartment-suite": ["آپارتمان", "سوئیت", "سوییت"],
  "garden-villa": ["باغ", "ویلا"], "daily-garden-villa": ["باغ", "ویلا"],
  "villa-house": ["خانه", "ویلایی"], land: ["زمین"],
  office: ["اداری", "دفتر", "مطب"], "daily-workspace": ["اداری", "دفتر", "مطب"],
  "commercial-unit": ["تجاری", "مغازه"], warehouse: ["انبار", "سوله"],
  "hotel-apartment": ["هتل", "اقامتگاه"], "daily-hotel-apartment": ["هتل", "اقامتگاه"],
  "factory-workshop": ["کارخانه", "کارگاه"],
};

export function matchesSinglePropertyType(
  adTitle: string,
  propertyType: AdManagementPropertyType,
  sourceAd?: AdvertisementItem | Record<string, unknown>,
): boolean {
  const formCode = String(sourceAd?.form_code ?? "").toLowerCase();
  if (formCode) {
    if (propertyType === "apartment" && (formCode.includes("apartment") || formCode.includes("suite"))) return true;
    if (propertyType === "daily-apartment-suite" && formCode.includes("daily") && (formCode.includes("apartment") || formCode.includes("suite"))) return true;
    if (propertyType === "garden-villa" && (formCode.includes("garden") || formCode.includes("villa"))) return true;
    if (propertyType === "daily-garden-villa" && formCode.includes("daily") && (formCode.includes("garden") || formCode.includes("villa"))) return true;
    if (propertyType === "villa-house" && (formCode.includes("villa-house") || formCode.includes("house"))) return true;
    if (propertyType === "land" && formCode.includes("land")) return true;
    if (propertyType === "office" && formCode.includes("office")) return true;
    if (propertyType === "daily-workspace" && (formCode.includes("workspace") || (formCode.includes("daily") && formCode.includes("office")))) return true;
    if (propertyType === "commercial-unit" && (formCode.includes("commercial") || formCode.includes("shop"))) return true;
    if (propertyType === "warehouse" && formCode.includes("warehouse")) return true;
    if (propertyType === "hotel-apartment" && formCode.includes("hotel")) return true;
    if (propertyType === "daily-hotel-apartment" && formCode.includes("daily") && formCode.includes("hotel")) return true;
    if (propertyType === "factory-workshop" && (formCode.includes("factory") || formCode.includes("workshop"))) return true;
  }

  const category = String(sourceAd?.category ?? "");
  const keywords = PROPERTY_KEYWORDS[propertyType];
  if (keywords) {
    if (category && keywords.some((kw) => category.includes(kw))) return true;
    return keywords.some((kw) => adTitle.includes(kw));
  }
  return adTitle.includes("پروژه") || adTitle.includes("مشارکت") || adTitle.includes("پیش فروش");
}

export function matchesPropertyType(
  adTitle: string,
  propertyTypes?: AdManagementPropertyType[],
  legacyPropertyType?: AdManagementPropertyType,
  sourceAd?: AdvertisementItem | Record<string, unknown>,
): boolean {
  const selectedTypes = propertyTypes?.length ? propertyTypes : legacyPropertyType ? [legacyPropertyType] : [];
  if (!selectedTypes.length) return true;
  return selectedTypes.some((type) => matchesSinglePropertyType(adTitle, type, sourceAd));
}

export const STATUS_KEYS: Record<string, string[]> = {
  "در انتظار": ["pending", "wait_for_payment", "wait_for_agency", "wait_for_repost", "wait_for_stop", "wait_for_deal_confirmation"],
  "فعال": ["published", "deal_success"],
  "غیر فعال": ["expired", "deleted", "deal_unsuccessful", "rejected_by_agency", "archived", "incomplete_deleted"],
  "نیمه کاره": ["incomplete"],
};

export function matchesStatusFilter(
  statusLabel: string,
  statusKey?: string,
  filterStatus?: string,
  sourceAd?: AdvertisementItem | Record<string, unknown>,
): boolean {
  if (!filterStatus) return true;

  const rawStatusCode = sourceAd?.status_code;
  const statusCode = typeof rawStatusCode === "number" ? rawStatusCode : rawStatusCode !== undefined && rawStatusCode !== null && rawStatusCode !== "" ? Number(rawStatusCode) : NaN;
  const rawStatus = String(sourceAd?.status ?? "").toLowerCase();
  const serverLabel = String(sourceAd?.status_label ?? "").trim();

  if (filterStatus === "فعال") {
    if (statusCode === 3 || rawStatus === "accepted" || serverLabel === "منتشر شده") return true;
    if (statusKey === "published" || statusKey === "deal_success") return true;
    return statusLabel === "فعال" || statusLabel === "منتشر شده" || statusLabel === "معامله موفق";
  }

  if (filterStatus === "در انتظار") {
    if (!Number.isNaN(statusCode) && [0, 1, 2, -10].includes(statusCode)) return true;
    if (statusKey && ["pending", "wait_for_payment", "wait_for_agency", "wait_for_repost", "wait_for_stop", "wait_for_deal_confirmation"].includes(statusKey)) return true;
    return statusLabel.includes("انتظار");
  }

  if (filterStatus === "غیر فعال") {
    if (!Number.isNaN(statusCode) && [-1, -2, -3, -6].includes(statusCode)) return true;
    if (statusKey && ["expired", "deleted", "deal_unsuccessful", "rejected_by_agency", "archived", "incomplete_deleted"].includes(statusKey)) return true;
    return ["غیر", "منقض", "حذف", "رد", "بایگانی"].some((k) => statusLabel.includes(k));
  }

  if (filterStatus === "نیمه کاره") {
    if (statusCode === -5 || statusCode === -4 || rawStatus === "incomplete") return true;
    if (statusKey === "incomplete") return true;
    return statusLabel.includes("نیمه");
  }

  const targetKeys = STATUS_KEYS[filterStatus];
  if (targetKeys && statusKey && targetKeys.includes(statusKey)) return true;
  return statusLabel === filterStatus || serverLabel === filterStatus;
}

export function matchesNeighborhood(
  adTimeAndLocation: string,
  selectedNeighborhoods: AdManagementSelectedNeighborhood[],
  sourceAd?: AdvertisementItem | Record<string, unknown>,
): boolean {
  if (!selectedNeighborhoods.length) return true;

  const rawNeighborhood = sourceAd?.neighborhood as { id?: number | string; name?: string } | undefined;
  const sourceId = String(rawNeighborhood?.id ?? sourceAd?.neighborhood_id ?? "").trim();
  const sourceName = String(rawNeighborhood?.name ?? sourceAd?.neighborhood_name ?? "").trim();
  const subNeighborhood = sourceAd?.sub_neighborhood as { id?: number | string; name?: string } | undefined;
  const subSourceId = String(subNeighborhood?.id ?? sourceAd?.sub_neighborhood_id ?? "").trim();
  const subSourceName = String(subNeighborhood?.name ?? "").trim();

  return selectedNeighborhoods.some((n) => {
    const targetId = String(n.id).trim();
    const targetName = n.name.trim();

    if (sourceId && targetId && sourceId === targetId) return true;
    if (sourceName && targetName && sourceName === targetName) return true;
    if (subSourceId && targetId && subSourceId === targetId) return true;
    if (subSourceName && targetName && subSourceName === targetName) return true;

    return adTimeAndLocation.includes(targetName);
  });
}

export function matchesPublisher(
  adPublisher: string | undefined,
  filterPublisher: string | undefined,
  sourceAd?: AdvertisementItem | Record<string, unknown>,
): boolean {
  if (!filterPublisher) return true;
  const target = filterPublisher.trim();
  if (!target) return true;

  if (adPublisher && adPublisher.trim() === target) return true;

  const agentName = String(
    (sourceAd?.agent as { name?: string } | undefined)?.name ??
      (sourceAd?.consultant as { name?: string } | undefined)?.name ?? "",
  ).trim();
  if (agentName && agentName === target) return true;

  const agencyName = String(
    (sourceAd?.agency as { name?: string } | undefined)?.name ??
      (typeof sourceAd?.agency === "string" ? sourceAd.agency : ""),
  ).trim();
  if (agencyName && agencyName === target) return true;

  const ownerProfile = sourceAd?.owner_profile as {
    display_name?: string;
    first_name?: string;
    last_name?: string;
  } | undefined;
  const ownerFullName = ownerProfile?.first_name ? `${ownerProfile.first_name} ${ownerProfile.last_name ?? ""}`.trim() : undefined;
  const ownerName = String(ownerProfile?.display_name ?? ownerFullName ?? sourceAd?.owner_name ?? "").trim();
  if (ownerName && ownerName === target) return true;

  return false;
}
