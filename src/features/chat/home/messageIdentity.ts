import { type ChatMessage } from "../api/chat.service";
import {
  readChatMessageAttachment,
  readChatMessageBody,
  readChatMessageLocation,
  readChatMessageType,
} from "./messageContent";
import { readPathText } from "./readChatValues";

export function readChatMessageSenderId(message: ChatMessage) {
  return readPathText(message, [
    "sender_id",
    "senderId",
    "user_id",
    "userId",
    "sender._id",
    "sender.id",
    "user._id",
    "user.id",
    "from._id",
    "from.id",
  ]);
}

export function isOutgoingChatMessage(message: ChatMessage, currentUserId: string) {
  const senderId = readChatMessageSenderId(message);

  return (
    message.is_mine === true ||
    message.isMine === true ||
    message.from_me === true ||
    message.fromMe === true ||
    (Boolean(currentUserId) && senderId === currentUserId)
  );
}

export function isReadChatMessage(message: ChatMessage) {
  return (
    message.is_read === true ||
    message.isRead === true ||
    message.read === true ||
    Boolean(message.read_at ?? message.readAt) ||
    (Array.isArray(message.read_by) && message.read_by.length > 0) ||
    message.status === "read"
  );
}

export function markMessageAsRead(message: ChatMessage) {
  return {
    ...message,
    is_read: true,
    read: true,
  };
}

export function getChatMessageId(message: ChatMessage, index: number) {
  return (
    readPathText(message, ["id", "_id", "messageId", "message_id"]) ||
    `${readChatMessageBody(message)}-${index}`
  );
}

export function getChatMessageDedupeKey(message: ChatMessage) {
  const stableId = readPathText(message, ["id", "_id", "messageId", "message_id"]);

  if (stableId) return `id:${stableId}`;

  return [
    "body",
    readChatMessageBody(message),
    "type",
    readChatMessageType(message),
    "attachment",
    readChatMessageAttachment(message).attachmentUrl,
    "location",
    readChatMessageLocation(message).mapsUrl,
    "time",
    readPathText(message, ["created_at", "createdAt", "date"]),
    "sender",
    readChatMessageSenderId(message),
  ].join(":");
}

export function dedupeChatMessages(messages: ChatMessage[]) {
  const seenKeys = new Set<string>();

  return messages.filter((message) => {
    const key = getChatMessageDedupeKey(message);

    if (seenKeys.has(key)) return false;

    seenKeys.add(key);
    return true;
  });
}
