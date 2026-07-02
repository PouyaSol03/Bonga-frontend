import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  deleteNotification,
  getNotificationPreferences,
  getNotificationUnreadCount,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationPreference,
  type NotificationCategory,
  type NotificationListFilters,
  type NotificationsPageResult,
} from "../services/notification.service";

export function useNotificationsInfiniteQuery({
  category,
  includeDisabled = false,
  perPage = 20,
  read,
  type,
}: Omit<NotificationListFilters, "page"> = {}) {
  return useInfiniteQuery<
    NotificationsPageResult,
    Error,
    { pages: NotificationsPageResult[]; pageParams: number[] },
    ReturnType<typeof queryKeys.notifications.list>,
    number
  >({
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getNotifications({
        category,
        includeDisabled,
        page: pageParam,
        perPage,
        read,
        type,
      }),
    queryKey: queryKeys.notifications.list({
      category,
      includeDisabled,
      perPage,
      read,
      type,
    }),
  });
}

export function useNotificationUnreadCountQuery({
  category,
  enabled = true,
}: {
  category?: NotificationCategory;
  enabled?: boolean;
} = {}) {
  return useQuery({
    enabled,
    queryFn: () => getNotificationUnreadCount(category),
    queryKey: queryKeys.notifications.unreadCount(category),
  });
}

export function useNotificationPreferencesQuery() {
  return useQuery({
    queryFn: getNotificationPreferences,
    queryKey: queryKeys.notifications.preferences(),
  });
}

function invalidateNotifications() {
  void queryClient.invalidateQueries({
    queryKey: queryKeys.notifications.all,
  });
}

export function useMarkNotificationReadMutation() {
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: invalidateNotifications,
  });
}

export function useMarkAllNotificationsReadMutation() {
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: invalidateNotifications,
  });
}

export function useDeleteNotificationMutation() {
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: invalidateNotifications,
  });
}

export function useUpdateNotificationPreferenceMutation() {
  return useMutation({
    mutationFn: updateNotificationPreference,
    onSuccess: invalidateNotifications,
  });
}
