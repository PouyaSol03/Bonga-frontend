import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../shared/api/query-client";
import { queryKeys } from "../../../shared/api/query-keys";
import {
  addMyAgencyConsultant,
  cancelMyAgencyConsultantRequest,
  deactivateMyAgencyConsultant,
  getMyAgencyConsultant,
  getMyAgencyConsultants,
  respondToAgencyConsultantRequest,
  updateMyAgencyConsultant,
} from "./agency-consultants.service";

export function useAgencyConsultantQuery({
  agentId,
  enabled = true,
}: {
  agentId?: number | string;
  enabled?: boolean;
}) {
  const numericId = Number(agentId);
  const isValidId =
    agentId !== undefined &&
    String(agentId).trim().length > 0 &&
    (!Number.isFinite(numericId) || numericId > 0);

  return useQuery({
    enabled: enabled && isValidId,
    queryFn: () => getMyAgencyConsultant(agentId as number | string),
    queryKey: queryKeys.agencies.consultant(agentId ?? ""),
  });
}

export function useAgencyConsultantsQuery({
  enabled = true,
  page = 1,
  perPage = 100,
  query,
  status = "all",
}: {
  enabled?: boolean;
  page?: number;
  perPage?: number;
  query?: string;
  status?: "active" | "pending" | "all";
} = {}) {
  return useQuery({
    enabled,
    queryFn: () => getMyAgencyConsultants({ page, perPage, query, status }),
    queryKey: queryKeys.agencies.consultants({ page, perPage, query, status }),
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
