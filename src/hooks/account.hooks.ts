import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  authorizeMe,
  chargeWallet,
  createMyAgency,
  createMyAgent,
  deleteAdvertiseBadge,
  deleteAdvertiseNote,
  getAccountCreditHistory,
  getAdvertiseBadges,
  getMyAds,
  getMyAgencyProfile,
  getMyBadges,
  getMyNotes,
  getMyProfile,
  getWallet,
  getWalletPayments,
  saveAdvertiseNote,
  toggleAdvertiseBadge,
  updateMyAgencyProfile,
  updateMyProfile,
  verifyPaymentCallback,
  type AccountCreditHistoryPage,
  type AdvertiseBadgesPage,
  type MyAdsPage,
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

export function useMyAgencyProfileQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    enabled,
    queryFn: getMyAgencyProfile,
    queryKey: queryKeys.account.agencyProfile(),
  });
}

export function useUpdateMyAgencyProfileMutation() {
  return useMutation({
    mutationFn: updateMyAgencyProfile,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.agencyProfile(),
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

export function useCreateMyAgencyMutation() {
  return useMutation({
    mutationFn: createMyAgency,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.profile(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.agencyProfile(),
      });
    },
  });
}

export function useCreateMyAgentMutation() {
  return useMutation({
    mutationFn: createMyAgent,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.profile(),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.all,
      });
    },
  });
}

export function useWalletQuery() {
  return useQuery({
    queryFn: getWallet,
    queryKey: queryKeys.account.wallet(),
  });
}

export function useWalletPaymentsQuery(page = 1) {
  return useQuery({
    queryFn: () => getWalletPayments(page),
    queryKey: queryKeys.account.walletPayments(page),
  });
}

export function useAccountCreditHistoryInfiniteQuery({
  perPage = 20,
}: {
  perPage?: number;
} = {}) {
  return useInfiniteQuery<
    AccountCreditHistoryPage,
    Error,
    { pages: AccountCreditHistoryPage[]; pageParams: number[] },
    ReturnType<typeof queryKeys.account.creditHistory>,
    number
  >({
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getAccountCreditHistory({ page: pageParam, perPage }),
    queryKey: queryKeys.account.creditHistory(perPage),
  });
}

export function useChargeWalletMutation() {
  return useMutation({
    mutationFn: chargeWallet,
  });
}

export function useVerifyPaymentCallbackMutation() {
  return useMutation({
    mutationFn: verifyPaymentCallback,
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.all,
      });
    },
  });
}

export function useMyAdsInfiniteQuery({
  perPage = 20,
  type,
}: {
  perPage?: number;
  type: MyAdsType;
}) {
  return useInfiniteQuery<
    MyAdsPage,
    Error,
    { pages: MyAdsPage[]; pageParams: number[] },
    ReturnType<typeof queryKeys.account.myAds>,
    number
  >({
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => getMyAds({ page: pageParam, perPage, type }),
    queryKey: queryKeys.account.myAds({ perPage, type }),
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
