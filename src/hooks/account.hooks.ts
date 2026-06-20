import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  authorizeMe,
  deleteAdvertiseBadge,
  deleteAdvertiseNote,
  getAdvertiseBadges,
  getMyAds,
  getMyBadges,
  getMyNotes,
  getMyProfile,
  getWalletPayments,
  saveAdvertiseNote,
  toggleAdvertiseBadge,
  updateMyProfile,
  type AdvertiseBadgesPage,
  type MyAdsType,
} from "../services/account.service";

export function useMyProfileQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    enabled,
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

export function useAdvertiseBadgesQuery({ perPage = 10 }: { perPage?: number } = {}) {
  return useInfiniteQuery<
    AdvertiseBadgesPage,
    Error,
    { pages: AdvertiseBadgesPage[]; pageParams: number[] },
    ReturnType<typeof queryKeys.account.bookmarks>,
    number
  >({
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getAdvertiseBadges({
        page: pageParam,
        perPage,
      }),
    queryKey: queryKeys.account.bookmarks({ perPage }),
  });
}

export function useToggleAdvertiseBadgeMutation() {
  return useMutation({
    mutationFn: toggleAdvertiseBadge,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.bookmarksRoot(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.badges(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.all,
      });
    },
  });
}

export function useDeleteAdvertiseBadgeMutation() {
  return useMutation({
    mutationFn: deleteAdvertiseBadge,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.bookmarksRoot(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.badges(),
      });
    },
  });
}

export function useMyNotesQuery() {
  return useQuery({
    queryFn: getMyNotes,
    queryKey: queryKeys.account.notes(),
  });
}

export function useSaveAdvertiseNoteMutation() {
  return useMutation({
    mutationFn: saveAdvertiseNote,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.notes(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.advertisements.all,
      });
    },
  });
}

export function useDeleteAdvertiseNoteMutation() {
  return useMutation({
    mutationFn: deleteAdvertiseNote,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.notes(),
      });
    },
  });
}
