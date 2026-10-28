import { readText } from "../../../shared/lib/textUtils";
import { type ChatMessage } from "../api/chat.service";
import { readPathText } from "./readChatValues";

export function parseChatDate(value: unknown): Date | null {
  const text = readText(value);
  if (!text) return null;

  let trimmed = text.trim();
  if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(trimmed)) {
    trimmed = trimmed.replace(" ", "T") + "Z";
  }

  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatChatMessageTime(value?: unknown) {
  const text = readText(value);
  if (!text) {
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tehran",
    }).format(new Date());
  }

  const date = parseChatDate(text);
  if (!date) return text;

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tehran",
  }).format(date);
}

export function readChatMessageTime(message: ChatMessage) {
  const text = readPathText(message, ["sent_at", "sentAt", "created_at", "createdAt", "date"]);

  if (!text) return undefined;

  const date = parseChatDate(text);

  if (!date) return text;

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tehran",
  }).format(date);
}

export function formatChatDate(value: unknown) {
  const text = readText(value);

  if (!text) return "";

  const date = parseChatDate(text);

  if (!date) return text;

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Tehran",
  }).format(date);
}
