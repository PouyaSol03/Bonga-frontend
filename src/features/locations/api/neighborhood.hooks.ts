import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/query-keys";
import {
  getNeighborhoodInfo,
  getNeighborhoodList,
  type NeighborhoodListParams,
} from "./neighborhood.service";

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