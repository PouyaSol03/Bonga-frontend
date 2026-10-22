/**
 * Safe conversion of unknown/nullable scalar values to string with optional fallback.
 */
export function readText(value: unknown, fallback = ""): string {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number" && !Number.isNaN(value)) return String(value);

  return fallback;
}

/**
 * Type guard for plain, non-null, non-array object records.
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
