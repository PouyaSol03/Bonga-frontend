import { getFeatureIconSrc } from "../../../../shared/lib/handleFeaturesIcons";
import { toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import type { AdvertisementItem } from "../../api/advertisement.service";
import type { DetailItem } from "../viewAdTypes";
import {
  getFeatureValue,
  toText,
} from "../viewAdDetails";

export const parkingFacilityFormCodes = new Set([
  "sale-apartment",
  "sale-villa-house",
  "sale-garden-villa",
  "sale-office",
  "sale-commercial",
  "sale-hotel",
  "sale-warehouse",
  "rent-apartment",
  "rent-villa-house",
  "rent-garden-villa",
  "rent-office",
  "rent-commercial",
  "rent-hotel",
  "rent-warehouse",
  "daily-apartment-suite",
  "daily-garden-villa",
  "daily-hotel",
  "daily-office-booth",
  "presale-special",
]);

function getFirstFeatureValue(
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
) {
  for (const label of labels) {
    const value = getFeatureValue(features, label);
    if (value !== undefined && value !== null && value !== "") return value;
  }

  return undefined;
}

function getAdOrFeatureValue(
  ad: AdvertisementItem | undefined,
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
) {
  if (ad) {
    for (const label of labels) {
      const value = ad[label];
      if (value !== undefined && value !== null && value !== "") return value;
    }
  }

  return getFirstFeatureValue(features, labels);
}

function getFacilityCountText(
  ad: AdvertisementItem | undefined,
  features: NonNullable<AdvertisementItem["features"]>,
  labels: string[],
) {
  const count = getAdOrFeatureValue(ad, features, labels);
  const text = toText(count);
  return text ? toPersianDigits(text) : "";
}

export function getElevatorCountText(
  features: NonNullable<AdvertisementItem["features"]>,
  ad?: AdvertisementItem,
) {
  return getFacilityCountText(ad, features, ["elevator_count", "elevatorCount", "elevators_count"]);
}

export function getParkingCountText(
  features: NonNullable<AdvertisementItem["features"]>,
  ad?: AdvertisementItem,
) {
  return getFacilityCountText(ad, features, ["parking_count", "parkingCount", "parkings_count"]);
}

export function getTerraceCountText(
  features: NonNullable<AdvertisementItem["features"]>,
  ad?: AdvertisementItem,
) {
  return getFacilityCountText(ad, features, ["terrace_count", "terraceCount", "terraces_count"]);
}

export function getWarehouseCountText(
  features: NonNullable<AdvertisementItem["features"]>,
  ad?: AdvertisementItem,
) {
  return getFacilityCountText(ad, features, [
    "warehouse_count",
    "warehouseCount",
    "warehouses_count",
    "storage_count",
    "storageCount",
  ]);
}

export function parseCountNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const str = String(value ?? "").trim();
  if (!str) return 0;
  const english = str
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  const match = english.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

export function parseFeatureList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => toText(item).trim()).filter(Boolean);
  }

  if (typeof value !== "string" || !value.trim()) return [];

  const text = value.trim();
  if (text.startsWith("[") && text.endsWith("]")) {
    try {
      const parsed = JSON.parse(text) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.map((item) => toText(item).trim()).filter(Boolean);
      }
    } catch {
      // Fall through to the delimiter-based parser for legacy payloads.
    }
  }

  return text
    .split(/[،,|]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeFacilityDisplayLabel(value: string) {
  const normalized = value.trim();

  if (normalized === "سرویس فرهنگی") return "سرویس فرنگی";
  if (normalized === "western") return "سرویس فرنگی";
  if (normalized === "iranian") return "سرویس ایرانی";

  return normalized;
}

export function buildFacilityItems(
  ad: AdvertisementItem,
  features: NonNullable<AdvertisementItem["features"]>,
) {
  const facilities = getFeatureValue(features, "facilities") ?? ad.facilities;
  const heatingCooling = getFeatureValue(features, "heating_cooling") ?? ad.heating_cooling;
  const elevatorCount = getElevatorCountText(features, ad);
  const parkingCount = getParkingCountText(features, ad);
  const terraceCount = getTerraceCountText(features, ad);
  const warehouseCount = getWarehouseCountText(features, ad);

  const elevatorNum = parseCountNumber(elevatorCount);
  const parkingNum = parseCountNumber(parkingCount);
  const terraceNum = parseCountNumber(terraceCount);
  const warehouseNum = parseCountNumber(warehouseCount);

  const rawFacilityList = parseFeatureList(facilities).map(normalizeFacilityDisplayLabel);
  const heatingList = parseFeatureList(heatingCooling).map(normalizeFacilityDisplayLabel);
  const facilitySet = new Set(rawFacilityList);
  const formCode = toText(getFeatureValue(features, "form_code"), toText(ad.form_code));
  const supportsStructuralFacilities = parkingFacilityFormCodes.has(formCode);

  const hasElevator =
    (facilitySet.has("آسانسور") || facilitySet.has("elevator") || Boolean(elevatorCount)) &&
    (elevatorNum !== 0 || !elevatorCount);
  const hasParking =
    (facilitySet.has("پارکینگ") || facilitySet.has("parking") || Boolean(parkingCount)) &&
    (parkingNum !== 0 || !parkingCount);
  const hasTerrace =
    (facilitySet.has("تراس") || facilitySet.has("terrace") || Boolean(terraceCount)) &&
    (terraceNum !== 0 || !terraceCount);
  const hasWarehouse =
    (facilitySet.has("انباری") ||
      facilitySet.has("warehouse") ||
      facilitySet.has("storage") ||
      Boolean(warehouseCount)) &&
    (warehouseNum !== 0 || !warehouseCount);

  const makeFeatureItem = (feature: string): DetailItem => ({
    icon: "apartment",
    iconSrc: getFeatureIconSrc(feature),
    label: feature,
    value: feature,
    featureIconLabel: feature,
    hideFallbackIcon: true,
  });

  if (formCode === "rent-factory-workshop" || formCode === "rent-warehouse") {
    const utilityPriority = [
      "امتیاز برق",
      "برق تک فاز",
      "برق سه فاز",
      "امتیاز گاز",
      "امتیاز آب",
      "چاه آب",
      "دور دیوار/حصار",
      "دور دیوار",
      "نگهبانی",
      "امتیاز تلفن",
    ];
    const priorityIndex = new Map(utilityPriority.map((label, index) => [label, index]));
    const orderedFacilities = [...rawFacilityList].sort((a, b) => {
      const aIndex = priorityIndex.get(a) ?? Number.MAX_SAFE_INTEGER;
      const bIndex = priorityIndex.get(b) ?? Number.MAX_SAFE_INTEGER;
      return aIndex - bIndex;
    });
    const seenIndustrial = new Set<string>();
    const makeIndustrialItem = (feature: string): DetailItem => {
      const item = makeFeatureItem(feature);
      if ((feature === "آسانسور" || feature === "elevator") && elevatorNum > 1)
        item.inlineNote = `(${toPersianDigits(elevatorNum)})`;
      if ((feature === "پارکینگ" || feature === "parking") && parkingNum > 1)
        item.inlineNote = `(${toPersianDigits(parkingNum)})`;
      if ((feature === "تراس" || feature === "terrace") && terraceNum > 1)
        item.inlineNote = `(${toPersianDigits(terraceNum)})`;
      return item;
    };

    return [...orderedFacilities, ...heatingList]
      .filter((name) => {
        if (!name || seenIndustrial.has(name)) return false;
        seenIndustrial.add(name);
        return true;
      })
      .map(makeIndustrialItem);
  }

  const structuralItems: DetailItem[] = [];

  if (supportsStructuralFacilities) {
    structuralItems.push(
      hasElevator
        ? {
            ...makeFeatureItem("آسانسور"),
            inlineNote: elevatorNum > 1 ? `(${toPersianDigits(elevatorNum)})` : undefined,
          }
        : {
            ...makeFeatureItem("آسانسور"),
            statusBadge: "ندارد",
          },
    );

    structuralItems.push(
      hasParking
        ? {
            ...makeFeatureItem("پارکینگ"),
            inlineNote: parkingNum > 1 ? `(${toPersianDigits(parkingNum)})` : undefined,
          }
        : {
            ...makeFeatureItem("پارکینگ"),
            statusBadge: "ندارد",
          },
    );

    structuralItems.push(
      hasWarehouse
        ? {
            ...makeFeatureItem("انباری"),
            inlineNote: warehouseNum > 1 ? `(${toPersianDigits(warehouseNum)})` : undefined,
          }
        : {
            ...makeFeatureItem("انباری"),
            statusBadge: "ندارد",
          },
    );

    structuralItems.push(
      hasTerrace
        ? {
            ...makeFeatureItem("تراس"),
            inlineNote: terraceNum > 1 ? `(${toPersianDigits(terraceNum)})` : undefined,
          }
        : {
            ...makeFeatureItem("تراس"),
            statusBadge: "ندارد",
          },
    );
  }

  const mandatoryKeys = new Set([
    "آسانسور",
    "elevator",
    "پارکینگ",
    "parking",
    "تراس",
    "terrace",
    "انباری",
    "warehouse",
    "storage",
  ]);

  const otherFacilityNames = rawFacilityList.filter((name) => !mandatoryKeys.has(name));
  const seen = new Set<string>();
  const uniqueHeatingNames = heatingList.filter((name) => {
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });
  const uniqueOtherNames = otherFacilityNames.filter((name) => {
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  });

  const heatingItems = uniqueHeatingNames.map(makeFeatureItem);
  const otherFacilities = uniqueOtherNames.map(makeFeatureItem);

  return [...structuralItems, ...heatingItems, ...otherFacilities];
}

