import { type AdvertisementItem } from "./item-types";
import { type AdvertisementFeature } from "./entity-types";

export function toText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return fallback;
}

export function formatFeatureUnit(
  value: unknown,
  unit: string,
  fallback = "-",
) {
  const text = toText(value);

  return text ? `${text} ${unit}` : fallback;
}

export function formatBuildingAge(value: unknown, fallback = "-") {
  let text = toText(value);

  if (!text) return fallback;
  text = text.replace(/ساخت/g, "").trim();
  if (text.includes("سال") || text.includes("نوساز")) return text;

  return `${text} سال`;
}

export function readNestedText(item: AdvertisementItem, keys: string[]) {
  for (const key of keys) {
    const value = item[key];

    if (typeof value === "string" && value.trim()) return value;

    if (value && typeof value === "object" && "name" in value) {
      const name = (value as { name?: unknown }).name;

      if (typeof name === "string" && name.trim()) return name;
    }
  }

  return "";
}

export function readFeatureValue(item: AdvertisementItem, labels: string[]) {
  const rawFeatures = Array.isArray(item.features) ? item.features : [];
  const dynamicFields = Array.isArray(
    (item as Record<string, unknown>).dynamicFields,
  )
    ? ((item as Record<string, unknown>)
        .dynamicFields as AdvertisementFeature[])
    : [];
  const features = [...rawFeatures, ...dynamicFields];

  for (const label of labels) {
    const directVal = item[label];
    if (directVal !== undefined && directVal !== null && directVal !== "") {
      return directVal;
    }
    const lower = label.toLowerCase();
    const feature = features.find((candidate) => {
      const candidateLabel = String(
        candidate.label ?? candidate.key ?? "",
      ).toLowerCase();
      return candidateLabel === lower;
    });
    if (
      feature?.value !== undefined &&
      feature.value !== null &&
      feature.value !== ""
    ) {
      return feature.value;
    }
  }

  return undefined;
}
