import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../api/query-keys";
import {
  getCityList,
  getMostVisitedCityList,
  searchCities,
} from "../services/city.service";

export function useCityListQuery(options?: { enabled?: boolean }) {
  return useQuery({
    enabled: options?.enabled ?? true,
    queryFn: getCityList,
    queryKey: queryKeys.cities.list(),
  });
}

export function useCitySearchQuery({
  enabled = true,
  q = "",
}: {
  enabled?: boolean;
  q?: string;
}) {
  return useQuery({
    enabled,
    queryFn: () => searchCities(q),
    queryKey: queryKeys.cities.search(q),
  });
}

export function useMostVisitedCityListQuery() {
  return useQuery({
    queryFn: getMostVisitedCityList,
    queryKey: queryKeys.cities.mostVisited(),
    // Cache disabled globally in src/api/query-client.ts.
    // staleTime: 1000 * 60 * 15,
  });
}
