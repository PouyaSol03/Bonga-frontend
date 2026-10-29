import type { NeighborhoodDto } from "../../locations/api/neighborhood.service";
import type { SelectedNeighborhood } from "./types";

export function isDesktopDashboard(): boolean {
  return false;
}

export function normalizeOptionalText(value: string): string | null {
  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue : null;
}

export function splitProfileName(value: string): { family: string | null; name: string | null } {
  const [name, ...familyParts] = value.trim().split(/\s+/);

  return {
    family: familyParts.length ? familyParts.join(" ") : null,
    name: name || null,
  };
}

export function getNeighborhoodId(neighborhood: NeighborhoodDto): string {
  return String(neighborhood.id ?? neighborhood._id ?? neighborhood.name);
}

export function toSelectedNeighborhood(neighborhood: NeighborhoodDto): SelectedNeighborhood {
  return {
    id: getNeighborhoodId(neighborhood),
    name: neighborhood.name,
  };
}
