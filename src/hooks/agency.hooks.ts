import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  deactivateMyAgencyConsultant,
  getMyAgencyConsultant,
  getMyAgencyConsultants,
  getPublicAgencies,
  updateMyAgencyConsultant,
  type AgencySort,
  type PublicAgencyPage,
} from "../services/agency.service";

export function useAgencyConsultantQuery({
  enabled = true,
  userId,
}: {
  enabled?: boolean;
  userId?: number | string;
}) {
  return useQuery({
    enabled: enabled && userId !== undefined && String(userId).trim().length > 0,
    queryFn: () => getMyAgencyConsultant(userId as number | string),
    queryKey: queryKeys.agencies.consultant(userId ?? ""),
  });
}

export function useAgencyConsultantsQuery({
  enabled = true,
  page = 1,
  perPage = 100,
}: {
  enabled?: boolean;
  page?: number;
  perPage?: number;
} = {}) {
  return useQuery({
    enabled,
    queryFn: () => getMyAgencyConsultants({ page, perPage }),
    queryKey: queryKeys.agencies.consultants({ page, perPage }),
  });
}

export function useUpdateAgencyConsultantMutation() {
  return useMutation({
    mutationFn: updateMyAgencyConsultant,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.agencies.consultant(variables.userId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.agencies.all,
      });
    },
  });
}

export function useDeactivateAgencyConsultantMutation() {
  return useMutation({
    mutationFn: deactivateMyAgencyConsultant,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.agencies.consultant(variables.userId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.agencies.all,
      });
    },
  });
}

export type AgencyInfiniteQueryParams = {
  enabled?: boolean;
  neighborhoodId?: string;
  perPage?: number;
  search?: string;
  sort?: AgencySort;
};

export function useAgencyInfiniteQuery({
  enabled = true,
  neighborhoodId,
  perPage = 20,
  search = "",
  sort,
}: AgencyInfiniteQueryParams) {
  return useInfiniteQuery<
    PublicAgencyPage,
    Error,
    { pages: PublicAgencyPage[]; pageParams: number[] },
    ReturnType<typeof queryKeys.agencies.list>,
    number
  >({
    enabled,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getPublicAgencies({
        neighborhoodId,
        page: pageParam,
        perPage,
        search,
        sort,
      }),
    queryKey: queryKeys.agencies.list({
      neighborhoodId,
      perPage,
      search,
      sort,
    }),
  });
}
