import type { ChatMessage, ChatThread } from "../../chat/api/chat.service";
import type { SupportChatMessage } from "./types";
import {
  asChatRecord,
  formatSupportMessageTime,
  isOwnSupportMessage,
  readChatPathText,
} from "./supportChatFormatters";

export * from "./supportChatFormatters";

export function readSupportThreadId(source: unknown) {
  return readChatPathText(source, [
    "thread_id",
    "threadId",
    "thread.id",
    "thread._id",
    "id",
    "_id",
  ]);
}

export function isOpenSupportThread(thread: ChatThread) {
  const record = asChatRecord(thread);
  const status = readChatPathText(thread, ["status", "state"]).toLowerCase();
  const closedAt = readChatPathText(thread, ["closed_at", "closedAt"]);
  const isClosed = record?.is_closed === true || record?.closed === true;

  return !isClosed && !closedAt && !["closed", "resolved", "done", "finished"].includes(status);
}

export function readSupportMessageThreadId(source: unknown) {
  return readChatPathText(source, [
    "threadId",
    "thread_id",
    "chatId",
    "chat_id",
    "thread.id",
    "thread._id",
    "chat.id",
    "chat._id",
    "message.threadId",
    "message.thread_id",
    "message.chatId",
    "message.chat_id",
  ]);
}

export function readSupportMessageBody(message: ChatMessage) {
  return readChatPathText(message, [
    "body",
    "text",
    "content",
    "description",
    "message",
    "message.body",
    "message.text",
    "data.body",
    "data.text",
    "data.message",
  ]);
}

export function readSupportMessageSenderId(message: ChatMessage) {
  return readChatPathText(message, [
    "sender_id",
    "senderId",
    "user_id",
    "userId",
    "sender.id",
    "sender._id",
    "user.id",
    "user._id",
  ]);
}

export function mapAccountSupportMessage(
  message: ChatMessage,
  index: number,
  currentUserId: string,
  threadId: string,
): SupportChatMessage | null {
  const metadata = asChatRecord(message.metadata);
  const attachmentUrl = readChatPathText(metadata, ["attachment_url", "attachmentUrl", "url"]);
  const fileName = readChatPathText(metadata, ["file_name", "fileName", "name"]);
  const mimeType = readChatPathText(metadata, ["mime_type", "mimeType"]);
  const rawType = readChatPathText(message, ["type"]).toLowerCase();
  const type: SupportChatMessage["type"] = attachmentUrl
    ? rawType === "image" || mimeType.startsWith("image/")
      ? "image"
      : "file"
    : "text";
  const text =
    readSupportMessageBody(message) || (attachmentUrl ? fileName || "فایل پیوست‌شده" : "");
  if (!text && !attachmentUrl) return null;
  const senderId = readSupportMessageSenderId(message);
  const isOwn = isOwnSupportMessage(message, currentUserId, senderId);

  return {
    attachmentUrl: attachmentUrl || undefined,
    direction: isOwn ? "outgoing" : "incoming",
    fileName: fileName || undefined,
    id:
      readChatPathText(message, ["id", "_id", "messageId", "message_id"]) ||
      `api-${threadId}-${index}-${text || attachmentUrl}`,
    mimeType: mimeType || undefined,
    sender: isOwn ? undefined : "پشتیبانی",
    text,
    threadId,
    time: formatSupportMessageTime(
      readChatPathText(message, ["sent_at", "sentAt", "created_at", "createdAt", "date"]),
    ),
    type,
  };
}

export function readSocketSupportMessage(payload: unknown) {
  const payloadRecord = asChatRecord(payload);
  const message = asChatRecord(payloadRecord?.message) ?? payloadRecord;

  return message as ChatMessage | undefined;
}

export function mergeSupportChatMessages(messages: SupportChatMessage[]) {
  const seenIds = new Set<string>();
  const seenContent = new Set<string>();

  return messages.filter((message) => {
    if (seenIds.has(message.id)) return false;

    const contentKey = `${message.threadId}:${message.direction}:${message.type}:${message.text}:${message.attachmentUrl ?? ""}:${message.time}`;
    if (seenContent.has(contentKey)) return false;

    seenIds.add(message.id);
    seenContent.add(contentKey);
    return true;
  });
}
