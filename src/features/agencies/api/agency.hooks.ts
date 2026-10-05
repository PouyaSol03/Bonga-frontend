import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/query-client";
import { queryKeys } from "../../../shared/api/query-keys";
import {
  addMyAgencyConsultant,
  cancelMyAgencyConsultantRequest,
  deactivateMyAgencyConsultant,
  getMyAgencyConsultant,
  getMyAgencyConsultants,
  getMyAgencyConsultantActivities,
  getMyAgencyConsultantActivityStats,
  getMyAgencyConsultantActivityFeed,
  getMyAgencyConsultantAdvertisements,
  getMyAgencyConsultantCharts,
  getMyAgencyConsultantPublishedAdsMetric,
  getMyAgencyConsultantRenewalUsageMetric,
  getMyAgencyConsultantSpecialUsageMetric,
  getPublicAgencies,
  getPublicTrustedAgencies,
  getPublicAgencyDetail,
  getPublicAgents,
  getPublicAgentDetail,
  respondToAgencyConsultantRequest,
  updateMyAgencyConsultant,
  type AgencySort,
  type ConsultantActivitiesParams,
  type ConsultantAdvertisementsParams,
  type ConsultantMetricParams,
  type PublicAgencyPage,
  type PublicAgentsPage,
} from "./agency.service";

export function useAgencyConsultantQuery({
  agentId,
  enabled = true,
}: {
  agentId?: number | string;
  enabled?: boolean;
}) {
  return useQuery({
    enabled: enabled && agentId !== undefined && String(agentId).trim().length > 0,
    queryFn: () => getMyAgencyConsultant(agentId as number | string),
    queryKey: queryKeys.agencies.consultant(agentId ?? ""),
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

export function useAgencyConsultantAdvertisementsQuery({
  agentId,
  enabled = true,
  page = 1,
  perPage = 15,
  status = "active",
}: ConsultantAdvertisementsParams & { enabled?: boolean }) {
  return useQuery({
    enabled:
      enabled &&
      agentId !== undefined &&
      String(agentId).trim().length > 0 &&
      String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantAdvertisements({ agentId, page, perPage, status }),
    queryKey: queryKeys.agencies.consultantAdvertisements(agentId, {
      page,
      perPage,
      status,
    }),
  });
}

export function useAgencyConsultantActivitiesQuery({
  agentId,
  enabled = true,
  page = 1,
  perPage = 20,
  period = "week",
  type = "all",
}: ConsultantActivitiesParams & { enabled?: boolean }) {
  return useQuery({
    enabled:
      enabled &&
      agentId !== undefined &&
      String(agentId).trim().length > 0 &&
      String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantActivities({
        agentId,
        page,
        perPage,
        period,
        type,
      }),
    queryKey: queryKeys.agencies.consultantActivities(agentId, {
      page,
      perPage,
      period,
      type,
    }),
  });
}

export function useAgencyConsultantActivityStatsQuery({
  agentId,
  enabled = true,
  period = "week",
}: {
  agentId: number | string;
  enabled?: boolean;
  period?: "week" | "month" | "year";
}) {
  return useQuery({
    enabled:
      enabled &&
      agentId !== undefined &&
      String(agentId).trim().length > 0 &&
      String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantActivityStats({
        agentId,
        period,
      }),
    queryKey: queryKeys.agencies.consultantActivityStats(agentId, period),
  });
}

export function useAgencyConsultantActivityFeedQuery({
  agentId,
  enabled = true,
  page = 1,
  perPage = 20,
  period = "week",
  type = "all",
}: ConsultantActivitiesParams & { enabled?: boolean }) {
  return useQuery({
    enabled:
      enabled &&
      agentId !== undefined &&
      String(agentId).trim().length > 0 &&
      String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantActivityFeed({
        agentId,
        page,
        perPage,
        period,
        type,
      }),
    queryKey: queryKeys.agencies.consultantActivityFeed(agentId, {
      page,
      perPage,
      period,
      type,
    }),
  });
}

export function useAgencyConsultantChartsQuery({
  agentId,
  enabled = true,
  period = "month",
}: {
  agentId?: number | string;
  enabled?: boolean;
  period?: "month" | "year";
}) {
  return useQuery({
    enabled:
      enabled &&
      agentId !== undefined &&
      String(agentId).trim().length > 0 &&
      String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantCharts({
        agentId: agentId as number | string,
        period,
      }),
    queryKey: queryKeys.agencies.consultantCharts(agentId ?? "", period),
  });
}

export function useAgencyConsultantPublishedAdsMetricQuery({
  agentId,
  period = "month",
  from,
  to,
  enabled = true,
}: ConsultantMetricParams & { enabled?: boolean }) {
  return useQuery({
    enabled: enabled && Boolean(agentId) && String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantPublishedAdsMetric({ agentId, period, from, to }),
    queryKey: queryKeys.agencies.consultantMetricPublishedAds(agentId, {
      period,
      from,
      to,
    }),
  });
}

export function useAgencyConsultantRenewalUsageMetricQuery({
  agentId,
  period = "month",
  from,
  to,
  enabled = true,
}: ConsultantMetricParams & { enabled?: boolean }) {
  return useQuery({
    enabled: enabled && Boolean(agentId) && String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantRenewalUsageMetric({ agentId, period, from, to }),
    queryKey: queryKeys.agencies.consultantMetricRenewalUsage(agentId, {
      period,
      from,
      to,
    }),
  });
}

export function useAgencyConsultantSpecialUsageMetricQuery({
  agentId,
  period = "month",
  from,
  to,
  enabled = true,
}: ConsultantMetricParams & { enabled?: boolean }) {
  return useQuery({
    enabled: enabled && Boolean(agentId) && String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantSpecialUsageMetric({ agentId, period, from, to }),
    queryKey: queryKeys.agencies.consultantMetricSpecialUsage(agentId, {
      period,
      from,
      to,
    }),
  });
}

export function useUpdateAgencyConsultantMutation() {
  return useMutation({
    mutationFn: updateMyAgencyConsultant,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.agencies.consultant(variables.agentId),
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
        queryKey: queryKeys.agencies.consultant(variables.agentId),
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


export function useCancelAgencyConsultantRequestMutation() {
  return useMutation({
    mutationFn: cancelMyAgencyConsultantRequest,
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
