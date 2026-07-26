import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";

import {
  joinChatThread,
  leaveChatThread,
  markChatRead,
  sendChatTextMessage,
  sendChatTyping,
} from "../../api/chat-socket";
import { getRequestErrorState } from "../../components/ErrorState";
import { SearchEmptyState } from "../../components/SearchEmptyState";
import { useChatMessagesQuery, useChatsQuery } from "../../hooks/chat.hooks";
import type { ChatMessage, ChatThread } from "../../services/chat.service";

type DashboardChatFilter = "all" | "support" | "mine";

type DashboardChatListItem = {
  adLabel?: string;
  contactBadge?: string;
  date: string;
  id: string;
  isMineAd?: boolean;
  isSupport?: boolean;
  lastMessage: string;
  messages: DashboardLocalMessage[];
  source: "api" | "mock";
  subtitle: string;
  title: string;
  unreadCount?: number;
};

type DashboardLocalMessage = {
  body: string;
  direction: "incoming" | "outgoing";
  id: string;
  isRead?: boolean;
  time: string;
  type: "message";
};

type RenderedDashboardMessage = DashboardLocalMessage | { id: string; label: string; type: "date" };

const fallbackConversations: DashboardChatListItem[] = [
  {
    date: "۱۲/۲",
    id: "support-naser-ashrafi",
    isMineAd: true,
    isSupport: true,
    lastMessage: "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر و تعداد نفرات را ارسال کنید...",
    messages: [
      {
        body: "سلام\nقیمت این خونه ای که گذاشتین چقدر هست و اگر بخواهم رهن و بیشتر کنم امکانش هست؟",
        direction: "incoming",
        id: "m-1",
        time: "۱۸:۲۱",
        type: "message",
      },
      {
        body: "سلام دوست عزیز\nقیمت و داخل آگهی گذاشتم و قیمت مناسبی هم هست\nرهن و اجاره قابل تبدیل هست",
        direction: "outgoing",
        id: "m-2",
        isRead: true,
        time: "۱۸:۲۱",
        type: "message",
      },
      {
        body: "خیلی ممنونم",
        direction: "incoming",
        id: "m-3",
        time: "۱۸:۲۱",
        type: "message",
      },
      {
        body: "خواهش میکنم",
        direction: "outgoing",
        id: "m-4",
        isRead: true,
        time: "۱۸:۲۱",
        type: "message",
      },
    ],
    source: "mock",
    subtitle: "باغ ویلا با استخر آب گرم",
    title: "ناصر اشرفی",
    unreadCount: 2,
  },
  {
    contactBadge: "محمد زمانی",
    date: "۱۲/۲",
    id: "support-rasoul-esmaeili",
    isMineAd: true,
    isSupport: true,
    lastMessage: "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر را ارسال کنید...",
    messages: [
      {
        body: "سلام، برای بازدید باغ ویلا چه ساعتی مناسب است؟",
        direction: "incoming",
        id: "m-5",
        time: "۱۸:۰۵",
        type: "message",
      },
      {
        body: "سلام، امروز از ساعت ۶ عصر امکان بازدید دارید.",
        direction: "outgoing",
        id: "m-6",
        isRead: true,
        time: "۱۸:۱۰",
        type: "message",
      },
    ],
    source: "mock",
    subtitle: "باغ ویلا با استخر آب گرم",
    title: "رسول اسماعیلیان",
    unreadCount: 2,
  },
  {
    contactBadge: "محمد زمانی",
    date: "۱۲/۲",
    id: "support-alireza-abedini",
    isMineAd: true,
    isSupport: true,
    lastMessage: "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر را ارسال کنید...",
    messages: [
      {
        body: "سلام، شرایط تبدیل رهن و اجاره چطور است؟",
        direction: "incoming",
        id: "m-7",
        time: "۱۷:۴۵",
        type: "message",
      },
    ],
    source: "mock",
    subtitle: "باغ ویلا با استخر آب گرم",
    title: "علیرضا عابدینی",
  },
  {
    contactBadge: "محمد زمانی",
    date: "۱۲/۲",
    id: "support-mohammad-zarifpour",
    isMineAd: true,
    isSupport: true,
    lastMessage: "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر را ارسال کنید...",
    messages: [
      {
        body: "سلام، امکان اجاره برای آخر هفته وجود دارد؟",
        direction: "incoming",
        id: "m-8",
        time: "۱۶:۲۲",
        type: "message",
      },
    ],
    source: "mock",
    subtitle: "باغ ویلا با استخر آب گرم",
    title: "محمد ظریف‌پور",
  },
  {
    contactBadge: "محمد زمانی",
    date: "۱۲/۲",
    id: "support-hossein-abedi",
    isMineAd: true,
    isSupport: true,
    lastMessage: "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر را ارسال کنید...",
    messages: [
      {
        body: "سلام، لطفا موقعیت دقیق ملک را ارسال می‌کنید؟",
        direction: "incoming",
        id: "m-9",
        time: "۱۵:۴۰",
        type: "message",
      },
    ],
    source: "mock",
    subtitle: "باغ ویلا با استخر آب گرم",
    title: "حسین عابدی",
  },
];

const filters: Array<{ id: DashboardChatFilter; label: string }> = [
  { id: "all", label: "همه" },
  { id: "support", label: "پشتیبانی" },
  { id: "mine", label: "آگهی‌های من" },
];

const createLocalMessageId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

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

function readNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

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

function readThreadId(thread: ChatThread) {
  return readPathText(thread, ["id", "_id", "threadId", "thread_id"]);
}

function readMessageBody(message: ChatMessage) {
  return readPathText(message, ["body", "text", "message", "content", "description"]);
}

function readMessageSenderId(message: ChatMessage) {
  return readPathText(message, [
    "sender_id",
    "senderId",
    "user_id",
    "userId",
    "sender._id",
    "sender.id",
    "user._id",
    "user.id",
  ]);
}

function isOutgoingApiMessage(message: ChatMessage) {
  return (
    message.is_mine === true ||
    message.isMine === true ||
    message.from_me === true ||
    message.fromMe === true ||
    readMessageSenderId(message) === "me"
  );
}

function isReadApiMessage(message: ChatMessage) {
  return (
    message.is_read === true ||
    message.isRead === true ||
    message.read === true ||
    Boolean(message.read_at ?? message.readAt) ||
    (Array.isArray(message.read_by) && message.read_by.length > 0) ||
    message.status === "read"
  );
}

function formatFaTime(value: unknown) {
  const text = readText(value);

  if (!text) return "۱۸:۲۱";

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatFaDate(value: unknown) {
  const text = readText(value);

  if (!text) return "۱۲/۲";

  const date = new Date(text);

  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "numeric",
  }).format(date);
}

function mapThreadToListItem(thread: ChatThread, index: number): DashboardChatListItem {
  const ad = readPathRecord(thread, ["ad", "advertise", "advertisement", "property"]);
  const lastMessage = readPathRecord(thread, ["last_message", "lastMessage", "message"]);
  const user =
    readPathRecord(thread, [
      "user",
      "sender",
      "receiver",
      "participant",
      "customer",
      "consultant",
      "last_message.user",
    ]) ?? {};
  const id = readThreadId(thread) || String(index + 1);
  const unreadCount = readNumber(thread.unread_count ?? thread.unreadCount);
  const adLabel = readPathText(thread, ["ad_label", "adLabel"]);
  const isMineAd =
    thread.is_mine === true ||
    thread.isMine === true ||
    adLabel.includes("من") ||
    readPathText(ad, ["owner_type", "ownerType"]) === "me";

  return {
    adLabel: adLabel || (isMineAd ? "آگهی من" : "آگهی دیگران"),
    contactBadge: readPathText(thread, ["assignee.name", "support.name", "agent.name"]),
    date: formatFaDate(thread.updated_at ?? thread.created_at ?? readPathText(lastMessage, ["created_at", "createdAt", "date"])),
    id,
    isMineAd,
    isSupport: thread.is_support !== false && thread.support !== false,
    lastMessage:
      readPathText(lastMessage, ["text", "message", "body", "content", "description"]) ||
      readText(thread.message) ||
      readText(thread.last_message) ||
      "سلام وقت بخیر جهت استعلام قیمت و مشاهده باغ ویلا لطفا تاریخ مدنظر را ارسال کنید...",
    messages: [],
    source: "api",
    subtitle:
      readPathText(thread, ["ad_title", "adTitle"]) ||
      readPathText(ad, ["title", "label", "name"]) ||
      "باغ ویلا با استخر آب گرم",
    title:
      readPathText(thread, ["user_name", "userName", "name", "full_name"]) ||
      readPathText(user, ["name", "full_name", "username", "mobile", "phone"]) ||
      "ناصر اشرفی",
    unreadCount,
  };
}

function mapApiMessageToLocal(message: ChatMessage, index: number): DashboardLocalMessage | null {
  const body = readMessageBody(message);

  if (!body) return null;

  return {
    body,
    direction: isOutgoingApiMessage(message) ? "outgoing" : "incoming",
    id: readPathText(message, ["id", "_id", "messageId", "message_id"]) || `api-${index}`,
    isRead: isReadApiMessage(message),
    time: formatFaTime(message.created_at ?? message.createdAt ?? message.date),
    type: "message",
  };
}

function DashboardSearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M20.9999 21L16.6499 16.65"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function DashboardMenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 7H19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M5 12H19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="M5 17H19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function MoreVerticalIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 6H12.01M12 12H12.01M12 18H12.01"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.8"
      />
    </svg>
  );
}

function LinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.086 5.868 13.641 4.314C15.358 2.596 18.103 2.558 19.773 4.227C21.442 5.897 21.404 8.642 19.686 10.359L10.359 19.686C8.642 21.404 5.897 21.442 4.227 19.773C2.558 18.103 2.596 15.358 4.314 13.641L7.811 10.143C8.885 9.07 10.6 9.046 11.644 10.089C12.687 11.133 12.663 12.848 11.59 13.922L9.647 15.865"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function SendIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M10.6 13.4 13.4 10.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6" />
      <path
        d="M10.6 13.4 3.701 11.85C2.823 11.651 2.749 10.428 3.597 10.125L17.795 5.054C18.511 4.799 19.201 5.489 18.946 6.204L13.875 20.403C13.572 21.251 12.349 21.177 12.15 20.299L10.6 13.4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function DoubleTickIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.8 9.5 5.7 12.3 11.3 6.7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M8.2 12.2 14.8 5.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ContactBadgeIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.6 10.4C4.15 9.45 5.23 8.85 6.5 8.85H7.5C8.77 8.85 9.85 9.45 10.4 10.4M9.2 4.95C9.2 6.17 8.22 7.15 7 7.15C5.78 7.15 4.8 6.17 4.8 4.95C4.8 3.73 5.78 2.75 7 2.75C8.22 2.75 9.2 3.73 9.2 4.95Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.1"
      />
    </svg>
  );
}

function UnreadBadge({ count }: { count?: number }) {
  if (!count) return null;

  return (
    <span className="grid h-4 min-w-4 place-items-center rounded-full bg-[#0048C4] px-1 text-[10px] font-semibold leading-4 text-white">
      {new Intl.NumberFormat("fa-IR").format(count)}
    </span>
  );
}

function ContactBadge({ label }: { label?: string }) {
  if (!label) return null;

  return (
    <span className="inline-flex h-6 max-w-[92px] items-center gap-1 rounded-lg bg-[#E8F1FF] px-2 text-[10px] font-medium leading-4 text-[#0048C4]">
      <ContactBadgeIcon className="h-3 w-3 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}

function ChatListCard({
  item,
  isActive,
  onSelect,
}: {
  item: DashboardChatListItem;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      aria-current={isActive ? "true" : undefined}
      className="group w-full border-b border-[#F0F0F0] px-4 py-2 text-right focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048C440]"
      onClick={onSelect}
      type="button"
    >
      <article
        className={`min-h-[80px] rounded-xl px-4 py-3 transition-colors ${
          isActive ? "bg-[#EAF1FC]" : "bg-white group-hover:bg-[#F7F9FD]"
        }`}
      >
        <div className="flex items-center justify-between gap-3 [direction:ltr]">
          <span className="flex shrink-0 items-center gap-2 text-[11px] font-normal leading-4 text-[#808080]">
            <span>{item.date}</span>
            <UnreadBadge count={item.unreadCount} />
          </span>
          <strong className="min-w-0 truncate text-sm font-semibold leading-5 text-[#1A1A1A]">
            {item.title}
          </strong>
        </div>
        <p className="mt-3 line-clamp-1 text-right text-[11px] font-normal leading-5 text-[#4D4D4D]">
          {item.lastMessage}
        </p>
        {item.contactBadge ? (
          <div className="mt-2 flex justify-end">
            <ContactBadge label={item.contactBadge} />
          </div>
        ) : null}
      </article>
    </button>
  );
}

function DashboardChatSidebar({
  activeFilter,
  activeId,
  conversations,
  onChangeFilter,
  onChangeQuery,
  onSelectConversation,
  query,
}: {
  activeFilter: DashboardChatFilter;
  activeId?: string;
  conversations: DashboardChatListItem[];
  onChangeFilter: (filter: DashboardChatFilter) => void;
  onChangeQuery: (query: string) => void;
  onSelectConversation: (id: string) => void;
  query: string;
}) {
  return (
    <aside className="flex h-full w-[320px] shrink-0 flex-col border-l border-[#CCCCCC] bg-white">
      <div className="flex h-[88px] shrink-0 items-center justify-between gap-5 border-b border-[#E6E6E6] px-6 [direction:ltr]">
        <label className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-[#F0F0F0] px-5 [direction:ltr]">
          <DashboardSearchIcon className="h-6 w-6 shrink-0 text-[#4D4D4D]" />
          <span className="sr-only">جستجو در چت‌ها</span>
          <input
            className="h-full min-w-0 flex-1 border-0 bg-transparent text-right text-xs font-normal leading-5 text-[#1A1A1A] outline-none placeholder:text-[#808080]"
            dir="rtl"
            onChange={(event) => onChangeQuery(event.target.value)}
            placeholder="جستجو در چت‌ها"
            type="search"
            value={query}
          />
        </label>
        <button
          aria-label="منوی پیام‌ها"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#4D4D4D] transition-colors hover:bg-[#F5F5F5] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048C440]"
          type="button"
        >
          <DashboardMenuIcon className="h-6 w-6" />
        </button>
      </div>

      <nav className="flex h-[72px] shrink-0 items-end gap-9 overflow-hidden border-b border-[#E6E6E6] px-6 [direction:rtl]">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;

          return (
            <button
              aria-pressed={isActive}
              className={`relative h-full shrink-0 px-1 text-sm font-semibold leading-5 transition-colors focus-visible:outline-3 focus-visible:outline-inset focus-visible:outline-[#0048C440] ${
                isActive ? "text-[#0048C4]" : "text-[#4D4D4D] hover:text-[#1A1A1A]"
              }`}
              key={filter.id}
              onClick={() => onChangeFilter(filter.id)}
              type="button"
            >
              <span className="flex h-full items-center">{filter.label}</span>
              {isActive ? (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-t bg-[#0048C4]" />
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto py-0">
        {conversations.map((item) => (
          <ChatListCard
            isActive={activeId === item.id}
            item={item}
            key={item.id}
            onSelect={() => onSelectConversation(item.id)}
          />
        ))}
        {conversations.length === 0 ? <SearchEmptyState className="min-h-[420px]" /> : null}
      </div>
    </aside>
  );
}

function ChatDateChip({ label }: { label: string }) {
  return (
    <div className="flex justify-center py-1">
      <span className="text-xs font-normal leading-5 text-[#808080]">{label}</span>
    </div>
  );
}

function ChatBubble({ message }: { message: DashboardLocalMessage }) {
  const isOutgoing = message.direction === "outgoing";

  return (
    <div className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[510px] rounded-2xl px-5 py-4 text-right ${
          isOutgoing ? "bg-[#E5F6EE]" : "bg-[#F5F5F5]"
        }`}
        dir="rtl"
      >
        <p className="whitespace-pre-line break-words text-base font-normal leading-7 text-[#1A1A1A] [overflow-wrap:anywhere]">
          {message.body}
        </p>
        <div
          className={`mt-1 flex items-center gap-2 text-sm font-normal leading-5 ${
            isOutgoing ? "justify-end text-[#4D4D4D] [direction:ltr]" : "justify-start text-[#808080]"
          }`}
        >
          <span>{message.time}</span>
          {isOutgoing ? (
            <DoubleTickIcon className={`h-5 w-5 ${message.isRead ? "text-[#4D4D4D]" : "text-[#808080]"}`} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function DashboardChatHeader({ conversation }: { conversation?: DashboardChatListItem }) {
  return (
    <header className="relative h-[88px] shrink-0 border-b border-[#CCCCCC] bg-white">
      <button
        aria-label="گزینه‌های گفتگو"
        className="absolute left-6 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-[#1A1A1A] transition-colors hover:bg-[#F5F5F5] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048C440]"
        type="button"
      >
        <MoreVerticalIcon className="h-6 w-6" />
      </button>

      <div className="absolute inset-x-20 top-1/2 -translate-y-1/2 text-center">
        <h1 className="m-0 truncate text-sm font-semibold leading-5 text-[#1A1A1A]">
          {conversation?.title ?? "ناصر اشرفی"}
        </h1>
        <p className="m-0 mt-2 truncate text-xs font-normal leading-5 text-[#1A1A1A]">
          {conversation?.subtitle ?? "باغ ویلا با استخر آب گرم"}
        </p>
      </div>
    </header>
  );
}

function ChatComposer({
  draft,
  onChangeDraft,
  onSend,
}: {
  draft: string;
  onChangeDraft: (value: string) => void;
  onSend: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const sendDraft = () => {
    onSend();
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <footer className="absolute inset-x-0 bottom-0 z-20 bg-white px-6 pb-6 pt-2">
      <form
        className="flex h-14 items-center rounded-full border border-[#E6E6E6] bg-white shadow-[0_1px_0_0_rgba(26,26,26,0.08)] [direction:ltr]"
        onSubmit={(event) => {
          event.preventDefault();
          sendDraft();
        }}
      >
        <button
          aria-label="پیوست"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-[#4D4D4D] hover:bg-[#F5F5F5] focus-visible:outline-3 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0048C440]"
          type="button"
        >
          <LinkIcon className="h-6 w-6" />
        </button>
        <label className="min-w-0 flex-1">
          <span className="sr-only">پیام خود را بنویسید</span>
          <input
            className="h-12 w-full border-0 bg-transparent px-3 text-right text-sm font-normal leading-5 text-[#1A1A1A] outline-none placeholder:text-[#808080]"
            dir="rtl"
            onChange={(event) => onChangeDraft(event.target.value)}
            placeholder="پیام خود را بنویسید"
            ref={inputRef}
            type="text"
            value={draft}
          />
        </label>
        <button
          aria-label="ارسال پیام"
          className="grid h-14 w-14 shrink-0 place-items-center rounded-full text-[#4D4D4D] hover:bg-[#F5F5F5] focus-visible:outline-3 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0048C440]"
          type="submit"
        >
          <SendIcon className="h-6 w-6" />
        </button>
      </form>
    </footer>
  );
}

function DashboardConversation({
  conversation,
  draft,
  isLoading,
  messages,
  onChangeDraft,
  onScroll,
  onSend,
  scrollRef,
}: {
  conversation?: DashboardChatListItem;
  draft: string;
  isLoading: boolean;
  messages: RenderedDashboardMessage[];
  onChangeDraft: (value: string) => void;
  onScroll: () => void;
  onSend: () => void;
  scrollRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className="relative flex min-w-0 flex-1 flex-col bg-white">
      <DashboardChatHeader conversation={conversation} />
      <div className="relative min-h-0 flex-1 bg-white">
        <div
          className="h-full overflow-y-auto px-6 pb-[104px] pt-4"
          onScroll={onScroll}
          ref={scrollRef}
        >
          {isLoading ? (
            <p className="py-8 text-center text-xs text-[#808080]">در حال دریافت پیام‌ها...</p>
          ) : null}

          <div className="space-y-4">
            {messages.map((message) =>
              message.type === "date" ? (
                <ChatDateChip key={message.id} label={message.label} />
              ) : (
                <ChatBubble key={message.id} message={message} />
              ),
            )}
          </div>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.9)_50%,#FFFFFF_100%)]"
        />
      </div>
      <ChatComposer draft={draft} onChangeDraft={onChangeDraft} onSend={onSend} />
    </section>
  );
}

function buildRenderedMessages(messages: DashboardLocalMessage[]) {
  if (messages.length === 0) {
    return [
      { id: "date-empty", label: "۲۲ بهمن", type: "date" as const },
      {
        body: "هنوز پیامی برای این گفتگو ثبت نشده است.",
        direction: "incoming" as const,
        id: "empty-message",
        time: "۱۸:۲۱",
        type: "message" as const,
      },
    ];
  }

  const rendered: RenderedDashboardMessage[] = [];

  messages.forEach((message, index) => {
    if (index === 2) {
      rendered.push({ id: "date-22-bahman", label: "۲۲ بهمن", type: "date" });
    }

    rendered.push(message);
  });

  return rendered;
}

export default function DashboardChatPage() {
  const [activeFilter, setActiveFilter] = useState<DashboardChatFilter>("support");
  const [activeId, setActiveId] = useState(fallbackConversations[0].id);
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [liveMessages, setLiveMessages] = useState<DashboardLocalMessage[]>([]);
  const [hasMoreMessagesBelow, setHasMoreMessagesBelow] = useState(false);
  const typingTimeoutRef = useRef<number | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { data: chatsPage, error, isError, refetch } = useChatsQuery({ page: 1, perPage: 30 });
  const apiConversations = useMemo<DashboardChatListItem[]>(
    () => ((chatsPage?.data ?? []) as ChatThread[]).map(mapThreadToListItem),
    [chatsPage?.data],
  );
  const allConversations: DashboardChatListItem[] = apiConversations.length > 0 ? apiConversations : fallbackConversations;
  const filteredConversations = useMemo<DashboardChatListItem[]>(() => {
    const trimmedQuery = query.trim();

    return allConversations.filter((item) => {
      if (trimmedQuery && !`${item.title} ${item.subtitle} ${item.lastMessage}`.includes(trimmedQuery)) {
        return false;
      }

      if (activeFilter === "support" && !item.isSupport) return false;
      if (activeFilter === "mine" && !item.isMineAd) return false;

      return true;
    });
  }, [activeFilter, allConversations, query]);
  const activeConversation = useMemo<DashboardChatListItem | undefined>(
    () => allConversations.find((item) => item.id === activeId) ?? filteredConversations[0],
    [activeId, allConversations, filteredConversations],
  );
  const isApiConversation = activeConversation?.source === "api";
  const messagesQuery = useChatMessagesQuery(isApiConversation && activeConversation ? activeConversation.id : null);
  const apiMessages = useMemo<DashboardLocalMessage[]>(
    () =>
      ((messagesQuery.data ?? []) as ChatMessage[])
        .map(mapApiMessageToLocal)
        .filter((message): message is DashboardLocalMessage => Boolean(message)),
    [messagesQuery.data],
  );
  const localMessages = isApiConversation ? apiMessages : activeConversation?.messages ?? [];
  const renderedMessages = useMemo(
    () => buildRenderedMessages([...localMessages, ...liveMessages]),
    [liveMessages, localMessages],
  );
  const RequestErrorState = isError && apiConversations.length === 0 ? getRequestErrorState(error) : null;

  useEffect(() => {
    if (!filteredConversations.length) return;

    if (!filteredConversations.some((item) => item.id === activeId)) {
      setActiveId(filteredConversations[0].id);
      setLiveMessages([]);
    }
  }, [activeId, filteredConversations]);

  useEffect(() => {
    setLiveMessages([]);
    setDraft("");
  }, [activeConversation?.id]);

  useEffect(() => {
    if (!isApiConversation || !activeConversation?.id) return;

    const threadId = activeConversation.id;
    // Keep the dashboard socket on the same channel as the conversation.
    // Support threads must never be sent through the advertise namespace.
    const category = activeConversation.isSupport ? "support" : "advertise";
    const socket = joinChatThread({ category, threadId });
    const handleNewMessage = (payload: { message?: unknown }) => {
      if (!payload.message || typeof payload.message !== "object") return;

      const mappedMessage = mapApiMessageToLocal(payload.message as ChatMessage, Date.now());

      if (!mappedMessage) return;

      setLiveMessages((current) => [...current, mappedMessage]);
      markChatRead(threadId, category);
    };
    const handleRead = () => {
      setLiveMessages((current) => current.map((message) => ({ ...message, isRead: true })));
      void messagesQuery.refetch();
    };

    socket.on("chat:message:new", handleNewMessage);
    socket.on("chat:read", handleRead);
    markChatRead(threadId, category);

    return () => {
      socket.off("chat:message:new", handleNewMessage);
      socket.off("chat:read", handleRead);
      leaveChatThread(threadId, category);
    };
  }, [activeConversation?.id, activeConversation?.isSupport, isApiConversation, messagesQuery.refetch]);

  const updateScrollState = useCallback(() => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) return;

    const distanceFromBottom = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
    setHasMoreMessagesBelow(distanceFromBottom > 8);
  }, []);

  useEffect(() => {
    const scrollElement = scrollRef.current;

    if (!scrollElement) return;

    scrollElement.scrollTo({ top: scrollElement.scrollHeight, behavior: "smooth" });
    updateScrollState();
  }, [renderedMessages.length, updateScrollState]);

  const changeDraft = (value: string) => {
    setDraft(value);

    if (!isApiConversation || !activeConversation?.id) return;

    sendChatTyping({
      category: activeConversation.isSupport ? "support" : "advertise",
      threadId: activeConversation.id,
      typing: true,
    });

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      sendChatTyping({
        category: activeConversation.isSupport ? "support" : "advertise",
        threadId: activeConversation.id,
        typing: false,
      });
      typingTimeoutRef.current = null;
    }, 900);
  };

  const sendMessage = () => {
    const text = draft.trim();

    if (!text || !activeConversation) return;

    const nextMessage: DashboardLocalMessage = {
      body: text,
      direction: "outgoing",
      id: createLocalMessageId(),
      isRead: false,
      time: new Intl.DateTimeFormat("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
      type: "message",
    };

    setLiveMessages((current) => [...current, nextMessage]);
    setDraft("");

    if (isApiConversation) {
      sendChatTextMessage({
        body: text,
        category: activeConversation.isSupport ? "support" : "advertise",
        threadId: activeConversation.id,
      });
    }
  };

  useEffect(() => () => {
    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }
  }, []);

  if (RequestErrorState && allConversations.length === 0) {
    return <RequestErrorState className="min-h-[520px] rounded-xl bg-white" onRetry={() => void refetch()} />;
  }

  return (
    <section
      className="h-full min-h-[640px] overflow-hidden rounded-xl bg-white text-[#1A1A1A] shadow-[0_1px_2px_rgba(26,26,26,0.04)] [direction:rtl]"
      dir="rtl"
    >
      <div className="flex h-full min-h-0 w-full [direction:rtl]">
        <DashboardChatSidebar
          activeFilter={activeFilter}
          activeId={activeConversation?.id}
          conversations={filteredConversations}
          onChangeFilter={setActiveFilter}
          onChangeQuery={setQuery}
          onSelectConversation={(id) => setActiveId(id)}
          query={query}
        />
        <DashboardConversation
          conversation={activeConversation}
          draft={draft}
          isLoading={isApiConversation ? messagesQuery.isLoading : false}
          messages={renderedMessages}
          onChangeDraft={changeDraft}
          onScroll={updateScrollState}
          onSend={sendMessage}
          scrollRef={scrollRef}
        />
      </div>
      {hasMoreMessagesBelow ? <span className="sr-only">پیام‌های بیشتری پایین صفحه وجود دارد</span> : null}
    </section>
  );
}
