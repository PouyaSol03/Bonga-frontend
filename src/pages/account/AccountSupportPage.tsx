import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type FormEvent,
  type SVGProps,
} from "react";

import { PageFrame } from "../../app/PageFrame";

import {
  joinChatThread,
  leaveChatThread,
  markChatRead,
  sendChatTextMessage,
  sendChatTyping,
} from "../../api/chat-socket";
import { getStoredAuthSession } from "../../auth/auth-storage";
import LinearArrowLeft1 from "../../components/(icons)/LinearArrowLeft1";
import LinearCall from "../../components/(icons)/LinearCall";
import LinearChat from "../../components/(icons)/LinearChat";
import LinearMoreVertical from "../../components/(icons)/LinearMoreVertical";
import LinearQuestion from "../../components/(icons)/LinearQuestion";
import LinearRequestList from "../../components/(icons)/LinearRequestList";
import LinearSent from "../../components/(icons)/LinearSent";
import LinearSupport from "../../components/(icons)/LinearSupport";
import LinearAttachment from "../../components/(icons)/LinearAttachment";
import LinearTickDouble from "../../components/(icons)/LinearTickDouble";
import LinearWavingHand from "../../components/(icons)/LinearWavingHand";
import { TopBar } from "../../components/TopBar";
import {
  useChatMessagesQuery,
  useChatsQuery,
} from "../../hooks/chat.hooks";
import type { ChatMessage, ChatThread } from "../../services/chat.service";
import { RouteLink } from "../../routes/RouteLink";

const SUPPORT_CHAT_PATH = "/account/support/chat";
const SUPPORT_NEW_CHAT_PATH = "/account/support/chat/new";

type SupportIcon = ComponentType<SVGProps<SVGSVGElement>>;

type SupportMenuItemProps = {
  description: string;
  icon: SupportIcon;
  showDivider?: boolean;
  title: string;
  to?: string;
};

function SupportMenuItem({
  description,
  icon: Icon,
  showDivider = true,
  title,
  to,
}: SupportMenuItemProps) {
  const content = (
    <>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef3fd] text-[#5f6673]">
        <Icon className="h-6 w-6 text-[#4D4D4D]" />
      </span>

      <span className="min-w-0 flex-1 text-right">
        <span className="block text-[#1a1a1a]">
          {title}
        </span>
        <span className="block text-sm font-normal leading-none text-[#a6a6a6]">
          {description}
        </span>
      </span>

      <LinearArrowLeft1 className="ml-5 h-6 w-6 shrink-0 text-[#4D4D4D]" />
      {showDivider ? (
        <span className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-[#d6d6d6]" />
      ) : null}
    </>
  );

  const className =
    "relative flex py-5.5 w-full items-center gap-3 bg-white px-4 text-right outline-none transition-colors active:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#0048c440]";

  if (to) {
    return (
      <RouteLink className={className} to={to}>
        {content}
      </RouteLink>
    );
  }

  return (
    <button className={className} type="button">
      {content}
    </button>
  );
}

const supportItems: SupportMenuItemProps[] = [
  {
    description: "همین حالا با پشتیبان گفتگو کنید",
    icon: LinearSupport,
    title: "گفتگوی آنلاین",
    to: SUPPORT_CHAT_PATH,
  },
  {
    description: "پیگیری و مشاهده درخواست‌ها",
    icon: LinearRequestList,
    title: "درخواست‌های من",
    to: "/account/support/requests",
  },
  {
    description: "پاسخ سوالات رایج شما",
    icon: LinearQuestion,
    title: "سوالات متداول",
    to: "/account/support/faq",
  },
  {
    description: "سوالتان بی‌پاسخ ماند؟ تماس بگیرید",
    icon: LinearCall,
    title: "تماس با پشتیبانی",
  },
];

export function AccountSupportPage() {
  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <TopBar backTo="/account" placement="inline" title="پشتیبانی" />

      <main className="min-h-0 flex-1 overflow-y-auto bg-white">
        <nav aria-label="گزینه‌های پشتیبانی" className="w-full">
          {supportItems.map((item, index) => (
            <SupportMenuItem
              key={item.title}
              {...item}
              showDivider={index < supportItems.length - 1}
            />
          ))}
        </nav>
      </main>

      <RouteLink
        aria-label="گفتگوی آنلاین با پشتیبانی"
        className="absolute bottom-6 right-4 grid h-14 w-14 place-items-center rounded-full bg-[#0048c4] text-white shadow-[0_6px_16px_rgba(0,72,196,0.24)] outline-none active:scale-[0.98] focus-visible:ring-3 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0048c4]"
        to={SUPPORT_CHAT_PATH}
      >
        <LinearChat className="h-6 w-6" />
      </RouteLink>
    </PageFrame>
  );
}

type Conversation = {
  date: string;
  id: string;
  isOpen: boolean;
  message: string;
  thread: ChatThread;
};

function SupportAgents() {
  const agents = [
    "/support/support-agent-3.webp",
    "/support/support-agent-2.webp",
    "/support/support-agent-1.webp",
  ];

  return (
    <div className="flex shrink-0 -space-x-3 [direction:ltr]" aria-label="کارشناسان پشتیبانی">
      {agents.map((src, index) => (
        <img
          alt=""
          className="h-10 w-10 rounded-full border-2 border-white object-cover"
          key={src}
          src={src}
          style={{ zIndex: agents.length - index }}
        />
      ))}
    </div>
  );
}

function WelcomeCard() {
  return (
    <section className="rounded-2xl bg-[#edf9f4] px-4 py-4" aria-labelledby="support-welcome-title">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#d7eee6] text-[#4d6660]">
            <LinearWavingHand className="h-6 w-6" />
          </span>
          <h2
            className="m-0 text-base font-semibold leading-none text-[#006038]"
            id="support-welcome-title"
          >
            خوش آمدید
          </h2>
        </div>

        <SupportAgents />
      </div>

      <p className="m-0 mt-2.5 text-right text-sm font-normal text-[#1A1A1A]">
        تیم پشتیبانی آماده پاسخگویی به شماست.
        <br />
        پیام خود را ارسال کنید، در کوتاه‌ترین زمان پاسخ
        <br />
        خواهیم داد.
      </p>
    </section>
  );
}

function SupportChatsEmptyState() {
  return (
    <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center px-6 pb-6 text-center">
      <img
        alt=""
        aria-hidden="true"
        className="h-auto w-[72px] shrink-0"
        src="/vectors/NoSupportChat.svg"
      />

      <h3 className="m-0 mt-5 text-base font-semibold leading-6 text-[#1a1a1a]">
        هنوز گفتگویی ندارید!
      </h3>

      <p className="m-0 mt-2 max-w-[270px] text-sm font-normal leading-6 text-[#666666]">
        اگر سوال یا مشکلی دارید، پیام خود را برای پشتیبان ارسال کنید.
      </p>
    </div>
  );
}

function ConversationCard({ conversation }: { conversation: Conversation }) {
  return (
    <RouteLink
      className="block w-full rounded-2xl border border-[#dedede] bg-white px-4 py-5 text-right outline-none active:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-[#0048c440]"
      state={{ thread: conversation.thread, threadId: conversation.id }}
      to={`${SUPPORT_NEW_CHAT_PATH}?thread_id=${encodeURIComponent(conversation.id)}`}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="text-xs font-normal leading-none text-[#808080]">
          {conversation.date}
        </span>
        <span
          className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-medium leading-none ${
            conversation.isOpen
              ? "bg-[#e5f7ef] text-[#11a366]"
              : "bg-[#f3f3f3] text-[#808080]"
          }`}
        >
          {conversation.isOpen ? "باز" : "بسته شده"}
        </span>
      </span>

      <span className="mt-3 block truncate text-sm font-normal leading-4 text-[#4d4d4d]">
        {conversation.message}
      </span>
    </RouteLink>
  );
}

export function AccountSupportChatPage() {
  const supportChatsQuery = useChatsQuery({
    category: "support",
    page: 1,
    perPage: 50,
  });
  const conversations = useMemo<Conversation[]>(
    () =>
      (supportChatsQuery.data?.data ?? []).flatMap((thread) => {
        const id = readSupportThreadId(thread);
        if (!id) return [];

        const lastMessage = asChatRecord(thread.last_message ?? thread.message);

        return [{
          date: formatSupportConversationDate(
            readChatPathText(lastMessage, ["created_at", "createdAt", "sent_at", "sentAt"]) ||
              readChatPathText(thread, ["updated_at", "updatedAt", "created_at", "createdAt"]),
          ),
          id,
          isOpen: isOpenSupportThread(thread),
          message: readSupportMessageBody((lastMessage ?? {}) as ChatMessage) || "گفتگو با پشتیبانی",
          thread,
        }];
      }),
    [supportChatsQuery.data?.data],
  );

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <LinearMoreVertical className="h-6 w-6" />,
            id: "support-menu",
            label: "گزینه‌های گفتگو",
          },
        ]}
        backTo="/account/support"
        centerClassName="px-2 text-center"
        placement="inline"
        reserveStartSpace
        title="گفتگو با پشتیبانی"
        titleClassName="text-center text-base font-semibold leading-6"
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-white px-4 pb-[88px] pt-4">
        <WelcomeCard />

        <section
          aria-labelledby="recent-support-conversations"
          className="mt-6 flex min-h-0 flex-1 flex-col"
        >
          <h2
            className="m-0 text-right text-base font-semibold leading-6 text-[#4d4d4d]"
            id="recent-support-conversations"
          >
            گفتگوهای اخیر
          </h2>

          {supportChatsQuery.isLoading ? (
            <p className="py-12 text-center text-sm text-[#808080]">در حال دریافت گفتگوها...</p>
          ) : conversations.length === 0 ? (
            <SupportChatsEmptyState />
          ) : (
            <div className="mt-4 space-y-4">
              {conversations.map((conversation) => (
                <ConversationCard conversation={conversation} key={conversation.id} />
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-white px-4 pb-3 pt-3">
        <RouteLink
          className="pointer-events-auto flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] px-4 text-sm font-semibold leading-5 text-white no-underline outline-none active:bg-[#003da7] focus-visible:ring-3 focus-visible:ring-[#0048c440]"
          to={SUPPORT_NEW_CHAT_PATH}
        >
          شروع گفتگوی جدید
        </RouteLink>
      </div>
    </PageFrame>
  );
}

type SupportChatMessage = {
  id: string;
  direction: "incoming" | "outgoing";
  sender?: string;
  text: string;
  threadId: string;
  time: string;
};

function asChatRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function readChatText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);

  return "";
}

function readChatPathText(source: unknown, paths: string[]) {
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

function readSupportThreadId(source: unknown) {
  return readChatPathText(source, [
    "thread_id",
    "threadId",
    "thread.id",
    "thread._id",
    "id",
    "_id",
  ]);
}

function formatSupportConversationDate(value: unknown) {
  const text = readChatText(value);
  if (!text) return "";

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Tehran",
  }).format(date);
}

function isOpenSupportThread(thread: ChatThread) {
  const record = asChatRecord(thread);
  const status = readChatPathText(thread, ["status", "state"]).toLowerCase();
  const closedAt = readChatPathText(thread, ["closed_at", "closedAt"]);
  const isClosed = record?.is_closed === true || record?.closed === true;

  return (
    !isClosed &&
    !closedAt &&
    !["closed", "resolved", "done", "finished"].includes(status)
  );
}

function readSupportMessageThreadId(source: unknown) {
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

function readSupportMessageBody(message: ChatMessage) {
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

function readSupportMessageSenderId(message: ChatMessage) {
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

function readCurrentAccountUserId() {
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

    return readChatText(
      decodedPayload.sub ?? decodedPayload.userId ?? decodedPayload.user_id,
    );
  } catch {
    return "";
  }
}

function isOwnSupportMessage(message: ChatMessage, currentUserId: string) {
  const senderId = readSupportMessageSenderId(message);

  return (
    message.is_mine === true ||
    message.isMine === true ||
    message.from_me === true ||
    message.fromMe === true ||
    (Boolean(currentUserId) && senderId === currentUserId)
  );
}

function formatSupportMessageTime(value: unknown) {
  const text = readChatText(value);
  if (!text) {
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  }

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tehran",
  }).format(date);
}

function mapAccountSupportMessage(
  message: ChatMessage,
  index: number,
  currentUserId: string,
  threadId: string,
): SupportChatMessage | null {
  const text = readSupportMessageBody(message);
  if (!text) return null;
  const isOwn = isOwnSupportMessage(message, currentUserId);

  return {
    id:
      readChatPathText(message, ["id", "_id", "messageId", "message_id"]) ||
      `api-${threadId}-${index}-${text}`,
    direction: isOwn ? "outgoing" : "incoming",
    sender: isOwn ? undefined : "پشتیبانی",
    text,
    threadId,
    time: formatSupportMessageTime(
      readChatPathText(message, [
        "sent_at",
        "sentAt",
        "created_at",
        "createdAt",
        "date",
      ]),
    ),
  };
}

function readSocketSupportMessage(payload: unknown) {
  const payloadRecord = asChatRecord(payload);
  const message = asChatRecord(payloadRecord?.message) ?? payloadRecord;

  return message as ChatMessage | undefined;
}

function mergeSupportChatMessages(messages: SupportChatMessage[]) {
  const seenIds = new Set<string>();
  const seenContent = new Set<string>();

  return messages.filter((message) => {
    if (seenIds.has(message.id)) return false;

    const contentKey = `${message.threadId}:${message.direction}:${message.text}:${message.time}`;
    if (seenContent.has(contentKey)) return false;

    seenIds.add(message.id);
    seenContent.add(contentKey);
    return true;
  });
}

function SupportMessageBubble({ message }: { message: SupportChatMessage }) {
  const isOutgoing = message.direction === "outgoing";

  return (
    <div className={`flex w-full ${isOutgoing ? "justify-start" : "justify-end"}`}>
      <article
        className={`min-w-[82px] max-w-[78%] px-3 py-2.5 text-right ${
          isOutgoing
            ? "rounded-[10px] rounded-tr-[2px] bg-[#eef3fb]"
            : "rounded-[10px] rounded-tl-[2px] border border-[#dedede] bg-white"
        }`}
        dir="rtl"
      >
        {message.sender ? (
          <p className="mb-1 text-[11px] font-medium leading-4 text-[#0048c4]">
            {message.sender}
          </p>
        ) : null}

        <p className="whitespace-pre-line text-[12px] font-normal leading-[19px] text-[#1a1a1a]">
          {message.text}
        </p>

        <div
          className={`mt-1 flex items-center gap-1 text-[10px] leading-4 ${
            isOutgoing
              ? "justify-start text-[#0048c4] [direction:ltr]"
              : "justify-end text-[#a6a6a6]"
          }`}
        >
          <span>{message.time}</span>
          {isOutgoing ? <LinearTickDouble className="h-3.5 w-3.5" /> : null}
        </div>
      </article>
    </div>
  );
}

function SupportChatDateChip() {
  return (
    <div className="flex justify-center py-0.5">
      <span className="rounded-md bg-[#f5f5f5] px-2.5 py-1 text-[10px] font-normal leading-4 text-[#808080]">
        امروز
      </span>
    </div>
  );
}

function SupportChatComposer({
  message,
  onChange,
  onSubmit,
}: {
  message: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
    inputRef.current?.focus({ preventScroll: true });
  };

  return (
    <form
      className="flex items-center gap-1.5 rounded-full bg-[#f7f7f7] p-1.5 shadow-[0_1px_5px_rgba(0,0,0,0.08)] [direction:ltr]"
      onSubmit={submitMessage}
    >
      <button
        aria-label="افزودن فایل"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#666] outline-none active:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#0048c440]"
        type="button"
      >
        <LinearAttachment className="h-5 w-5" />
      </button>

      <label className="min-w-0 flex-1">
        <span className="sr-only">پیام خود را بنویسید</span>
        <input
          ref={inputRef}
          className="h-10 w-full border-0 bg-transparent px-2 text-right text-xs leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] focus:ring-0"
          dir="rtl"
          onChange={(event) => onChange(event.target.value)}
          placeholder="پیام خود را بنویسید"
          type="text"
          value={message}
        />
      </label>

      <button
        aria-label="ارسال پیام"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1268d8] text-white outline-none active:bg-[#0758bd] focus-visible:ring-3 focus-visible:ring-[#1268d840]"
        type="submit"
      >
        <LinearSent className="h-5 w-5" />
      </button>
    </form>
  );
}

export function AccountSupportNewChatPage() {
  const selectedThreadId = new URLSearchParams(window.location.search).get("thread_id") ?? "";
  const [draftMessage, setDraftMessage] = useState("");
  const [createdThread, setCreatedThread] = useState<ChatThread | null>(null);
  const [liveMessages, setLiveMessages] = useState<SupportChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const createPromiseRef = useRef<Promise<string> | null>(null);
  const currentUserId = useMemo(readCurrentAccountUserId, []);
  const supportChatsQuery = useChatsQuery({
    category: "support",
    page: 1,
    perPage: 20,
  });
  const listedThread = selectedThreadId
    ? supportChatsQuery.data?.data.find(
        (thread) => readSupportThreadId(thread) === selectedThreadId,
      ) ?? ({ thread_id: selectedThreadId } as ChatThread)
    : supportChatsQuery.data?.data.find(isOpenSupportThread) ?? null;
  const activeThread = selectedThreadId ? listedThread : createdThread ?? listedThread;
  const activeThreadId = readSupportThreadId(activeThread);
  const messagesQuery = useChatMessagesQuery(activeThreadId || null);

  const apiMessages = useMemo(() => {
    if (!activeThreadId) return [];

    return (messagesQuery.data ?? []).flatMap((message, index) => {
      const mappedMessage = mapAccountSupportMessage(
        message,
        index,
        currentUserId,
        activeThreadId,
      );

      return mappedMessage ? [mappedMessage] : [];
    });
  }, [activeThreadId, currentUserId, messagesQuery.data]);

  const messages = useMemo(
    () =>
      mergeSupportChatMessages([
        ...apiMessages,
        ...liveMessages.filter((message) => message.threadId === activeThreadId),
      ]),
    [activeThreadId, apiMessages, liveMessages],
  );

  useEffect(() => {
    if (!activeThreadId) return undefined;

    const socket = joinChatThread({
      category: "support",
      threadId: activeThreadId,
    });
    const handleNewMessage = (payload: unknown) => {
      const rawMessage = readSocketSupportMessage(payload);
      if (!rawMessage) return;

      const payloadThreadId =
        readSupportMessageThreadId(payload) ||
        readSupportMessageThreadId(rawMessage) ||
        activeThreadId;
      if (payloadThreadId !== activeThreadId) return;

      const mappedMessage = mapAccountSupportMessage(
        rawMessage,
        Date.now(),
        currentUserId,
        activeThreadId,
      );
      if (!mappedMessage) return;

      setLiveMessages((current) => {
        const optimisticIndex = current.findIndex(
          (message) =>
            message.threadId === activeThreadId &&
            message.id.startsWith("local-") &&
            message.direction === mappedMessage.direction &&
            message.text === mappedMessage.text,
        );

        if (optimisticIndex < 0) {
          return mergeSupportChatMessages([...current, mappedMessage]);
        }

        const next = [...current];
        next[optimisticIndex] = mappedMessage;
        return mergeSupportChatMessages(next);
      });

      if (mappedMessage.direction === "incoming") {
        markChatRead(activeThreadId, "support");
      }
    };

    socket.on("chat:message:new", handleNewMessage);
    markChatRead(activeThreadId, "support");

    return () => {
      socket.off("chat:message:new", handleNewMessage);
      leaveChatThread(activeThreadId, "support");
    };
  }, [activeThreadId, currentUserId]);

  useEffect(() => {
    if (!activeThreadId || !draftMessage.trim()) return undefined;

    sendChatTyping({
      category: "support",
      threadId: activeThreadId,
      typing: true,
    });
    const timer = window.setTimeout(() => {
      sendChatTyping({
        category: "support",
        threadId: activeThreadId,
        typing: false,
      });
    }, 900);

    return () => {
      window.clearTimeout(timer);
      sendChatTyping({
        category: "support",
        threadId: activeThreadId,
        typing: false,
      });
    };
  }, [activeThreadId, draftMessage]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages.length]);

  const ensureSupportThread = async () => {
    if (activeThreadId) return activeThreadId;

    if (!createPromiseRef.current) {
      createPromiseRef.current = new Promise<string>((resolve, reject) => {
        let timeoutId = 0;
        const finish = (threadId: string) => {
          window.clearTimeout(timeoutId);
          socket.off("chat:error", handleError);
          resolve(threadId);
        };
        const handleError = (payload: { message?: string }) => {
          window.clearTimeout(timeoutId);
          socket.off("chat:error", handleError);
          reject(new Error(payload.message || "Unable to start support chat"));
        };
        const socket = joinChatThread({
          category: "support",
          onJoined: finish,
        });

        socket.once("chat:error", handleError);
        timeoutId = window.setTimeout(() => {
          socket.off("chat:error", handleError);
          reject(new Error("Support socket did not return a thread id"));
        }, 10_000);
      });
    }

    try {
      const threadId = await createPromiseRef.current;
      setCreatedThread({ _id: threadId });
      return threadId;
    } finally {
      createPromiseRef.current = null;
    }
  };

  const sendMessage = () => {
    const text = draftMessage.trim();
    if (!text) return;

    void ensureSupportThread()
      .then((threadId) => {
        if (!threadId) return;

        const optimisticMessage: SupportChatMessage = {
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          direction: "outgoing",
          text,
          threadId,
          time: formatSupportMessageTime(new Date().toISOString()),
        };

        setLiveMessages((current) =>
          mergeSupportChatMessages([...current, optimisticMessage]),
        );
        setDraftMessage("");

        if (threadId !== activeThreadId) {
          joinChatThread({ category: "support", threadId });
        }
        sendChatTextMessage({
          body: text,
          category: "support",
          threadId,
        });
      })
      .catch(() => {
        // Keep the typed message so the user can retry when the request succeeds.
      });
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        actions={[
          {
            icon: <LinearMoreVertical className="h-6 w-6" />,
            id: "support-new-chat-menu",
            label: "گزینه‌های گفتگو",
          },
        ]}
        backLabel="بازگشت به گفتگوهای پشتیبانی"
        backTo={SUPPORT_CHAT_PATH}
        className="border-b border-[#e6e6e6]"
        contentClassName="px-0"
        heightClassName="h-[52px]"
        reserveStartSpace
        title="پشتیبانی"
        titleClassName="text-center text-base font-semibold leading-6"
      />

      <main className="min-h-0 flex-1 overflow-y-auto bg-white px-2.5 pb-[82px] pt-3">
        <div className="space-y-2.5">
          {messages.slice(0, 2).map((message) => (
            <SupportMessageBubble key={message.id} message={message} />
          ))}

          {messages.length > 2 ? <SupportChatDateChip /> : null}

          {messages.slice(2).map((message) => (
            <SupportMessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-20 bg-white px-2 pb-3 pt-2">
        <SupportChatComposer
          message={draftMessage}
          onChange={setDraftMessage}
          onSubmit={sendMessage}
        />
      </footer>
    </PageFrame>
  );
}
