export function readText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);
  return fallback;
}

export function readFirst(record: Record<string, unknown> | undefined, keys: string[], fallback: string) {
  for (const key of keys) {
    const value = readText(record?.[key]);
    if (value) return value;
  }
  return fallback;
}

export function toPersianDigits(value: number | string) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}
