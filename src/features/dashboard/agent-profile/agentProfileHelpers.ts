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

export {
  getNeighborhoodId,
  toSelectedNeighborhood,
} from "../components/neighborhood/neighborhoodHelpers";
