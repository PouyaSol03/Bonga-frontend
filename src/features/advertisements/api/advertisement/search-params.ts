import { type AdvertisementSearchFilters } from "./listing-types";

export function compactSearchParams(
  params: Record<string, unknown>,
): Record<string, SearchParamValue> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      if (value === undefined || value === null) return false;
      if (typeof value === "string") return value.trim().length > 0;
      if (typeof value === "boolean" || typeof value === "number") return true;

      return false;
    }),
  ) as Record<string, SearchParamValue>;
}

export function buildAdvertiseSearchParams(
  filters?: AdvertisementSearchFilters,
) {
  if (!filters) return {};

  return compactSearchParams({
    area_max: filters.areaMax,
    area_min: filters.areaMin,
    building_age: filters.buildingAge,
    category_id: filters.categoryId,
    floor: filters.floor,
    form_code: filters.formCode,
    from_code: filters.formCode,
    has_image: filters.hasImage,
    has_video: filters.hasVideo,
    is_special: filters.isSpecial,
    neighborhood_id: filters.neighborhoodId,
    neighborhoods: filters.neighborhoodId,
    price_max: filters.priceMax,
    price_min: filters.priceMin,
    published_at: filters.publishedAt,
    query: filters.query,
    rooms: filters.rooms,
    ...(filters.featureFilters ?? {}),
  });
}

export type SearchParamValue = boolean | number | string;
