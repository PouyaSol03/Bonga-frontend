import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../api/query-keys";
import {
  getNeighborhoodInfo,
  getNeighborhoodInfoWithLoc,
  getNeighborhoodList,
  getSubNeighborhoodList,
  type NeighborhoodInfoWithLocParams,
  type NeighborhoodListParams,
} from "../services/neighborhood.service";

export function useNeighborhoodListQuery({
  cityId,
  enabled = true,
  page,
  perPage,
  q = "",
}: NeighborhoodListParams & { enabled?: boolean }) {
  return useQuery({
    enabled: enabled && Boolean(cityId),
    queryFn: () => getNeighborhoodList({ cityId, page, perPage, q }),
    queryKey: queryKeys.neighborhoods.list({ cityId, page, perPage, q }),
  });
}

export function useNeighborhoodInfoWithLocQuery({
  cityId,
  enabled = true,
  lat,
  lng,
}: NeighborhoodInfoWithLocParams & { enabled?: boolean }) {
  return useQuery({
    enabled: enabled && Boolean(cityId) && Number.isFinite(lat) && Number.isFinite(lng),
    queryFn: () => getNeighborhoodInfoWithLoc({ cityId, lat, lng }),
    queryKey: queryKeys.neighborhoods.infoWithLoc({ cityId, lat, lng }),
  });
}

export function useSubNeighborhoodListQuery(
  neighborhoodId: string | number | null | undefined,
  enabled = true,
) {
  return useQuery({
    enabled: enabled && Boolean(neighborhoodId),
    queryFn: () => getSubNeighborhoodList(neighborhoodId ?? ""),
    queryKey: queryKeys.neighborhoods.subNeighborhoods(neighborhoodId ?? ""),
  });
}

export function useNeighborhoodInfoQuery(
  neighborhoodId: string | number | null | undefined,
  enabled = true,
) {
  return useQuery({
    enabled: enabled && Boolean(neighborhoodId),
    queryFn: () => getNeighborhoodInfo(neighborhoodId ?? ""),
    queryKey: queryKeys.neighborhoods.info(neighborhoodId ?? ""),
  });
}
