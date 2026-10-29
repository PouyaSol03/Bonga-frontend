import type { ApiQueryParams } from "../../../../shared/api/api";

export type CrmRecord = Record<string, unknown>;

export const rowContainerKeys = [
  "data",
  "advertise",
  "advertises",
  "users",
  "agencies",
  "categories",
  "cities",
  "neighborhoods",
  "sub_neighborhood",
  "sub_neighborhoods",
  "subNeighborhood",
  "subNeighborhoods",
  "items",
  "list",
  "packages",
  "payments",
  "transactions",
  "reports",
  "advertise_reports",
  "user_reports",
  "chat_reports",
  "result",
] as const;

export function compactSearchParams(params: ApiQueryParams) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  ) as Record<string, string | number | boolean>;
}

export function normalizeRows(payload: unknown): CrmRecord[] {
  if (Array.isArray(payload)) return payload as CrmRecord[];
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;

  for (const key of rowContainerKeys) {
    const value = record[key];

    if (Array.isArray(value)) return value as CrmRecord[];
  }

  for (const key of rowContainerKeys) {
    const value = record[key];

    if (value && typeof value === "object" && !Array.isArray(value)) {
      const nestedRows = normalizeRows(value);

      if (nestedRows.length > 0) return nestedRows;
    }
  }

  return [];
}

export function unwrapRecord(payload: unknown, keys: string[]): CrmRecord {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {};

  let current = payload as CrmRecord;
  const visited = new Set<CrmRecord>();

  while (!visited.has(current)) {
    visited.add(current);
    let next: CrmRecord | null = null;

    for (const key of keys) {
      const value = current[key];

      if (value && typeof value === "object" && !Array.isArray(value)) {
        next = value as CrmRecord;
        break;
      }
    }

    if (!next) return current;
    current = next;
  }

  return current;
}

export function getCrmRecordId(record: CrmRecord) {
  const value = record.id ?? record._id;
  return value === undefined || value === null ? "" : String(value);
}

export function findPaginationRecord(payload: unknown): CrmRecord {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {};

  const current = payload as CrmRecord;
  const hasPagination = ["total", "count", "page", "current_page", "per_page", "perPage"].some(
    (key) => current[key] !== undefined,
  );

  if (hasPagination) return current;

  for (const key of ["data", "result", "meta", "pagination"]) {
    const nested = current[key];
    const match = findPaginationRecord(nested);

    if (Object.keys(match).length > 0) return match;
  }

  return {};
}
