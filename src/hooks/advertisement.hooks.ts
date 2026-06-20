import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  createAdvertisement,
  getAdvertisementDetail,
  getAdvertisementList,
  getAdvertisementMap,
  getAdvertiseReportReasons,
  submitAdvertiseFeedback,
  submitAdvertiseReport,
  type AdvertisementListParams,
  type AdvertisementMapParams,
  type AdvertisementPage,
} from "../services/advertisement.service";

export function useAdvertisementInfiniteQuery({
  categoryId,
  cityId,
  perPage = 10,
}: Pick<AdvertisementListParams, "categoryId" | "cityId" | "perPage">) {
  return useInfiniteQuery<
    AdvertisementPage,
    Error,
    { pages: AdvertisementPage[]; pageParams: number[] },
    ReturnType<typeof queryKeys.advertisements.list>,
    number
  >({
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getAdvertisementList({
        categoryId,
        cityId,
        page: pageParam,
        perPage,
      }),
    queryKey: queryKeys.advertisements.list({ categoryId, cityId, perPage }),
  });
}

export function useAdvertisementDetailQuery(id: string | null) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: () => getAdvertisementDetail(id ?? ""),
    queryKey: queryKeys.advertisements.detail(id ?? ""),
  });
}

export function useCreateAdvertisementMutation() {
  return useMutation({
    mutationFn: createAdvertisement,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.myAds({ page: 1, type: "all" }),
      });
    },
  });
}

export function useAdvertisementMapQuery(params: AdvertisementMapParams | null) {
  return useQuery({
    enabled: Boolean(params),
    gcTime: 0,
    queryFn: () => getAdvertisementMap(params as AdvertisementMapParams),
    queryKey: queryKeys.advertisements.map(params ?? {}),
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    staleTime: 0,
  });
}

export function useSubmitAdvertiseFeedbackMutation() {
  return useMutation({
    mutationFn: submitAdvertiseFeedback,
  });
}

export function useAdvertiseReportReasonsQuery(enabled: boolean) {
  return useQuery({
    enabled,
    queryFn: getAdvertiseReportReasons,
    queryKey: queryKeys.advertisements.reportReasons(),
    staleTime: 5 * 60_000,
  });
}

export function useSubmitAdvertiseReportMutation() {
  return useMutation({
    mutationFn: submitAdvertiseReport,
  });
}
