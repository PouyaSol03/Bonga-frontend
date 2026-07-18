import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  deleteSavedSearch,
  getSavedSearches,
  saveSearch,
} from "../services/saved-search.service";

export function useSavedSearchesQuery(enabled = true) {
  return useQuery({
    enabled,
    queryFn: getSavedSearches,
    queryKey: queryKeys.savedSearches.list(),
  });
}

export function useSaveSearchMutation() {
  return useMutation({
    mutationFn: saveSearch,
    onSuccess: (savedSearch) => {
      queryClient.setQueryData(
        queryKeys.savedSearches.list(),
        (items: Awaited<ReturnType<typeof getSavedSearches>> | undefined) => {
          const currentItems = items ?? [];
          const duplicateIndex = currentItems.findIndex(
            (item) => item.id === savedSearch.id || item.url === savedSearch.url,
          );

          if (duplicateIndex < 0) return [savedSearch, ...currentItems];

          return currentItems.map((item, index) =>
            index === duplicateIndex ? savedSearch : item,
          );
        },
      );
      void queryClient.invalidateQueries({ queryKey: queryKeys.savedSearches.all });
    },
  });
}

export function useDeleteSavedSearchMutation() {
  return useMutation({
    mutationFn: deleteSavedSearch,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.savedSearches.all });
      const previous = queryClient.getQueryData(queryKeys.savedSearches.list());

      queryClient.setQueryData(
        queryKeys.savedSearches.list(),
        (items: Awaited<ReturnType<typeof getSavedSearches>> | undefined) =>
          items?.filter((item) => item.id !== id) ?? [],
      );

      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.savedSearches.list(), context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.savedSearches.all });
    },
  });
}
