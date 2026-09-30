import { useEffect } from "react";
import type { NotificationItem } from "./api/notification.service";
import {
  disconnectNotificationSocket,
  subscribeToNotifications,
  type NotificationReadPayload,
} from "./api/notification-socket";
import { queryClient } from "../../shared/api/query-client";
import { queryKeys } from "../../shared/api/query-keys";
import { notificationsPerPage } from "./types";

export function useNotificationRealtimeSocket({
  onNotificationRead,
  onNotificationReceived,
  refetchNotifications,
  refetchUnreadCount,
}: {
  onNotificationRead: (payload: NotificationReadPayload) => void;
  onNotificationReceived: (notification: NotificationItem) => void;
  refetchNotifications: () => Promise<unknown>;
  refetchUnreadCount: () => Promise<unknown>;
}) {
  useEffect(() => {
    const socket = subscribeToNotifications({
      onSnapshot: (snapshot) => {
        if (typeof snapshot.unread_count === "number") {
          void refetchUnreadCount();
        }
      },
      perPage: notificationsPerPage,
    });

    const handleNewNotification = ({
      notification,
      unread_count: nextUnreadCount,
    }: {
      notification?: NotificationItem;
      unread_count?: number;
    }) => {
      if (notification) {
        onNotificationReceived(notification);
      }
      if (typeof nextUnreadCount === "number") {
        void refetchUnreadCount();
      }
    };

    const handleUnreadCount = ({ count }: { count?: number }) => {
      if (typeof count === "number") {
        void refetchUnreadCount();
      }
    };

    const handleRead = (payload: NotificationReadPayload) => {
      onNotificationRead(payload);
      void queryClient.invalidateQueries({
        queryKey: queryKeys.notifications.all,
      });
    };

    const handleConnect = () => {
      void refetchNotifications();
      void refetchUnreadCount();
    };

    const handleSocketError = ({
      message: socketMessage,
    }: {
      message?: string;
    }) => {
      if (import.meta.env.DEV) {
        console.error(socketMessage || "اتصال اعلان‌ها با خطا مواجه شد");
      }
    };

    socket.on("connect", handleConnect);
    socket.on("notification:new", handleNewNotification);
    socket.on("notification:unread-count", handleUnreadCount);
    socket.on("notification:read", handleRead);
    socket.on("notification:error", handleSocketError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("notification:new", handleNewNotification);
      socket.off("notification:unread-count", handleUnreadCount);
      socket.off("notification:read", handleRead);
      socket.off("notification:error", handleSocketError);
      disconnectNotificationSocket();
    };
  }, [
    onNotificationRead,
    onNotificationReceived,
    refetchNotifications,
    refetchUnreadCount,
  ]);
}
