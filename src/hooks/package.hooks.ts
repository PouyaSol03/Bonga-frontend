import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../api/query-keys";
import { getPackages } from "../services/package.service";

export function usePackagesQuery() {
  return useQuery({
    queryFn: getPackages,
    queryKey: queryKeys.packages.list(),
  });
}
