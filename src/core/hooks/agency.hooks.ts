import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  addMyAgencyConsultant,
  deactivateMyAgencyConsultant,
  getMyAgencyConsultant,
  getMyAgencyConsultants,
  getPublicAgencies,
  getPublicTrustedAgencies,
  getPublicAgencyDetail,
  getPublicAgents,
  getPublicAgentDetail,
  respondToAgencyConsultantRequest,
  updateMyAgencyConsultant,
  type AgencySort,
  type PublicAgencyPage,
  type PublicAgentsPage,
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

export function useAddAgencyConsultantMutation() {
  return useMutation({
    mutationFn: addMyAgencyConsultant,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.agencies.all,
      });
    },
  });
}

export function useAgencyConsultantRequestDecisionMutation() {
  return useMutation({
    mutationFn: respondToAgencyConsultantRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.agencies.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.all,
      });
    },
  });
}



export function usePublicAgencyDetailQuery({
  enabled = true,
  id,
}: {
  enabled?: boolean;
  id?: number | string;
}) {
  return useQuery({
    enabled: enabled && id !== undefined && String(id).trim().length > 0,
    queryFn: () => getPublicAgencyDetail(id as number | string),
    queryKey: [...queryKeys.agencies.all, "public-detail", String(id ?? "")],
  });
}

export function usePublicAgentDetailQuery({
  enabled = true,
  id,
}: {
  enabled?: boolean;
  id?: number | string;
}) {
  return useQuery({
    enabled: enabled && id !== undefined && String(id).trim().length > 0,
    queryFn: () => getPublicAgentDetail(id as number | string),
    queryKey: [...queryKeys.agencies.all, "public-agent-detail", String(id ?? "")],
  });
}

export function useTrustedAgenciesQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    enabled,
    queryFn: getPublicTrustedAgencies,
    queryKey: queryKeys.agencies.trusted(),
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

export function usePublicAgentsQuery({
  agencyId,
  enabled = true,
  page = 1,
  perPage = 20,
  search = "",
  sort,
}: {
  agencyId?: number | string;
  enabled?: boolean;
  page?: number;
  perPage?: number;
  search?: string;
  sort?: AgencySort;
} = {}) {
  return useQuery({
    enabled,
    queryFn: () =>
      getPublicAgents({
        agencyId,
        page,
        perPage,
        search,
        sort,
      }),
    queryKey: queryKeys.agencies.publicAgents({
      agencyId,
      page,
      perPage,
      search,
      sort,
    }),
  });
}

export function usePublicAgentsInfiniteQuery({
  agencyId,
  enabled = true,
  perPage = 20,
  search = "",
  sort,
}: {
  agencyId?: number | string;
  enabled?: boolean;
  perPage?: number;
  search?: string;
  sort?: AgencySort;
} = {}) {
  return useInfiniteQuery<
    PublicAgentsPage,
    Error,
    { pages: PublicAgentsPage[]; pageParams: number[] },
    ReturnType<typeof queryKeys.agencies.publicAgents>,
    number
  >({
    enabled,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getPublicAgents({
        agencyId,
        page: pageParam,
        perPage,
        search,
        sort,
      }),
    queryKey: queryKeys.agencies.publicAgents({
      agencyId,
      perPage,
      search,
      sort,
    }),
  });
}
