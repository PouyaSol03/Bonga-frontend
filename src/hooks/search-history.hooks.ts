import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  deleteSearchHistory,
  getSearchHistory,
} from "../services/search-history.service";

export function useSearchHistoryQuery({
  enabled = true,
  qsearch,
}: {
  enabled?: boolean;
  qsearch?: string;
}) {
  return useQuery({
    enabled,
    queryFn: () => getSearchHistory(qsearch),
    queryKey: queryKeys.searchHistory.list(qsearch),
  });
}

export function useDeleteSearchHistoryMutation() {
  return useMutation({
    mutationFn: deleteSearchHistory,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.searchHistory.all,
      });
    },
  });
}
