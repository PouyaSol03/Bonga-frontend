import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/query-keys";
import { getHomeStats } from "./home-stats.service";

export function useHomeStatsQuery() {
  return useQuery({
    queryFn: getHomeStats,
    queryKey: queryKeys.homeStats.snapshot(),
  });
}
