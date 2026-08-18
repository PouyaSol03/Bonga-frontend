import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/query-keys";
import { quickSearchAdvertisements } from "./quick-advertisement-search.service";

export function useQuickAdvertisementSearchQuery({
  enabled = true,
  query,
}: {
  enabled?: boolean;
  query: string;
}) {
  return useQuery({
    enabled: enabled && query.trim().length > 0,
    queryFn: () => quickSearchAdvertisements(query),
    queryKey: queryKeys.advertisements.quickSearch(query.trim()),
    // Cache disabled globally in src/api/query-client.ts.
    // staleTime: 30_000,
  });
}
