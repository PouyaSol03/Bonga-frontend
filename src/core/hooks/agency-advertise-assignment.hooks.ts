import { useInfiniteQuery, useMutation } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  getMyAgencyAdvertiseAssignments,
  rejectAgencyAdvertiseAssignment,
  type AgencyAdvertiseAssignmentsPage,
  type AgencyAdvertiseAssignmentsParams,
} from "../services/agency-advertise-assignment.service";

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
