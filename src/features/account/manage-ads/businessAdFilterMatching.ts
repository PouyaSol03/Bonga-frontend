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

const EXACT_PROPERTY_IDENTIFIERS: Record<
  AdManagementPropertyType,
  { isDaily?: boolean; nonDaily?: boolean; identifiers: string[] }
> = {
  apartment: {
    nonDaily: true,
    identifiers: ["apartment", "suite"],
  },
  "villa-house": {
    nonDaily: true,
    identifiers: ["villa-house", "house"],
  },
  "garden-villa": {
    nonDaily: true,
    identifiers: ["garden-villa", "villa"],
  },
  land: {
    nonDaily: true,
    identifiers: ["land"],
  },
  office: {
    nonDaily: true,
    identifiers: ["office"],
  },
  "commercial-unit": {
    nonDaily: true,
    identifiers: ["commercial", "commercial-unit"],
  },
  warehouse: {
    nonDaily: true,
    identifiers: ["warehouse"],
  },
  "hotel-apartment": {
    nonDaily: true,
    identifiers: ["hotel", "hotel-apartment"],
  },
  "factory-workshop": {
    nonDaily: true,
    identifiers: ["factory", "factory-workshop"],
  },
  "daily-apartment-suite": {
    isDaily: true,
    identifiers: ["apartment-suite", "apartment", "suite", "daily-apartment-suite"],
  },
  "daily-garden-villa": {
    isDaily: true,
    identifiers: ["garden-villa", "villa", "daily-garden-villa"],
  },
  "daily-hotel-apartment": {
    isDaily: true,
    identifiers: ["hotel", "hotel-apartment", "daily-hotel", "daily-hotel-apartment"],
  },
  "daily-workspace": {
    isDaily: true,
    identifiers: ["office-booth", "workspace", "office", "daily-office-booth", "daily-workspace"],
  },
  "project-presale": {
    identifiers: ["presale-special", "presale", "project-presale"],
  },
  "project-partnership": {
    identifiers: ["partnership", "project-partnership"],
  },
};

function matchesExactFormCode(
  formCode: string,
  propertyType: AdManagementPropertyType,
): boolean {
  const cleanCode = formCode.trim().toLowerCase();
  if (!cleanCode) return false;

  const config = EXACT_PROPERTY_IDENTIFIERS[propertyType];
  if (!config) return false;

  const match = cleanCode.match(/^(sale|rent|daily|project)-(.*)$/);
  const transactionPrefix = match ? match[1] : "";
  const identifier = match ? match[2] : cleanCode;

  if (config.isDaily && transactionPrefix !== "daily") {
    return false;
  }
  if (config.nonDaily && transactionPrefix === "daily") {
    return false;
  }

  return (
    config.identifiers.includes(identifier) ||
    config.identifiers.includes(cleanCode)
  );
}

export function matchesSinglePropertyType(
  adTitle: string,
  propertyType: AdManagementPropertyType,
  sourceAd?: AdvertisementItem | Record<string, unknown>,
): boolean {
  const rawFormCode =
    sourceAd?.form_code ??
    (sourceAd as Record<string, unknown> | undefined)?.formCode ??
    ((sourceAd as Record<string, unknown> | undefined)?.advertise as Record<string, unknown> | undefined)?.form_code ??
    ((sourceAd as Record<string, unknown> | undefined)?.metadata as Record<string, unknown> | undefined)?.form_code ??
    "";
  const formCode = String(rawFormCode).toLowerCase().trim();

  if (formCode) {
    return matchesExactFormCode(formCode, propertyType);
  }

  const category = String(sourceAd?.category ?? "");

  if (propertyType === "apartment" && (adTitle.includes("هتل") || category.includes("هتل"))) {
    return false;
  }

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
