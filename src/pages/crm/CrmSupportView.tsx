import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  joinChatThread,
  leaveChatThread,
  markChatRead,
  sendChatTextMessage,
  sendChatTyping,
} from "../../api/chat-socket";
import { getStoredAuthSession } from "../../auth/auth-storage";
import LinearAttachment from "../../components/(icons)/LinearAttachment";
import LinearCancel from "../../components/(icons)/LinearCancel";
import LinearChat from "../../components/(icons)/LinearChat";
import LinearSent from "../../components/(icons)/LinearSent";
import LinearTick from "../../components/(icons)/LinearTick";
import {
  useChatMessagesQuery,
  useChatsQuery,
  useDeleteChatMutation,
} from "../../hooks/chat.hooks";
import type { ChatMessage, ChatThread } from "../../services/chat.service";

type SupportMessage = {
  id: string;
  sender: "customer" | "support";
  text: string;
  time: string;
};

type SupportCustomer = {
  id: string;
  messages: SupportMessage[];
  name: string;
  phone: string;
  unreadCount: number;
  waitingTime: string;
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function readText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
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

function readThreadId(source: unknown) {
  return readPathText(source, [
    "id",
    "_id",
    "threadId",
    "thread_id",
    "thread.id",
    "thread._id",
  ]);
}

function readMessageBody(message: ChatMessage) {
  return readPathText(message, [
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

function readMessageSenderId(message: ChatMessage) {
  return readPathText(message, [
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

function readCurrentUserId() {
  const token = getStoredAuthSession()?.accessToken;
  if (!token) return "";

  try {
    const [, payload = ""] = token.split(".");
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const decodedPayload = JSON.parse(window.atob(normalizedPayload)) as {
      sub?: unknown;
      userId?: unknown;
      user_id?: unknown;
    };

    return readText(
      decodedPayload.sub ?? decodedPayload.userId ?? decodedPayload.user_id,
    );
  } catch {
    return "";
  }
}

function isSupportMessage(message: ChatMessage, currentUserId: string) {
  const senderId = readMessageSenderId(message);
  const senderRole = readPathText(message, [
    "sender.role",
    "sender.role.slug",
    "user.role",
    "user.role.slug",
    "role",
  ]).toLowerCase();

  return (
    message.is_mine === true ||
    message.isMine === true ||
    message.from_me === true ||
    message.fromMe === true ||
    (Boolean(currentUserId) && senderId === currentUserId) ||
    senderRole.includes("support") ||
    senderRole.includes("admin")
  );
}

function formatMessageTime(value: unknown) {
  const text = readText(value);
  if (!text) return currentTimeLabel();

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tehran",
  }).format(date);
}

function formatWaitingTime(value: unknown) {
  const text = readText(value);
  if (!text) return "همین حالا";

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60_000));

  if (elapsedMinutes < 1) return "همین حالا";
  if (elapsedMinutes < 60) {
    return `${new Intl.NumberFormat("fa-IR").format(elapsedMinutes)} دقیقه`;
  }

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) {
    return `${new Intl.NumberFormat("fa-IR").format(elapsedHours)} ساعت`;
  }

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Tehran",
  }).format(date);
}

function mapChatMessage(
  message: ChatMessage,
  index: number,
  currentUserId: string,
): SupportMessage | null {
  const text = readMessageBody(message);
  if (!text) return null;

  return {
    id:
      readPathText(message, ["id", "_id", "messageId", "message_id"]) ||
      `api-${index}-${text}`,
    sender: isSupportMessage(message, currentUserId) ? "support" : "customer",
    text,
    time: formatMessageTime(
      readPathText(message, [
        "sent_at",
        "sentAt",
        "created_at",
        "createdAt",
        "date",
      ]),
    ),
  };
}

function dedupeSupportMessages(messages: SupportMessage[]) {
  const seen = new Set<string>();

  return messages.filter((message) => {
    const key = `${message.id}:${message.sender}:${message.text}`;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}

function mapThreadToCustomer(
  thread: ChatThread,
  index: number,
  currentUserId: string,
): SupportCustomer | null {
  const id = readThreadId(thread);
  if (!id) return null;

  const user =
    readPathRecord(thread, [
      "user",
      "customer",
      "participant",
      "sender",
      "receiver",
      "last_message.user",
    ]) ?? {};
  const lastMessageRecord = readPathRecord(thread, [
    "last_message",
    "lastMessage",
    "message",
  ]);
  const lastMessage = lastMessageRecord
    ? mapChatMessage(lastMessageRecord as ChatMessage, index, currentUserId)
    : null;

  return {
    id,
    messages: lastMessage ? [lastMessage] : [],
    name:
      readPathText(user, [
        "full_name",
        "fullName",
        "name",
        "username",
      ]) ||
      readPathText(thread, [
        "user_name",
        "userName",
        "full_name",
        "fullName",
        "name",
      ]) ||
      "کاربر",
    phone:
      readPathText(user, ["mobile", "phone", "phone_number", "phoneNumber"]) ||
      readPathText(thread, ["mobile", "phone", "phone_number", "phoneNumber"]) ||
      "-",
    unreadCount:
      readNumber(thread.unread_count ?? thread.unreadCount) ?? 0,
    waitingTime: formatWaitingTime(
      readPathText(thread, [
        "last_message_at",
        "lastMessageAt",
        "updated_at",
        "updatedAt",
        "created_at",
        "createdAt",
      ]),
    ),
  };
}

const persianNumberFormatter = new Intl.NumberFormat("fa-IR");

function createMessageId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function currentTimeLabel() {
  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function ChatBubble({
  message,
  shouldReduceMotion,
}: {
  message: SupportMessage;
  shouldReduceMotion: boolean;
}) {
  const isSupport = message.sender === "support";

  return (
    <motion.div
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`flex ${isSupport ? "justify-start" : "justify-end"}`}
      exit={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.98, y: -4 }
      }
      initial={
        shouldReduceMotion
          ? { opacity: 0 }
          : { opacity: 0, scale: 0.97, y: 10 }
      }
      layout="position"
      transition={
        shouldReduceMotion
          ? { duration: 0.08 }
          : { damping: 30, stiffness: 430, type: "spring" }
      }
    >
      <motion.div
        className={`max-w-[72%] rounded-2xl px-4 py-3 shadow-sm ${
          isSupport
            ? "rounded-br-md bg-[#eaf1ff] text-[#1a1a1a]"
            : "rounded-bl-md border border-[#ececec] bg-white text-[#303030]"
        }`}
        whileHover={shouldReduceMotion ? undefined : { y: -1 }}
      >
        <p className="m-0 text-sm font-medium leading-7">{message.text}</p>
        <span className="mt-1 block text-left text-[11px] font-medium text-[#999999]">
          {message.time}
        </span>
      </motion.div>
    </motion.div>
  );
}

function CloseConversationDialog({
  customerName,
  onCancel,
  onConfirm,
  shouldReduceMotion,
}: {
  customerName: string;
  onCancel: () => void;
  onConfirm: () => void;
  shouldReduceMotion: boolean;
}) {
  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-label="تأیید بستن چت"
      aria-modal="true"
      className="fixed inset-0 z-[120] grid place-items-center bg-[#1a1a1a]/55 px-5"
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      role="dialog"
      transition={{ duration: shouldReduceMotion ? 0.08 : 0.18 }}
    >
      <motion.section
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[420px] rounded-2xl bg-white p-5 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
        dir="rtl"
        exit={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.98, y: 10 }
        }
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.96, y: 18 }
        }
        transition={
          shouldReduceMotion
            ? { duration: 0.08 }
            : { damping: 28, stiffness: 360, type: "spring" }
        }
      >
        <motion.div
          animate={{ rotate: 0, scale: 1 }}
          className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#eaf1ff] text-[#0048c4]"
          initial={shouldReduceMotion ? false : { rotate: -12, scale: 0.8 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : { damping: 18, delay: 0.08, stiffness: 380, type: "spring" }
          }
        >
          <LinearTick aria-hidden="true" className="h-7 w-7" />
        </motion.div>
        <h2 className="m-0 mt-4 text-center text-base font-bold text-[#1a1a1a]">
          آیا می‌خواهید این چت را ببندید؟
        </h2>
        <p className="m-0 mt-2 text-center text-sm font-medium leading-6 text-[#808080]">
          گفتگو با {customerName} از فهرست گفتگوهای باز حذف می‌شود.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <motion.button
            className="h-11 rounded-xl border border-[#d7dfeb] bg-white text-sm font-semibold text-[#4d4d4d] transition hover:bg-[#f5f7fb]"
            onClick={onCancel}
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          >
            انصراف
          </motion.button>
          <motion.button
            className="h-11 rounded-xl bg-[#0048c4] text-sm font-semibold text-white transition hover:bg-[#003ca5]"
            onClick={onConfirm}
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          >
            بله، بستن چت
          </motion.button>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function CrmSupportView() {
  const shouldReduceMotion = useReducedMotion() ?? false;
  const currentUserId = useMemo(readCurrentUserId, []);
  const [activeCustomerId, setActiveCustomerId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);
  const [closedCustomerIds, setClosedCustomerIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [readCustomerIds, setReadCustomerIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [unreadDeltas, setUnreadDeltas] = useState<Record<string, number>>({});
  const [liveMessages, setLiveMessages] = useState<Record<string, SupportMessage[]>>(
    {},
  );
  const composerInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const pendingOutgoingBodiesRef = useRef<Map<string, number>>(new Map());
  const typingTimeoutRef = useRef<number | null>(null);
  const { data: chatsPage } = useChatsQuery({
    category: "support",
    page: 1,
    perPage: 50,
  });
  const messagesQuery = useChatMessagesQuery(activeCustomerId);
  const deleteChatMutation = useDeleteChatMutation();
  const apiMessages = useMemo(
    () =>
      (messagesQuery.data ?? [])
        .map((message, index) =>
          mapChatMessage(message, index, currentUserId),
        )
        .filter((message): message is SupportMessage => message !== null),
    [currentUserId, messagesQuery.data],
  );
  const customers = useMemo(
    () =>
      (chatsPage?.data ?? [])
        .map((thread, index) =>
          mapThreadToCustomer(thread, index, currentUserId),
        )
        .filter((customer): customer is SupportCustomer => customer !== null)
        .filter((customer) => !closedCustomerIds.has(customer.id))
        .map((customer) => {
          const baseMessages =
            customer.id === activeCustomerId && apiMessages.length > 0
              ? apiMessages
              : customer.messages;
          const unreadCount = readCustomerIds.has(customer.id)
            ? unreadDeltas[customer.id] ?? 0
            : customer.unreadCount + (unreadDeltas[customer.id] ?? 0);

          return {
            ...customer,
            messages: dedupeSupportMessages([
              ...baseMessages,
              ...(liveMessages[customer.id] ?? []),
            ]),
            unreadCount,
          };
        }),
    [
      activeCustomerId,
      apiMessages,
      chatsPage?.data,
      closedCustomerIds,
      currentUserId,
      liveMessages,
      readCustomerIds,
      unreadDeltas,
    ],
  );
  const activeCustomer = useMemo(
    () => customers.find((customer) => customer.id === activeCustomerId),
    [activeCustomerId, customers],
  );
  const totalUnreadCount = useMemo(
    () => customers.reduce((total, customer) => total + customer.unreadCount, 0),
    [customers],
  );

  useEffect(() => {
    if (customers.length === 0) {
      if (activeCustomerId) setActiveCustomerId(null);
      return;
    }

    if (activeCustomerId && customers.some((customer) => customer.id === activeCustomerId)) {
      return;
    }

    const firstCustomerId = customers[0]?.id ?? null;
    setActiveCustomerId(firstCustomerId);

    if (firstCustomerId) {
      setReadCustomerIds((current) => new Set(current).add(firstCustomerId));
      setUnreadDeltas((current) => ({ ...current, [firstCustomerId]: 0 }));
      markChatRead(firstCustomerId, "support");
    }
  }, [activeCustomerId, customers]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [activeCustomer?.id, activeCustomer?.messages.length]);

  useEffect(() => {
    if (!activeCustomerId) return;

    const threadId = activeCustomerId;
    const socket = joinChatThread({ category: "support", threadId });
    const handleNewMessage = (payload: { message?: unknown }) => {
      if (!payload.message || typeof payload.message !== "object") return;

      const rawMessage = payload.message as ChatMessage;
      const targetThreadId = readThreadId(rawMessage) || threadId;
      const mappedMessage = mapChatMessage(rawMessage, Date.now(), currentUserId);
      if (!mappedMessage) return;

      const pendingKey = `${targetThreadId}:${mappedMessage.text}`;
      const pendingCount = pendingOutgoingBodiesRef.current.get(pendingKey) ?? 0;

      setLiveMessages((current) => {
        const currentMessages = current[targetThreadId] ?? [];
        let nextMessages = currentMessages;

        if (mappedMessage.sender === "support" && pendingCount > 0) {
          const optimisticIndex = currentMessages.findLastIndex(
            (message) =>
              message.sender === "support" &&
              message.text === mappedMessage.text &&
              message.id.startsWith("local-"),
          );

          if (optimisticIndex >= 0) {
            nextMessages = currentMessages.map((message, index) =>
              index === optimisticIndex ? mappedMessage : message,
            );
          } else {
            nextMessages = [...currentMessages, mappedMessage];
          }
        } else {
          nextMessages = [...currentMessages, mappedMessage];
        }

        return {
          ...current,
          [targetThreadId]: dedupeSupportMessages(nextMessages),
        };
      });

      if (mappedMessage.sender === "support" && pendingCount > 0) {
        if (pendingCount === 1) pendingOutgoingBodiesRef.current.delete(pendingKey);
        else pendingOutgoingBodiesRef.current.set(pendingKey, pendingCount - 1);
      }

      if (targetThreadId === activeCustomerId) {
        markChatRead(targetThreadId, "support");
        return;
      }

      if (mappedMessage.sender === "customer") {
        setReadCustomerIds((current) => {
          const next = new Set(current);
          next.delete(targetThreadId);
          return next;
        });
        setUnreadDeltas((current) => ({
          ...current,
          [targetThreadId]: (current[targetThreadId] ?? 0) + 1,
        }));
      }
    };
    const handleRead = (payload: { threadId?: number | string }) => {
      const readThreadId = readText(payload.threadId);
      if (readThreadId && readThreadId !== threadId) return;

      void messagesQuery.refetch();
    };

    socket.on("chat:message:new", handleNewMessage);
    socket.on("chat:read", handleRead);
    markChatRead(threadId, "support");

    return () => {
      socket.off("chat:message:new", handleNewMessage);
      socket.off("chat:read", handleRead);
      leaveChatThread(threadId, "support");
    };
  }, [activeCustomerId, currentUserId, messagesQuery.refetch]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const selectCustomer = (customerId: string) => {
    setActiveCustomerId(customerId);
    setReadCustomerIds((current) => new Set(current).add(customerId));
    setUnreadDeltas((current) => ({ ...current, [customerId]: 0 }));
    markChatRead(customerId, "support");
    setDraft("");
    window.requestAnimationFrame(() => composerInputRef.current?.focus());
  };

  const changeDraft = (value: string) => {
    setDraft(value);
    if (!activeCustomerId) return;

    sendChatTyping({
      category: "support",
      threadId: activeCustomerId,
      typing: true,
    });

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      sendChatTyping({
        category: "support",
        threadId: activeCustomerId,
        typing: false,
      });
      typingTimeoutRef.current = null;
    }, 1200);
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = draft.trim();

    if (!text || !activeCustomer) return;

    const message: SupportMessage = {
      id: `local-${createMessageId()}`,
      sender: "support",
      text,
      time: currentTimeLabel(),
    };
    const pendingKey = `${activeCustomer.id}:${text}`;

    pendingOutgoingBodiesRef.current.set(
      pendingKey,
      (pendingOutgoingBodiesRef.current.get(pendingKey) ?? 0) + 1,
    );
    setLiveMessages((current) => ({
      ...current,
      [activeCustomer.id]: dedupeSupportMessages([
        ...(current[activeCustomer.id] ?? []),
        message,
      ]),
    }));
    sendChatTextMessage({
      body: text,
      category: "support",
      threadId: activeCustomer.id,
    });
    setDraft("");
    window.requestAnimationFrame(() => composerInputRef.current?.focus());
  };

  const closeActiveConversation = () => {
    if (!activeCustomer || deleteChatMutation.isPending) return;

    const activeIndex = customers.findIndex(
      (customer) => customer.id === activeCustomer.id,
    );
    const nextCustomer =
      customers[activeIndex + 1] ?? customers[activeIndex - 1] ?? null;

    deleteChatMutation.mutate(activeCustomer.id, {
      onSuccess: () => {
        setClosedCustomerIds((current) =>
          new Set(current).add(activeCustomer.id),
        );
        setActiveCustomerId(nextCustomer?.id ?? null);
        if (nextCustomer) {
          setReadCustomerIds((current) =>
            new Set(current).add(nextCustomer.id),
          );
          setUnreadDeltas((current) => ({
            ...current,
            [nextCustomer.id]: 0,
          }));
          markChatRead(nextCustomer.id, "support");
        }
        setDraft("");
        setIsCloseDialogOpen(false);
      },
    });
  };

  if (!activeCustomer) {
    return (
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="grid h-full min-h-[520px] place-items-center rounded-xl bg-white p-8 text-center"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
      >
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
        >
          <motion.div
            animate={shouldReduceMotion ? undefined : { y: [0, -4, 0] }}
            className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]"
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: 2.6, ease: "easeInOut", repeat: Infinity }
            }
          >
            <LinearChat aria-hidden="true" className="h-8 w-8" />
          </motion.div>
          <h2 className="m-0 mt-5 text-lg font-bold text-[#1a1a1a]">
            گفتگوی بازی وجود ندارد
          </h2>
          <p className="m-0 mt-2 text-sm font-medium text-[#808080]">
            در حال حاضر مشتری دیگری منتظر پاسخگویی نیست.
          </p>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className="flex h-full min-h-[620px] flex-col gap-4"
      dir="rtl"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
    >
      <motion.header
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white px-5 py-4"
        initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.04, duration: 0.2 }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 className="m-0 text-lg font-bold text-[#1a1a1a]">
              پشتیبانی آنلاین
            </h1>
            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold text-[#0048c4]">
              پاسخگویی فوری
            </span>
          </div>
          <p className="m-0 mt-1 text-sm font-medium text-[#808080]">
            بین گفتگوهای باز جابه‌جا شوید و بدون از دست دادن پیام‌ها پاسخ دهید.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#dce5f4] bg-[#f7faff] px-4">
            <span className="text-xs font-medium text-[#808080]">
              گفتگوهای باز
            </span>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.strong
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-bold text-[#0048c4]"
                exit={{ opacity: 0, y: -5 }}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 5 }}
                key={customers.length}
                transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
              >
                {persianNumberFormatter.format(customers.length)} گفتگو
              </motion.strong>
            </AnimatePresence>
          </div>
          <motion.button
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-semibold text-white transition hover:bg-[#003ca5]"
            onClick={() => setIsCloseDialogOpen(true)}
            type="button"
            whileHover={shouldReduceMotion ? undefined : { y: -1 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
          >
            <span>بستن چت</span>
            <LinearCancel aria-hidden="true" className="h-[19px] w-[19px]" />
          </motion.button>
        </div>
      </motion.header>

      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="flex min-h-0 w-[360px] shrink-0 flex-col overflow-hidden rounded-xl bg-white">
          <div className="shrink-0 border-b border-[#eeeeee] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="m-0 text-sm font-bold text-[#1a1a1a]">
                  گفتگوهای فعال
                </h2>
                <p className="m-0 mt-1 text-xs font-medium text-[#808080]">
                  برای مشاهده هر گفتگو روی آن کلیک کنید.
                </p>
              </div>
              <AnimatePresence initial={false} mode="popLayout">
                {totalUnreadCount > 0 ? (
                  <motion.span
                    animate={{ opacity: 1, scale: 1 }}
                    className="shrink-0 rounded-full bg-[#fff1f1] px-2.5 py-1 text-[10px] font-bold text-[#d9363e]"
                    exit={{ opacity: 0, scale: 0.86 }}
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, scale: 0.86 }
                    }
                    key={totalUnreadCount}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0 }
                        : { damping: 24, stiffness: 420, type: "spring" }
                    }
                  >
                    {persianNumberFormatter.format(totalUnreadCount)} پیام جدید
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
          </div>

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
            <AnimatePresence initial={false} mode="popLayout">
              {customers.map((customer, index) => {
                const isActive = customer.id === activeCustomer.id;
                const lastMessage = customer.messages.at(-1);

                return (
                  <motion.button
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-right transition ${
                      isActive
                        ? "border-[#8eb5ff] bg-[#eef4ff] shadow-[0_4px_14px_rgba(0,72,196,0.08)]"
                        : "border-[#eeeeee] bg-white hover:border-[#cbd8ee] hover:bg-[#f8faff]"
                    }`}
                    exit={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scale: 0.96, x: 16 }
                    }
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, scale: 0.98, x: 10 }
                    }
                    key={customer.id}
                    layout
                    onClick={() => selectCustomer(customer.id)}
                    transition={{
                      delay: shouldReduceMotion ? 0 : Math.min(index * 0.025, 0.1),
                      duration: shouldReduceMotion ? 0 : 0.18,
                    }}
                    type="button"
                    whileHover={shouldReduceMotion ? undefined : { x: -2 }}
                    whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
                  >
                    <motion.span
                      animate={{ scale: isActive ? 1.04 : 1 }}
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-[#0048c4] text-white"
                          : "bg-[#f0f3f8] text-[#5d6879]"
                      }`}
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { damping: 25, stiffness: 400, type: "spring" }
                      }
                    >
                      {customer.name.slice(0, 1)}
                    </motion.span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <strong
                          className={`block truncate text-xs font-bold ${
                            customer.unreadCount > 0
                              ? "text-[#1a1a1a]"
                              : "text-[#303030]"
                          }`}
                        >
                          {customer.name}
                        </strong>
                        <span className="shrink-0 text-[10px] font-medium text-[#999999]">
                          {customer.waitingTime}
                        </span>
                      </span>

                      <span className="mt-1 flex min-w-0 items-center gap-2">
                        <span
                          className={`block min-w-0 flex-1 truncate text-[11px] ${
                            customer.unreadCount > 0
                              ? "font-bold text-[#505b6d]"
                              : "font-medium text-[#999999]"
                          }`}
                        >
                          {lastMessage?.text ?? "هنوز پیامی ارسال نشده است."}
                        </span>
                        <AnimatePresence initial={false}>
                          {customer.unreadCount > 0 ? (
                            <motion.span
                              animate={{ opacity: 1, scale: 1 }}
                              className="shrink-0 rounded-full bg-[#0048c4] px-2 py-0.5 text-[10px] font-bold text-white"
                              exit={{ opacity: 0, scale: 0.75 }}
                              initial={
                                shouldReduceMotion
                                  ? false
                                  : { opacity: 0, scale: 0.75 }
                              }
                              transition={
                                shouldReduceMotion
                                  ? { duration: 0 }
                                  : {
                                      damping: 20,
                                      stiffness: 450,
                                      type: "spring",
                                    }
                              }
                            >
                              {persianNumberFormatter.format(customer.unreadCount)} پیام جدید
                            </motion.span>
                          ) : null}
                        </AnimatePresence>
                      </span>
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white">
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="flex min-h-0 flex-1 flex-col"
            initial={
              shouldReduceMotion ? false : { opacity: 0, x: -12 }
            }
            key={activeCustomer.id}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          >
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-[#eeeeee] px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <motion.div
                  animate={{ opacity: 1, scale: 1 }}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eaf1ff] text-sm font-bold text-[#0048c4]"
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, scale: 0.82 }
                  }
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { damping: 22, stiffness: 380, type: "spring" }
                  }
                >
                  {activeCustomer.name.slice(0, 1)}
                </motion.div>
                <div className="min-w-0">
                  <strong className="block truncate text-sm font-bold text-[#1a1a1a]">
                    {activeCustomer.name}
                  </strong>
                  <span className="mt-1 block truncate text-xs font-medium text-[#808080]">
                    {activeCustomer.phone}
                  </span>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-[#edf8f1] px-3 py-1.5 text-[11px] font-bold text-[#198754]">
                <span className="relative flex h-2 w-2">
                  <motion.span
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : { opacity: [0.45, 0], scale: [1, 2.1] }
                    }
                    className="absolute inset-0 rounded-full bg-current"
                    transition={
                      shouldReduceMotion
                        ? undefined
                        : { duration: 1.8, ease: "easeOut", repeat: Infinity }
                    }
                  />
                  <span className="relative h-2 w-2 rounded-full bg-current" />
                </span>
                چت باز
              </span>
            </div>

            <main className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f7f8fa] px-5 py-5">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#999999] shadow-sm"
                initial={
                  shouldReduceMotion ? false : { opacity: 0, y: -4 }
                }
                transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
              >
                امروز
              </motion.div>
              <AnimatePresence initial={false}>
                {activeCustomer.messages.map((message) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    shouldReduceMotion={shouldReduceMotion}
                  />
                ))}
              </AnimatePresence>
              <div aria-hidden="true" ref={messagesEndRef} />
            </main>

            <form
              className="flex shrink-0 items-center gap-3 border-t border-[#eeeeee] bg-white p-4"
              onSubmit={sendMessage}
            >
              <motion.button
                aria-label="پیوست فایل"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-[#dce3ef] bg-white text-[#6f7888] transition hover:bg-[#f5f7fb]"
                type="button"
                whileHover={shouldReduceMotion ? undefined : { y: -1 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
              >
                <LinearAttachment
                  aria-hidden="true"
                  className="h-[21px] w-[21px]"
                />
              </motion.button>
              <input
                className="h-11 min-w-0 flex-1 rounded-xl border border-[#d9d9d9] bg-white px-4 text-sm font-medium text-[#303030] outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
                onChange={(event) => changeDraft(event.target.value)}
                placeholder="پیام خود را بنویسید..."
                ref={composerInputRef}
                value={draft}
              />
              <motion.button
                animate={{ scale: draft.trim() ? 1 : 0.96 }}
                aria-label="ارسال پیام"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0048c4] text-white transition hover:bg-[#003ca5] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={!draft.trim()}
                transition={
                  shouldReduceMotion
                    ? { duration: 0 }
                    : { damping: 25, stiffness: 420, type: "spring" }
                }
                type="submit"
                whileHover={
                  shouldReduceMotion || !draft.trim() ? undefined : { y: -1 }
                }
                whileTap={
                  shouldReduceMotion || !draft.trim()
                    ? undefined
                    : { scale: 0.9 }
                }
              >
                <LinearSent aria-hidden="true" className="h-[21px] w-[21px]" />
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isCloseDialogOpen ? (
          <CloseConversationDialog
            customerName={activeCustomer.name}
            onCancel={() => setIsCloseDialogOpen(false)}
            onConfirm={closeActiveConversation}
            shouldReduceMotion={shouldReduceMotion}
          />
        ) : null}
      </AnimatePresence>
    </motion.section>
  );
}
