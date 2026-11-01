import type { NeighborhoodDto } from "../../../locations/api/neighborhood.service";
import { toEnglishDigits, toPersianNumber as toPersianDigits } from "../../../../shared/lib/numberUtils";
import type { SearchMapQuickFilterId } from "./types";

export const neighborhoodSearchDebounceMs = 250;
export const quickAreaCustomOptionLabel = "وارد کردن مقدار";
export const quickAreaRangeOptions = ["۱۰۰", "۱۱۰", "۱۶۰", "۲۰۰", "۲۵۰"];

export function normalizeNumber(value: string) {
  return toEnglishDigits(value).replace(/[^\d.]/g, "");
}

export function formatGroupedNumber(value: string) {
  const normalized = normalizeNumber(value);
  const numericValue = Number(normalized);

  if (!normalized || !Number.isFinite(numericValue)) return "";

  return new Intl.NumberFormat("fa-IR").format(numericValue);
}

export function normalizeChoiceValue(value: string) {
  const normalized = toEnglishDigits(value)
    .replace(/‌/g, " ")
    .replace(/سال/g, "")
    .replace(/اتاق/g, "")
    .replace(/طبقه/g, "")
    .replace(/و بیشتر/g, "")
    .replace(/بیشتر از/g, "")
    .replace(/\+/g, "")
    .trim();

  if (normalized === "همکف" || normalized === "بدون") return "0";
  if (normalized === "بدون اتاق") return "0";

  const numericValue = normalized.replace(/[^\d.-]/g, "");

  return numericValue || normalized;
}

export function getNeighborhoodId(neighborhood: Pick<NeighborhoodDto, "_id" | "id" | "name">) {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

export function splitParam(value: string | null) {
  return (value ?? "").split(/[_،,]/).filter(Boolean);
}

export function getSheetTitle(filterId: SearchMapQuickFilterId | null) {
  switch (filterId) {
    case "category":
      return "دسته‌بندی";
    case "neighborhood":
      return "محله";
    case "area":
      return "متراژ";
    case "price":
      return "قیمت";
    case "rooms":
      return "تعداد اتاق";
    case "floor":
      return "طبقه";
    case "building_age":
      return "سن ساخت";
    default:
      return "فیلتر";
  }
}

export function formatAreaValue(value: string) {
  const normalized = normalizeNumber(value);
  return normalized ? toPersianDigits(normalized) : "";
}
