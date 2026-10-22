import type { AdvertisementItem } from "../../advertisements/api/advertisement.service";
import type { MyAdsType } from "../api/account.service";
import { toPersianDigits } from "../../../shared/lib/numberUtils";
export { toPersianDigits };
import type {
  AdManagementFilters,
  AdManagementPropertyType,
  AdsTab,
  ConsultantAd,
} from "../adManagement/adManagementData";
import {
  matchesNeighborhood,
  matchesPropertyType,
  matchesPublisher,
  matchesStatusFilter,
  matchesTransaction,
} from "./businessAdFilterMatching";

export {
  getAssignmentCountdown,
  mapAssignmentToAd,
  type AssignmentCountdown,
} from "./businessAdAssignmentMapping";

export const emptyBusinessFilters: AdManagementFilters = { neighborhoods: [] };

export function mapStatusToApiType(status?: string): MyAdsType | undefined {
  if (!status) return undefined;
  if (status === "فعال") return "active";
  if (status === "در انتظار") return "pending";
  if (status === "غیر فعال") return "deactive";
  if (status === "نیمه کاره") return "incomplete";
  return undefined;
}

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
    return Boolean(
      filters.neighborhoods.length ||
        filters.propertyType ||
        filters.propertyTypes?.length ||
        filters.transaction,
    );
  }
  return Boolean(
    filters.neighborhoods.length ||
      filters.propertyType ||
      filters.propertyTypes?.length ||
      filters.publisher ||
      filters.status ||
      filters.transaction,
  );
}

export function getTransactionLabel(transaction?: AdManagementFilters["transaction"]): string {
  if (transaction === "sale") return "فروش";
  if (transaction === "rent") return "اجاره";
  if (transaction === "project") return "پروژه";
  return "";
}

export function getFilterPropertyTypes(filters: AdManagementFilters): AdManagementPropertyType[] {
  return filters.propertyTypes?.length
    ? filters.propertyTypes
    : filters.propertyType
      ? [filters.propertyType]
      : [];
}

export function matchesAdFilters(
  ad: ConsultantAd & { publisher?: string },
  filters: AdManagementFilters,
  assignedTab: boolean,
  statusKey?: string,
  sourceAd?: AdvertisementItem | Record<string, unknown>,
): boolean {
  const matchesStatus = assignedTab
    ? true
    : matchesStatusFilter(ad.status, statusKey, filters.status, sourceAd);
  const matchesNb = matchesNeighborhood(ad.timeAndLocation, filters.neighborhoods, sourceAd);
  const matchesPub = assignedTab
    ? true
    : matchesPublisher(ad.publisher, filters.publisher, sourceAd);
  const matchesTx = matchesTransaction(ad.title, filters, sourceAd);
  const matchesPt = matchesPropertyType(
    ad.title,
    filters.propertyTypes,
    filters.propertyType,
    sourceAd,
  );

  return matchesStatus && matchesNb && matchesPub && matchesTx && matchesPt;
}
