import { getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { readText } from "../../../shared/lib/textUtils";
import { type ChatThread } from "../api/chat.service";

export function getChatRouteThreadId() {
  const [, routeId = ""] = window.location.pathname.match(/^\/chat\/([^/]+)/) ?? [];

  return decodeURIComponent(routeId);
}

export function getChatRouteStateThreadId() {
  const state = window.history.state;

  if (!state || typeof state !== "object") return "";

  const threadId = (state as { threadId?: unknown }).threadId;

  return typeof threadId === "string" || typeof threadId === "number" ? String(threadId) : "";
}

export function getChatRouteStateThread() {
  const state = window.history.state;

  if (!state || typeof state !== "object") return undefined;

  const thread = (state as { thread?: unknown }).thread;

  return thread && typeof thread === "object" && !Array.isArray(thread)
    ? (thread as ChatThread)
    : undefined;
}

export function readCurrentUserId() {
  const session = getStoredAuthSession();
  if (session?.userId) return readText(session.userId);

  const token = session?.accessToken;
  if (!token) return "";

  try {
    const [, payload] = token.split(".");
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

    return readText(decodedPayload.sub ?? decodedPayload.userId ?? decodedPayload.user_id);
  } catch {
    return "";
  }
}

export const createChatMessageId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const CHAT_RENAME_NOTICE_STORAGE_KEY = "bonga-chat-rename-notice";
