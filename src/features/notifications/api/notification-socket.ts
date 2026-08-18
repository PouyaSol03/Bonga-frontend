import { io, type Socket } from "socket.io-client";

import { getStoredAccessToken } from "../../../shared/auth/auth-storage";
import type {
  NotificationCategory,
  NotificationItem,
} from "./notification.service";
import { websocketBaseUrl } from "../../../shared/api/api";

export type NotificationNewPayload = {
  notification?: NotificationItem;
  unread_count?: number;
};

export type NotificationReadPayload =
  | {
      all?: false;
      notification_id?: string;
    }
  | {
      all: true;
      category?: NotificationCategory;
    };

type NotificationSocketServerToClientEvents = {
  connect: () => void;
  "notification:error": (payload: { message?: string }) => void;
  "notification:new": (payload: NotificationNewPayload) => void;
  "notification:read": (payload: NotificationReadPayload) => void;
  "notification:unread-count": (payload: { count?: number }) => void;
};

type NotificationSocketClientToServerEvents = {
  "notification:read": (
    payload: { notificationId: string },
    callback?: (response: { notification?: NotificationItem }) => void,
  ) => void;
  "notification:read-all": (
    payload: { category?: NotificationCategory },
    callback?: (response: { affected?: number }) => void,
  ) => void;
  "notification:subscribe": (
    payload: { page?: string; per_page?: string },
    callback?: (response: {
      notifications?: NotificationItem[];
      unread_count?: number;
    }) => void,
  ) => void;
};

export type NotificationSocket = Socket<
  NotificationSocketServerToClientEvents,
  NotificationSocketClientToServerEvents
>;

let notificationSocket: NotificationSocket | null = null;

function getNotificationSocketUrl() {
  const socketBaseUrl =
    websocketBaseUrl ||
    (typeof window !== "undefined" ? window.location.origin : "");

  return `${socketBaseUrl.replace(/\/$/, "")}/notifications`;
}

export function getNotificationSocket() {
  const token = getStoredAccessToken();

  if (!notificationSocket) {
    notificationSocket = io(getNotificationSocketUrl(), {
      auth: {
        token,
      },
      autoConnect: false,
    });
  }

  notificationSocket.auth = { token };

  if (!notificationSocket.connected) {
    notificationSocket.connect();
  }

  return notificationSocket;
}

export function disconnectNotificationSocket() {
  notificationSocket?.disconnect();
}

export function subscribeToNotifications({
  page = 1,
  perPage = 20,
  onSnapshot,
}: {
  onSnapshot?: (payload: {
    notifications?: NotificationItem[];
    unread_count?: number;
  }) => void;
  page?: number;
  perPage?: number;
} = {}) {
  const socket = getNotificationSocket();

  socket.emit(
    "notification:subscribe",
    {
      page: String(page),
      per_page: String(perPage),
    },
    (response) => {
      onSnapshot?.(response);
    },
  );

  return socket;
}
