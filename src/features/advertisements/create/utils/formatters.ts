import { toEnglishDigits as toLatinDigits } from "../../../../shared/lib/numberUtils";
import type { ChipItem } from "../types";

export function normalizeDigits(value: unknown): string {
  return String(value ?? "")
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

export function parseUnitsPerFloor(value: unknown): number | null {
  const wordsMap: Record<string, number> = {
    "تک واحدی": 1,
    "دو واحدی": 2,
    "سه واحدی": 3,
    "چهار واحدی": 4,
    "پنج واحدی": 5,
    "شش واحدی": 6,
    "هفت واحدی": 7,
    "هشت واحد بیشتر": 8,
  };
  const str = String(value ?? "").trim();
  if (wordsMap[str]) return wordsMap[str];

  const match = normalizeDigits(str).match(/\d+/);
  if (!match) return null;

  const number = Number(match[0]);
  return Number.isInteger(number) && number >= 1 && number <= 60 ? number : null;
}

export function normalizeUnitsPerFloorValue(value: unknown): string {
  const number = parseUnitsPerFloor(value);
  return number === null ? "" : new Intl.NumberFormat("fa-IR").format(number);
}

export function formatUnitsPerFloorLabel(value: unknown): string {
  const normalized = normalizeUnitsPerFloorValue(value);
  return normalized ? `${normalized} واحد` : typeof value === "string" ? value : "";
}

export function normalizeNumberInput(value: unknown): string {
  return normalizeDigits(value).replace(/[^\d,]/g, "");
}

export function toNumber(value: unknown): number | null {
  const normalized = normalizeDigits(value).replace(/,/g, "");
  const number = Number(normalized);
  return Number.isFinite(number) && normalized ? number : null;
}

export function toUnitsPerFloorNumber(value: string): number | null {
  return parseUnitsPerFloor(value);
}

export function labels(items: ChipItem[], ids: string[]): string[] {
  return items.filter((item) => ids.includes(item.id)).map((item) => item.label);
}

export function pickFirstNumber(value: string): string {
  const match = value.match(/[۰-۹٠-٩0-9]+/);
  return match?.[0] ?? "";
}

export function priceTextToNumberString(value: string): string {
  const normalized = toLatinDigits(value).replace(/\//g, ".");
  const decimalMatch = normalized.match(/\d+(?:\.\d+)?/);
  if (!decimalMatch) return "";

  const amount = Number(decimalMatch[0]);
  if (!Number.isFinite(amount)) return "";

  if (value.includes("میلیارد")) return String(Math.round(amount * 1_000_000_000));
  if (value.includes("میلیون")) return String(Math.round(amount * 1_000_000));

  return normalized.replace(/[^\d]/g, "");
}

export function locationFromTimeAndLocation(value: string): string {
  const parts = value.split(" در ");
  return parts.length > 1 ? parts.slice(1).join(" در ").trim() : value.trim();
}

export function readText(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return "";
}
