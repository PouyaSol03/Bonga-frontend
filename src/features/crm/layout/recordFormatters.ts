import type { CrmRecord } from "../api/crm.service";

export function stringifyValue(value: unknown, fallback = "") {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  return JSON.stringify(value, null, 2);
}

export function readText(record: CrmRecord, keys: string[], fallback = "-") {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }

  return fallback;
}

export function readArray(record: CrmRecord, key: string) {
  return Array.isArray(record[key]) ? (record[key] as unknown[]) : [];
}

export function readNestedText(
  record: CrmRecord,
  keys: string[],
  childKeys = ["name", "title", "label"],
) {
  for (const key of keys) {
    const value = record[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const text = readText(value as CrmRecord, childKeys, "");
      if (text) return text;
    }
  }
  return "";
}
export function formatMoney(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) && number !== 0
    ? new Intl.NumberFormat("fa-IR").format(number)
    : "-";
}
export function cleanEmptyValues(values: CrmRecord) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== "" && value !== undefined),
  );
}

export function getCategoryChildren(category: CrmRecord) {
  return Array.isArray(category.children) ? (category.children as CrmRecord[]) : [];
}

export function getCategoryLabel(category: CrmRecord) {
  return readText(category, ["name", "title", "label"]);
}

export function fullName(user: CrmRecord) {
  return (
    [readText(user, ["name"], ""), readText(user, ["family"], "")].filter(Boolean).join(" ") || "-"
  );
}
