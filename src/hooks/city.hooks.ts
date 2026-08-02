import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../api/query-keys";
import {
  getMostVisitedCityList,
  searchCities,
} from "../services/city.service";

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
