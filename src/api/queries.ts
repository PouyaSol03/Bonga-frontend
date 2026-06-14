import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import {
  authorizeMe,
  getMyAds,
  getMyBadges,
  getMyNotes,
  getMyProfile,
  getWalletPayments,
  updateMyProfile,
  type MyAdsType,
} from "./accountApi";
import {
  getAdvertisementById,
  getAdvertisementList,
  type AdvertisementPage,
  type AdvertisementListParams,
} from "./advertiseApi";
import { getCategoryList } from "./CategoryApi";
import { getCityList, getMostVisitedCityList } from "./cityApi";
import { queryClient } from "./queryClient";
import { queryKeys } from "./queryKeys";

export function useCategoryListQuery() {
  return useQuery({
    queryFn: getCategoryList,
    queryKey: queryKeys.categories.list(),
  });
}

export function useCityListQuery(options?: { enabled?: boolean }) {
  return useQuery({
    enabled: options?.enabled ?? true,
    queryFn: getCityList,
    queryKey: queryKeys.cities.list(),
  });
}

export function useMostVisitedCityListQuery() {
  return useQuery({
    queryFn: getMostVisitedCityList,
    queryKey: queryKeys.cities.mostVisited(),
    staleTime: 1000 * 60 * 15,
  });
}

export function useMyProfileQuery() {
  return useQuery({
    queryFn: getMyProfile,
    queryKey: queryKeys.account.profile(),
  });
}

export function useUpdateMyProfileMutation() {
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.profile(),
      });
    },
  });
}

export function useAuthorizeMeMutation() {
  return useMutation({
    mutationFn: authorizeMe,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.profile(),
      });
    },
  });
}

export function useWalletPaymentsQuery() {
  return useQuery({
    queryFn: getWalletPayments,
    queryKey: queryKeys.account.walletPayments(),
  });
}

export function useMyAdsQuery({ page = 1, type }: { page?: number; type: MyAdsType }) {
  return useQuery({
    queryFn: () => getMyAds({ page, type }),
    queryKey: queryKeys.account.myAds({ page, type }),
  });
}

export function useMyBadgesQuery() {
  return useQuery({
    queryFn: getMyBadges,
    queryKey: queryKeys.account.badges(),
  });
}

export function useMyNotesQuery() {
  return useQuery({
    queryFn: getMyNotes,
    queryKey: queryKeys.account.notes(),
  });
}

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
    queryFn: () => getAdvertisementById(id ?? ""),
    queryKey: queryKeys.advertisements.detail(id ?? ""),
  });
}
