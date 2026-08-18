import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/query-client";
import { queryKeys } from "../../../shared/api/query-keys";
import {
  createPropertyRequest,
  deletePropertyRequest,
  getPropertyRequestMatches,
  getPropertyRequests,
  getPropertyRequestScope,
  renamePropertyRequest,
  type PropertyRequestCreateInput,
} from "./property-request.service";

export function usePropertyRequestsQuery(page = 1, perPage = 20) {
  const scope = getPropertyRequestScope();

  return useQuery({
    queryFn: () => getPropertyRequests(page, perPage),
    queryKey: queryKeys.propertyRequests.list(scope.ownerType, page, perPage),
  });
}

export function useCreatePropertyRequestMutation() {
  return useMutation({
    mutationFn: (input: PropertyRequestCreateInput) => createPropertyRequest(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.propertyRequests.all,
      });
    },
  });
}

export function useRenamePropertyRequestMutation() {
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      renamePropertyRequest(id, name),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.propertyRequests.all,
      });
    },
  });
}

export function useDeletePropertyRequestMutation() {
  return useMutation({
    mutationFn: (id: string) => deletePropertyRequest(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.propertyRequests.all,
      });
    },
  });
}

export function usePropertyRequestMatchesQuery(
  requestId: string | null,
  page = 1,
  perPage = 20,
  enabled = true,
) {
  const scope = getPropertyRequestScope();

  return useQuery({
    enabled: enabled && Boolean(requestId),
    queryFn: () => getPropertyRequestMatches(requestId ?? "", page, perPage),
    queryKey: queryKeys.propertyRequests.matches(
      scope.ownerType,
      requestId ?? "",
      page,
      perPage,
    ),
  });
}
