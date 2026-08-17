import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../api/query-keys";
import { getHomeStats } from "../services/home-stats.service";

export function useHomeStatsQuery() {
  return useQuery({
    queryFn: getHomeStats,
    queryKey: queryKeys.homeStats.snapshot(),
  });
}
