import { getApiAssetUrl } from "../../../shared/api/api";
import type { AdvertisementItem } from "../../advertisements/api/advertisement.service";

export function toText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function toOptionalNumber(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function toStringArray(value: unknown): string[] {
  const values = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : [];

  return values
    .flatMap((item) => String(item ?? "").split(","))
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toAssetUrl(value: unknown): string | undefined {
  const path = toText(value);
  return path ? getApiAssetUrl(path) : undefined;
}

export function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function firstText(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return String(value);
    }
    const text = toText(value);
    if (text) return text;
  }
  return "";
}

export function firstNumber(fallback: number, ...values: unknown[]): number {
  for (const value of values) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

export function readAdvertises(...values: unknown[]): AdvertisementItem[] {
  for (const value of values) {
    if (Array.isArray(value)) return value as AdvertisementItem[];
  }
  return [];
}

export function readSocialValue(record: Record<string, unknown>, key: string): string {
  const profile = asRecord(record.profile);
  const social = asRecord(record.social);
  const contactSocial = asRecord(record.contact_social);
  const contacts = asRecord(record.contacts);

  return firstText(
    record[key],
    profile[key],
    social[key],
    contactSocial[key],
    contacts[key],
  );
}

export function normalizePermissionFlag(value: unknown): boolean {
  return value === true || value === 1 || value === "1";
}
