import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import type { AdvertisementListParams } from "../../advertisements/api/advertisement.service";
import {
  getApiSearchQuery,
  getSearchQuery,
  readSearchFilters,
} from "../searchFilters";
import type { SearchFilterChip, SearchMapBounds } from "../searchMapData";
import type { SaveSearchInput } from "../api/saved-search.service";
import { mapRequestLimit } from "./constants";
import { roundCoordinate } from "./coordinateHelpers";
import {
  getActiveFilterCount,
  getSearchParamsFromSnapshot,
} from "./searchParamsHelpers";

export function buildMapQueryParams(
  bounds: SearchMapBounds | null,
  search: string,
  geofence?: string,
) {
  if (!bounds) return null;

  const params = getSearchParamsFromSnapshot(search);
  const selectedCity = readStoredSelectedCity();
  const cityId = params.get("city_id") || selectedCity?.id || "";
  const filters = readSearchFilters(params);

  return {
    filters,
    ...(cityId ? { cityId } : {}),
    east: roundCoordinate(bounds.east),
    ...(geofence ? { geofence } : {}),
    limit: mapRequestLimit,
    north: roundCoordinate(bounds.north),
    south: roundCoordinate(bounds.south),
    west: roundCoordinate(bounds.west),
  };
}

export function buildListQueryParams(search: string): AdvertisementListParams {
  const params = getSearchParamsFromSnapshot(search);
  const selectedCity = readStoredSelectedCity();

  return {
    cityId: params.get("city_id") || selectedCity?.id || undefined,
    filters: readSearchFilters(params),
    page: 1,
    perPage: 20,
  };
}

export function hasSearchCriteria(search: string) {
  const params = getSearchParamsFromSnapshot(search);

  return getActiveFilterCount(params) > 0 || Boolean(getApiSearchQuery(params));
}

export function buildSaveSearchInput(
  search: string,
  chips: SearchFilterChip[],
): SaveSearchInput | null {
  const params = getSearchParamsFromSnapshot(search);

  params.delete("focus");
  params.delete("view");
  if (!hasSearchCriteria(`?${params.toString()}`)) return null;

  const selectedCity = readStoredSelectedCity();
  if (!params.get("city_id") && selectedCity?.id) {
    params.set("city_id", selectedCity.id);
  }

  const query = getSearchQuery(params);
  const content = chips
    .filter((chip) => chip.id !== "filters" && chip.isActive)
    .map((chip) => chip.label);
  const filters = Object.fromEntries(
    Array.from(params.entries())
      .filter(([key]) => !["query", "q", "qsearch"].includes(key))
      .map(([key, value]) => {
        const numericValue = Number(value);
        return [key, value !== "" && Number.isFinite(numericValue) ? numericValue : value];
      }),
  );

  return {
    content,
    filters,
    title: query || content[0] || "جستجوی آگهی",
    url: `/search?${params.toString()}`,
  };
}
