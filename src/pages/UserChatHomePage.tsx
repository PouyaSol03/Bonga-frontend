import { memo, type ComponentType, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getApiAssetUrl, getApiErrorMessage } from "../api/api";
import {
  joinChatThread,
  leaveChatThread,
  markChatRead,
  sendChatImageMessage,
  sendChatLocationMessage,
  sendChatTextMessage,
  sendChatTyping,
} from "../api/chat-socket";
import { BottomSheet, BottomSheetActionList } from "../components/BottomSheet";
import { Button } from "../components/ui/Button";
import { TransientNotice } from "../components/TransientNotice";
import { getRequestErrorState } from "../components/ErrorState";
import { HorizontalFilterBar } from "../components/HorizontalFilterBar";
import { SearchEmptyState } from "../components/SearchEmptyState";
import {
  useBlockChatMutation,
  useChatAvailabilityQuery,
  useChatEntryQuery,
  useChatMessagesQuery,
  useChatShowingNameQuery,
  useChatsQuery,
  useDeleteChatMutation,
  useDeleteChatsMutation,
  useUnblockChatMutation,
  useUpdateChatAvailabilityMutation,
  useUpdateChatShowingNameMutation,
} from "../hooks/chat.hooks";
import { useTransientNotice } from "../hooks/useTransientNotice";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { TopBar } from "../components/TopBar";
import { PageFrame } from "../app/PageFrame";
import { TopBarNavigationLayout } from "../app/TopBarNavigationLayout";
import NavHomeIcon from "../components/(icons)/NavHomeIcon";
import { RouteLink } from "../routes/RouteLink";
import { getBrowserLocation, getBrowserLocationNotice } from "../lib/browserLocation";
import { getStoredAuthSession } from "../auth/auth-storage";
import LinearSupport from "../components/(icons)/LinearSupport";
import {
  uploadChatAttachment,
  type ChatAvailability,
  type ChatDayOfWeek,
  type ChatFilter,
  type ChatMessage,
  type ChatThread,
} from "../services/chat.service";
import { Typography } from "../components/ui/Typography";

type ChatItem = {
  adCategory: string;
  adLabel: string;
  adTitle: string;
  badgeCount?: string;
  category?: "advertise" | "support";
  date: string;
  detailPath?: string;
  detailState?: { thread?: ChatThread; threadId: string };
  highlighted?: boolean;
  id?: string;
  imageUrl?: string;
  isBlocked?: boolean;
  message: string;
  userName: string;
};

type SentChatMessage =
  | { id: string; type: "text"; text: string }
  | { id: string; type: "image"; imageUrl: string; attachmentUrl: string; fileName: string }
  | { id: string; type: "location"; latitude: number; longitude: number; mapsUrl: string };

const createChatMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

function getChatRouteThreadId() {
  const [, routeId = ""] = window.location.pathname.match(/^\/chat\/([^/]+)/) ?? [];

  return decodeURIComponent(routeId);
}

function getChatRouteStateThreadId() {
  const state = window.history.state;

  if (!state || typeof state !== "object") return "";

  const threadId = (state as { threadId?: unknown }).threadId;

  return typeof threadId === "string" || typeof threadId === "number"
    ? String(threadId)
    : "";
}

function getChatRouteStateThread() {
  const state = window.history.state;

  if (!state || typeof state !== "object") return undefined;

  const thread = (state as { thread?: unknown }).thread;

  return thread && typeof thread === "object" && !Array.isArray(thread)
    ? (thread as ChatThread)
    : undefined;
}

const filters: Array<{ label: string; value: ChatFilter }> = [
  { label: "خوانده نشده", value: "not_read" },
  { label: "آگهی‌های من", value: "my_ads" },
  { label: "آگهی‌های دیگران", value: "others_ads" },
];

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function readText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return "";
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value : "";
}

function readNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function readBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (value === 1 || value === "1" || value === "true") return true;
  if (value === 0 || value === "0" || value === "false") return false;

  return undefined;
}

function readPathText(source: unknown, paths: string[]) {
  for (const path of paths) {
    let current: unknown = source;

    for (const key of path.split(".")) {
      current = asRecord(current)?.[key];
    }

    const text = readText(current);

    if (text) return text;
  }

  return "";
}

function readPathString(source: unknown, paths: string[]) {
  for (const path of paths) {
    let current: unknown = source;

    for (const key of path.split(".")) {
      current = asRecord(current)?.[key];
    }

    const text = readString(current);

    if (text) return text;
  }

  return "";
}

function readPathRecord(source: unknown, paths: string[]) {
  for (const path of paths) {
    let current: unknown = source;

    for (const key of path.split(".")) {
      current = asRecord(current)?.[key];
    }

    const record = asRecord(current);

    if (record) return record;
  }

  return undefined;
}

function readPathBoolean(source: unknown, paths: string[]) {
  for (const path of paths) {
    let current: unknown = source;

    for (const key of path.split(".")) {
      current = asRecord(current)?.[key];
    }

    const value = readBoolean(current);

    if (value !== undefined) return value;
  }

  return undefined;
}

function readAdvertiseFormTitle(source: unknown) {
  return readPathText(source, [
    "form_title",
    "formTitle",
    "form.title",
    "form.name",
    "category_name",
    "categoryName",
    "category.title",
    "category.name",
  ]);
}

function readChatThreadId(source: unknown) {
  return readPathText(source, [
    "thread_id",
    "threadId",
    "thread.id",
    "thread._id",
    "id",
    "_id",
  ]);
}

function readChatMessageBody(message: ChatMessage) {
  return (
    readPathString(message, [
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
      "payload.body",
      "payload.text",
      "payload.message",
    ]) ||
    ""
  );
}

function readChatMessageType(message: ChatMessage) {
  return readPathText(message, [
    "type",
    "message.type",
    "data.type",
    "payload.type",
  ]).toLowerCase();
}

function readChatMessageAttachment(message: ChatMessage) {
  const attachmentUrl = readPathText(message, [
    "metadata.attachment_url",
    "metadata.attachmentUrl",
    "attachment_url",
    "attachmentUrl",
    "message.metadata.attachment_url",
    "data.metadata.attachment_url",
    "payload.metadata.attachment_url",
  ]);
  const fileName = readPathText(message, [
    "metadata.file_name",
    "metadata.fileName",
    "file_name",
    "fileName",
    "message.metadata.file_name",
    "data.metadata.file_name",
    "payload.metadata.file_name",
  ]);

  return {
    attachmentUrl,
    fileName: fileName || "تصویر ارسالی",
    imageUrl: attachmentUrl
      ? (/^https?:\/\//i.test(attachmentUrl)
        ? attachmentUrl
        : getApiAssetUrl(attachmentUrl))
      : "",
  };
}

function readChatMessageLocation(message: ChatMessage) {
  const latitude = readNumber(
    readPathText(message, [
      "metadata.lat",
      "metadata.latitude",
      "lat",
      "latitude",
      "message.metadata.lat",
      "data.metadata.lat",
      "payload.metadata.lat",
    ]),
  );
  const longitude = readNumber(
    readPathText(message, [
      "metadata.lng",
      "metadata.longitude",
      "lng",
      "longitude",
      "message.metadata.lng",
      "data.metadata.lng",
      "payload.metadata.lng",
    ]),
  );

  return {
    latitude,
    longitude,
    mapsUrl:
      latitude !== undefined && longitude !== undefined
        ? `https://www.google.com/maps?q=${latitude},${longitude}`
        : "",
  };
}

function readChatMessageTime(message: ChatMessage) {
  const text = readPathText(message, ["sent_at", "sentAt", "created_at", "createdAt", "date"]);

  if (!text) return undefined;

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function readCurrentUserId() {
  const token = getStoredAuthSession()?.accessToken;

  if (!token) return "";

  try {
    const [, payload] = token.split(".");
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

function readChatMessageSenderId(message: ChatMessage) {
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

function isOutgoingChatMessage(message: ChatMessage, currentUserId: string) {
  const senderId = readChatMessageSenderId(message);

  return (
    message.is_mine === true ||
    message.isMine === true ||
    message.from_me === true ||
    message.fromMe === true ||
    (Boolean(currentUserId) && senderId === currentUserId)
  );
}

function isReadChatMessage(message: ChatMessage) {
  return (
    message.is_read === true ||
    message.isRead === true ||
    message.read === true ||
    Boolean(message.read_at ?? message.readAt) ||
    (Array.isArray(message.read_by) && message.read_by.length > 0) ||
    message.status === "read"
  );
}

function markMessageAsRead(message: ChatMessage) {
  return {
    ...message,
    is_read: true,
    read: true,
  };
}

function getChatMessageId(message: ChatMessage, index: number) {
  return (
    readPathText(message, ["id", "_id", "messageId", "message_id"]) ||
    `${readChatMessageBody(message)}-${index}`
  );
}

function getChatMessageDedupeKey(message: ChatMessage) {
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

function dedupeChatMessages(messages: ChatMessage[]) {
  const seenKeys = new Set<string>();

  return messages.filter((message) => {
    const key = getChatMessageDedupeKey(message);

    if (seenKeys.has(key)) return false;

    seenKeys.add(key);
    return true;
  });
}

function readImageUrl(source: unknown) {
  const directImage = readPathText(source, ["image", "image_url", "thumbnail", "cover"]);

  if (directImage) return /^https?:\/\//i.test(directImage) ? directImage : getApiAssetUrl(directImage);

  const images = asRecord(source)?.images;

  if (Array.isArray(images)) {
    for (const image of images) {
      const imageUrl =
        typeof image === "string"
          ? image
          : readPathText(image, ["url", "path", "image", "thumbnail"]);

      if (imageUrl) return /^https?:\/\//i.test(imageUrl) ? imageUrl : getApiAssetUrl(imageUrl);
    }
  }

  return undefined;
}

function formatChatDate(value: unknown) {
  const text = readText(value);

  if (!text) return "";

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Tehran",
  }).format(date);
}

function mapChatThreadToChatItem(chat: ChatThread, index: number): ChatItem {
  const ad =
    readPathRecord(chat, ["ad", "advertise", "advertisement", "property"]) ?? {};
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
  const unreadCount = readNumber(
    chat.unread_count ?? chat.unreadCount ?? chat.messages_count,
  );
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
    ]) === true ||
    apiAdLabel.includes("آگهی من");

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
      "جزئیات ملک",
    badgeCount: unreadCount && unreadCount > 0 ? new Intl.NumberFormat("fa-IR").format(unreadCount) : undefined,
    category: readPathText(chat, ["category"]) === "support" ? "support" : "advertise",
    date: formatChatDate(
      readPathText(lastMessage, ["sent_at", "sentAt", "created_at", "createdAt", "date"]) ||
      readPathText(chat, ["last_message_at", "lastMessageAt", "updated_at", "updatedAt", "created_at", "createdAt"]),
    ),
    detailPath: `/chat/${id}`,
    detailState: { thread: chat, threadId: id },
    highlighted: unreadCount !== undefined && unreadCount > 0,
    id,
    imageUrl: readImageUrl(ad) ?? readImageUrl(chat),
    isBlocked:
      chat.is_blocked === true ||
      chat.isBlocked === true ||
      chat.blocked === true,
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
      readPathText(user, ["showing_name", "showingName", "full_name", "fullName", "name", "username", "mobile", "phone"]) ||
      readPathText(chat, ["participant.showing_name", "participant.showingName", "participant.full_name", "participant.fullName", "user_name", "userName", "full_name", "fullName", "name"]) ||
      "کاربر",
  };
}

function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m16.2 16.2 3.8 3.8" />
    </svg>
  );
}

function MoreVerticalIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M11.9919 12.0004H12.0009M11.9829 6H11.9919M11.9921 18H12.001" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function BlockedIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M5.7 5.7 18.3 18.3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 18 18"
    >
      <path d="m5.1 9.1 2.3 2.3 5.5-5.5" />
    </svg>
  );
}

function ChevronLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m15 6-6 6 6 6" />
    </svg>
  );
}

function ChevronRightIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ArrowDownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}


function LinkChainIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12.0864 5.86813L13.6409 4.31357C15.358 2.59645 18.1034 2.55778 19.7728 4.22721C21.4422 5.8966 21.4036 8.64196 19.6864 10.3591L10.3591 19.6865C8.64198 21.4035 5.89659 21.4422 4.22719 19.7728C2.55777 18.1034 2.59647 15.358 4.31356 13.6409L7.81132 10.1432C8.88451 9.06998 10.6004 9.04581 11.6437 10.0892C12.6871 11.1326 12.663 12.8484 11.5898 13.9216L9.64657 15.8648" stroke="#808080" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function SendMessageIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="M10.6 13.4 13.4 10.6" />
      <path d="M10.6 13.4 3.70058 11.8502C2.82251 11.6506 2.74934 10.4279 3.59735 10.125L17.7955 5.05425C18.5106 4.79885 19.2011 5.48933 18.9458 6.20445L13.875 20.4026C13.5721 21.2506 12.3494 21.1775 12.1498 20.2994L10.6 13.4Z" />
    </svg>
  );
}

function CameraIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M8 6.5V7.25C8.32097 7.25 8.60636 7.04575 8.70991 6.74194L8 6.5ZM8.64487 4.6078L9.35478 4.84974L9.35549 4.84762L8.64487 4.6078ZM15.3551 4.6078L14.6445 4.84761L14.6452 4.84974L15.3551 4.6078ZM16 6.5L15.2901 6.74195C15.3936 7.04575 15.679 7.25 16 7.25V6.5ZM15.1526 13.7778H14.4026C14.4026 15.0728 13.3366 16.1389 12.0013 16.1389V16.8889V17.6389C14.1469 17.6389 15.9026 15.9192 15.9026 13.7778H15.1526ZM12.0013 16.8889V16.1389C10.666 16.1389 9.6 15.0727 9.6 13.7778H8.85H8.1C8.1 15.9193 9.85584 17.6389 12.0013 17.6389V16.8889ZM8.85 13.7778H9.6C9.6 12.4828 10.666 11.4167 12.0013 11.4167V10.6667V9.91667C9.85584 9.91667 8.1 11.6363 8.1 13.7778H8.85ZM12.0013 10.6667V11.4167C13.3366 11.4167 14.4026 12.4828 14.4026 13.7778H15.1526H15.9026C15.9026 11.6363 14.1469 9.91667 12.0013 9.91667V10.6667ZM5 6.5V7.25H8V6.5V5.75H5V6.5ZM8 6.5L8.70991 6.74194L9.35478 4.84973L8.64487 4.6078L7.93497 4.36586L7.29009 6.25806L8 6.5ZM8.64487 4.6078L9.35549 4.84762C9.37352 4.79422 9.42814 4.75 9.49868 4.75V4V3.25C8.79446 3.25 8.16122 3.69544 7.93425 4.36797L8.64487 4.6078ZM9.49868 4V4.75H14.5013V4V3.25H9.49868V4ZM14.5013 4V4.75C14.5719 4.75 14.6265 4.79422 14.6445 4.84761L15.3551 4.6078L16.0657 4.36798C15.8388 3.69544 15.2056 3.25 14.5013 3.25V4ZM15.3551 4.6078L14.6452 4.84974L15.2901 6.74195L16 6.5L16.7099 6.25805L16.065 4.36585L15.3551 4.6078ZM16 6.5V7.25H19V6.5V5.75H16V6.5ZM19 6.5V7.25C19.2525 7.25 19.5717 7.38504 19.843 7.65585C20.1141 7.92646 20.25 8.24527 20.25 8.5H21H21.75C21.75 7.75473 21.3829 7.07354 20.9026 6.59415C20.4225 6.11496 19.7416 5.75 19 5.75V6.5ZM21 8.5H20.25V18H21H21.75V8.5H21ZM21 18H20.25C20.25 18.2561 20.1144 18.5749 19.8447 18.8447C19.5749 19.1144 19.2561 19.25 19 19.25V20V20.75C19.7439 20.75 20.4251 20.3856 20.9053 19.9053C21.3856 19.4251 21.75 18.7439 21.75 18H21ZM19 20V19.25H5V20V20.75H19V20ZM5 20V19.25C4.74392 19.25 4.42507 19.1144 4.15533 18.8447C3.88559 18.5749 3.75 18.2561 3.75 18H3H2.25C2.25 18.7439 2.61441 19.4251 3.09467 19.9053C3.57493 20.3856 4.25608 20.75 5 20.75V20ZM3 18H3.75V8.5H3H2.25V18H3ZM3 8.5H3.75C3.75 8.24527 3.88587 7.92647 4.15702 7.65585C4.42836 7.38503 4.74751 7.25 5 7.25V6.5V5.75C4.25838 5.75 3.57752 6.11497 3.0974 6.59415C2.61707 7.07353 2.25 7.75473 2.25 8.5H3Z" fill="#4D4D4D" />
    </svg>
  );
}

function AlbumIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M17.4 6.6H19.2C20.1941 6.6 21 7.40589 21 8.4V19.2C21 20.1941 20.1941 21 19.2 21H8.4C7.40589 21 6.6 20.1941 6.6 19.2V17.4M3 11.2066C3.55712 11.1358 4.12036 11.1009 4.68454 11.1021C7.07129 11.058 9.39958 11.7087 11.254 12.9382C12.9738 14.0785 14.1822 15.6477 14.7 17.4M12.8998 7.5H12.9079M17.4 15.6V4.8C17.4 3.80589 16.5941 3 15.6 3H4.8C3.80589 3 3 3.80589 3 4.8V15.6C3 16.5941 3.80589 17.4 4.8 17.4H15.6C16.5941 17.4 17.4 16.5941 17.4 15.6Z" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function MapLocationIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M20.25 10.3569C20.25 10.7711 20.5858 11.1069 21 11.1069C21.4142 11.1069 21.75 10.7711 21.75 10.3569H21H20.25ZM8.78367 3.16801L9.08452 2.481L9.08451 2.481L8.78367 3.16801ZM8.02665 3.19075L8.36787 3.85863L8.36788 3.85862L8.02665 3.19075ZM3.49751 5.50466L3.83872 6.17255L3.83873 6.17254L3.49751 5.50466ZM4.18461 18.2299L4.42637 18.9399L4.42642 18.9399L4.18461 18.2299ZM10.7992 18.6635C11.1786 18.8297 11.6209 18.6568 11.787 18.2773C11.9532 17.8979 11.7803 17.4556 11.4008 17.2895L11.1 17.9765L10.7992 18.6635ZM13.95 9.89707C13.95 10.3113 14.2858 10.6471 14.7 10.6471C15.1142 10.6471 15.45 10.3113 15.45 9.89707H14.7H13.95ZM16.988 20.7987L17.5771 20.3345L17.5771 20.3345L16.988 20.7987ZM17.8263 20.8093L18.407 21.2839L18.4071 21.2838L17.8263 20.8093ZM17.4 15.1245C16.9858 15.1245 16.65 15.4603 16.65 15.8745C16.65 16.2887 16.9858 16.6245 17.4 16.6245V15.8745V15.1245ZM17.4081 16.6245C17.8223 16.6245 18.1581 16.2887 18.1581 15.8745C18.1581 15.4603 17.8223 15.1245 17.4081 15.1245V15.8745V16.6245ZM21 10.3569H21.75V6.67844H21H20.25V10.3569H21ZM21 6.67844H21.75C21.75 5.77167 21.0265 5.00883 20.1 5.00883V5.75883V6.50883C20.1677 6.50883 20.25 6.56944 20.25 6.67844H21ZM20.1 5.75883V5.00883H14.7V5.75883V6.50883H20.1V5.75883ZM14.7 5.75883L15.0008 5.07181L9.08452 2.481L8.78367 3.16801L8.48282 3.85503L14.3991 6.44584L14.7 5.75883ZM8.78367 3.16801L9.08451 2.481C8.63489 2.28411 8.12231 2.29965 7.68542 2.52287L8.02665 3.19075L8.36788 3.85862C8.40456 3.83989 8.44578 3.83881 8.48283 3.85503L8.78367 3.16801ZM8.02665 3.19075L7.68543 2.52286L3.15629 4.83677L3.49751 5.50466L3.83873 6.17254L8.36787 3.85863L8.02665 3.19075ZM3.49751 5.50466L3.1563 4.83677C2.59503 5.12351 2.25 5.7033 2.25 6.32718H3H3.75C3.75 6.25441 3.79017 6.19735 3.83872 6.17255L3.49751 5.50466ZM3 6.32718H2.25V17.3575H3H3.75V6.32718H3ZM3 17.3575H2.25C2.25 18.4758 3.33522 19.3115 4.42637 18.9399L4.18461 18.2299L3.94284 17.52C3.86844 17.5453 3.75 17.4945 3.75 17.3575H3ZM4.18461 18.2299L4.42642 18.9399L8.64181 17.5041L8.4 16.7941L8.15819 16.0842L3.94279 17.52L4.18461 18.2299ZM8.4 16.7941L8.09915 17.4812L10.7992 18.6635L11.1 17.9765L11.4008 17.2895L8.70085 16.1071L8.4 16.7941ZM8.4 3H7.65V16.7941H8.4H9.15V3H8.4ZM14.7 5.75883H13.95V9.89707H14.7H15.45V5.75883H14.7ZM17.4 12.1961V11.4461C14.9754 11.4461 13.05 13.4679 13.05 15.9117H13.8H14.55C14.55 14.2513 15.8482 12.9461 17.4 12.9461V12.1961ZM13.8 15.9117H13.05C13.05 17.2717 13.6639 18.2727 14.3647 19.0898C14.7091 19.4913 15.0936 19.8697 15.4406 20.2186C15.7973 20.577 16.1219 20.9114 16.3989 21.2629L16.988 20.7987L17.5771 20.3345C17.2406 19.9075 16.8601 19.5185 16.504 19.1606C16.1383 18.7931 15.8025 18.4621 15.5032 18.1132C14.9167 17.4295 14.55 16.7655 14.55 15.9117H13.8ZM16.988 20.7987L16.3989 21.2628C16.8983 21.8967 17.8865 21.9207 18.407 21.2839L17.8263 20.8093L17.2456 20.3346C17.2998 20.2684 17.3698 20.2494 17.4158 20.25C17.4613 20.2506 17.5269 20.2708 17.5771 20.3345L16.988 20.7987ZM17.8263 20.8093L18.4071 21.2838C18.6936 20.9333 19.0236 20.5959 19.3828 20.2315C19.7335 19.8758 20.1143 19.4921 20.4565 19.0829C21.1486 18.2553 21.75 17.2461 21.75 15.9117H21H20.25C20.25 16.7479 19.8886 17.4239 19.3059 18.1206C19.0106 18.4736 18.676 18.8119 18.3146 19.1784C17.9618 19.5363 17.5831 19.9216 17.2456 20.3347L17.8263 20.8093ZM21 15.9117H21.75C21.75 13.4679 19.8246 11.4461 17.4 11.4461V12.1961V12.9461C18.9518 12.9461 20.25 14.2513 20.25 15.9117H21ZM17.4 15.8745V16.6245H17.4081V15.8745V15.1245H17.4V15.8745Z" fill="#4D4D4D" />
    </svg>
  );
}

function DoubleTickIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.7"
      viewBox="0 0 24 24"
    >
      <path d="m3.5 12.5 3.5 3.5 7-8" />
      <path d="m11 15.5 1 1 8-9" />
    </svg>
  );
}

function ClockAlarmIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <path d="M8 2.75 3.75 6.2" />
      <path d="M16 2.75 20.25 6.2" />
      <path d="M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" />
      <path d="M12 8.5V12l2.5 2.2" />
      <path d="m7.5 20.5-1.4 1.4" />
      <path d="m16.5 20.5 1.4 1.4" />
    </svg>
  );
}

function TrashIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M18.6667 6.15L17.879 19.3089C17.8221 20.2589 17.0445 21 16.1044 21H7.89552C6.95545 21 6.17787 20.2589 6.121 19.3089L5.33333 6.15M4 6.15H8.44444M8.44444 6.15L9.54689 3.54547C9.68696 3.21456 10.0083 3 10.3639 3H13.6361C13.9916 3 14.3131 3.21456 14.4531 3.54547L15.5556 6.15M8.44444 6.15H15.5556M20 6.15H15.5556M9.77778 16.05V10.65M14.2222 16.05V10.65" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

function InfoIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V11.5M12 8.01172V8.00172M21 15.3971V8.60294C21 8.35168 20.9001 8.11071 20.7225 7.93305L16.067 3.27747C15.8893 3.09981 15.6483 3 15.3971 3H8.60294C8.35168 3 8.11071 3.09981 7.93305 3.27747L3.27747 7.93305C3.09981 8.11071 3 8.35168 3 8.60294V15.3971C3 15.6483 3.09981 15.8893 3.27747 16.067L7.93305 20.7225C8.11071 20.9001 8.35168 21 8.60294 21H15.3971C15.6483 21 15.8893 20.9001 16.067 20.7225L20.7225 16.067C20.9001 15.8893 21 15.6483 21 15.3971Z" stroke="#4D4D4D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}

const ChatHeader = memo(function ChatHeader({
  onOpenMenu,
  onOpenSearch,
}: {
  onOpenMenu: () => void;
  onOpenSearch: () => void;
}) {
  return (
    <TopBar
      actions={[
        {
          icon: <MoreVerticalIcon />,
          id: "more",
          label: "گزینه‌های بیشتر",
          onClick: onOpenMenu,
        },
        {
          icon: <SearchIcon className="h-6 w-6" />,
          id: "search",
          label: "جستجو در چت‌ها",
          onClick: onOpenSearch,
        },
      ]}
      backTo="/home"
      title="چت"
    />
  );
});

const ChatSearchHeader = memo(function ChatSearchHeader({
  onClose,
  onQueryChange,
  query,
}: {
  onClose: () => void;
  onQueryChange: (value: string) => void;
  query: string;
}) {
  return (
    <TopBar
      centerSlot={
        <input
          aria-label="جستجو در گفتگوها"
          autoFocus
          className="h-10 w-full appearance-none border-0 bg-transparent p-0 text-right text-base font-medium leading-6 text-[#1a1a1a] caret-[#0048c4] outline-none placeholder:text-[#808080]"
          inputMode="search"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="جستجو"
          type="search"
          value={query}
        />
      }
      className="bg-[#f0f0f0]"
      onBack={onClose}
    />
  );
});

const FilterTabs = memo(function FilterTabs({
  activeFilter,
  onSelect,
}: {
  activeFilter: ChatFilter | null;
  onSelect: (filter: ChatFilter) => void;
}) {
  return (
    <HorizontalFilterBar
      ariaLabel="فیلتر چت‌ها"
      className="h-[52px] bg-[#f0f0f0]"
      contentClassName="h-9"
    >
      {filters.map((filter) => (
        <Button unstyled
          aria-pressed={activeFilter === filter.value}
          className={`flex shrink-0 items-center justify-center rounded-lg border p-2 text-sm! font-medium! focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${activeFilter === filter.value
            ? "border-[#0048c4] bg-[#0048c414] text-[#0048c4]"
            : "border-[#cccccc] bg-white text-[#4d4d4d]"
            }`}
          key={filter.value}
          onClick={() => onSelect(filter.value)}
          type="button"
        >
          {filter.label}
        </Button>
      ))}
    </HorizontalFilterBar>
  );
});

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <Button unstyled
      aria-pressed={checked}
      className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] ${checked ? "bg-[#0048c4]" : "bg-[#cccccc]"
        }`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      <Typography as="span" variant="body" size="medium" weight="regular"
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "right-[22px]" : "right-0.5"
          }`}
      />
    </Button>
  );
}

function ChatMenuRow({
  children,
  compact = false,
  icon,
  onClick,
  trailing,
}: {
  children: ReactNode;
  compact?: boolean;
  icon?: ReactNode;
  onClick?: () => void;
  trailing?: ReactNode;
}) {
  const content = (
    <>
      {icon ? (
        <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-6 w-6 shrink-0 place-items-center text-[#4d4d4d]">
          {icon}
        </Typography>
      ) : null}
      <Typography as="span" variant="body" size="large" weight="regular" className="min-w-0 flex-1 text-base font-normal leading-6">
        {children}
      </Typography>
      {trailing ? <Typography as="span" variant="body" size="medium" weight="regular" className="grid shrink-0 place-items-center">{trailing}</Typography> : null}
    </>
  );

  const className = `flex ${compact ? "h-14" : "h-[72px]"} w-full items-center gap-3 bg-white px-4 text-right text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]`;

  if (!onClick) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Button unstyled className={className} onClick={onClick} type="button">
      {content}
    </Button>
  );
}

function ChatMenuDivider() {
  return (
    <div className="px-4">
      <div className="h-px bg-[#f0f0f0]" />
    </div>
  );
}

function ChatMenuBottomSheet({
  isOpen,
  onClose,
  onShowBlockedChange,
  onShowMyAdsChange,
  onSelect,
  showBlocked,
  showMyAds,
}: {
  isOpen: boolean;
  onClose: () => void;
  onShowBlockedChange: (checked: boolean) => void;
  onShowMyAdsChange: (checked: boolean) => void;
  onSelect: (id: string) => void;
  showBlocked: boolean;
  showMyAds: boolean;
}) {
  return (
    <BottomSheet
      ariaLabel="مدیریت چت"
      className="rounded-t-[18px]"
      contentClassName="mt-1"
      heightClassName="h-[448px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      scrimClassName="bg-[#1a1a1a]/60"
      showHeader={false}
    >
      <ChatMenuRow
        compact
        icon={<ChevronRightIcon className="h-6 w-6" />}
        onClick={onClose}
      >
        <strong className="font-semibold">مدیریت چت</strong>
      </ChatMenuRow>
      <ChatMenuRow
        icon={<ClockAlarmIcon className="h-6 w-6" />}
        onClick={() => onSelect("hours")}
      >
        ساعات پاسخگویی
      </ChatMenuRow>
      <ChatMenuDivider />
      <ChatMenuRow
        icon={<TrashIcon className="h-6 w-6" />}
        onClick={() => onSelect("rename")}
      >
        تغییر نام چت
      </ChatMenuRow>
      <ChatMenuDivider />
      <ChatMenuRow
        trailing={<ToggleSwitch checked={showBlocked} onChange={onShowBlockedChange} />}
      >
        نمایش چت‌های مسدود شده
      </ChatMenuRow>
      <ChatMenuRow
        trailing={<ToggleSwitch checked={showMyAds} onChange={onShowMyAdsChange} />}
      >
        نمایش آگهی‌های من
      </ChatMenuRow>
      <ChatMenuDivider />
      <ChatMenuRow
        icon={<TrashIcon className="h-6 w-6" />}
        onClick={() => onSelect("bulk-delete")}
        trailing={<ChevronLeftIcon className="h-5 w-5" />}
      >
        حذف گروهی چت‌ها
      </ChatMenuRow>
    </BottomSheet>
  );
}

function UnreadBadge({ count }: { count?: string }) {
  if (!count) return null;

  return (
    <Typography as="span" variant="label" size="small" weight="medium" className="grid h-4 min-w-3.5 place-items-center rounded-full bg-[#0048c4] px-1 text-xs font-medium leading-4 text-white">
      {count}
    </Typography>
  );
}

function BlockedBadge() {
  return (
    <Typography as="span" variant="body" size="small" weight="regular" className="flex h-5 items-center gap-1 rounded-lg bg-[#dd2b1e1f] px-2 text-xs font-normal leading-4 text-[#c11004]">
      <BlockedIcon className="h-3 w-3 text-[#808080]" />
      <Typography as="span" variant="body" size="medium" weight="regular">مسدود</Typography>
    </Typography>
  );
}

function SystemChatIcon() {
  return (
    <Typography as="span" variant="body" size="medium" weight="regular"
      aria-hidden="true"
      className="grid h-5 w-5 shrink-0 place-items-center rounded-xl bg-[#003f9f] text-white"
    >
      <NavHomeIcon
        active
        color="currentColor"
        duotoneOpacity={0.24}
        size={30}
        strokeWidth={2}
      />
    </Typography>
  );
}

function SelectionCheckbox({
  isSelected,
  onToggle,
}: {
  isSelected: boolean;
  onToggle: () => void;
}) {
  return (
    <Button unstyled
      aria-pressed={isSelected}
      aria-label={isSelected ? "برداشتن انتخاب گفتگو" : "انتخاب گفتگو"}
      className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-full focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440]"
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      type="button"
    >
      <Typography as="span" variant="body" size="medium" weight="regular"
        className={`grid h-[18px] w-[18px] place-items-center rounded border ${isSelected
          ? "border-[#0048c4] bg-[#0048c4] text-white"
          : "border-[#808080] bg-white text-transparent"
          }`}
      >
        <CheckIcon className="h-[14px] w-[14px]" />
      </Typography>
    </Button>
  );
}

const ChatCard = memo(function ChatCard({
  chatId,
  index,
  isBulkDeleteMode,
  isSelected,
  item,
  onToggleSelected,
}: {
  chatId: string;
  index: number;
  isBulkDeleteMode: boolean;
  isSelected: boolean;
  item: ChatItem;
  onToggleSelected: (id: string) => void;
}) {
  const displayItem = item;
  const isSupportChat = displayItem.category === "support";
  const isHighlighted = isBulkDeleteMode
    ? isSelected
    : Boolean(displayItem.highlighted);

  const cardClassName = `relative shrink-0 overflow-visible border-b px-4 text-right ${isBulkDeleteMode
      ? "h-[147px] border-[#cccccc] pb-[19px] pt-5"
      : "h-[140px] border-[#f0f0f0] py-4"
    } ${isHighlighted ? "bg-[#edf3ff]" : "bg-white"}`;

  const supportCardContent = (
    <article
      aria-pressed={isBulkDeleteMode ? isSelected : undefined}
      className={`relative shrink-0 text-right ${isHighlighted ? "bg-[#edf3ff]" : "bg-white"}`}
      onClick={isBulkDeleteMode ? () => onToggleSelected(chatId) : undefined}
      onKeyDown={
        isBulkDeleteMode
          ? (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;

            event.preventDefault();
            onToggleSelected(chatId);
          }
          : undefined
      }
      role={isBulkDeleteMode ? "button" : undefined}
      tabIndex={isBulkDeleteMode ? 0 : undefined}
    >
      <div className="flex items-start gap-2 border-b border-[#d9d9d9] p-4 [direction:ltr]">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4 [direction:ltr]">
            <div className="flex shrink-0 items-center gap-2 text-xs font-normal leading-4 text-[#808080]">
              <Typography as="span" variant="body" size="medium" weight="regular">{displayItem.date}</Typography>
              <UnreadBadge count={displayItem.badgeCount} />
            </div>

            <div className="flex min-w-0 items-center gap-5.5 [direction:rtl]">
              <SystemChatIcon />
              <div className="flex flex-col min-w-0 gap-2">
                <Typography as="p" variant="body" size="medium" weight="medium" className="text-sm font-medium  text-[#1a1a1a]">
                  پیام سیستم
                </Typography>
                <Typography as="p" variant="body" size="medium" weight="regular" className="text-right text-sm font-normal text-[#1a1a1a]">
                  {displayItem.message}
                </Typography>
                {displayItem.isBlocked ? <BlockedBadge /> : null}
              </div>
            </div>
          </div>

        </div>

        {isBulkDeleteMode ? (
          <SelectionCheckbox isSelected={isSelected} onToggle={() => onToggleSelected(chatId)} />
        ) : null}
      </div>
    </article>
  );

  const advertiseCardContent = (
    <article
      aria-pressed={isBulkDeleteMode ? isSelected : undefined}
      className={cardClassName}
      onClick={isBulkDeleteMode ? () => onToggleSelected(chatId) : undefined}
      onKeyDown={
        isBulkDeleteMode
          ? (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;

            event.preventDefault();
            onToggleSelected(chatId);
          }
          : undefined
      }
      role={isBulkDeleteMode ? "button" : undefined}
      tabIndex={isBulkDeleteMode ? 0 : undefined}
    >
      <div
        className={`flex items-start justify-between [direction:ltr] ${isBulkDeleteMode ? "h-12 gap-2" : "h-5"
          }`}
      >
        <div className={isBulkDeleteMode ? "min-w-0 flex-1" : "w-full min-w-0"}>
          <div className="flex h-5 items-center justify-between [direction:ltr]">
            <div className="flex items-center gap-2 text-xs font-normal leading-4 text-[#808080]">
              <Typography as="span" variant="body" size="medium" weight="regular">{displayItem.date}</Typography>
              <UnreadBadge count={displayItem.badgeCount} />
            </div>

            <div className="flex min-w-0 items-center gap-4 [direction:rtl]">
              <Typography as="span" variant="label" size="medium" weight="medium" className="flex min-w-0 items-center text-sm font-medium leading-5 text-[#1a1a1a]">
                <Typography as="span" variant="body" size="medium" weight="regular" className="truncate">{displayItem.userName}</Typography>
              </Typography>
              {displayItem.isBlocked ? <BlockedBadge /> : null}
            </div>
          </div>

          {isBulkDeleteMode ? (
            <Typography as="p" variant="body" size="small" weight="regular" className="mt-3 line-clamp-1 text-right text-xs font-normal leading-4 text-[#4d4d4d]">
              {displayItem.message}
            </Typography>
          ) : null}
        </div>

        {isBulkDeleteMode ? (
          <SelectionCheckbox isSelected={isSelected} onToggle={() => onToggleSelected(chatId)} />
        ) : null}
      </div>

      {!isBulkDeleteMode ? (
        <Typography as="p" variant="body" size="small" weight="regular" className="mt-3 line-clamp-1 text-right text-xs font-normal leading-4 text-[#4d4d4d]">
          {displayItem.message}
        </Typography>
      ) : null}

      <div className="mt-3 flex h-12 items-center justify-between [direction:ltr]">
        <div className="min-w-0 flex-1 pr-2 text-right">
          <div className="flex h-5 min-w-0 items-center justify-start gap-2 [direction:rtl]">
            <Typography as="span" variant="body" size="small" weight="regular" className="min-w-0 truncate text-xs font-normal leading-4 text-[#808080]">
              {displayItem.adCategory}
            </Typography>
            {displayItem.adLabel ? (
              <Typography as="span" variant="body" size="small" weight="regular" className="shrink-0 rounded bg-[#0048c414] px-2 py-0.5 text-xs font-normal leading-4 text-[#0048c4]">
                {displayItem.adLabel}
              </Typography>
            ) : null}
          </div>
          <div className="mt-2 truncate text-sm font-medium leading-5 text-[#1a1a1a]">
            {displayItem.adTitle}
          </div>
        </div>
        <img
          alt=""
          className="h-12 w-[72px] shrink-0 rounded object-cover"
          src={displayItem.imageUrl ?? "/figma/view-ad-album.png"}
        />
      </div>
    </article>
  );
  const cardContent = isSupportChat ? supportCardContent : advertiseCardContent;

  if (isBulkDeleteMode) {
    return cardContent;
  }

  return (
    <RouteLink
      aria-label={`${displayItem.userName} - ${displayItem.adTitle}`}
      className="block text-inherit no-underline focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
      state={displayItem.detailState}
      to={displayItem.detailPath ?? `/chat/${index + 1}`}
    >
      {cardContent}
    </RouteLink>
  );
});

function ChatDetailHeader({
  onOpenMenu,
  subtitle,
  title,
}: {
  onOpenMenu: () => void;
  subtitle?: string;
  title: string;
}) {
  return (
    <TopBar
      actions={[
        {
          icon: <MoreVerticalIcon className="h-6 w-6" />,
          id: "more",
          label: "گزینه‌های بیشتر",
          onClick: onOpenMenu,
        },
      ]}
      backLabel="بازگشت به چت‌ها"
      backTo="/chat"
      centerSlot={
        <div className="min-w-0 text-right">
          <Typography as="h1" variant="title" size="medium" weight="semibold" className="m-0 truncate text-base font-semibold leading-5 text-[#1a1a1a]">
            {title}
          </Typography>
          {subtitle ? (
            <Typography as="p" variant="body" size="small" weight="regular" className="mt-0.5 truncate text-[10px] font-normal leading-4 text-[#808080]">
              {subtitle}
            </Typography>
          ) : null}
        </div>
      }
      className="border-b border-[#e6e6e6]"
      contentClassName="px-0"
      heightClassName={subtitle ? "h-[60px]" : "h-[52px]"}
    />
  );
}

function ChatPropertyStrip({ thread }: { thread?: ChatThread }) {
  const advertise = readPathRecord(thread, ["advertise", "ad", "advertisement", "property"]);

  if (!advertise) return null;

  const advertiseId = readPathText(advertise, ["id", "_id"]);
  const advertiseTitle =
    readPathText(advertise, ["title", "label", "name"]) || "جزئیات ملک";
  const advertiseFormTitle = readAdvertiseFormTitle(advertise);
  const imageUrl = readImageUrl(advertise) ?? "/figma/view-ad-album.png";
  const content = (
    <section className="flex h-[52px] shrink-0 items-center gap-2 bg-[#f5f5f5] px-4 text-right [direction:rtl]">
      <img
        alt={advertiseTitle}
        className="h-10 w-[54px] shrink-0 rounded-md object-cover"
        src={imageUrl}
      />
      <div className="min-w-0 flex-1">
        {advertiseFormTitle ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="truncate text-xs font-normal leading-4 text-[#1a1a1a]">
            {advertiseFormTitle}
          </Typography>
        ) : null}
        <Typography as="p" variant="body" size="small" weight="medium" className={`${advertiseFormTitle ? "mt-1" : ""} truncate text-xs font-medium leading-4 text-[#1a1a1a]`}>
          {advertiseTitle}
        </Typography>
      </div>
    </section>
  );

  if (!advertiseId) return content;

  return (
    <RouteLink
      aria-label={`مشاهده ${advertiseTitle}`}
      className="block shrink-0 text-inherit no-underline focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440]"
      to={`/ads/${encodeURIComponent(advertiseId)}`}
    >
      {content}
    </RouteLink>
  );
}

function ChatBubble({
  children,
  direction,
  isRead = false,
  time = "18:21",
  wide = false,
}: {
  children: ReactNode;
  direction: "incoming" | "outgoing";
  isRead?: boolean;
  time?: string;
  wide?: boolean;
}) {
  const isOutgoing = direction === "outgoing";

  return (
    <div className={`flex [direction:ltr] ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`${wide ? "w-[168px]" : "w-fit min-w-[72px] max-w-[198px]"} rounded-lg px-3 py-2 text-right ${isOutgoing
          ? "bg-[#eef3fb] rounded-tr-none"
          : "border border-[#e6e6e6] bg-white rounded-tl-none"
          }`}
        dir="rtl"
      >
        <Typography as="p" variant="body" size="medium" weight="regular" className="whitespace-pre-line break-words text-sm font-normal leading-[18px] text-[#1a1a1a] [overflow-wrap:anywhere]">
          {children}
        </Typography>
        <div
          className={`mt-1 flex items-center gap-0.5 text-[11px] font-normal leading-4 ${isOutgoing ? "justify-end [direction:ltr] text-[#0048c4]" : "justify-start text-[#808080]"
            }`}
        >
          <Typography as="span" variant="body" size="medium" weight="regular">{time}</Typography>
          {isOutgoing ? (
            <DoubleTickIcon className={`h-4 w-4 ${isRead ? "text-[#0048c4]" : "text-[#808080]"}`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ChatDateChip() {
  return (
    <div className="flex justify-center py-0.5">
      <Typography as="span" variant="body" size="small" weight="regular" className="rounded-lg bg-[#f5f5f5] px-3 py-1 text-[10px] font-normal leading-4 text-[#808080]">
        22 بهمن
      </Typography>
    </div>
  );
}


function ChatImageBubble({
  direction = "outgoing",
  fileName,
  imageUrl,
  isRead = false,
  time,
}: {
  direction?: "incoming" | "outgoing";
  fileName: string;
  imageUrl: string;
  isRead?: boolean;
  time?: string;
}) {
  const isOutgoing = direction === "outgoing";

  return (
    <div className={`flex [direction:ltr] ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[220px] rounded-lg p-1.5 text-right ${isOutgoing
          ? "rounded-tr-none bg-[#eef3fb]"
          : "rounded-tl-none border border-[#e6e6e6] bg-white"
          }`}
        dir="rtl"
      >
        <a href={imageUrl} target="_blank" rel="noreferrer" aria-label={`مشاهده ${fileName}`}>
          <img
            alt={fileName || "تصویر ارسالی"}
            className="max-h-[220px] w-full rounded-md object-cover"
            src={imageUrl}
          />
        </a>
        <div className={`mt-1 flex items-center gap-1 px-1 text-[10px] leading-4 [direction:ltr] ${isOutgoing ? "justify-end text-[#0048c4]" : "justify-start text-[#808080]"
          }`}>
          <Typography as="span" variant="body" size="medium" weight="regular">{time}</Typography>
          {isOutgoing ? (
            <DoubleTickIcon className={`h-3.5 w-3.5 ${isRead ? "text-[#0048c4]" : "text-[#808080]"}`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ChatLocationBubble({
  direction = "outgoing",
  isRead = false,
  mapsUrl,
  time,
}: {
  direction?: "incoming" | "outgoing";
  isRead?: boolean;
  mapsUrl: string;
  time?: string;
}) {
  const isOutgoing = direction === "outgoing";

  return (
    <div className={`flex [direction:ltr] ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <a
        className={`block w-[220px] rounded-lg px-3 py-2 text-right no-underline ${isOutgoing
          ? "rounded-tr-none bg-[#eef3fb]"
          : "rounded-tl-none border border-[#e6e6e6] bg-white"
          }`}
        dir="rtl"
        href={mapsUrl}
        target="_blank"
        rel="noreferrer"
      >
        <div className="flex items-center gap-2 [direction:rtl]">
          <MapLocationIcon />
          <Typography as="span" variant="label" size="small" weight="medium" className="text-xs font-medium leading-5 text-[#1a1a1a]">
            موقعیت در نقشه
          </Typography>
        </div>
        <Typography as="p" variant="body" size="small" weight="regular" className="mt-2 text-[11px] leading-4 text-[#4d4d4d]">
          برای مشاهده موقعیت روی نقشه لمس کنید.
        </Typography>
        <div className={`mt-1 flex items-center gap-1 text-[10px] leading-4 [direction:ltr] ${isOutgoing ? "justify-end text-[#0048c4]" : "justify-start text-[#808080]"
          }`}>
          <Typography as="span" variant="body" size="medium" weight="regular">{time}</Typography>
          {isOutgoing ? (
            <DoubleTickIcon className={`h-3.5 w-3.5 ${isRead ? "text-[#0048c4]" : "text-[#808080]"}`} />
          ) : null}
        </div>
      </a>
    </div>
  );
}

function SentChatMessageBubble({ message }: { message: SentChatMessage }) {
  if (message.type === "image") {
    return <ChatImageBubble fileName={message.fileName} imageUrl={message.imageUrl} />;
  }

  if (message.type === "location") {
    return <ChatLocationBubble mapsUrl={message.mapsUrl} />;
  }

  return <ChatBubble direction="outgoing">{message.text}</ChatBubble>;
}

function ChatApiMessageBubble({
  currentUserId,
  forceRead,
  message,
}: {
  currentUserId: string;
  forceRead: boolean;
  message: ChatMessage;
}) {
  const direction = isOutgoingChatMessage(message, currentUserId) ? "outgoing" : "incoming";
  const isRead = forceRead || isReadChatMessage(message);
  const time = readChatMessageTime(message);
  const type = readChatMessageType(message);

  if (type === "image") {
    const attachment = readChatMessageAttachment(message);

    if (!attachment.imageUrl) return null;

    return (
      <ChatImageBubble
        direction={direction}
        fileName={attachment.fileName}
        imageUrl={attachment.imageUrl}
        isRead={isRead}
        time={time}
      />
    );
  }

  if (type === "location") {
    const location = readChatMessageLocation(message);

    if (!location.mapsUrl) return null;

    return (
      <ChatLocationBubble
        direction={direction}
        isRead={isRead}
        mapsUrl={location.mapsUrl}
        time={time}
      />
    );
  }

  const body = readChatMessageBody(message);

  if (!body) return null;

  return (
    <ChatBubble
      direction={direction}
      isRead={isRead}
      time={time}
    >
      {body}
    </ChatBubble>
  );
}

function ChatComposer({
  message,
  onChangeMessage,
  onOpenAttach,
  onSend,
}: {
  message: string;
  onChangeMessage: (message: string) => void;
  onOpenAttach: () => void;
  onSend: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const sentByPointerRef = useRef(false);

  const keepKeyboardOpen = () => {
    inputRef.current?.focus({ preventScroll: true });
  };

  const sendFromComposer = () => {
    onSend();

    // Keep focus on the input so mobile keyboard does not close
    keepKeyboardOpen();
  };

  return (
    <footer className="shrink-0 bg-transparent px-2 pb-4 pt-1 bg">
      <div className="flex items-center gap-2 rounded-full border border-transparent p-1.5 [direction:ltr] shadow-[0_1px_0px_0px_#1A1A1A14] bg-gray-100">
        <Button unstyled
          aria-label="ارسال فایل"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#808080] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          onClick={onOpenAttach}
          type="button"
        >
          <LinkChainIcon className="h-6 w-6" />
        </Button>

        <label className="min-w-0 flex-1">
          <Typography as="span" variant="body" size="medium" weight="regular" className="sr-only">پیام خود را بنویسید</Typography>
          <input
            ref={inputRef}
            className="h-11 w-full rounded-xl border-0 px-2 text-right text-[12px] leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] focus:ring-0"
            dir="rtl"
            placeholder="پیام خود را بنویسید"
            type="text"
            value={message}
            onChange={(event) => onChangeMessage(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                sendFromComposer();
              }
            }}
          />
        </label>

        <Button unstyled
          aria-label="ارسال پیام"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#0048c4] text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#003da8]"
          onPointerDown={(event) => {
            event.preventDefault();
            sentByPointerRef.current = true;
            sendFromComposer();
          }}
          onClick={(event) => {
            event.preventDefault();

            if (sentByPointerRef.current) {
              sentByPointerRef.current = false;
              return;
            }

            sendFromComposer();
          }}
          type="button"
        >
          <SendMessageIcon className="h-6 w-6" />
        </Button>
      </div>
    </footer>
  );
}

type SendFileOptionId = "camera" | "gallery" | "map";

type SendFileOption = {
  id: SendFileOptionId;
  title: string;
  Icon: ComponentType<{ className?: string }>;
};

const sendFileOptions: SendFileOption[] = [
  {
    id: "camera",
    title: "عکس با دوربین",
    Icon: CameraIcon,
  },
  {
    id: "gallery",
    title: "عکس از گالری",
    Icon: AlbumIcon,
  },
  {
    id: "map",
    title: "موقعیت در نقشه",
    Icon: MapLocationIcon,
  },
];

function SendFileBottomSheet({
  isOpen,
  onClose,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: SendFileOption["id"]) => void;
}) {
  return (
    <BottomSheet
      ariaLabel="ارسال فایل"
      className="rounded-t-[18px]"
      contentClassName="mt-2"
      isOpen={isOpen}
      onClose={onClose}
      scrimClassName="bg-[#1a1a1a]/65"
      title="ارسال"
      variant="actions"
      zIndexClassName="z-[60]"
    >
      <BottomSheetActionList
        isOpen={isOpen}
        itemClassName="h-11 text-[12px] leading-5"
        items={sendFileOptions}
        onSelect={(item) => onSelect(item.id)}
      />
    </BottomSheet>
  );
}

function ChatSettingsBottomSheet({
  isBlockedByMe,
  isOpen,
  onClose,
  onSelect,
}: {
  isBlockedByMe: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (id: string, title: string) => void;
}) {
  const options = [
    {
      id: isBlockedByMe ? "unblock" : "block",
      title: isBlockedByMe ? "رفع مسدودیت" : "مسدود کردن",
      Icon: BlockedIcon,
    },
    {
      id: "delete",
      title: "حذف مکالمه",
      Icon: TrashIcon,
    },
    {
      id: "report",
      title: "گزارش تخلف",
      Icon: InfoIcon,
    },
  ];

  return (
    <BottomSheet
      ariaLabel="تنظیمات مکالمه"
      className="rounded-t-[18px]"
      contentClassName="mt-2"
      isOpen={isOpen}
      onClose={onClose}
      scrimClassName="bg-[#1a1a1a]/65"
      title="تنظیمات مکالمه"
      variant="actions"
      zIndexClassName="z-[60]"
    >
      <BottomSheetActionList
        isOpen={isOpen}
        itemClassName="h-11 text-[12px] leading-5"
        items={options}
        onSelect={(item) => onSelect(item.id, item.title)}
      />
    </BottomSheet>
  );
}

function BlockChatConfirmBottomSheet({
  isOpen,
  isPending,
  onCancel,
  onConfirm,
}: {
  isOpen: boolean;
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <BottomSheet
      ariaLabel="تأیید مسدود کردن کاربر"
      className="rounded-t-[20px]"
      contentClassName="px-4 pb-7 pt-7"
      isOpen={isOpen}
      onClose={onCancel}
      scrimClassName="bg-[#1a1a1a]/60"
      showHandle={false}
      showHeader={false}
      variant="confirm"
      zIndexClassName="z-[70]"
    >
      <div className="flex flex-col gap-5">
        <Typography as="p" variant="body" size="large" weight="medium" className="m-0 text-center text-base font-medium leading-6 text-[#1a1a1a]">
          آیا از مسدود کردن کاربر مطمئن هستید؟
        </Typography>
        <div className="grid grid-cols-2 gap-4 [direction:ltr]">
          <Button
            disabled={isPending}
            fullWidth
            onClick={onConfirm}
            size="sm"
          >
            {isPending ? "در حال مسدود کردن..." : "بله مسدود کن!"}
          </Button>
          <Button
            disabled={isPending}
            fullWidth
            onClick={onCancel}
            size="sm"
            variant="secondary"
          >
            انصراف
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}

function ChatBlockedFooter({
  blockedMe,
  isPending,
  onUnblock,
}: {
  blockedMe: boolean;
  isPending: boolean;
  onUnblock: () => void;
}) {
  return (
    <footer className="shrink-0 bg-white px-4 pb-4 pt-2">
      <div className="flex min-h-[52px] items-center justify-between gap-3 rounded-full bg-[#f5f5f5] p-1 [direction:ltr]">
        {blockedMe ? (
          <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1 px-3 text-right text-sm font-normal leading-5 text-[#808080]" dir="rtl">
            این کاربر شما را مسدود کرده است
          </Typography>
        ) : (
          <>
            <Button unstyled
              className="h-11 min-w-[132px] shrink-0 rounded-full bg-[#0048c4] px-4 text-sm font-semibold leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] disabled:cursor-wait disabled:opacity-60"
              disabled={isPending}
              onClick={onUnblock}
              type="button"
            >
              {isPending ? "در حال انجام..." : "رفع مسدودیت"}
            </Button>
            <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1 px-2 text-right text-sm font-normal leading-5 text-[#808080]" dir="rtl">
              این کاربر را مسدود کرده اید
            </Typography>
          </>
        )}
      </div>
    </footer>
  );
}

type ResponseTimeSheet = "days" | "start" | "end" | null;

type ResponseWeekDay = {
  label: string;
  value: ChatDayOfWeek;
};

const responseWeekDays: ResponseWeekDay[] = [
  { label: "شنبه", value: "saturday" },
  { label: "یکشنبه", value: "sunday" },
  { label: "دوشنبه", value: "monday" },
  { label: "سه‌شنبه", value: "tuesday" },
  { label: "چهارشنبه", value: "wednesday" },
  { label: "پنجشنبه", value: "thursday" },
  { label: "جمعه", value: "friday" },
];

const responseHourOptions = Array.from({ length: 48 }, (_, index) => {
  const hours = Math.floor(index / 2);
  const minutes = index % 2 === 0 ? 0 : 30;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
});

const persianNumber = new Intl.NumberFormat("fa-IR", {
  useGrouping: false,
});

const persianTwoDigitNumber = new Intl.NumberFormat("fa-IR", {
  minimumIntegerDigits: 2,
  useGrouping: false,
});

function formatResponseTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return value;

  return `${persianTwoDigitNumber.format(hours)}:${persianTwoDigitNumber.format(minutes)}`;
}

function getResponseDayLabel(day: ChatDayOfWeek) {
  return responseWeekDays.find((item) => item.value === day)?.label ?? day;
}

function sortResponseDays(days: ChatDayOfWeek[]) {
  const selectedDays = new Set(days);

  return responseWeekDays
    .map((item) => item.value)
    .filter((day) => selectedDays.has(day));
}

function areResponseDaysEqual(first: ChatDayOfWeek[], second: ChatDayOfWeek[]) {
  const normalizedFirst = sortResponseDays(first);
  const normalizedSecond = sortResponseDays(second);

  return normalizedFirst.length === normalizedSecond.length &&
    normalizedFirst.every((day, index) => day === normalizedSecond[index]);
}

function formatParticipantAvailabilityDays(availability: ChatAvailability) {
  const availableDays = sortResponseDays(
    availability.days.map((day) => day.day_of_week),
  );

  if (availableDays.length === 0) return "";
  if (availableDays.length === responseWeekDays.length) return "همه‌روزه";

  const dayIndexes = availableDays.map((day) =>
    responseWeekDays.findIndex((item) => item.value === day),
  );
  const isContinuousRange = dayIndexes.every(
    (dayIndex, index) => index === 0 || dayIndex === dayIndexes[index - 1] + 1,
  );

  if (isContinuousRange && availableDays.length > 1) {
    const firstDay = availableDays[0];
    const lastDay = availableDays.at(-1) ?? firstDay;

    return `${getResponseDayLabel(firstDay)} تا ${getResponseDayLabel(lastDay)}`;
  }

  const labels = availableDays.map(getResponseDayLabel);

  if (labels.length === 1) return labels[0];

  return `${labels.slice(0, -1).join("، ")} و ${labels.at(-1)}`;
}

function formatParticipantAvailabilityTime(value: string) {
  const [hours, minutes] = value.split(":").map(Number);

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) {
    return formatResponseTime(value);
  }

  const twelveHourValue = hours % 12 || 12;
  const minuteText = minutes
    ? `:${persianTwoDigitNumber.format(minutes)}`
    : "";
  const dayPeriod = hours < 6
    ? "بامداد"
    : hours < 12
      ? "صبح"
      : hours === 12
        ? "ظهر"
        : hours < 20
          ? "عصر"
          : "شب";

  return `${persianNumber.format(twelveHourValue)}${minuteText} ${dayPeriod}`;
}

function ChatParticipantAvailabilityCard({
  availability,
}: {
  availability?: ChatAvailability;
}) {
  if (!availability?.days?.length || !availability.start_time || !availability.end_time) {
    return null;
  }

  const daysText = formatParticipantAvailabilityDays(availability);

  if (!daysText) return null;

  return (
    <section
      aria-label="ساعت پاسخگویی آژانس"
      className="mb-4 h-[100px] rounded-xl border border-[#0048c4] bg-[#0048C414] p-4 text-xs font-normal leading-4 text-[#1a1a1a]"
    >
      <div className="flex h-5 items-center gap-2 text-sm font-medium leading-5 text-[#0048c4]">
        <LinearSupport aria-hidden="true" className="h-5 w-5" />
        <Typography as="h2" variant="headline" size="large" className="m-0">ساعت پاسخگویی آژانس</Typography>
      </div>

      <div className="mt-2 space-y-2 [direction:rtl]">
        <div className="flex text-xs items-center justify-between gap-4">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#4d4d4d]">روزهای هفته:</Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 truncate text-left text-[#1a1a1a]">{daysText}</Typography>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#4d4d4d]">ساعت:</Typography>
          <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 truncate text-left text-[#1a1a1a]">
            از {formatParticipantAvailabilityTime(availability.start_time)} - تا{" "}
            {formatParticipantAvailabilityTime(availability.end_time)}
          </Typography>
        </div>
      </div>
    </section>
  );
}

function ResponseTimeSelectBox({
  label,
  onClick,
  onClear,
  value,
}: {
  label: string;
  onClick: () => void;
  onClear?: () => void;
  value?: string;
}) {
  const hasValue = Boolean(value);

  return (
    <div className="flex h-14 min-w-0 flex-1 items-center rounded-lg border border-[#cccccc] bg-white px-2">
      <Button unstyled
        className="flex h-full min-w-0 flex-1 items-center gap-2 px-1 text-right focus-visible:outline-3 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0048c440]"
        onClick={onClick}
        type="button"
      >
        <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1 text-right">
          {hasValue ? (
            <Typography as="span" variant="body" size="medium" weight="regular" className="flex min-w-0 flex-col gap-0.5">
              <Typography as="span" variant="body" size="small" weight="regular" className="truncate text-[10px] font-normal leading-4 text-[#a6a6a6]">
                {label}
              </Typography>
              <Typography as="span" variant="label" size="small" weight="medium" className="truncate text-xs font-medium leading-4 text-[#1a1a1a]">
                {value}
              </Typography>
            </Typography>
          ) : (
            <Typography as="span" variant="body" size="small" weight="regular" className="block truncate text-xs font-normal leading-4 text-[#a6a6a6]">
              {label}
            </Typography>
          )}
        </Typography>

        {!hasValue ? <ArrowDownIcon className="h-4 w-4 shrink-0 text-[#4d4d4d]" /> : null}
      </Button>

      {hasValue && onClear ? (
        <Button unstyled
          aria-label={`پاک کردن ${label}`}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-[#a6a6a6] focus-visible:outline-2 focus-visible:outline-[#0048c4]"
          onClick={onClear}
          type="button"
        >
          <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-5 w-5 place-items-center rounded-full border border-[#cccccc]">
            <CloseIcon className="h-3 w-3" />
          </Typography>
        </Button>
      ) : null}
    </div>
  );
}

function ResponseTimeDaysSheet({
  isOpen,
  onClose,
  onToggleDay,
  selectedDays,
}: {
  isOpen: boolean;
  onClose: () => void;
  onToggleDay: (day: ChatDayOfWeek) => void;
  selectedDays: ChatDayOfWeek[];
}) {
  return (
    <BottomSheet
      ariaLabel="انتخاب روزهای هفته"
      className="rounded-t-[18px]"
      contentClassName="mt-5"
      heightClassName="h-[560px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      scrimClassName="bg-[#1a1a1a]/65"
      title="انتخاب روزهای هفته"
      zIndexClassName="z-[60]"
    >
      <div className="space-y-2 px-4">
        {responseWeekDays.map((day) => {
          const isSelected = selectedDays.includes(day.value);

          return (
            <Button unstyled
              className="flex h-[54px] w-full items-center justify-between text-right text-sm leading-5 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
              key={day.value}
              onClick={() => onToggleDay(day.value)}
              type="button"
            >
              <Typography as="span" variant="body" size="medium" weight="regular">{day.label}</Typography>
              <Typography as="span" variant="body" size="medium" weight="regular"
                className={`grid h-[18px] w-[18px] place-items-center rounded border ${isSelected
                  ? "border-[#0048c4] bg-[#0048c4] text-white"
                  : "border-[#808080] bg-white text-transparent"
                  }`}
              >
                <CheckIcon className="h-[14px] w-[14px]" />
              </Typography>
            </Button>
          );
        })}
      </div>
    </BottomSheet>
  );
}

function ResponseTimeHourSheet({
  isOpen,
  onClose,
  onSelect,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (hour: string) => void;
  title: string;
}) {
  return (
    <BottomSheet
      ariaLabel={title}
      className="rounded-t-[18px]"
      contentClassName="mt-1 h-[calc(100%-76px)] overflow-y-auto"
      heightClassName="h-[560px]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      scrimClassName="bg-[#1a1a1a]/65"
      showHeaderDivider
      title={title}
      titleAlign="center"
      zIndexClassName="z-[60]"
    >
      <div className="px-4 py-2">
        {responseHourOptions.map((hour) => (
          <Button unstyled
            className="flex h-[70px] w-full items-center justify-center text-center text-base leading-6 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
            key={hour}
            onClick={() => {
              onSelect(hour);
              onClose();
            }}
            type="button"
          >
            {formatResponseTime(hour)}
          </Button>
        ))}
      </div>
    </BottomSheet>
  );
}

export function UserChatResponseTimePage() {
  const availabilityQuery = useChatAvailabilityQuery();
  const updateAvailabilityMutation = useUpdateChatAvailabilityMutation();
  const [selectedDays, setSelectedDays] = useState<ChatDayOfWeek[]>([]);
  const [startHour, setStartHour] = useState<string | undefined>();
  const [endHour, setEndHour] = useState<string | undefined>();
  const [openSheet, setOpenSheet] = useState<ResponseTimeSheet>(null);
  const { message, showNotice } = useTransientNotice();

  useEffect(() => {
    if (!availabilityQuery.data) return;

    const availableDays = sortResponseDays(
      availabilityQuery.data.days.map((day) => day.day_of_week),
    );

    setSelectedDays(availableDays);
    setStartHour(availableDays.length ? availabilityQuery.data.start_time ?? undefined : undefined);
    setEndHour(availableDays.length ? availabilityQuery.data.end_time ?? undefined : undefined);
  }, [availabilityQuery.data]);

  const toggleDay = (day: ChatDayOfWeek) => {
    setSelectedDays((current) =>
      current.includes(day)
        ? current.filter((item) => item !== day)
        : sortResponseDays([...current, day]),
    );
  };

  const saveAvailability = async () => {
    const currentAvailability = availabilityQuery.data ?? {
      days: [],
      end_time: null,
      start_time: null,
    };
    const currentDays = currentAvailability.days.map((day) => day.day_of_week);

    if (selectedDays.length > 0 && (!startHour || !endHour)) {
      showNotice("ساعت شروع و پایان را انتخاب کنید");
      return;
    }

    if (selectedDays.length > 0 && startHour && endHour && startHour >= endHour) {
      showNotice("ساعت پایان باید بعد از ساعت شروع باشد");
      return;
    }

    const payload: {
      days?: ChatDayOfWeek[];
      end_time?: string;
      start_time?: string;
    } = {};

    if (selectedDays.length === 0) {
      payload.days = [];
    } else {
      if (!areResponseDaysEqual(selectedDays, currentDays)) {
        payload.days = sortResponseDays(selectedDays);
      }
      if (startHour !== currentAvailability.start_time) {
        payload.start_time = startHour;
      }
      if (endHour !== currentAvailability.end_time) {
        payload.end_time = endHour;
      }
    }

    if (Object.keys(payload).length === 0) {
      showNotice("تغییری برای ثبت وجود ندارد");
      return;
    }

    try {
      await updateAvailabilityMutation.mutateAsync(payload);
      showNotice(selectedDays.length === 0
        ? "ساعت پاسخگویی پاک شد"
        : "ساعت پاسخگویی ثبت شد");
    } catch (error) {
      showNotice(getApiErrorMessage(error, "ثبت ساعت پاسخگویی با خطا مواجه شد"));
    }
  };

  const isBusy = availabilityQuery.isLoading || updateAvailabilityMutation.isPending;

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backLabel="بازگشت به چت‌ها"
        backTo="/chat"
        className="border-b border-[#e6e6e6]"
        contentClassName="px-0"
        heightClassName="h-[60px]"
        title="ساعت پاسخگویی"
        titleClassName="text-base font-semibold leading-6"
      />

      <main className="min-h-0 flex-1 overflow-y-auto bg-white pb-28">
        <section className="px-4 pb-4 pt-5 text-right text-xs font-normal leading-5 text-[#1a1a1a]">
          <Typography as="p" variant="body" size="medium" weight="regular">ساعت پاسخگویی خود را در چت مشخص کنید.</Typography>
          <Typography as="p" variant="body" size="medium" weight="regular">این ساعت زیر اسم شما در چت و برای کاربران نمایش داده می‌شود.</Typography>
        </section>

        {availabilityQuery.isError ? (
          <div className="mx-4 mb-3 rounded-lg bg-[#fff1f0] px-3 py-2 text-xs leading-5 text-[#b42318]">
            دریافت ساعت پاسخگویی با خطا مواجه شد.
            <Button unstyled
              className="mr-2 font-semibold text-[#0048c4]"
              onClick={() => void availabilityQuery.refetch()}
              type="button"
            >
              تلاش دوباره
            </Button>
          </div>
        ) : null}

        <Button unstyled
          className="flex h-14 w-full items-center gap-3 px-4 text-right focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048c440] disabled:cursor-wait disabled:opacity-60"
          disabled={availabilityQuery.isLoading}
          onClick={() => setOpenSheet("days")}
          type="button"
        >
          <Typography as="span" variant="label" size="small" weight="semibold" className="min-w-0 flex-1 text-xs font-semibold leading-5 text-[#1a1a1a]">
            روزهای هفته
          </Typography>
          <ChevronLeftIcon className="h-4 w-4 shrink-0 text-[#4d4d4d]" />
        </Button>

        {selectedDays.length ? (
          <div className="flex flex-wrap justify-start gap-2 px-4 pb-4 pt-1 [direction:rtl]">
            {selectedDays.map((day) => (
              <Button unstyled
                className="flex h-8 items-center gap-1.5 rounded-md border border-[#0048c4] bg-[#0048c414] px-2.5 text-[11px] font-medium leading-4 text-[#0048c4]"
                key={day}
                onClick={() => toggleDay(day)}
                type="button"
              >
                <Typography as="span" variant="body" size="medium" weight="regular">{getResponseDayLabel(day)}</Typography>
                <CloseIcon className="h-3 w-3" />
              </Button>
            ))}
          </div>
        ) : (
          <Typography as="p" variant="body" size="small" weight="regular" className="px-4 pb-4 text-[11px] leading-4 text-[#808080]">
            با ثبت بدون انتخاب روز، ساعت پاسخگویی پاک می‌شود.
          </Typography>
        )}

        <section className="border-t border-[#cccccc] px-4 pt-5">
          <Typography as="h2" variant="title" size="small" weight="semibold" className="mb-4 text-right text-xs font-semibold leading-5 text-[#1a1a1a]">
            تعیین ساعت شروع و پایان
          </Typography>
          <div className="flex gap-2 [direction:rtl]">
            <ResponseTimeSelectBox
              label="از ساعت"
              onClick={() => setOpenSheet("start")}
              onClear={() => setStartHour(undefined)}
              value={startHour ? formatResponseTime(startHour) : undefined}
            />
            <ResponseTimeSelectBox
              label="تا ساعت"
              onClick={() => setOpenSheet("end")}
              onClear={() => setEndHour(undefined)}
              value={endHour ? formatResponseTime(endHour) : undefined}
            />
          </div>
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 pb-4 pt-3 shadow-[0_-8px_22px_rgba(0,0,0,0.05)]">
        <Button unstyled
          className="h-11 w-full rounded-lg bg-[#0048c4] text-sm font-semibold leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#003da8] disabled:cursor-wait disabled:opacity-60"
          disabled={isBusy}
          onClick={() => void saveAvailability()}
          type="button"
        >
          {updateAvailabilityMutation.isPending
            ? "در حال ثبت..."
            : availabilityQuery.isLoading
              ? "در حال دریافت..."
              : "ثبت"}
        </Button>
      </footer>

      <ResponseTimeDaysSheet
        isOpen={openSheet === "days"}
        onClose={() => setOpenSheet(null)}
        onToggleDay={toggleDay}
        selectedDays={selectedDays}
      />
      <ResponseTimeHourSheet
        isOpen={openSheet === "start"}
        onClose={() => setOpenSheet(null)}
        onSelect={setStartHour}
        title="از ساعت"
      />
      <ResponseTimeHourSheet
        isOpen={openSheet === "end"}
        onClose={() => setOpenSheet(null)}
        onSelect={setEndHour}
        title="تا ساعت"
      />
      <TransientNotice className="bottom-20" message={message} />
    </PageFrame>
  );
}

const CHAT_RENAME_NOTICE_STORAGE_KEY = "bonga-chat-rename-notice";

function navigateFromChatSettings(path: string, replace = false) {
  const method = replace ? "replaceState" : "pushState";

  window.history[method]({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function UserChatRenamePage() {
  const showingNameQuery = useChatShowingNameQuery();
  const updateShowingNameMutation = useUpdateChatShowingNameMutation();
  const [chatName, setChatName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const didHydrateShowingNameRef = useRef(false);
  const { message } = useTransientNotice();

  useEffect(() => {
    if (showingNameQuery.data === undefined || didHydrateShowingNameRef.current) return;

    didHydrateShowingNameRef.current = true;
    setChatName(showingNameQuery.data ?? "");
  }, [showingNameQuery.data]);

  const saveChatName = async () => {
    const normalizedName = chatName.trim();

    try {
      setErrorMessage("");
      await updateShowingNameMutation.mutateAsync(normalizedName || null);
      window.sessionStorage.setItem(
        CHAT_RENAME_NOTICE_STORAGE_KEY,
        normalizedName ? "تغییر نام با موفقیت انجام شد" : "نام نمایشی پاک شد",
      );
      navigateFromChatSettings("/chat", true);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "ثبت نام نمایشی با خطا مواجه شد."));
    }
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backLabel="بازگشت به چت‌ها"
        backTo="/chat"
        className="border-b border-[#e6e6e6]"
        contentClassName="px-1"
        heightClassName="h-[60px]"
        title="تغییر نام چت"
        titleClassName="font-semibold"
      />

      <main className="min-h-0 flex-1 overflow-y-auto bg-white p-4">
        <section className="text-right">
          <label
            className="block font-semibold text-[#1a1a1a]"
            htmlFor="chat-display-name"
          >
            نام و نام خانوادگی
          </label>
          <Typography as="p" variant="body" size="medium" weight="regular" className="mb-3 mt-1 text-sm font-normal text-[#808080]">
            کاربران در چت شما را با این نام می‌بینند
          </Typography>
          <input
            autoComplete="name"
            className={`w-full rounded-xl border bg-white px-3 py-3.75 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c41f] ${errorMessage ? "border-[#c11004]" : "border-[#6e6e6e]"
              }`}
            id="chat-display-name"
            maxLength={80}
            onChange={(event) => {
              setChatName(event.target.value);
              if (errorMessage) setErrorMessage("");
            }}
            placeholder="نام خود را وارد کنید"
            value={chatName}
          />
          <Typography as="p" variant="body" size="small" weight="regular" className="mt-2 text-[11px] leading-4 text-[#808080]">
            برای نمایش نام و نام خانوادگی اصلی، این فیلد را خالی ذخیره کنید.
          </Typography>
          {errorMessage ? (
            <Typography as="p" variant="body" size="small" weight="regular" className="mt-1.5 text-[11px] leading-4 text-[#c11004]">
              {errorMessage}
            </Typography>
          ) : null}
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 pb-4 pt-3 shadow-[0_-8px_22px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3 [direction:rtl]">
          <Button unstyled
            className="h-11 min-w-0 flex-1 rounded-lg bg-[#0048c4] text-xs font-semibold leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#003da8]"
            disabled={showingNameQuery.isLoading || updateShowingNameMutation.isPending}
            onClick={() => void saveChatName()}
            type="button"
          >
            {updateShowingNameMutation.isPending ? "در حال ذخیره..." : "ذخیره نام"}
          </Button>
          <Button unstyled
            className="h-11 min-w-0 flex-1 rounded-lg border border-[#0048c4] bg-white text-xs font-semibold leading-5 text-[#0048c4] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] active:bg-[#0048c40a]"
            onClick={() => navigateFromChatSettings("/chat", true)}
            type="button"
          >
            انصراف
          </Button>
        </div>
      </footer>

      <TransientNotice className="bottom-20" message={message} />
    </PageFrame>
  );
}

export function UserChatDetailPage() {
  const routeId = getChatRouteThreadId();
  const routeThreadId = getChatRouteStateThreadId() || routeId;
  const routeThread = getChatRouteStateThread();
  const [isSendFileSheetOpen, setIsSendFileSheetOpen] = useState(false);
  const [isSettingsSheetOpen, setIsSettingsSheetOpen] = useState(false);
  const [isBlockConfirmSheetOpen, setIsBlockConfirmSheetOpen] = useState(false);
  const [draftMessage, setDraftMessage] = useState("");
  const [activeThreadId, setActiveThreadId] = useState(routeThreadId);
  const [blockedByMe, setBlockedByMe] = useState(
    () => readPathBoolean(routeThread, ["blocked_by_me", "blockedByMe"]) ?? false,
  );
  const [blockedMe, setBlockedMe] = useState(
    () => readPathBoolean(routeThread, ["blocked_me", "blockedMe"]) ?? false,
  );
  const [isBlocked, setIsBlocked] = useState(
    () => readPathBoolean(routeThread, ["is_blocked", "isBlocked", "blocked"]) ?? false,
  );
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [readThreadIds, setReadThreadIds] = useState<Set<string>>(() => new Set());
  const [sentMessages, setSentMessages] = useState<SentChatMessage[]>([]);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [isSendingLocation, setIsSendingLocation] = useState(false);
  const { message, showNotice } = useTransientNotice();
  const chatScrollRef = useRef<HTMLElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const pendingOutgoingAttachmentsRef = useRef<Set<string>>(new Set());
  const pendingOutgoingLocationsRef = useRef<Set<string>>(new Set());
  const pendingOutgoingBodiesRef = useRef<Map<string, number>>(new Map());
  const typingTimeoutRef = useRef<number | null>(null);
  const [, setHasMoreMessagesBelow] = useState(false);
  const currentUserId = useMemo(readCurrentUserId, []);
  const blockChatMutation = useBlockChatMutation();
  const unblockChatMutation = useUnblockChatMutation();
  const deleteChatMutation = useDeleteChatMutation();
  const chatEntryQuery = useChatEntryQuery({
    initialThread: routeThread,
    threadId: routeThreadId,
  });
  const chatThread = chatEntryQuery.data ?? routeThread;
  const resolvedThreadId = readChatThreadId(chatThread) || routeThreadId;
  const messagesQuery = useChatMessagesQuery(activeThreadId || null);
  const apiMessages = useMemo(() => {
    const lastMessage = readPathRecord(chatThread, ["last_message", "lastMessage"]);

    return dedupeChatMessages([
      ...(messagesQuery.data ?? []),
      ...(lastMessage ? [lastMessage as ChatMessage] : []),
      ...liveMessages,
    ]);
  }, [chatThread, liveMessages, messagesQuery.data]);
  const participantName =
    readPathText(chatThread, [
      "participant.showing_name",
      "participant.showingName",
      "participant.full_name",
      "participant.fullName",
      "participant.name",
      "user.full_name",
      "user.fullName",
      "user.name",
    ]) || "گفتگو";
  const chatCategory = readPathText(chatThread, ["category"]) === "support"
    ? "support"
    : "advertise";
  const participantAvailability = chatThread?.participant?.availability;
  const isChatBlocked = isBlocked || blockedByMe || blockedMe;

  useEffect(() => {
    if (resolvedThreadId) {
      setActiveThreadId(resolvedThreadId);
    }
  }, [resolvedThreadId]);

  useEffect(() => {
    if (!chatThread) return;

    const nextBlockedByMe =
      readPathBoolean(chatThread, ["blocked_by_me", "blockedByMe"]) ?? false;
    const nextBlockedMe =
      readPathBoolean(chatThread, ["blocked_me", "blockedMe"]) ?? false;
    const nextIsBlocked =
      readPathBoolean(chatThread, ["is_blocked", "isBlocked", "blocked"]) ??
      (nextBlockedByMe || nextBlockedMe);

    setBlockedByMe(nextBlockedByMe);
    setBlockedMe(nextBlockedMe);
    setIsBlocked(nextIsBlocked);
  }, [chatThread]);

  useEffect(() => {
    if (!activeThreadId) return;

    const socket = joinChatThread({
      category: chatCategory,
      onJoined: setActiveThreadId,
      threadId: activeThreadId,
    });
    const handleNewMessage = (payload: { data?: unknown; message?: unknown;[key: string]: unknown }) => {
      const data = asRecord(payload.data);
      const rawMessage = payload.message ?? data?.message ?? payload.data ?? payload;

      if (!rawMessage || typeof rawMessage !== "object" || Array.isArray(rawMessage)) return;

      const nextMessage = rawMessage as ChatMessage;
      const body = readChatMessageBody(nextMessage);
      const pendingCount = pendingOutgoingBodiesRef.current.get(body) ?? 0;

      if (pendingCount > 0) {
        pendingOutgoingBodiesRef.current.set(body, pendingCount - 1);
        nextMessage.is_mine = true;
        nextMessage.is_read = false;
        nextMessage.read = false;
        setSentMessages((current) => {
          const optimisticIndex = current.findIndex(
            (message) => message.type === "text" && message.text === body,
          );

          return optimisticIndex < 0
            ? current
            : current.filter((_, index) => index !== optimisticIndex);
        });
      }

      const messageType = readChatMessageType(nextMessage);

      if (messageType === "image") {
        const { attachmentUrl } = readChatMessageAttachment(nextMessage);

        if (pendingOutgoingAttachmentsRef.current.delete(attachmentUrl)) {
          nextMessage.is_mine = true;
        }

        setSentMessages((current) =>
          current.filter(
            (message) => message.type !== "image" || message.attachmentUrl !== attachmentUrl,
          ),
        );
      } else if (messageType === "location") {
        const { latitude, longitude } = readChatMessageLocation(nextMessage);
        const locationKey = `${latitude},${longitude}`;

        if (pendingOutgoingLocationsRef.current.delete(locationKey)) {
          nextMessage.is_mine = true;
        }

        setSentMessages((current) =>
          current.filter(
            (message) =>
              message.type !== "location" ||
              message.latitude !== latitude ||
              message.longitude !== longitude,
          ),
        );
      }

      setLiveMessages((current) => dedupeChatMessages([...current, nextMessage]));
      markChatRead(activeThreadId, chatCategory);
    };
    const handleTyping = (payload: { typing?: boolean; userId?: number | string }) => {
      if (payload.typing) {
        showNotice("در حال نوشتن...");
      }
    };
    const handleRead = (payload: { threadId?: number | string; userId?: number | string }) => {
      const readThreadId = readText(payload.threadId);
      const readerId = readText(payload.userId);

      if (readThreadId && readThreadId !== activeThreadId) return;
      if (readerId && readerId === currentUserId) return;

      setReadThreadIds((current) => new Set(current).add(activeThreadId));
      setLiveMessages((current) => current.map(markMessageAsRead));
      void messagesQuery.refetch();
    };
    const handleError = (payload: { message?: string }) => {
      showNotice(payload.message ?? "ارتباط چت با خطا مواجه شد");
    };

    socket.on("chat:message:new", handleNewMessage);
    socket.on("chat:typing", handleTyping);
    socket.on("chat:read", handleRead);
    socket.on("chat:error", handleError);
    markChatRead(activeThreadId, chatCategory);

    return () => {
      socket.off("chat:message:new", handleNewMessage);
      socket.off("chat:typing", handleTyping);
      socket.off("chat:read", handleRead);
      socket.off("chat:error", handleError);
      leaveChatThread(activeThreadId, chatCategory);
    };
  }, [activeThreadId, chatCategory, currentUserId, messagesQuery.refetch, showNotice]);

  const updateScrollShadow = useCallback(() => {
    const scrollElement = chatScrollRef.current;
    if (!scrollElement) return;
    const distanceFromBottom =
      scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
    setHasMoreMessagesBelow(distanceFromBottom > 8);
  }, []);

  useEffect(() => {
    updateScrollShadow();
    const frame = window.requestAnimationFrame(updateScrollShadow);
    window.addEventListener("resize", updateScrollShadow);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateScrollShadow);
    };
  }, [apiMessages.length, sentMessages.length, updateScrollShadow]);

  useEffect(() => {
    const scrollElement = chatScrollRef.current;
    if (!scrollElement) return;

    scrollElement.scrollTo({ top: scrollElement.scrollHeight, behavior: "smooth" });
  }, [apiMessages.length, sentMessages.length]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const changeDraftMessage = (nextMessage: string) => {
    setDraftMessage(nextMessage);

    if (!activeThreadId) return;

    sendChatTyping({ category: chatCategory, threadId: activeThreadId, typing: true });

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      sendChatTyping({ category: chatCategory, threadId: activeThreadId, typing: false });
      typingTimeoutRef.current = null;
    }, 1200);
  };

  const sendMessage = (nextMessage = draftMessage) => {
    if (isChatBlocked) return;

    const text = nextMessage.trim();
    if (!text) return;

    if (activeThreadId) {
      pendingOutgoingBodiesRef.current.set(
        text,
        (pendingOutgoingBodiesRef.current.get(text) ?? 0) + 1,
      );
      setSentMessages((current) => [
        ...current,
        { id: createChatMessageId(), text, type: "text" },
      ]);
      void sendChatTextMessage({
        body: text,
        category: chatCategory,
        threadId: activeThreadId,
      }).catch(() => {
        setSentMessages((current) => {
          const optimisticIndex = current.findIndex(
            (message) => message.type === "text" && message.text === text,
          );

          return optimisticIndex < 0
            ? current
            : current.filter((_, index) => index !== optimisticIndex);
        });
        showNotice("ارسال پیام با خطا مواجه شد");
      });
    }

    setDraftMessage("");
  };

  const navigateToChatHome = () => {
    window.history.pushState({}, "", "/chat");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const confirmBlockChat = () => {
    if (!activeThreadId || blockChatMutation.isPending) return;

    blockChatMutation.mutate(activeThreadId, {
      onError: () => {
        showNotice("مسدود کردن گفتگو با خطا مواجه شد");
      },
      onSuccess: () => {
        setBlockedByMe(true);
        setIsBlocked(true);
        setDraftMessage("");
        setIsSendFileSheetOpen(false);
        setIsBlockConfirmSheetOpen(false);
      },
    });
  };

  const unblockCurrentChat = () => {
    if (!activeThreadId || unblockChatMutation.isPending) return;

    unblockChatMutation.mutate(activeThreadId, {
      onError: () => {
        showNotice("رفع مسدودیت گفتگو با خطا مواجه شد");
      },
      onSuccess: () => {
        setBlockedByMe(false);
        setIsBlocked(blockedMe);
      },
    });
  };

  const handleSettingsSelect = (id: string, title: string) => {
    setIsSettingsSheetOpen(false);

    if (!activeThreadId) {
      showNotice("ابتدا گفتگو را باز کنید");
      return;
    }

    if (id === "block") {
      setIsBlockConfirmSheetOpen(true);
      return;
    }

    if (id === "unblock") {
      unblockCurrentChat();
      return;
    }

    if (id === "delete") {
      deleteChatMutation.mutate(activeThreadId, {
        onError: () => {
          showNotice("حذف گفتگو با خطا مواجه شد");
        },
        onSuccess: () => {
          showNotice("گفتگو حذف شد");
          navigateToChatHome();
        },
      });
      return;
    }

    if (id === "report") {
      window.history.pushState(
        { returnTo: window.location.pathname },
        "",
        `/chat/${encodeURIComponent(activeThreadId)}/report`,
      );
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    showNotice(`${title} انتخاب شد`);
  };

  const sendImageFiles = async (files: FileList | null) => {
    const selectedFiles = Array.from(files ?? []);
    const oversizedFile = selectedFiles.find((file) => file.size > 10 * 1024 * 1024);

    if (oversizedFile) {
      showNotice("حجم هر فایل نباید بیشتر از ۱۰ مگابایت باشد");
      return;
    }

    const imageFiles = selectedFiles.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      showNotice("لطفا فقط فایل تصویر انتخاب کنید");
      return;
    }

    if (!activeThreadId || isUploadingImages) {
      if (!activeThreadId) showNotice("ابتدا گفتگو را باز کنید");
      return;
    }

    setIsUploadingImages(true);
    showNotice("در حال ارسال تصویر...");

    const results = await Promise.allSettled(
      imageFiles.map(async (file) => {
        const attachment = await uploadChatAttachment(activeThreadId, file);

        if (!attachment.status || !attachment.url) {
          throw new Error("آپلود تصویر ناموفق بود");
        }

        const optimisticMessage: SentChatMessage = {
          attachmentUrl: attachment.url,
          fileName: attachment.file_name || file.name || "تصویر ارسالی",
          id: createChatMessageId(),
          imageUrl: getApiAssetUrl(attachment.url),
          type: "image",
        };

        setSentMessages((current) => [...current, optimisticMessage]);
        pendingOutgoingAttachmentsRef.current.add(attachment.url);
        sendChatImageMessage({
          attachmentUrl: attachment.url,
          category: chatCategory,
          fileName: attachment.file_name,
          mimeType: attachment.mime_type,
          size: attachment.size,
          threadId: activeThreadId,
        });
      }),
    );
    const failedResult = results.find((result) => result.status === "rejected");

    if (failedResult?.status === "rejected") {
      showNotice(getApiErrorMessage(failedResult.reason, "ارسال تصویر با خطا مواجه شد"));
    } else {
      showNotice(imageFiles.length > 1 ? "تصاویر ارسال شدند" : "تصویر ارسال شد");
    }

    setIsUploadingImages(false);
  };

  const sendCurrentLocation = () => {
    if (isSendingLocation || !activeThreadId) {
      if (!activeThreadId) showNotice("ابتدا گفتگو را باز کنید");
      return;
    }

    setIsSendingLocation(true);
    showNotice("در حال دریافت موقعیت شما...");

    void getBrowserLocation({ maximumAge: 30_000, timeout: 15_000 })
      .then(({ latitude, longitude }) => {
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

        setSentMessages((current) => [
          ...current,
          {
            id: createChatMessageId(),
            type: "location",
            latitude,
            longitude,
            mapsUrl,
          },
        ]);
        pendingOutgoingLocationsRef.current.add(`${latitude},${longitude}`);
        sendChatLocationMessage({
          category: chatCategory,
          latitude,
          longitude,
          threadId: activeThreadId,
        });
        showNotice("موقعیت ارسال شد");
      })
      .catch((error) => {
        showNotice(getBrowserLocationNotice(error));
      })
      .finally(() => {
        setIsSendingLocation(false);
      });
  };

  const handleSendFileSelect = (id: SendFileOption["id"]) => {
    setIsSendFileSheetOpen(false);

    if (id === "camera") {
      if (cameraInputRef.current) {
        cameraInputRef.current.value = "";
        cameraInputRef.current.click();
      }
      return;
    }

    if (id === "gallery") {
      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
        galleryInputRef.current.click();
      }
      return;
    }

    if (id === "map") {
      sendCurrentLocation();
    }
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <ChatDetailHeader
        onOpenMenu={() => setIsSettingsSheetOpen(true)}
        title={participantName}
      />
      <ChatPropertyStrip thread={chatThread} />

      <div className="relative min-h-0 flex-1 bg-white">
        <main
          ref={chatScrollRef}
          onScroll={updateScrollShadow}
          className={`h-full overflow-y-auto bg-white px-4 pt-4 ${isChatBlocked ? "pb-[84px]" : "pb-[92px]"}`}
        >
          <ChatParticipantAvailabilityCard availability={participantAvailability} />

          <div className="space-y-3">
            {messagesQuery.isLoading && apiMessages.length === 0 ? (
              <Typography as="p" variant="body" size="small" weight="regular" className="py-6 text-center text-xs text-[#808080]">
                در حال دریافت پیام‌ها...
              </Typography>
            ) : null}

            {!messagesQuery.isLoading && apiMessages.length === 0 ? (
              <>
                <ChatDateChip />
                <Typography as="p" variant="body" size="small" weight="regular" className="py-6 text-center text-xs text-[#808080]">
                  هنوز پیامی در این گفتگو ثبت نشده است.
                </Typography>
              </>
            ) : null}

            {apiMessages.map((apiMessage, index) => (
              <ChatApiMessageBubble
                currentUserId={currentUserId}
                forceRead={readThreadIds.has(activeThreadId)}
                key={getChatMessageId(apiMessage, index)}
                message={apiMessage}
              />
            ))}

            {sentMessages.map((sentMessage) => (
              <SentChatMessageBubble message={sentMessage} key={sentMessage.id} />
            ))}
          </div>
        </main>
      </div>

      <input
        ref={cameraInputRef}
        accept="image/*"
        aria-hidden="true"
        capture="environment"
        className="sr-only"
        onChange={(event) => sendImageFiles(event.target.files)}
        tabIndex={-1}
        type="file"
      />
      <input
        ref={galleryInputRef}
        accept="image/*"
        aria-hidden="true"
        className="sr-only"
        multiple
        onChange={(event) => sendImageFiles(event.target.files)}
        tabIndex={-1}
        type="file"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[15px] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.88)_42%,#fff_100%)]"
      />

      <div className="absolute inset-x-0 bottom-0 z-30">
        {isChatBlocked ? (
          <ChatBlockedFooter
            blockedMe={blockedMe && !blockedByMe}
            isPending={unblockChatMutation.isPending}
            onUnblock={unblockCurrentChat}
          />
        ) : (
          <ChatComposer
            message={draftMessage}
            onChangeMessage={changeDraftMessage}
            onOpenAttach={() => setIsSendFileSheetOpen(true)}
            onSend={() => sendMessage()}
          />
        )}
      </div>
      <SendFileBottomSheet
        isOpen={!isChatBlocked && isSendFileSheetOpen}
        onClose={() => setIsSendFileSheetOpen(false)}
        onSelect={handleSendFileSelect}
      />
      <ChatSettingsBottomSheet
        isBlockedByMe={blockedByMe}
        isOpen={isSettingsSheetOpen}
        onClose={() => setIsSettingsSheetOpen(false)}
        onSelect={handleSettingsSelect}
      />
      <BlockChatConfirmBottomSheet
        isOpen={isBlockConfirmSheetOpen}
        isPending={blockChatMutation.isPending}
        onCancel={() => {
          if (!blockChatMutation.isPending) setIsBlockConfirmSheetOpen(false);
        }}
        onConfirm={confirmBlockChat}
      />
      <TransientNotice className="bottom-20" message={message} />
    </PageFrame>
  );
}

export function UserChatHomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<ChatFilter | null>(null);
  const [showBlocked, setShowBlocked] = useState(false);
  const [query, setQuery] = useState("");
  const deferredSearch = useDebouncedValue(query.trim(), 300);
  const { message, showNotice } = useTransientNotice();
  useEffect(() => {
    const notice = window.sessionStorage.getItem(CHAT_RENAME_NOTICE_STORAGE_KEY);
    if (!notice) return;

    window.sessionStorage.removeItem(CHAT_RENAME_NOTICE_STORAGE_KEY);
    showNotice(notice);
  }, [showNotice]);
  const {
    data: chatsPage,
    error: chatsError,
    isError: isChatsError,
    isLoading: isChatsLoading,
    refetch: refetchChats,
  } = useChatsQuery({
    blocked: showBlocked ? true : undefined,
    category: "advertise",
    filter: activeFilter ?? undefined,
    page: 1,
    perPage: 10,
    search: deferredSearch || undefined,
  });
  const chats = useMemo(
    () => (chatsPage?.data ?? []).map(mapChatThreadToChatItem),
    [chatsPage?.data],
  );
  const RequestErrorState = isChatsError ? getRequestErrorState(chatsError) : null;

  const handleMenuSelect = useCallback((id: string) => {
    setIsMenuOpen(false);

    if (id === "hours") {
      window.history.pushState({}, "", "/chat/response-time");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    if (id === "rename") {
      window.history.pushState({}, "", "/chat/rename");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    if (id === "bulk-delete") {
      window.history.pushState({}, "", "/chat/bulk-delete");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, []);

  const visibleChats = chats;

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
    setQuery("");
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setQuery("");
  }, []);

  const selectFilter = useCallback((filter: ChatFilter) => {
    setActiveFilter((current) => (current === filter ? null : filter));
  }, []);

  return (
    <TopBarNavigationLayout
      activeKey="chat"
      contentClassName="bg-white"
      fixedAfterTopBar={
        <FilterTabs
          activeFilter={activeFilter}
          onSelect={selectFilter}
        />
      }
      frameClassName="relative bg-[#cccccc] text-[#1a1a1a] [direction:rtl]"
      overlay={
        <ChatMenuBottomSheet
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          onShowBlockedChange={setShowBlocked}
          onShowMyAdsChange={(checked) => {
            setActiveFilter(checked ? "my_ads" : null);
          }}
          onSelect={handleMenuSelect}
          showBlocked={showBlocked}
          showMyAds={activeFilter === "my_ads"}
        />
      }
      topBar={
        isSearchOpen ? (
          <ChatSearchHeader
            onClose={closeSearch}
            onQueryChange={setQuery}
            query={query}
          />
        ) : (
          <ChatHeader
            onOpenMenu={() => setIsMenuOpen(true)}
            onOpenSearch={openSearch}
          />
        )
      }
    >
      {isChatsLoading && chats.length === 0 ? <ChatListSkeleton /> : null}
      {RequestErrorState && chats.length === 0 ? (
        <RequestErrorState className="min-h-[420px]" onRetry={() => void refetchChats()} />
      ) : null}
      {visibleChats.map((item, index) => {
        const chatId = item.id ?? String(index);

        return (
          <ChatCard
            chatId={chatId}
            index={index}
            isBulkDeleteMode={false}
            isSelected={false}
            item={item}
            key={chatId}
            onToggleSelected={() => undefined}
          />
        );
      })}
      {!isChatsLoading && !isChatsError && visibleChats.length === 0 ? (
        query.trim() || activeFilter ? (
          <SearchEmptyState />
        ) : (
          <Typography as="p" variant="body" size="medium" weight="regular" className="py-16 text-center text-sm text-[#808080]">هنوز گفتگویی ندارید.</Typography>
        )
      ) : null}
      <TransientNotice message={message} />
    </TopBarNavigationLayout>
  );
}

function ChatListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-px bg-white">
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="h-[140px] animate-pulse border-b border-[#f0f0f0] px-4 py-4"
          key={index}
        >
          <div className="mb-4 h-5 w-3/4 rounded bg-[#f0f0f0]" />
          <div className="mb-5 h-4 w-full rounded bg-[#f0f0f0]" />
          <div className="flex items-center gap-3">
            <div className="h-12 w-[72px] rounded bg-[#f0f0f0]" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-1/2 rounded bg-[#f0f0f0]" />
              <div className="h-5 w-4/5 rounded bg-[#f0f0f0]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function BulkSelectAllControl({
  checked,
  disabled,
  onToggle,
}: {
  checked: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <Button unstyled
      aria-pressed={checked}
      className="flex h-11 items-center gap-3 text-sm font-semibold leading-5 text-[#1a1a1a] disabled:opacity-50"
      disabled={disabled}
      onClick={onToggle}
      type="button"
    >
      <Typography as="span" variant="body" size="medium" weight="regular"
        className={`grid h-[18px] w-[18px] place-items-center rounded border ${checked
          ? "border-[#808080] bg-white text-[#4d4d4d]"
          : "border-[#808080] bg-white text-transparent"
          }`}
      >
        <CheckIcon className="h-[14px] w-[14px]" />
      </Typography>
      <Typography as="span" variant="body" size="medium" weight="regular">انتخاب همه</Typography>
    </Button>
  );
}

type ChatPageShellProps = {
  action?: ReactNode;
  children: ReactNode;
  onBack?: () => void;
  title: string;
};

function ChatPageShell({ action, children, onBack, title }: ChatPageShellProps) {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backTo="/chat"
        onBack={onBack}
        startSlot={
          <div className="flex h-12 w-12 shrink-0 items-center justify-center">
            {action}
          </div>
        }
        title={title}
      />
      <div className="min-h-0 flex flex-1 flex-col">
        {children}
      </div>
    </PageFrame>
  );
}

export function UserChatBulkDeletePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBlocked, setShowBlocked] = useState(false);
  const [showMyAds, setShowMyAds] = useState(false);
  const [selectedChatIds, setSelectedChatIds] = useState<Set<string>>(() => new Set());
  const [deleteError, setDeleteError] = useState("");
  const { message } = useTransientNotice();
  const {
    data: chatsPage,
    error,
    isError,
    isLoading,
    refetch,
  } = useChatsQuery({
    blocked: showBlocked ? true : undefined,
    category: "advertise",
    filter: showMyAds ? "my_ads" : undefined,
    page: 1,
    perPage: 50,
  });
  const deleteChatsMutation = useDeleteChatsMutation();
  const chats = useMemo(
    () => (chatsPage?.data ?? []).map(mapChatThreadToChatItem),
    [chatsPage?.data],
  );
  const selectableChatIds = useMemo(
    () => chats.map((item) => item.id).filter((id): id is string => Boolean(id)),
    [chats],
  );
  const areAllSelected = selectableChatIds.length > 0
    && selectableChatIds.every((id) => selectedChatIds.has(id));
  const RequestErrorState = isError ? getRequestErrorState(error) : null;

  const toggleSelectedChat = useCallback((id: string) => {
    if (!id) return;

    setSelectedChatIds((current) => {
      const next = new Set(current);

      if (next.has(id)) next.delete(id);
      else next.add(id);

      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedChatIds((current) => {
      const alreadySelected = selectableChatIds.length > 0
        && selectableChatIds.every((id) => current.has(id));

      return alreadySelected ? new Set() : new Set(selectableChatIds);
    });
  }, [selectableChatIds]);

  const deleteSelectedChats = useCallback(() => {
    const threadIds = [...selectedChatIds];
    if (threadIds.length === 0 || deleteChatsMutation.isPending) return;

    setDeleteError("");
    deleteChatsMutation.mutate(threadIds, {
      onError: () => {
        setDeleteError("حذف گفتگوها با خطا مواجه شد. دوباره تلاش کنید.");
      },
      onSuccess: () => {
        window.history.replaceState({}, "", "/chat");
        window.dispatchEvent(new PopStateEvent("popstate"));
      },
    });
  }, [deleteChatsMutation, selectedChatIds]);

  const handleMenuSelect = useCallback((id: string) => {
    setIsMenuOpen(false);

    if (id === "hours") {
      window.history.pushState({}, "", "/chat/response-time");
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }

    if (id === "rename") {
      window.history.pushState({}, "", "/chat/rename");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }
  }, []);

  return (
    <ChatPageShell
      action={
        <Button unstyled
          aria-label="گزینه‌های بیشتر"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-[#0048c440] active:bg-[#1a1a1a0a]"
          onClick={() => setIsMenuOpen(true)}
          type="button"
        >
          <MoreVerticalIcon className="h-6 w-6" />
        </Button>
      }
      title="حذف گروهی چت‌ها"
    >
      <main className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-white pb-[72px]">
        {isLoading && chats.length === 0 ? <ChatListSkeleton count={5} /> : null}
        {RequestErrorState && chats.length === 0 ? (
          <RequestErrorState className="min-h-[420px]" onRetry={() => void refetch()} />
        ) : null}
        {chats.map((item, index) => {
          const chatId = item.id ?? "";

          return (
            <ChatCard
              chatId={chatId}
              index={index}
              isBulkDeleteMode
              isSelected={Boolean(chatId && selectedChatIds.has(chatId))}
              item={item}
              key={chatId || `chat-${index}`}
              onToggleSelected={toggleSelectedChat}
            />
          );
        })}
        {!isLoading && !isError && chats.length === 0 ? (
          <Typography as="p" variant="body" size="medium" weight="regular" className="py-16 text-center text-sm text-[#808080]">گفتگویی برای حذف وجود ندارد</Typography>
        ) : null}
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-20 h-[72px] border-t border-[#f0f0f0] bg-white px-4 shadow-[0_-8px_22px_rgba(0,0,0,0.06)]">
        {deleteError ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="absolute inset-x-4 bottom-full mb-2 rounded-lg bg-white px-3 py-2 text-center text-xs leading-5 text-[#c11004] shadow-sm">
            {deleteError}
          </Typography>
        ) : null}
        <div className="flex h-full items-center justify-between gap-4 [direction:ltr]">
          <Button unstyled
            className="h-[42px] w-[191px] shrink-0 rounded-lg bg-[#0048c4] px-6 text-sm font-semibold leading-5 text-white disabled:cursor-not-allowed disabled:opacity-40"
            disabled={selectedChatIds.size === 0 || deleteChatsMutation.isPending}
            onClick={deleteSelectedChats}
            type="button"
          >
            {deleteChatsMutation.isPending ? "در حال حذف..." : "حذف"}
          </Button>
          <BulkSelectAllControl
            checked={areAllSelected}
            disabled={selectableChatIds.length === 0 || deleteChatsMutation.isPending}
            onToggle={toggleSelectAll}
          />
        </div>
      </footer>

      <ChatMenuBottomSheet
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onShowBlockedChange={(checked) => {
          setShowBlocked(checked);
          setSelectedChatIds(new Set());
        }}
        onShowMyAdsChange={(checked) => {
          setShowMyAds(checked);
          setSelectedChatIds(new Set());
        }}
        onSelect={handleMenuSelect}
        showBlocked={showBlocked}
        showMyAds={showMyAds}
      />
      <TransientNotice className="bottom-20" message={message} />
    </ChatPageShell>
  );
}
