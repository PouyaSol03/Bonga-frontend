import type { ChipItem } from "../types";

export function toLatinDigits(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export function toPersianDigits(value: string) {
  return value.replace(/[0-9٠-٩]/g, (digit) => {
    const latinDigit = digit >= "0" && digit <= "9" ? digit : String("٠١٢٣٤٥٦٧٨٩".indexOf(digit));

    return "۰۱۲۳۴۵۶۷۸۹"[Number(latinDigit)] ?? digit;
  });
}

export function normalizeLookupText(value: unknown): string {
  return toLatinDigits(String(value ?? ""))
    .trim()
    .toLowerCase();
}

export function readText(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "دارد" : "ندارد";

  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;

    for (const key of ["name", "title", "label", "value"]) {
      const nestedText: string = readText(record[key]);
      if (nestedText) return nestedText;
    }
  }

  return "";
}

export function isFilledValue(value: unknown): boolean {
  if (value === undefined || value === null) return false;
  const str = String(value).trim();
  return str !== "" && str !== "null" && str !== "undefined";
}

export function readNestedText(source: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = source[key];
    const text = readText(value);

    if (text) return text;
  }

  return "";
}

export function readArrayValue(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map((item) => readText(item)).filter(Boolean);
  }

  const text = readText(value);

  return text
    ? text
        .split(/[،,]/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];
}

export function toBooleanValue(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;

  if (typeof value === "string" && value.trim()) {
    const normalized = normalizeLookupText(value);

    if (["1", "true", "yes", "y", "on", "دارد", "بله", "بلی"].includes(normalized)) return true;
    if (["0", "false", "no", "n", "off", "ندارد", "خیر"].includes(normalized)) return false;
  }

  return null;
}

export function numericInputText(value: unknown): string {
  const text = readText(value);

  if (!text) return "";

  const normalized = toLatinDigits(text).replace(/[٬,]/g, "").replace(/\//g, ".");
  const decimalMatch = normalized.match(/\d+(?:\.\d+)?/);

  if (!decimalMatch) return "";

  const amount = Number(decimalMatch[0]);

  if (!Number.isFinite(amount)) return "";
  if (text.includes("میلیارد")) return String(Math.round(amount * 1_000_000_000));
  if (text.includes("میلیون")) return String(Math.round(amount * 1_000_000));

  return String(Math.round(amount));
}

export function elevatorCountText(value: unknown): string {
  const text = numericInputText(value);

  if (!text) return "";

  const count = Number(text);

  if (!Number.isFinite(count) || count < 1) return "";

  return toPersianDigits(String(Math.min(5, Math.floor(count))));
}

export function selectText(value: unknown): string {
  const text = readText(value);

  if (!text) return "";

  const normalized = toLatinDigits(text);

  return /^\d+$/.test(normalized) ? toPersianDigits(normalized) : text;
}

export function ageText(value: unknown): string {
  const text = selectText(value);
  const normalized = toLatinDigits(text);

  if (!text) return "";
  if (text.includes("سال") || text.includes("نوساز")) return text;
  if (/^\d+$/.test(normalized)) return `${toPersianDigits(normalized)} سال`;

  return text;
}

export function idsFromLabels(items: ChipItem[], value: unknown): string[] {
  const selectedLabels = readArrayValue(value).map(normalizeLookupText);

  if (!selectedLabels.length) return [];

  return items
    .filter((item) => {
      const itemId = normalizeLookupText(item.id);
      const itemLabel = normalizeLookupText(item.label);

      return selectedLabels.some((label) => label === itemId || label === itemLabel);
    })
    .map((item) => item.id);
}
