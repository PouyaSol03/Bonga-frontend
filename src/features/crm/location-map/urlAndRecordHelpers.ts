import type { CrmRecord } from "../api/crm.service";
import { getCrmRecordId } from "../api/crm.service";
import { readText } from "../CrmLayout";
import { getNeighborhoodPoints, getSubNeighborhoodPoints } from "./geometry/pointUtils";
import type { BoundaryItem, EditTarget, SubNeighborhoodRecord } from "./types";

export function getCityIdFromUrl() {
  return new URLSearchParams(window.location.search).get("cityId")?.trim() ?? "";
}

export function getSelectedNeighborhoodIdFromUrl() {
  return new URLSearchParams(window.location.search).get("neighborhoodId")?.trim() ?? "";
}

export function getCitySnapshotFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));

  return {
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    name: params.get("cityName")?.trim() ?? "",
  };
}

export function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : String(value ?? "").trim();
}

export function parseMaybeJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return value;
  }
}

export function parseSubNeighborhoods(value: unknown): SubNeighborhoodRecord[] {
  const parsed = parseMaybeJson(value);
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

    if (!item || typeof item !== "object" || Array.isArray(item)) return [];

    const record = item as CrmRecord;
    const name = normalizeText(record.name ?? record.title ?? record.label);
    if (!name) return [];

    return [
      {
        ...record,
        geofence: record.geofence ?? record.polygon ?? null,
        id: normalizeText(record.id ?? record._id ?? `legacy-${index + 1}`),
        name,
      },
    ];
  });
}

export function createLocalSubNeighborhoodId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function buildBoundaryItems(neighborhoods: CrmRecord[]): BoundaryItem[] {
  return neighborhoods.flatMap((neighborhood) => {
    const neighborhoodId = getCrmRecordId(neighborhood);
    const neighborhoodName = readText(neighborhood, ["name"], "محله");
    const mainPoints = getNeighborhoodPoints(neighborhood);
    const mainBoundary: BoundaryItem[] =
      mainPoints.length >= 3
        ? [
            {
              id: `n:${neighborhoodId}`,
              kind: "neighborhood",
              name: neighborhoodName,
              neighborhoodId,
              points: mainPoints,
            },
          ]
        : [];

    const subBoundaries = parseSubNeighborhoods(neighborhood.sub_neighbors).flatMap(
      (subNeighborhood) => {
        const points = getSubNeighborhoodPoints(subNeighborhood);
        if (points.length < 3) return [];

        return [
          {
            id: `s:${neighborhoodId}:${subNeighborhood.id}`,
            kind: "sub-neighborhood" as const,
            name: subNeighborhood.name,
            neighborhoodId,
            parentName: neighborhoodName,
            points,
            subId: subNeighborhood.id,
          },
        ];
      },
    );

    return [...mainBoundary, ...subBoundaries];
  });
}

export function targetBoundaryId(target: EditTarget | null) {
  if (!target) return "";
  if (target.kind === "neighborhood") return `n:${target.neighborhoodId}`;
  if (target.kind === "sub-neighborhood" && !target.isNew) {
    return `s:${target.neighborhoodId}:${target.subId}`;
  }
  return "";
}
