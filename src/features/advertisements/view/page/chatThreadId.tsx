import type { ChatThread } from "../../../chat/api/chat.service";

export function getChatThreadId(thread: ChatThread) {
  const value = thread.id ?? thread._id;

  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value.trim();

  return "";
}
