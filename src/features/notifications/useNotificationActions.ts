import { useState } from "react";
import type { NotificationItem } from "./api/notification.service";
import type {
  useDeleteNotificationMutation,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "./api/notification.hooks";
import type { useAgencyConsultantRequestDecisionMutation } from "../agencies/api/agency.hooks";
import type { AgencyConsultantRequestDecision } from "./types";
import {
  getAgencyConsultantRequestAgentId,
  getNotificationPath,
  navigateTo,
} from "./notificationRouting";

export function useNotificationActions({
  agencyRequestDecisionMutation,
  deleteMutation,
  markAllReadMutation,
  markReadMutation,
  notifications,
  refetchNotifications,
  refetchUnreadCount,
  setRealtimeNotifications,
}: {
  agencyRequestDecisionMutation: ReturnType<
    typeof useAgencyConsultantRequestDecisionMutation
  >;
  deleteMutation: ReturnType<typeof useDeleteNotificationMutation>;
  markAllReadMutation: ReturnType<typeof useMarkAllNotificationsReadMutation>;
  markReadMutation: ReturnType<typeof useMarkNotificationReadMutation>;
  notifications: NotificationItem[];
  refetchNotifications: () => Promise<unknown>;
  refetchUnreadCount: () => Promise<unknown>;
  setRealtimeNotifications: React.Dispatch<
    React.SetStateAction<NotificationItem[]>
  >;
}) {
  const [isClearingRead, setIsClearingRead] = useState(false);
  const [agencyRequestActionNotificationId, setAgencyRequestActionNotificationId] =
    useState<string | null>(null);
  const [agencyRequestDecisions, setAgencyRequestDecisions] = useState<
    Record<string, AgencyConsultantRequestDecision>
  >({});

  const refreshNotifications = async () => {
    setRealtimeNotifications([]);
    await Promise.all([refetchNotifications(), refetchUnreadCount()]);
  };

  const openNotification = async (notification: NotificationItem) => {
    if (!notification.is_read) {
      setRealtimeNotifications((current) =>
        current.map((item) =>
          String(item.id) === String(notification.id)
            ? { ...item, is_read: true }
            : item,
        ),
      );
      try {
        await markReadMutation.mutateAsync(String(notification.id));
      } catch {
        void refetchNotifications();
        void refetchUnreadCount();
      }
    }

    const path = getNotificationPath(notification);
    if (path) navigateTo(path);
  };

  const handleAgencyConsultantRequestDecision = async (
    notification: NotificationItem,
    decision: AgencyConsultantRequestDecision,
  ) => {
    const notificationId = String(notification.id);
    const agentId = getAgencyConsultantRequestAgentId(notification);
    if (!agentId) return;

    setAgencyRequestActionNotificationId(notificationId);
    try {
      await agencyRequestDecisionMutation.mutateAsync({
        agentId,
        decision,
      });
      setAgencyRequestDecisions((current) => ({
        ...current,
        [notificationId]: decision,
      }));
      setRealtimeNotifications((current) =>
        current.map((item) =>
          String(item.id) === notificationId ? { ...item, is_read: true } : item,
        ),
      );
    } finally {
      setAgencyRequestActionNotificationId(null);
    }
  };

  const markAllRead = async () => {
    try {
      await markAllReadMutation.mutateAsync(undefined);
      setRealtimeNotifications((current) =>
        current.map((item) => ({ ...item, is_read: true })),
      );
      await refetchNotifications();
    } catch {
      void refetchNotifications();
    }
  };

  const clearReadNotifications = async () => {
    const readNotificationIds = notifications
      .filter((notification) => notification.is_read)
      .map((notification) => String(notification.id));
    if (readNotificationIds.length === 0) return;

    setIsClearingRead(true);
    try {
      for (const notificationId of readNotificationIds) {
        await deleteMutation.mutateAsync(notificationId);
      }
      setRealtimeNotifications((current) =>
        current.filter((notification) => notification.is_read === false),
      );
      await refetchNotifications();
    } catch {
      void refetchNotifications();
    } finally {
      setIsClearingRead(false);
    }
  };

  return {
    agencyRequestActionNotificationId,
    agencyRequestDecisions,
    clearReadNotifications,
    handleAgencyConsultantRequestDecision,
    isClearingRead,
    openNotification,
    refreshNotifications,
    markAllRead,
  };
}
