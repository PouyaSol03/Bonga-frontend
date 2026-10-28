import type { AdCardData, AdCategoryType } from "./types";
import { resolveDailyCategory } from "./dailyCategory";
import { resolveRentCategory } from "./rentCategory";
import { resolveSaleCategory } from "./saleCategory";

export type CategoryInput = { formCode: string; category: string; title: string };

export function isDailyRentCategory(category: AdCategoryType): boolean {
  return (
    category === "daily-apartment-suite" ||
    category === "daily-garden-villa" ||
    category === "daily-hotel" ||
    category === "daily-office-booth"
  );
}

export function resolveAdCategory(ad: AdCardData): AdCategoryType {
  const formCode = (ad.formCode ?? "").toLowerCase().trim();
  const category = (ad.category ?? "").toLowerCase().trim();
  const title = (ad.title ?? "").toLowerCase().trim();

  if (
    formCode.includes("partnership") ||
    category.includes("مشارکت") ||
    category.includes("project-partnership") ||
    title.includes("مشارکت")
  ) {
    return "project-partnership";
  }

  if (
    formCode.includes("presale") ||
    category.includes("پیش فروش") ||
    category.includes("پیشفروش") ||
    category.includes("project-presale") ||
    title.includes("پیش فروش") ||
    title.includes("پیشفروش")
  ) {
    return "project-presale";
  }

  const isDaily =
    formCode.startsWith("daily") || category.includes("روزانه") || title.includes("روزانه");

  if (isDaily) {
    return resolveDailyCategory({ formCode, category, title });
  }

  const isRent =
    formCode.startsWith("rent") ||
    category.includes("اجاره") ||
    title.includes("اجاره") ||
    category.includes("رهن") ||
    title.includes("رهن");

  if (isRent) {
    return resolveRentCategory({ formCode, category, title });
  }

  const saleCategory = resolveSaleCategory({ formCode, category, title });
  if (saleCategory) return saleCategory;

  if (ad.commercialPosition) return "sale-commercial";
  if (ad.landPosition) return "sale-factory";
  if (ad.landArea && !ad.rooms) return "sale-land";

  return "default";
}
