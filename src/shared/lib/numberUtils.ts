const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

const persianToEnglishMap: Record<string, string> = {
  "۰": "0", "۱": "1", "۲": "2", "۳": "3", "۴": "4",
  "۵": "5", "۶": "6", "۷": "7", "۸": "8", "۹": "9",
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
};

/**
 * Convert any Persian/Arabic digits in a string or number to ASCII English digits (0-9).
 */
export function toEnglishDigits(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[۰-۹٠-٩]/g, (char) => persianToEnglishMap[char] ?? char);
}

/**
 * Convert ASCII English digits and Arabic digits in a string or number to Persian digits (۰-۹).
 */
export function toPersianNumber(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/[0-9]/g, (digit) => persianDigits[Number(digit)] ?? digit)
    .replace(/[٠-٩]/g, (digit) => persianDigits["٠١٢٣٤٥٦٧٨٩".indexOf(digit)] ?? digit);
}

const faNumberFormatter = new Intl.NumberFormat("fa-IR");

/**
 * Format a number or numeric string using Persian locale (e.g. ۱٬۲۵۰٬۰۰۰).
 */
export function formatNumber(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  const normalized = typeof value === "string" ? toEnglishDigits(value).replace(/,/g, "").trim() : value;
  const num = typeof normalized === "number" ? normalized : Number(normalized);
  if (!Number.isFinite(num)) return String(value);
  return faNumberFormatter.format(num);
}

/**
 * Parse an unknown value into a finite number, stripping separators and Persian/Arabic digits.
 */
export function parseNumericValue(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || !value.trim()) return null;

  const normalized = toEnglishDigits(value)
    .replace(/[٬،,\s]/g, "")
    .replace(/[^0-9.-]/g, "");
  const number = Number(normalized);

  return Number.isFinite(number) ? number : null;
}

export const toNumericValue = parseNumericValue;


