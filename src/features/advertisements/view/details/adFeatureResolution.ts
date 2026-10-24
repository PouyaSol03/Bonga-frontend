import type { AdvertisementItem } from "../../api/advertisement.service";
import { propertyInfoLabelMap } from "./propertyInfoMaps";
import {
  getFirstExistingFeatureValue,
  isFilledValue,
} from "./detailFormatters";

export type AdvertisementFeatureMap = Record<string, unknown>;

export function getResolvedAdvertisementFeatures(
  ad: AdvertisementItem,
): NonNullable<AdvertisementItem["features"]> {
  const rawFeatures = Array.isArray(ad.features) ? ad.features : [];
  const resolved = rawFeatures.map((item) => {
    if (!item || typeof item !== "object") return item;
    const it = item as Record<string, unknown>;
    const label =
      (typeof it.label === "string" && it.label.trim()) ||
      (typeof it.key === "string" && it.key.trim()) ||
      (typeof it.name === "string" && it.name.trim()) ||
      "";
    return {
      ...it,
      label,
      value: it.value,
    };
  });
  const labels = new Set(
    resolved.map((item) => (typeof item.label === "string" ? item.label : "")).filter(Boolean),
  );

  const addRootValue = (label: string, value: unknown) => {
    if (labels.has(label) || !isFilledValue(value)) return;
    resolved.push({ label, value });
    labels.add(label);
  };

  // Detail serializers in different API versions do not always place the same
  // fields inside `features`. Promote known root-level values so the purchase
  // detail UI does not silently lose data that the API did return.
  addRootValue("form_code", ad.form_code);
  addRootValue("area", ad.area);
  addRootValue("floor", ad.floor ?? ad.unit_floor);
  addRootValue("rooms", ad.rooms);
  addRootValue("building_age", ad.building_age ?? ad.year);

  const rootKeys = new Set([
    ...Object.keys(propertyInfoLabelMap),
    "meterage",
    "apartment_area",
    "unit_area",
    "room_count",
    "bedrooms",
    "age",
    "construction_age",
    "unit_floor",
    "apartment_floor",
    "unit_per_floor",
    "units_per_floor",
    "units_per_floor_count",
    "building_position",
    "building_direction",
    "unit_direction",
    "direction",
    "unit_location",
    "ground_position",
    "plot_position",
    "land_location",
    "document",
    "deed_type",
    "floors",
    "building_floors",
    "apartment_floors",
    "is_renovated",
    "is_furnished",
    "facilities",
    "heating_cooling",
    "elevator_count",
    "elevatorCount",
    "parking_count",
    "parkingCount",
    "terrace_count",
    "terraceCount",
    "has_exchange",
    "exchange",
    "is_exchangeable",
    "exchange_items",
    "exchange_types",
    "loan_amount",
    "mortgage_amount",
    "loan_price",
    "loan_value",
    "loan_installment",
    "installment_amount",
    "loan_payment",
    "monthly_installment",
    "rent_conversion_enabled",
    "rent_convertible",
    "is_rent_convertible",
    "rent_conversion_policy",
    "rent_convertibility",
    "conversion_policy",
    "is_special",
  ]);

  for (const key of rootKeys) {
    addRootValue(key, ad[key]);
  }

  const loanAmountVal =
    getFirstExistingFeatureValue(resolved, [
      "loan_amount",
      "mortgage_amount",
      "loan_price",
      "loan_value",
    ]) ?? ad.loan?.amount;
  const loanInstallmentVal =
    getFirstExistingFeatureValue(resolved, [
      "loan_installment",
      "installment_amount",
      "loan_payment",
      "monthly_installment",
    ]) ?? ad.loan?.installment;
  const hasLoanPresent = isFilledValue(loanAmountVal) || isFilledValue(loanInstallmentVal);
  if (hasLoanPresent) {
    const existingIndex = resolved.findIndex(
      (item) => item.label === "has_loan" || ("key" in item && item.key === "has_loan"),
    );
    if (existingIndex >= 0) {
      resolved[existingIndex] = { ...resolved[existingIndex], value: true };
    } else {
      resolved.push({ label: "has_loan", value: true });
      labels.add("has_loan");
    }
  }

  return resolved;
}

export function buildAdvertisementFeatureMap(ad: AdvertisementItem): AdvertisementFeatureMap {
  return Object.fromEntries(
    getResolvedAdvertisementFeatures(ad)
      .filter((item) => typeof item.label === "string" && item.label.trim().length > 0)
      .map((item) => [item.label, item.value]),
  );
}

export function getFeatureValue(features: NonNullable<AdvertisementItem["features"]>, label: string) {
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

