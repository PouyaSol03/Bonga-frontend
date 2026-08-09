import { api } from "../api/api";

export type NotificationCategory =
  | "advertise"
  | "chats"
  | "requests"
  | "trades"
  | "systems"
  | "support";

export type NotificationPayload = Record<string, unknown> & {
  advertise_id?: number | string;
  agent_id?: number | string;
  agentId?: number | string;
  agency_id?: number | string;
  agency_name?: string;
  agencyName?: string;
  chat_thread_id?: number | string;
  message_id?: number | string;
  payment_id?: number | string;
  request_id?: number | string;
  support_ticket_id?: number | string;
  target?: string;
  trade_id?: number | string;
};

export type NotificationItem = Record<string, unknown> & {
  _id?: string;
  category?: NotificationCategory;
  created_at?: string;
  description?: string;
  id: number | string;
  is_read?: boolean;
  payload?: NotificationPayload | null;
  read_at?: string | null;
  title?: string;
  type?: string;
};

export type NotificationPreference = {
  category: NotificationCategory;
  enabled: boolean;
};

export type NotificationsPageResult = {
  data: NotificationItem[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

export type NotificationListFilters = {
  category?: NotificationCategory;
  includeDisabled?: boolean;
  page?: number;
  perPage?: number;
  read?: boolean;
  type?: string;
};

type NotificationsResponse =
  | {
      data?: NotificationItem[];
      notifications?: NotificationItem[];
      page?: number;
      per_page?: number;
      status?: boolean;
      total?: number;
    }
  | NotificationItem[];

type UnreadCountResponse = {
  count?: number;
  data?: { count?: number } | number;
  status?: boolean;
};

type PreferencesResponse =
  | {
      data?: NotificationPreference[];
      preferences?: NotificationPreference[];
      status?: boolean;
    }
  | NotificationPreference[];

type NotificationResponse =
  | {
      data?: NotificationItem;
      notification?: NotificationItem;
      status?: boolean;
    }
  | NotificationItem;

function normalizeNotification(notification: NotificationItem) {
  const id =
    typeof notification.id === "string"
      ? notification.id
      : typeof notification.id === "number"
        ? String(notification.id)
        : typeof notification._id === "string"
          ? notification._id
          : "";

  return {
    ...notification,
    id,
  };
}

function readNotifications(response: NotificationsResponse) {
  if (Array.isArray(response)) return response.map(normalizeNotification);
  if (Array.isArray(response.data)) return response.data.map(normalizeNotification);
  if (Array.isArray(response.notifications)) {
    return response.notifications.map(normalizeNotification);
  }

  return [];
}

function readNotification(response: NotificationResponse) {
  if ("notification" in response && response.notification) {
    return normalizeNotification(response.notification as NotificationItem);
  }

  if ("data" in response && response.data) {
    return normalizeNotification(response.data as NotificationItem);
  }

  return normalizeNotification(response as NotificationItem);
}

function readPreferences(response: PreferencesResponse) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.preferences)) return response.preferences;

  return [];
}

export async function getNotifications({
  category,
  includeDisabled,
  page = 1,
  perPage = 20,
  read,
  type,
}: NotificationListFilters = {}): Promise<NotificationsPageResult> {
  const response = await api
    .get("notifications", {
      searchParams: {
        category,
        include_disabled: includeDisabled,
        page,
        per_page: perPage,
        read,
        type,
      },
    })
    .json<NotificationsResponse>();
  const record = Array.isArray(response) ? {} : response;
  const data = readNotifications(response);
  const currentPage = typeof record.page === "number" ? record.page : page;
  const resolvedPerPage = typeof record.per_page === "number" ? record.per_page : perPage;
  const total = typeof record.total === "number" ? record.total : data.length;

  return {
    data,
    hasNextPage: currentPage * resolvedPerPage < total,
    page: currentPage,
    perPage: resolvedPerPage,
    total,
  };
}

export async function getNotificationUnreadCount(category?: NotificationCategory) {
  const response = await api
    .get("notifications/unread-count", {
      searchParams: {
        category,
      },
    })
    .json<UnreadCountResponse>();

  if (typeof response.count === "number") return response.count;
  if (typeof response.data === "number") return response.data;
  if (response.data && typeof response.data.count === "number") {
    return response.data.count;
  }

  return 0;
}

export async function getNotificationPreferences() {
  const response = await api
    .get("notifications/preferences")
    .json<PreferencesResponse>();

  return readPreferences(response);
}

export async function updateNotificationPreference({
  category,
  enabled,
}: {
  category: NotificationCategory;
  enabled: boolean;
}) {
  const response = await api
    .patch(`notifications/preferences/${category}`, {
      json: {
        enabled,
      },
    })
    .json<{
      data?: NotificationPreference;
      preference?: NotificationPreference;
      status?: boolean;
    } | NotificationPreference>();

  if ("data" in response && response.data) return response.data;
  if ("preference" in response && response.preference) return response.preference;

  return response as NotificationPreference;
}

export async function markNotificationRead(notificationId: string) {
  const response = await api
    .patch(`notifications/${notificationId}/read`)
    .json<NotificationResponse>();

  return readNotification(response);
}

export function markAllNotificationsRead(category?: NotificationCategory) {
  return api
    .patch("notifications/read-all", {
      searchParams: {
        category,
      },
    })
    .json<{ affected?: number; status?: boolean }>();
}

export async function deleteNotification(notificationId: string) {
  await api.delete(`notifications/${encodeURIComponent(notificationId)}`, {
    context: { allowNonJsonResponse: true },
  });

  return notificationId;
}
