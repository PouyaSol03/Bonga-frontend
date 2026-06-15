import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  authorizeMe,
  deleteAdvertiseBadge,
  getMyAds,
  getMyBadges,
  getMyNotes,
  getMyProfile,
  getWalletPayments,
  toggleAdvertiseBadge,
  updateMyProfile,
  type MyAdsType,
} from "../services/account.service";

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

export function useAdvertiseBadgesQuery() {
  return useQuery({
    queryFn: getMyBadges,
    queryKey: queryKeys.account.bookmarks(),
  });
}

export function useToggleAdvertiseBadgeMutation() {
  return useMutation({
    mutationFn: toggleAdvertiseBadge,
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.account.bookmarks(),
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
        queryKey: queryKeys.account.bookmarks(),
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
