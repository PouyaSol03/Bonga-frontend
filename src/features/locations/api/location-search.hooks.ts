import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/query-keys";
import {
  searchLocationByCoordinates,
  searchLocationsByQuery,
  type LocationSearchByCoordinatesParams,
  type LocationSearchByQueryParams,
} from "./location-search.service";

export function useLocationSearchByQuery({
  cityId,
  enabled = true,
  query,
}: LocationSearchByQueryParams & { enabled?: boolean }) {
  return useQuery({
    enabled: enabled && Boolean(cityId) && Boolean(query.trim()),
    queryFn: () => searchLocationsByQuery({ cityId, query }),
    queryKey: queryKeys.locationSearch.byQuery({ cityId, query }),
  });
}

export function useLocationSearchByCoordinates({
  cityId,
  enabled = true,
  lat,
  lng,
}: LocationSearchByCoordinatesParams & { enabled?: boolean }) {
  return useQuery({
    enabled:
      enabled &&
      Boolean(cityId) &&
      Number.isFinite(lat) &&
      Number.isFinite(lng),
    queryFn: () => searchLocationByCoordinates({ cityId, lat, lng }),
    queryKey: queryKeys.locationSearch.byCoordinates({ cityId, lat, lng }),
  });
}
