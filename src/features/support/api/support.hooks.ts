import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/query-client";
import {
  assignPanelSupportRequest,
  listPanelSupportChats,
  listPanelSupportRequests,
  sendPanelSupportRequestMessage,
  updatePanelSupportRequestStatus,
  type PanelSupportRequestFilters,
  type PanelSupportRequestStatus,
} from "./panel-support.service";

const panelSupportKeys = {
  all: ["panel-support"] as const,
  chats: () => [...panelSupportKeys.all, "chats"] as const,
  requests: (filters: PanelSupportRequestFilters) =>
    [...panelSupportKeys.all, "requests", filters] as const,
};

export function usePanelSupportChatsQuery() {
  return useQuery({
    queryFn: listPanelSupportChats,
    queryKey: panelSupportKeys.chats(),
    refetchOnMount: "always",
  });
}

export function usePanelSupportRequestsQuery(filters: PanelSupportRequestFilters) {
  return useQuery({
    queryFn: () => listPanelSupportRequests(filters),
    queryKey: panelSupportKeys.requests(filters),
    refetchOnMount: "always",
  });
}

export function useAssignPanelSupportRequestMutation() {
  return useMutation({
    mutationFn: ({ requestId, supportUserId }: { requestId: string; supportUserId: number }) =>
      assignPanelSupportRequest(requestId, supportUserId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: panelSupportKeys.all });
    },
  });
}

export function useUpdatePanelSupportRequestStatusMutation() {
  return useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: PanelSupportRequestStatus }) =>
      updatePanelSupportRequestStatus(requestId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: panelSupportKeys.all });
    },
  });
}

export function useSendPanelSupportRequestMessageMutation() {
  return useMutation({
    mutationFn: ({ body, requestId }: { body: string; requestId: string }) =>
      sendPanelSupportRequestMessage(requestId, body),
  });
}
