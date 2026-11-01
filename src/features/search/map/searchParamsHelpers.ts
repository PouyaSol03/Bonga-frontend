import { filterableParamKeys } from "./constants";
import type { SearchFilterChip } from "../searchMapData";
import type { SearchMapMode } from "./types";

export function getSearchParams() {
  return new URLSearchParams(window.location.search);
}

export function getSearchParamsFromSnapshot(search: string) {
  return new URLSearchParams(search);
}

export function getInitialSearchMode(): SearchMapMode {
  return getSearchParams().get("view") === "list" ? "list" : "map";
}

export function writeSearchParams(
  params: URLSearchParams,
  navigate: (to: string, options?: { replace?: boolean }) => void,
  options: { replace?: boolean } = {},
) {
  const queryString = params.toString();
  const nextUrl = queryString ? `/search?${queryString}` : "/search";
  navigate(nextUrl, { replace: options.replace !== false });
}

export function getFilterOpenTarget(chip: SearchFilterChip): string {
  if (chip.id === "category") return "category";
  if (chip.id === "neighborhood") return "neighborhood";
  if (chip.id === "area") return "area";
  if (chip.id === "price") return "price";
  if (chip.id === "rooms") return "rooms";
  if (chip.id === "floor") return "floor";
  if (chip.id === "building_age") return "age";

  return "filters";
}

export function buildFilterPageUrl(chip: SearchFilterChip) {
  const params = getSearchParams();
  const target = getFilterOpenTarget(chip);

  params.set("focus", target);

  return `/search/filter?${params.toString()}`;
}

export function getActiveFilterCount(params: URLSearchParams) {
  const uniqueFilterKeys = new Set<string>();

  filterableParamKeys.forEach((key) => {
    if (!params.get(key)) return;

    if (key === "from_code") {
      uniqueFilterKeys.add("form_code");
      return;
    }

    if (key === "category_id") {
      uniqueFilterKeys.add("category_id");
      return;
    }

    if (key === "neighborhoods") {
      uniqueFilterKeys.add("neighborhood_id");
      return;
    }

    if (key === "area_min" || key === "area_max") {
      uniqueFilterKeys.add("area");
      return;
    }

    if (key === "price_min" || key === "price_max") {
      uniqueFilterKeys.add("price");
      return;
    }

    uniqueFilterKeys.add(key);
  });

  return uniqueFilterKeys.size;
}
