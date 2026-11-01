import type { CrmRecord } from "../api/crm.service";
import type { CrmSubNeighborhoodDraft } from "./types";

export function parseCrmSubNeighborhoods(value: string): CrmSubNeighborhoodDraft[] {
  if (!value.trim()) return [];

  let parsed: unknown;

  try {
    parsed = JSON.parse(value) as unknown;
  } catch {
    parsed = value;
  }

  const items = Array.isArray(parsed)
    ? parsed
    : typeof parsed === "string"
      ? parsed
          .split(/[،,|]/)
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  return items.flatMap((item, index) => {
    if (typeof item === "string") {
      return [{ geofence: null, id: `legacy-${index + 1}`, name: item }];
    }

    if (!item || typeof item !== "object") return [];

    const record = item as CrmRecord;
    const nameValue = record.name ?? record.title ?? record.label;
    const name = typeof nameValue === "string" ? nameValue : "";

    return [
      {
        geofence: record.geofence ?? record.polygon ?? null,
        id: String(record.id ?? record._id ?? `legacy-${index + 1}`),
        name,
      },
    ];
  });
}

export function createSubNeighborhoodId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
