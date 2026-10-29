import type { PaymentHistoryItem } from "./wallet.types";

export function asPaginationRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export function readFiniteNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}

export function readPaymentHistoryItems(value: unknown): PaymentHistoryItem[] {
  if (Array.isArray(value)) return value as PaymentHistoryItem[];
  const record = asPaginationRecord(value);
  if (!record) return [];

  for (const key of ["payments", "history", "items", "list", "result"]) {
    if (Array.isArray(record[key])) return record[key] as PaymentHistoryItem[];
  }
  if (Array.isArray(record.data)) return record.data as PaymentHistoryItem[];

  return readPaymentHistoryItems(record.data);
}

export function readPaymentUrl(response: Record<string, unknown>) {
  const value = response.payment_url ?? response.url;
  if (typeof value !== "string" || !value.trim()) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}
