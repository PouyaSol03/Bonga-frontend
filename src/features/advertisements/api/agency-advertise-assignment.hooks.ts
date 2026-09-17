import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

import { queryClient } from "../../../shared/api/query-client";
import { queryKeys } from "../../../shared/api/query-keys";
import {
  approveAgencyStopRequest,
  cancelStopPublishRequest,
  cancelUserAdvertiseAssignment,
  changeAgencyAdvertiseConsultant,
  confirmUserDealResult,
  createStopPublishRequest,
  getMyAgencyAdvertiseAssignments,
  rejectAgencyAdvertiseAssignment,
  rejectAgencyStopRequest,
  restoreArchivedAdvertise,
  submitAdvertiseDealResult,
  type AgencyAdvertiseAssignmentsPage,
  type AgencyAdvertiseAssignmentsParams,
  type ChangeAgencyAdvertiseConsultantPayload,
} from "./agency-advertise-assignment.service";

export function useAgencyAdvertiseAssignmentsInfiniteQuery({
  advertiseId,
  agencyId,
  consultantId,
  enabled = true,
  perPage = 20,
  status,
  targetType,
}: AgencyAdvertiseAssignmentsParams & { enabled?: boolean } = {}) {
  return useInfiniteQuery<
    AgencyAdvertiseAssignmentsPage,
    Error,
    { pages: AgencyAdvertiseAssignmentsPage[]; pageParams: number[] },
    ReturnType<typeof queryKeys.agencyAdvertiseAssignments.list>,
    number
  >({
    enabled,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getMyAgencyAdvertiseAssignments({
        advertiseId,
        agencyId,
        consultantId,
        page: pageParam,
        perPage,
        status,
        targetType,
      }),
    queryKey: queryKeys.agencyAdvertiseAssignments.list({
      advertiseId,
      agencyId,
      consultantId,
      perPage,
      status,
      targetType,
    }),
  });
}


export function useRejectAgencyAdvertiseAssignmentMutation() {
  return useMutation({
    mutationFn: rejectAgencyAdvertiseAssignment,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.agencyAdvertiseAssignments.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.myAdsRoot(),
      });
    },
  });
}

export function useChangeAgencyAdvertiseConsultantMutation() {
  return useMutation({
    mutationFn: (payload: ChangeAgencyAdvertiseConsultantPayload) =>
      changeAgencyAdvertiseConsultant(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.agencyAdvertiseAssignments.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.myAdsRoot(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.all,
      });
    },
  });
}

export function useCancelUserAssignmentMutation() {
  return useMutation({
    mutationFn: ({ advertiseId, reason }: { advertiseId: string | number; reason?: string }) =>
      cancelUserAdvertiseAssignment(advertiseId, reason),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.myAdsRoot() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.advertisements.all });
    },
  });
}

export function useRestoreArchivedAdMutation() {
  return useMutation({
    mutationFn: (advertiseId: string | number) => restoreArchivedAdvertise(advertiseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.myAdsRoot() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.advertisements.all });
    },
  });
}

export function useCreateStopPublishRequestMutation() {
  return useMutation({
    mutationFn: createStopPublishRequest,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.myAdsRoot() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.advertisements.all });
    },
  });
}

export function useCancelStopPublishRequestMutation() {
  return useMutation({
    mutationFn: (advertiseId: string | number) => cancelStopPublishRequest(advertiseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.myAdsRoot() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.advertisements.all });
    },
  });
}

export function useApproveAgencyStopRequestMutation() {
  return useMutation({
    mutationFn: (payload: string | number | { requestId: string | number; agencyResponse?: string }) =>
      approveAgencyStopRequest(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.myAdsRoot() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.advertisements.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.agencyAdvertiseAssignments.all });
    },
  });
}

export function useRejectAgencyStopRequestMutation() {
  return useMutation({
    mutationFn: (payload: string | number | { requestId: string | number; agencyResponse?: string }) =>
      rejectAgencyStopRequest(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.myAdsRoot() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.advertisements.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.agencyAdvertiseAssignments.all });
    },
  });
}

export function useSubmitAdvertiseDealResultMutation() {
  return useMutation({
    mutationFn: submitAdvertiseDealResult,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.myAdsRoot() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.advertisements.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.agencyAdvertiseAssignments.all });
    },
  });
}

export function useConfirmUserDealResultMutation() {
  return useMutation({
    mutationFn: ({ advertiseId, confirmed }: { advertiseId: string | number; confirmed: boolean }) =>
      confirmUserDealResult(advertiseId, confirmed),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.account.myAdsRoot() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.advertisements.all });
    },
  });
}

