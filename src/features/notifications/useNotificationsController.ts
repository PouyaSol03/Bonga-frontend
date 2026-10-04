import { useCallback, useMemo, useRef, useState } from "react";
import type {
  NotificationCategory,
  NotificationItem,
} from "./api/notification.service";
import {
  useDeleteNotificationMutation,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useNotificationUnreadCountQuery,
  useNotificationsInfiniteQuery,
} from "./api/notification.hooks";
import { useAgencyConsultantRequestDecisionMutation } from "../agencies/api/agency.hooks";
import { notificationFilterOptions, notificationsPerPage } from "./types";
import { useNotificationRealtimeSocket } from "./useNotificationRealtimeSocket";
import { useNotificationActions } from "./useNotificationActions";
import { useNotificationInViewReader } from "./useNotificationInViewReader";

function mergeNotifications(
  realtimeNotifications: NotificationItem[],
  serverNotifications: NotificationItem[],
) {
  const usedIds = new Set<string>();
  const merged: NotificationItem[] = [];

  [...realtimeNotifications, ...serverNotifications].forEach((notification) => {
    const notificationId = String(notification.id);
    if (usedIds.has(notificationId)) return;
    usedIds.add(notificationId);
    merged.push(notification);
  });

  return merged;
}

export function useNotificationsController() {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [markAllUnread, setMarkAllUnread] = useState(false);
  const [realtimeNotifications, setRealtimeNotifications] = useState<
    NotificationItem[]
  >([]);
  const [selectedFilterIds, setSelectedFilterIds] = useState<
    Set<NotificationCategory>
  >(() => new Set());
  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null);

  const notificationsQuery = useNotificationsInfiniteQuery({
    perPage: notificationsPerPage,
  });
  const unreadCountQuery = useNotificationUnreadCountQuery();
  const markReadMutation = useMarkNotificationReadMutation();
  const markAllReadMutation = useMarkAllNotificationsReadMutation();
  const deleteMutation = useDeleteNotificationMutation();
  const agencyRequestDecisionMutation =
    useAgencyConsultantRequestDecisionMutation();

  const serverNotifications = useMemo(
    () => notificationsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    [notificationsQuery.data],
  );

  const notifications = useMemo(
    () => mergeNotifications(realtimeNotifications, serverNotifications),
    [realtimeNotifications, serverNotifications],
  );

  const selectedFilters = useMemo(
    () =>
      notificationFilterOptions.filter((option) =>
        selectedFilterIds.has(option.id),
      ),
    [selectedFilterIds],
  );

  const visibleNotifications = useMemo(() => {
    if (selectedFilterIds.size === 0) return notifications;
    return notifications.filter((notification) =>
      selectedFilterIds.has(notification.category ?? "systems"),
    );
  }, [notifications, selectedFilterIds]);

  const loadMoreSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      loadMoreObserverRef.current?.disconnect();
      loadMoreObserverRef.current = null;
      if (!node || !notificationsQuery.hasNextPage || notificationsQuery.isFetchingNextPage) {
        return;
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0]?.isIntersecting &&
            notificationsQuery.hasNextPage &&
            !notificationsQuery.isFetchingNextPage
          ) {
            void notificationsQuery.fetchNextPage();
          }
        },
        { root: null, rootMargin: "220px 0px", threshold: 0 },
      );
      observer.observe(node);
      loadMoreObserverRef.current = observer;
    },
    [notificationsQuery],
  );

  useNotificationRealtimeSocket({
    onNotificationReceived: (notification) => {
      setRealtimeNotifications((current) => [
        notification,
        ...current.filter((item) => String(item.id) !== String(notification.id)),
      ]);
    },
    onNotificationRead: (payload) => {
      if ("all" in payload && payload.all) {
        setRealtimeNotifications((current) =>
          current.map((notification) =>
            !payload.category || notification.category === payload.category
              ? { ...notification, is_read: true }
              : notification,
          ),
        );
      } else if (payload.notification_id) {
        setRealtimeNotifications((current) =>
          current.map((notification) =>
            String(notification.id) === payload.notification_id
              ? { ...notification, is_read: true }
              : notification,
          ),
        );
      }
    },
    refetchNotifications: () => notificationsQuery.refetch(),
    refetchUnreadCount: () => unreadCountQuery.refetch(),
  });

  const actions = useNotificationActions({
    agencyRequestDecisionMutation,
    deleteMutation,
    markAllReadMutation,
    markReadMutation,
    notifications,
    refetchNotifications: () => notificationsQuery.refetch(),
    refetchUnreadCount: () => unreadCountQuery.refetch(),
    setRealtimeNotifications,
  });

  const { observeNotificationNode } = useNotificationInViewReader({
    setRealtimeNotifications,
  });

  const toggleFilter = (id: NotificationCategory) => {
    setSelectedFilterIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const removeFilter = (id: NotificationCategory) => {
    setSelectedFilterIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  };

  return {
    ...actions,
    deleteMutation,
    isFilterSheetOpen,
    isSettingsSheetOpen,
    loadMoreSentinelRef,
    markAllReadMutation,
    markAllUnread,
    notifications,
    notificationsQuery,
    observeNotificationNode,
    removeFilter,
    selectedFilterIds,
    selectedFilters,
    setIsFilterSheetOpen,
    setIsSettingsSheetOpen,
    setMarkAllUnread,
    toggleFilter,
    visibleNotifications,
  };
}
