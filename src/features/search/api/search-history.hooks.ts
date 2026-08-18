import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/query-client";
import { queryKeys } from "../../../shared/api/query-keys";
import {
  deleteSearchHistory,
  getSearchHistory,
} from "./search-history.service";

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
    /*
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.searchHistory.all });
      const previousQueries = queryClient.getQueriesData<
        Awaited<ReturnType<typeof getSearchHistory>>
      >({ queryKey: queryKeys.searchHistory.all });

      previousQueries.forEach(([queryKey, items]) => {
        queryClient.setQueryData(
          queryKey,
          items?.filter((item) => item.id !== id) ?? [],
        );
      });

      return { previousQueries };
    },
    onError: (_error, _id, context) => {
      context?.previousQueries.forEach(([queryKey, items]) => {
        queryClient.setQueryData(queryKey, items);
      });
    },
    */
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.searchHistory.all,
      });
    },
  });
}
