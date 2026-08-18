import type { NeighborhoodDto } from "../locations/api/neighborhood.service";

const AGENCY_CREATION_DRAFT_KEY = "bonga:account:business:create:agency:draft";

export type AgencyCreationDraft = {
  agencyName: string;
  selectedNeighborhoods: NeighborhoodDto[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normalizeStoredNeighborhood(value: unknown): NeighborhoodDto | null {
  if (!isRecord(value)) return null;

  const rawId = value.id ?? value._id;
  const id = rawId === undefined || rawId === null ? "" : String(rawId).trim();
  const name = typeof value.name === "string" ? value.name.trim() : "";

  if (!id || !name) return null;

  return { id, name };
}

export function readAgencyCreationDraft(): AgencyCreationDraft {
  if (typeof window === "undefined") {
    return { agencyName: "", selectedNeighborhoods: [] };
  }

  try {
    const rawValue = window.sessionStorage.getItem(AGENCY_CREATION_DRAFT_KEY);
    if (!rawValue) return { agencyName: "", selectedNeighborhoods: [] };

    const parsed = JSON.parse(rawValue) as unknown;
    if (!isRecord(parsed)) return { agencyName: "", selectedNeighborhoods: [] };

    const agencyName = typeof parsed.agencyName === "string" ? parsed.agencyName : "";
    const selectedNeighborhoods = Array.isArray(parsed.selectedNeighborhoods)
      ? parsed.selectedNeighborhoods
          .map(normalizeStoredNeighborhood)
          .filter((item): item is NeighborhoodDto => item !== null)
      : [];

    return { agencyName, selectedNeighborhoods };
  } catch {
    return { agencyName: "", selectedNeighborhoods: [] };
  }
}

export function writeAgencyCreationDraft(draft: AgencyCreationDraft) {
  if (typeof window === "undefined") return;

  const selectedNeighborhoods = draft.selectedNeighborhoods
    .map((item) => {
      const rawId = item.id ?? item._id;
      const id = rawId === undefined || rawId === null ? "" : String(rawId).trim();
      const name = item.name?.trim() ?? "";

      return id && name ? { id, name } : null;
    })
    .filter((item): item is { id: string; name: string } => item !== null);

  window.sessionStorage.setItem(
    AGENCY_CREATION_DRAFT_KEY,
    JSON.stringify({ agencyName: draft.agencyName, selectedNeighborhoods }),
  );
}

export function clearAgencyCreationDraft() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(AGENCY_CREATION_DRAFT_KEY);
}
