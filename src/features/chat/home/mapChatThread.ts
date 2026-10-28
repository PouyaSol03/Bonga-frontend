import { type ChatThread } from "../api/chat.service";
import { formatChatDate } from "./chatDates";
import {
  readNumber,
  readPathBoolean,
  readPathRecord,
  readPathString,
  readPathText,
  readString,
} from "./readChatValues";
import { readAdvertiseFormTitle, readChatThreadId, readImageUrl } from "./threadMetadata";
import { type ChatItem } from "./types";

export function mapChatThreadToChatItem(chat: ChatThread, index: number): ChatItem {
  const ad = readPathRecord(chat, ["ad", "advertise", "advertisement", "property"]) ?? {};
  const lastMessage = readPathRecord(chat, ["last_message", "lastMessage", "message"]);
  const user =
    readPathRecord(chat, [
      "user",
      "sender",
      "receiver",
      "participant",
      "customer",
      "consultant",
      "last_message.user",
    ]) ?? {};
  const id = readChatThreadId(chat) || String(index + 1);
  const unreadCount = readNumber(chat.unread_count ?? chat.unreadCount ?? chat.messages_count);
  const apiAdLabel = readPathText(chat, ["ad_label", "adLabel"]);
  const isMine =
    readPathBoolean(chat, [
      "is_mine",
      "isMine",
      "mine",
      "ad.is_mine",
      "ad.isMine",
      "advertise.is_mine",
      "advertise.isMine",
      "advertisement.is_mine",
      "advertisement.isMine",
      "property.is_mine",
      "property.isMine",
    ]) === true || apiAdLabel.includes("آگهی من");

  return {
    adCategory:
      readAdvertiseFormTitle(ad) ||
      readPathText(chat, [
        "form_title",
        "formTitle",
        "advertise.form_title",
        "advertise.form.title",
        "ad.form_title",
        "ad.form.title",
      ]),
    adLabel: apiAdLabel || (isMine ? "آگهی من" : ""),
    adTitle:
      readPathText(chat, ["ad_title", "adTitle"]) ||
      readPathText(ad, ["title", "label", "name"]) ||
      (readPathText(chat, ["category"]) === "agency_support" ? "پشتیبانی آژانس" : "جزئیات ملک"),
    badgeCount:
      unreadCount && unreadCount > 0
        ? new Intl.NumberFormat("fa-IR").format(unreadCount)
        : undefined,
    category:
      readPathText(chat, ["category"]) === "support"
        ? "support"
        : readPathText(chat, ["category"]) === "agency_support"
          ? "agency_support"
          : "advertise",
    date: formatChatDate(
      readPathText(lastMessage, ["sent_at", "sentAt", "created_at", "createdAt", "date"]) ||
        readPathText(chat, [
          "last_message_at",
          "lastMessageAt",
          "updated_at",
          "updatedAt",
          "created_at",
          "createdAt",
        ]),
    ),
    detailPath: `/chat/${id}`,
    detailState: { thread: chat, threadId: id },
    highlighted: unreadCount !== undefined && unreadCount > 0,
    id,
    imageUrl: readImageUrl(ad) ?? readImageUrl(chat),
    isBlocked: chat.is_blocked === true || chat.isBlocked === true || chat.blocked === true,
    message:
      readPathString(lastMessage, [
        "body",
        "text",
        "content",
        "description",
        "message",
        "message.body",
        "message.text",
        "message.content",
        "data.body",
        "data.text",
        "data.message",
      ]) ||
      readPathString(chat, [
        "last_message.body",
        "last_message.text",
        "last_message.content",
        "last_message.message",
        "lastMessage.body",
        "lastMessage.text",
        "lastMessage.content",
        "lastMessage.message",
        "message.body",
        "message.text",
        "message.content",
      ]) ||
      readString(chat.message) ||
      readString(chat.last_message) ||
      "",
    userName:
      readPathText(user, [
        "showing_name",
        "showingName",
        "full_name",
        "fullName",
        "name",
        "username",
        "mobile",
        "phone",
      ]) ||
      readPathText(chat, [
        "participant.showing_name",
        "participant.showingName",
        "participant.full_name",
        "participant.fullName",
        "user_name",
        "userName",
        "full_name",
        "fullName",
        "name",
      ]) ||
      "کاربر",
  };
}
