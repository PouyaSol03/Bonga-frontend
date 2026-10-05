import type { AdCardData } from "../../../../advertisements/components/AdCard";
import { adManagementPropertyTypeLabels } from "../../../../account/adManagement/adManagementData";
import type { ConsultantAdsFilterState } from "./consultantAdsFilterTypes";

export function filterConsultantAds(
  ads: AdCardData[],
  filters: ConsultantAdsFilterState,
): AdCardData[] {
  return ads.filter((ad) => {
    if (
      filters.neighborhoods.length > 0 &&
      !filters.neighborhoods.some((n) => ad.timeAndLocation?.includes(n.name))
    ) {
      return false;
    }

    if (filters.transaction) {
      const transLabel =
        filters.transaction === "sale"
          ? "فروش"
          : filters.transaction === "rent"
            ? "اجاره"
            : "پروژه";
      const matchesTrans =
        ad.title?.includes(transLabel) ||
        ad.category?.includes(transLabel) ||
        ad.formCode?.includes(filters.transaction);
      if (!matchesTrans) return false;
    }

    if (filters.propertyTypes.length > 0) {
      const matchesProperty = filters.propertyTypes.some((pt) => {
        const label = (adManagementPropertyTypeLabels as Record<string, string>)[pt];
        return (
          (label && ad.title?.includes(label)) ||
          (label && ad.category?.includes(label)) ||
          ad.formCode?.includes(pt)
        );
      });
      if (!matchesProperty) return false;
    }

    return true;
  });
}
