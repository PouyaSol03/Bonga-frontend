import { toEnglishDigits, toPersianDigits } from "../../../shared/lib/numberUtils";
import { getAdvertisementImageUrls } from "../../advertisements/utils/advertisement-images";
import type { AdvertisementItem } from "../../advertisements/api/advertisement.service";

export function toNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : undefined;

  if (typeof value === "string" && value.trim()) {
    const normalizedValue = toEnglishDigits(value);
    const parsed = Number(normalizedValue.replace(/[^\d.-]/g, ""));

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export function toText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return toPersianDigits(value);
  if (typeof value === "number") return new Intl.NumberFormat("fa-IR").format(value);
  if (typeof value === "boolean") return value ? "دارد" : "ندارد";

  return fallback;
}

export function readFeatureRaw(item: AdvertisementItem, labels: string[]) {
  const rawFeatures = Array.isArray(item.features) ? item.features : [];
  const dynamicFields = Array.isArray((item as Record<string, unknown>).dynamicFields)
    ? ((item as Record<string, unknown>).dynamicFields as Array<{
        key?: unknown;
        label?: unknown;
        value?: unknown;
      }>)
    : [];
  const features = [...rawFeatures, ...dynamicFields];

  for (const label of labels) {
    const directVal = item[label];
    if (directVal !== undefined && directVal !== null && directVal !== "") {
      return directVal;
    }
    const lower = label.toLowerCase();
    const feature = features.find((candidate) => {
      const featureItem = candidate as { key?: unknown; label?: unknown };
      const featureName = String(featureItem.key ?? featureItem.label ?? "").toLowerCase();
      return featureName === lower;
    });
    if (feature?.value !== undefined && feature.value !== null && feature.value !== "") {
      return feature.value;
    }
  }

  return undefined;
}

export function readFeature(item: AdvertisementItem, labels: string[], fallback = "") {
  return toText(readFeatureRaw(item, labels), fallback);
}

export function readNestedText(item: AdvertisementItem, keys: string[]) {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "string" && value.trim()) return toPersianDigits(value);

    if (value && typeof value === "object" && "name" in value) {
      const name = (value as { name?: unknown }).name;

      if (typeof name === "string" && name.trim()) return toPersianDigits(name);
    }
  }

  return "";
}

export function readImageSources(item: AdvertisementItem) {
  return getAdvertisementImageUrls(item);
}

export function readBadges(item: AdvertisementItem) {
  const badges: string[] = [];
  const isSpecial =
    item.is_special === true ||
    item.is_special === 1 ||
    item.is_special === "true" ||
    item.is_special === "1" ||
    item.special === true ||
    item.special === 1 ||
    item.special === "true" ||
    item.special === "1";
  const isLadder =
    item.is_ladder === true ||
    item.is_ladder === 1 ||
    item.is_ladder === "true" ||
    item.is_ladder === "1" ||
    item.ladder === true ||
    item.ladder === 1 ||
    item.ladder === "true" ||
    item.ladder === "1";

  if (isSpecial) {
    badges.push("ویژه");
  }
  if (isLadder) {
    badges.push("بروزرسانی");
  }

  if (badges.length > 0) {
    return badges;
  }

  if (Array.isArray(item.badges)) {
    return item.badges.filter(
      (badge): badge is string => typeof badge === "string" && badge.trim().length > 0,
    );
  }

  return [];
}
