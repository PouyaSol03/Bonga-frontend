import type { AdCardData, AdCardPropertyItem } from "./types";
import { resolveAdCategory } from "./category";
import { getDailyProperties } from "./dailyProperties";
import { getRentProperties } from "./rentProperties";
import { getProjectProperties } from "./projectProperties";
import { getSaleProperties } from "./saleProperties";

export function getAdCardProperties(ad: AdCardData): AdCardPropertyItem[] {
  if (ad.properties && ad.properties.length > 0) {
    return ad.properties.filter(
      (item) => item.value && item.value.trim() && item.value.trim() !== "-",
    );
  }

  const category = resolveAdCategory(ad);

  const items = category.startsWith("daily-")
    ? getDailyProperties(ad, category)
    : category.startsWith("rent-")
      ? getRentProperties(ad, category)
      : category.startsWith("project-")
        ? getProjectProperties(ad, category)
        : getSaleProperties(ad, category);

  return items.filter((item): item is AdCardPropertyItem =>
    Boolean(item.value && item.value.trim() && item.value.trim() !== "-"),
  );
}
