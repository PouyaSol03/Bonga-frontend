import { getStoredAuthSession } from "../../../shared/auth/auth-storage";
import type { ChatMessage } from "../../chat/api/chat.service";

export function asChatRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

export function readChatText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);

  return "";
}

export function readChatPathText(source: unknown, paths: string[]) {
  for (const path of paths) {
    let current: unknown = source;

    for (const key of path.split(".")) {
      current = asChatRecord(current)?.[key];
    }

    const text = readChatText(current);
    if (text) return text;
  }

  return "";
}

export function formatSupportConversationDate(value: unknown) {
  const text = readChatText(value);
  if (!text) return "";

  let trimmed = text.trim();
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(trimmed)) {
    trimmed = trimmed.replace(" ", "T") + "Z";
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Tehran",
  }).format(date);
}

export function formatSupportMessageTime(value: unknown) {
  const text = readChatText(value);
  if (!text) {
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tehran",
    }).format(new Date());
  }

  let trimmed = text.trim();
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(trimmed)) {
    trimmed = trimmed.replace(" ", "T") + "Z";
  }

  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tehran",
  }).format(date);
}

export function readCurrentAccountUserId() {
  const session = getStoredAuthSession();
  if (session?.userId) {
    return session.userId;
  }

  const token = session?.accessToken;
  if (!token) return "";

  try {
    const [, payload = ""] = token.split(".");
    if (!payload) return "";
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decodedPayload = JSON.parse(window.atob(normalizedPayload)) as {
      sub?: unknown;
      userId?: unknown;
      user_id?: unknown;
    };

    return readChatText(decodedPayload.sub ?? decodedPayload.userId ?? decodedPayload.user_id);
  } catch {
    return "";
  }
}

export function isOwnSupportMessage(
  message: ChatMessage,
  currentUserId: string,
  senderId: string,
) {
  return (
    message.is_mine === true ||
    message.isMine === true ||
    message.from_me === true ||
    message.fromMe === true ||
    (Boolean(currentUserId) && senderId === currentUserId)
  );
}
