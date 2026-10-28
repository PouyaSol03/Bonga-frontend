import { type AdvertisementItem } from "../../api/advertisement.service";
import type { ViewAdDetails } from ".././viewAdTypes";

export type AdvertisementNeighborhoodSelection = {
  cityId?: string;
  id: string;
  name: string;
};

export function toNonEmptyText(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(toNonEmptyText).find(Boolean) ?? "";
  }

  if (typeof value !== "string" && typeof value !== "number") return "";

  return String(value).trim();
}

export function extractNeighborhoodName(value: unknown, allowPlainText = false) {
  const text = toNonEmptyText(value);

  if (!text) return "";

  const neighborhoodMatch = text.match(/(?:محله|منطقه)\s+(.+)$/);

  return neighborhoodMatch?.[1]?.trim() ?? (allowPlainText ? text : "");
}

export function getAdvertisementNeighborhood(
  ad: AdvertisementItem,
  details: ViewAdDetails,
): AdvertisementNeighborhoodSelection | null {
  const neighborhoodId = ad.neighborhood?.id ?? ad.neighborhood_id;
  const neighborhoodName = toNonEmptyText(ad.neighborhood?.name ?? ad.neighborhood_name);
  const id = toNonEmptyText(neighborhoodId);
  const name = neighborhoodName || extractNeighborhoodName(details.locationTitle, true);

  if (!id || !name) return null;

  const cityId = toNonEmptyText(ad.city?.id ?? ad.city_id) || undefined;

  return { cityId, id, name };
}
