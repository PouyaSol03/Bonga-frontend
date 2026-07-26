import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  createAdvertisement,
  getAdvertisementCheckout,
  getAdvertisementDetail,
  getAdvertisementList,
  getAdvertisementMap,
  getAdvertisementPreview,
  getAdvertiseReportReasons,
  submitAdvertisementCheckout,
  submitAdvertiseFeedback,
  submitAdvertiseReport,
  type AdvertisementListParams,
  type AdvertisementMapParams,
  type AdvertisementPage,
  type SubmitAdvertisementCheckoutPayload,
  type SubmitAdvertisementCheckoutResult,
} from "../services/advertisement.service";

export function useAdvertisementInfiniteQuery({
  cityId,
  filters,
  perPage = 10,
}: Pick<AdvertisementListParams, "cityId" | "filters" | "perPage">) {
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
        cityId,
        filters,
        page: pageParam,
        perPage,
      }),
    queryKey: queryKeys.advertisements.list({ cityId, filters, perPage }),
  });
}

export function useAdvertisementListQuery(params: AdvertisementListParams | null) {
  return useQuery({
    enabled: Boolean(params),
    queryFn: () => getAdvertisementList(params as AdvertisementListParams),
    queryKey: queryKeys.advertisements.list({
      cityId: params?.cityId,
      filters: params?.filters,
      perPage: params?.perPage ?? 20,
    }),
    // Cache disabled globally in src/api/query-client.ts.
    // staleTime: 0,
  });
}

export function useAdvertisementDetailQuery(id: string | null) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: () => getAdvertisementDetail(id ?? ""),
    queryKey: queryKeys.advertisements.detail(id ?? ""),
  });
}

export function useAdvertisementPreviewQuery(id: string | null) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: () => getAdvertisementPreview(id ?? ""),
    queryKey: queryKeys.advertisements.preview(id ?? ""),
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
        queryKey: queryKeys.account.myAdsRoot(),
      });
    },
  });
}

export function useAdvertisementCheckoutQuery(advertiseId: string | null) {
  return useQuery({
    enabled: Boolean(advertiseId),
    queryFn: () => getAdvertisementCheckout(advertiseId ?? ""),
    queryKey: queryKeys.advertisements.checkout(advertiseId ?? ""),
    // Cache disabled globally in src/api/query-client.ts.
    // staleTime: 0,
  });
}

export function useSubmitAdvertisementCheckoutMutation() {
  return useMutation({
    mutationFn: submitAdvertisementCheckout,
    onSuccess: (
      _result: SubmitAdvertisementCheckoutResult,
      variables: SubmitAdvertisementCheckoutPayload,
    ) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.checkout(variables.advertiseId),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.myAdsRoot(),
      });
    },
  });
}

export function useAdvertisementMapQuery(params: AdvertisementMapParams | null) {
  return useQuery({
    enabled: Boolean(params),
    // Previous map-result caching is temporarily disabled.
    // gcTime: 2 * 60_000,
    // placeholderData: (previousData) => previousData,
    queryFn: () => getAdvertisementMap(params as AdvertisementMapParams),
    queryKey: queryKeys.advertisements.map(params ?? {}),
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    // staleTime: 15_000,
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
    // Cache disabled globally in src/api/query-client.ts.
    // staleTime: 5 * 60_000,
  });
}

export function useSubmitAdvertiseReportMutation() {
  return useMutation({
    mutationFn: submitAdvertiseReport,
  });
}
