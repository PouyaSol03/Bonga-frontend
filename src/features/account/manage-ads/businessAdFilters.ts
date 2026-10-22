import type { AgencyAdvertiseAssignmentDto } from "../../advertisements/api/agency-advertise-assignment.service";
import { mapAdvertisementToAdCard } from "../../advertisements/api/advertisement.service";
import { toPersianDigits } from "../../../shared/lib/numberUtils";
export { toPersianDigits };
import type {
  AdManagementFilters,
  AdManagementPropertyType,
  AdsTab,
  ConsultantAd,
} from "../adManagement/adManagementData";

export const emptyBusinessFilters: AdManagementFilters = { neighborhoods: [] };

export type AssignmentCountdown = { hours: number; minutes: number; isExpired: boolean };

export function isAssignedTab(tab: AdsTab): boolean {
  return tab === "status";
}

export function getScopedFilters(filters: AdManagementFilters, tab: AdsTab): AdManagementFilters {
  if (!isAssignedTab(tab)) return filters;
  return {
    neighborhoods: filters.neighborhoods,
    propertyType: filters.propertyType,
    propertyTypes: filters.propertyTypes,
    transaction: filters.transaction,
  };
}

export function hasActiveFilters(filters: AdManagementFilters, tab: AdsTab): boolean {
  if (isAssignedTab(tab)) {
    return Boolean(filters.neighborhoods.length || filters.propertyType || filters.propertyTypes?.length || filters.transaction);
  }
  return Boolean(
    filters.neighborhoods.length || filters.propertyType || filters.propertyTypes?.length || filters.publisher || filters.status || filters.transaction,
  );
}

export function getTransactionLabel(transaction?: AdManagementFilters["transaction"]): string {
  if (transaction === "sale") return "فروش";
  if (transaction === "rent") return "اجاره";
  if (transaction === "project") return "پروژه";
  return "";
}

function matchesTransaction(adTitle: string, filters: AdManagementFilters): boolean {
  if (!filters.transaction) return true;
  if (filters.transaction === "rent") return adTitle.includes("اجاره");
  if (filters.transaction === "sale") return adTitle.includes("فروش") || !adTitle.includes("اجاره");
  return adTitle.includes("پروژه");
}

const PROPERTY_KEYWORDS: Record<string, string[]> = {
  apartment: ["آپارتمان", "سوئیت", "سوییت"],
  "daily-apartment-suite": ["آپارتمان", "سوئیت", "سوییت"],
  "garden-villa": ["باغ", "ویلا"],
  "daily-garden-villa": ["باغ", "ویلا"],
  "villa-house": ["خانه", "ویلایی"],
  land: ["زمین"],
  office: ["اداری", "دفتر", "مطب"],
  "daily-workspace": ["اداری", "دفتر", "مطب"],
  "commercial-unit": ["تجاری", "مغازه"],
  warehouse: ["انبار", "سوله"],
  "hotel-apartment": ["هتل", "اقامتگاه"],
  "daily-hotel-apartment": ["هتل", "اقامتگاه"],
  "factory-workshop": ["کارخانه", "کارگاه"],
};

function matchesSinglePropertyType(adTitle: string, propertyType: AdManagementPropertyType): boolean {
  const keywords = PROPERTY_KEYWORDS[propertyType];
  if (keywords) return keywords.some((kw) => adTitle.includes(kw));
  return adTitle.includes("پروژه") || adTitle.includes("مشارکت") || adTitle.includes("پیش فروش");
}

function matchesPropertyType(
  adTitle: string,
  propertyTypes?: AdManagementPropertyType[],
  legacyPropertyType?: AdManagementPropertyType,
): boolean {
  const selectedTypes = propertyTypes?.length ? propertyTypes : legacyPropertyType ? [legacyPropertyType] : [];
  if (!selectedTypes.length) return true;
  return selectedTypes.some((type) => matchesSinglePropertyType(adTitle, type));
}

export function getFilterPropertyTypes(filters: AdManagementFilters): AdManagementPropertyType[] {
  return filters.propertyTypes?.length ? filters.propertyTypes : filters.propertyType ? [filters.propertyType] : [];
}

const STATUS_KEYS: Record<string, string[]> = {
  "در انتظار": ["pending", "wait_for_payment", "wait_for_agency", "wait_for_repost", "wait_for_stop", "wait_for_deal_confirmation"],
  "فعال": ["published", "deal_success"],
  "غیر فعال": ["expired", "deleted", "deal_unsuccessful", "rejected_by_agency", "archived", "incomplete_deleted"],
  "نیمه کاره": ["incomplete"],
};

function matchesStatusFilter(statusLabel: string, statusKey?: string, filterStatus?: string): boolean {
  if (!filterStatus) return true;
  const targetKeys = STATUS_KEYS[filterStatus];
  if (targetKeys && statusKey && targetKeys.includes(statusKey)) return true;
  if (filterStatus === "در انتظار") return statusLabel.includes("انتظار");
  if (filterStatus === "فعال") return statusLabel === "فعال" || statusLabel === "منتشر شده" || statusLabel === "معامله موفق";
  if (filterStatus === "غیر فعال") return ["غیر", "منقض", "حذف", "رد", "بایگانی"].some((k) => statusLabel.includes(k));
  if (filterStatus === "نیمه کاره") return statusLabel.includes("نیمه");
  return statusLabel === filterStatus;
}

export function matchesAdFilters(
  ad: ConsultantAd & { publisher?: string },
  filters: AdManagementFilters,
  assignedTab: boolean,
  statusKey?: string,
): boolean {
  const matchesStatus = assignedTab ? true : matchesStatusFilter(ad.status, statusKey, filters.status);
  const matchesNeighborhood = filters.neighborhoods.length
    ? filters.neighborhoods.some((n) => ad.timeAndLocation.includes(n.name))
    : true;
  const matchesPublisher = assignedTab ? true : filters.publisher ? ad.publisher === filters.publisher : true;
  return matchesStatus && matchesNeighborhood && matchesPublisher && matchesTransaction(ad.title, filters) && matchesPropertyType(ad.title, filters.propertyTypes, filters.propertyType);
}

export function mapAssignmentToAd(assignment: AgencyAdvertiseAssignmentDto, index: number): ConsultantAd {
  if (assignment.advertise) {
    return { ...mapAdvertisementToAdCard(assignment.advertise, index), id: assignment.advertiseId, status: "در انتظار انتشار" };
  }
  return {
    agency: "", area: "-", badges: [], id: assignment.advertiseId,
    imageClassName: `ad-card__image--${(index % 4) + 1}`, imageCount: "0",
    priceLabelPrimary: "", priceLabelSecondary: "", pricePrimary: "توافقی", priceSecondary: "",
    rooms: "-", status: "در انتظار انتشار", timeAndLocation: "",
    title: `آگهی شماره ${toPersianDigits(assignment.advertiseId)}`, year: "-",
  };
}

export function getAssignmentCountdown(assignment: AgencyAdvertiseAssignmentDto): AssignmentCountdown {
  let targetTime: number | null = assignment.expiresAt ? Date.parse(assignment.expiresAt) : null;
  if (!targetTime || !Number.isFinite(targetTime)) {
    const raw = assignment.createdAt || (assignment.metadata?.created_at as string) || (assignment.metadata?.assigned_at as string) || (assignment.advertise?.updated_at as string) || (assignment.advertise?.created_at as string);
    const parsed = raw ? Date.parse(raw) : null;
    targetTime = parsed && Number.isFinite(parsed) ? parsed + 86_400_000 : Date.now() + 86_400_000;
  }
  const diff = targetTime - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, isExpired: true };
  const remaining = Math.ceil(diff / 60_000);
  return { hours: Math.floor(remaining / 60), minutes: remaining % 60, isExpired: false };
}
