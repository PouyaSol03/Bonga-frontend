import { type AdvertisementItem } from "./item-types";

export function extractAdvertisementItems(
  payload: unknown,
): AdvertisementItem[] {
  if (Array.isArray(payload)) return payload as AdvertisementItem[];

  if (!payload || typeof payload !== "object") return [];

  const response = payload as {
    advertises?: unknown;
    data?: unknown;
    items?: unknown;
    list?: unknown;
    result?: unknown;
    results?: unknown;
  };

  const directCandidates = [
    response.advertises,
    response.list,
    response.items,
    response.results,
    response.data,
  ];

  for (const candidate of directCandidates) {
    if (Array.isArray(candidate)) return candidate as AdvertisementItem[];
  }

  for (const candidate of [response.data, response.result]) {
    const nestedItems = extractAdvertisementItems(candidate);

    if (nestedItems.length > 0) return nestedItems;
  }

  return [];
}
