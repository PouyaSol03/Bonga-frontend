import type { NotificationItem } from "./api/notification.service";
import {
  getActiveAuthRole,
  getStoredAuthSession,
} from "../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../shared/constants/roles.constants";

export { getNotificationActionLabel } from "./notificationActionLabels";

export function readRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function getAgencyConsultantRequestAgentId(notification: NotificationItem) {
  const payload = notification.payload ?? {};
  const nestedAgent = readRecord(payload.agent);

  return readPayloadId(
    payload.agent_id ??
      payload.agentId ??
      nestedAgent?.id ??
      notification.agent_id ??
      notification.agentId,
  );
}

export function readPayloadId(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" && !Number.isNaN(value)) return String(value);
  return "";
}

export function formatNotificationTime(value?: string): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const dateKey = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tehran",
    year: "numeric",
  }).format(date);
  const todayKey = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tehran",
    year: "numeric",
  }).format(now);
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayKey = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tehran",
    year: "numeric",
  }).format(yesterday);
  const time = new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tehran",
  }).format(date);

  if (dateKey === todayKey) return `امروز ${time}`;
  if (dateKey === yesterdayKey) return `دیروز ${time}`;

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Tehran",
    year: "numeric",
  }).format(date);
}

const AD_MANAGED_AD_ROLES = [REAL_ESTATE_MANAGER, REAL_ESTATE_CONSULTANT, INDEPENDENT_CONSULTANT];

function getAdvertiseStatePath(advertiseId: string) {
  const role = getActiveAuthRole(getStoredAuthSession()) ?? "";
  const base = AD_MANAGED_AD_ROLES.includes(role) ? "/account/manage-ads" : "/account/my-ads";
  return `${base}/${encodeURIComponent(advertiseId)}/state-ad`;
}

export function getNotificationPath(notification: NotificationItem): string {
  const payload = notification.payload ?? {};
  const target = typeof payload.target === "string" ? payload.target : "";

  switch (target) {
    case "advertise": {
      const advertiseId = readPayloadId(payload.advertise_id);
      return advertiseId ? getAdvertiseStatePath(advertiseId) : "/account/manage-ads";
    }

    case "chat": {
      const threadId = readPayloadId(payload.chat_thread_id);
      return threadId ? `/chat/${threadId}` : "/chat";
    }

    case "payment":
      return "/account/wallet/history";

    case "agency":
      return "/account/dashboard/agency";

    case "support": {
      const threadId = readPayloadId(payload.chat_thread_id);
      if (threadId) {
        return `/account/support/chat/new?thread_id=${encodeURIComponent(threadId)}`;
      }
      return "/account/support/requests";
    }

    case "identity":
    case "verification":
      return "/account/identity";

    case "profile":
      return "/account/profile";

    case "request":
      return payload.support_ticket_id ? "/account/support/requests" : "/account/requests";

    case "trade":
      return "/account/manage-ads";

    case "system":
      return "/notifications/settings";
  }

  const threadId = readPayloadId(payload.chat_thread_id);
  if (threadId) {
    return `/chat/${threadId}`;
  }

  const advertiseId = readPayloadId(payload.advertise_id);
  if (advertiseId) {
    return getAdvertiseStatePath(advertiseId);
  }

  if (
    notification.title?.includes("احراز هویت") ||
    notification.description?.includes("احراز هویت")
  ) {
    return "/account/identity";
  }

  return "";
}
