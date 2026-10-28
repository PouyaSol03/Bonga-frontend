import { toEnglishDigits, toPersianDigits } from "../../../shared/lib/numberUtils";
import { formatPrice, formatBigNumber } from "../../../shared/lib/MoneyHandler";

export function normalizeExactFilterValue(value: string | undefined) {
  if (!value) return "";

  const trimmed = value.trim();
  if (trimmed === "همکف" || trimmed === "بدون") return "0";

  const normalized = toEnglishDigits(trimmed)
    .replace(/‌/g, " ")
    .replace(/سال/g, "")
    .replace(/اتاق/g, "")
    .replace(/طبقه/g, "")
    .replace(/نفر/g, "")
    .replace(/و بیشتر/g, "")
    .replace(/\+/g, "")
    .trim();

  if (/\d/.test(normalized)) {
    const numericValue = normalized.replace(/[^\d.-]/g, "");
    if (numericValue && !isNaN(Number(numericValue))) {
      return numericValue;
    }
  }

  return trimmed;
}

export function normalizeMultiExactFilterValue(values: string[] | undefined) {
  return (values ?? []).map(normalizeExactFilterValue).filter(Boolean).join("_");
}

export function normalizeRangeNumber(value: string | undefined) {
  if (!value) return "";

  return toEnglishDigits(value).replace(/[^\d.]/g, "");
}

export function formatPersianGroupedNumberInput(value: string) {
  const normalized = normalizeRangeNumber(value);

  if (!normalized) return "";

  const [integerPart, decimalPart] = normalized.split(".");
  const grouped = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "،");

  return toPersianDigits(decimalPart !== undefined ? `${grouped}.${decimalPart}` : grouped);
}

export function formatPersianPlainNumber(value: string | number) {
  const normalized = normalizeRangeNumber(String(value));

  return normalized ? toPersianDigits(normalized) : "";
}

export function formatMoneyInputValue(value: string | number | undefined) {
  const normalized = normalizeRangeNumber(String(value ?? ""));
  const numericValue = Number(normalized);

  return normalized && numericValue > 0 ? formatPrice(numericValue) : "";
}

export function getMoneySupportingText(value: string | number | undefined) {
  const normalized = normalizeRangeNumber(String(value ?? ""));
  const numericValue = Number(normalized);

  return normalized && numericValue > 0 ? `${formatBigNumber(numericValue)} تومان` : "";
}
