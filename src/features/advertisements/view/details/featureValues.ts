import type { AdvertisementItem } from "../../api/advertisement.service";
import { toText } from "./detailCore";

export function getFeatureValue(
  features: NonNullable<AdvertisementItem["features"]>,
  label: string,
) {
  const target = label.toLowerCase().trim();
  return features.find((feature) => {
    const l = String(feature.label ?? "")
      .toLowerCase()
      .trim();
    const k = String(feature.key ?? "")
      .toLowerCase()
      .trim();
    return l === target || k === target;
  })?.value;
}

export function isFilledValue(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.some((item): boolean => isFilledValue(item));
  }

  return value !== undefined && value !== null && value !== "";
}

export function getFirstExistingFeatureValue(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
) {
  for (const label of labels) {
    const value = getFeatureValue(features, label);

    if (isFilledValue(value)) {
      return value;
    }
  }

  return undefined;
}

export function toValueArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => toText(item)).filter(Boolean) : [];
}

export function toBooleanLike(value: unknown): boolean | undefined {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return value === 1 ? true : value === 0 ? false : undefined;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "1", "yes", "y", "دارد", "بله", "هست"].includes(normalized)) {
      return true;
    }

    if (["false", "0", "no", "n", "ندارد", "خیر", "نیست"].includes(normalized)) {
      return false;
    }
  }

  return undefined;
}
