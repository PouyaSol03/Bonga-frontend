import { useRef, type ComponentType, type FormEvent, type SVGProps } from "react";
import { getStoredAuthSession } from "../../core/auth/auth-storage";
import LinearArrowLeft1 from "../../shared/icons/LinearArrowLeft1";
import LinearCall from "../../shared/icons/LinearCall";
import LinearQuestion from "../../shared/icons/LinearQuestion";
import LinearRequestList from "../../shared/icons/LinearRequestList";
import LinearSent from "../../shared/icons/LinearSent";
import LinearSupport from "../../shared/icons/LinearSupport";
import LinearAttachment from "../../shared/icons/LinearAttachment";
import LinearTickDouble from "../../shared/icons/LinearTickDouble";
import LinearWavingHand from "../../shared/icons/LinearWavingHand";
import type { ChatMessage, ChatThread } from "../../core/services/chat.service";
import { RouteLink } from "../../app/router/RouteLink";

import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

export const SUPPORT_CHAT_PATH = "/account/support/chat";
export const SUPPORT_NEW_CHAT_PATH = "/account/support/chat/new";

type SupportIcon = ComponentType<SVGProps<SVGSVGElement>>;

type SupportMenuItemProps = {
  description: string;
  icon: SupportIcon;
  showDivider?: boolean;
  title: string;
  to?: string;
};

export function SupportMenuItem({
  description,
  icon: Icon,
  showDivider = true,
  title,
  to,
}: SupportMenuItemProps) {
  const content = (
    <>
      <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#eef3fd] text-[#5f6673]">
        <Icon className="h-6 w-6 text-[#4D4D4D]" />
      </Typography>

      <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1 text-right">
        <Typography as="span" variant="body" size="medium" weight="regular" className="block text-[#1a1a1a]">
          {title}
        </Typography>
        <Typography as="span" variant="body" size="medium" weight="regular" className="block text-sm font-normal leading-none text-[#a6a6a6]">
          {description}
        </Typography>
      </Typography>

      <LinearArrowLeft1 className="ml-5 h-6 w-6 shrink-0 text-[#4D4D4D]" />
      {showDivider ? (
        <Typography as="span" variant="body" size="medium" weight="regular" className="pointer-events-none absolute inset-x-4 bottom-0 h-px bg-[#d6d6d6]" />
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
    <Button unstyled className={className} type="button">
      {content}
    </Button>
  );
}

export const supportItems: SupportMenuItemProps[] = [
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

export type Conversation = {
  date: string;
  id: string;
  isOpen: boolean;
  message: string;
  thread: ChatThread;
};

function SupportAgents() {
  const agents = [
    "/support/support-agent-3.png",
    "/support/support-agent-2.png",
    "/support/support-agent-1.png",
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

export function WelcomeCard() {
  return (
    <section className="rounded-2xl bg-[#edf9f4] px-4 py-4" aria-labelledby="support-welcome-title">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Typography as="span" variant="body" size="medium" weight="regular" className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#d7eee6] text-[#4d6660]">
            <LinearWavingHand className="h-6 w-6" />
          </Typography>
          <Typography as="h2" variant="title" size="medium" weight="semibold"
            className="m-0 text-base font-semibold leading-none text-[#006038]"
            id="support-welcome-title"
          >
            خوش آمدید
          </Typography>
        </div>

        <SupportAgents />
      </div>

      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2.5 text-right text-sm font-normal text-[#1A1A1A]">
        تیم پشتیبانی آماده پاسخگویی به شماست.
        <br />
        پیام خود را ارسال کنید، در کوتاه‌ترین زمان پاسخ
        <br />
        خواهیم داد.
      </Typography>
    </section>
  );
}

export function SupportChatsEmptyState() {
  return (
    <div className="flex min-h-[300px] flex-1 flex-col items-center justify-center px-6 pb-6 text-center">
      <img
        alt=""
        aria-hidden="true"
        className="h-auto w-[72px] shrink-0"
        src="/vectors/NoSupportChat.svg"
      />

      <Typography as="h3" variant="title" size="medium" weight="semibold" className="m-0 mt-5 text-base font-semibold leading-6 text-[#1a1a1a]">
        هنوز گفتگویی ندارید!
      </Typography>

      <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-2 max-w-[270px] text-sm font-normal leading-6 text-[#666666]">
        اگر سوال یا مشکلی دارید، پیام خود را برای پشتیبان ارسال کنید.
      </Typography>
    </div>
  );
}

export function ConversationCard({ conversation }: { conversation: Conversation }) {
  return (
    <RouteLink
      className="block w-full rounded-2xl border border-[#dedede] bg-white px-4 py-5 text-right outline-none active:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-[#0048c440]"
      state={{ thread: conversation.thread, threadId: conversation.id }}
      to={`${SUPPORT_NEW_CHAT_PATH}?thread_id=${encodeURIComponent(conversation.id)}`}
    >
      <Typography as="span" variant="body" size="medium" weight="regular" className="flex items-center justify-between gap-3">
        <Typography as="span" variant="body" size="small" weight="regular" className="text-xs font-normal leading-none text-[#808080]">
          {conversation.date}
        </Typography>
        <Typography as="span" variant="label" size="small" weight="medium"
          className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs font-medium leading-none ${
            conversation.isOpen
              ? "bg-[#e5f7ef] text-[#11a366]"
              : "bg-[#f3f3f3] text-[#808080]"
          }`}
        >
          {conversation.isOpen ? "باز" : "بسته شده"}
        </Typography>
      </Typography>

      <Typography as="span" variant="body" size="medium" weight="regular" className="mt-3 block truncate text-sm font-normal leading-4 text-[#4d4d4d]">
        {conversation.message}
      </Typography>
    </RouteLink>
  );
}

export type SupportChatMessage = {
  attachmentUrl?: string;
  direction: "incoming" | "outgoing";
  fileName?: string;
  id: string;
  mimeType?: string;
  sender?: string;
  text: string;
  threadId: string;
  time: string;
  type: "file" | "image" | "text";
};

export function asChatRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function readChatText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number") return String(value);

  return "";
}

export function readChatPathText(source: unknown, paths: string[]) {
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

export function formatSupportConversationDate(value: unknown) {
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

export function isOpenSupportThread(thread: ChatThread) {
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

export function readCurrentAccountUserId() {
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

export function formatSupportMessageTime(value: unknown) {
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

export function mapAccountSupportMessage(
  message: ChatMessage,
  index: number,
  currentUserId: string,
  threadId: string,
): SupportChatMessage | null {
  const metadata = asChatRecord(message.metadata);
  const attachmentUrl = readChatPathText(metadata, [
    "attachment_url",
    "attachmentUrl",
    "url",
  ]);
  const fileName = readChatPathText(metadata, ["file_name", "fileName", "name"]);
  const mimeType = readChatPathText(metadata, ["mime_type", "mimeType"]);
  const rawType = readChatPathText(message, ["type"]).toLowerCase();
  const type: SupportChatMessage["type"] = attachmentUrl
    ? rawType === "image" || mimeType.startsWith("image/")
      ? "image"
      : "file"
    : "text";
  const text = readSupportMessageBody(message) || (attachmentUrl ? fileName || "فایل پیوست‌شده" : "");
  if (!text && !attachmentUrl) return null;
  const isOwn = isOwnSupportMessage(message, currentUserId);

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
      readChatPathText(message, [
        "sent_at",
        "sentAt",
        "created_at",
        "createdAt",
        "date",
      ]),
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

export function SupportMessageBubble({ message }: { message: SupportChatMessage }) {
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
          <Typography as="p" variant="body" size="small" weight="medium" className="mb-1 text-[11px] font-medium leading-4 text-[#0048c4]">
            {message.sender}
          </Typography>
        ) : null}

        {message.attachmentUrl ? (
          message.type === "image" ? (
            <a href={message.attachmentUrl} rel="noreferrer" target="_blank">
              <img
                alt={message.fileName || "تصویر پیوست‌شده"}
                className="mb-2 max-h-52 w-full rounded-lg object-cover"
                src={message.attachmentUrl}
              />
            </a>
          ) : (
            <a
              className="mb-2 block break-all text-xs font-medium text-[#0048c4] underline"
              href={message.attachmentUrl}
              rel="noreferrer"
              target="_blank"
            >
              {message.fileName || "مشاهده فایل پیوست"}
            </a>
          )
        ) : null}

        {message.text ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="whitespace-pre-line text-[12px] font-normal leading-[19px] text-[#1a1a1a]">
            {message.text}
          </Typography>
        ) : null}

        <div
          className={`mt-1 flex items-center gap-1 text-[10px] leading-4 ${
            isOutgoing
              ? "justify-start text-[#0048c4] [direction:ltr]"
              : "justify-end text-[#a6a6a6]"
          }`}
        >
          <Typography as="span" variant="body" size="medium" weight="regular">{message.time}</Typography>
          {isOutgoing ? <LinearTickDouble className="h-3.5 w-3.5" /> : null}
        </div>
      </article>
    </div>
  );
}

export function SupportChatDateChip() {
  return (
    <div className="flex justify-center py-0.5">
      <Typography as="span" variant="body" size="small" weight="regular" className="rounded-md bg-[#f5f5f5] px-2.5 py-1 text-[10px] font-normal leading-4 text-[#808080]">
        امروز
      </Typography>
    </div>
  );
}

export function SupportChatComposer({
  isSending = false,
  message,
  onAttachmentClick,
  onChange,
  onSubmit,
}: {
  isSending?: boolean;
  message: string;
  onAttachmentClick?: () => void;
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
      <Button unstyled
        aria-label="افزودن فایل"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[#666] outline-none active:bg-black/5 focus-visible:ring-2 focus-visible:ring-[#0048c440] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSending}
        onClick={onAttachmentClick}
        type="button"
      >
        <LinearAttachment className="h-5 w-5" />
      </Button>

      <label className="min-w-0 flex-1">
        <Typography as="span" variant="body" size="medium" weight="regular" className="sr-only">پیام خود را بنویسید</Typography>
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

      <Button unstyled
        aria-label="ارسال پیام"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#1268d8] text-white outline-none active:bg-[#0758bd] focus-visible:ring-3 focus-visible:ring-[#1268d840] disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSending || !message.trim()}
        type="submit"
      >
        <LinearSent className="h-5 w-5" />
      </Button>
    </form>
  );
}
