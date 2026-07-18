import {
  useRef,
  useState,
  type ComponentType,
  type FormEvent,
  type SVGProps,
} from "react";

import { PageFrame } from "../../app/PageFrame";
import LinearArrowLeft1 from "../../components/(icons)/LinearArrowLeft1";
import LinearCall from "../../components/(icons)/LinearCall";
import LinearChat from "../../components/(icons)/LinearChat";
import LinearMoreVertical from "../../components/(icons)/LinearMoreVertical";
import LinearQuestion from "../../components/(icons)/LinearQuestion";
import LinearRequestList from "../../components/(icons)/LinearRequestList";
import LinearSupport from "../../components/(icons)/LinearSupport";
import LinearAttachment from "../../components/(icons)/LinearAttachment";
import LinearTickDouble from "../../components/(icons)/LinearTickDouble";
import LinearWavingHand from "../../components/(icons)/LinearWavingHand";
import { TopBar } from "../../components/TopBar";
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
  isOpen: boolean;
  message: string;
};

const conversations: Conversation[] = [];

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
    <button
      className="block w-full rounded-2xl border border-[#dedede] bg-white px-4 py-5 text-right outline-none active:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-[#0048c440]"
      type="button"
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
    </button>
  );
}

export function AccountSupportChatPage() {
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

          {conversations.length === 0 ? (
            <SupportChatsEmptyState />
          ) : (
            <div className="mt-4 space-y-4">
              {conversations.map((conversation) => (
                <ConversationCard conversation={conversation} key={conversation.date} />
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
  time: string;
};

const initialSupportChatMessages: SupportChatMessage[] = [
  {
    id: "customer-question",
    direction: "outgoing",
    text: "سلام\nقیمت بسته‌ای که گذاشتین چقدره؟\nقیمت چرا توی پنل درج نشده؟",
    time: "۱۸:۱۸",
  },
  {
    id: "support-answer",
    direction: "incoming",
    sender: "پشتیبانی",
    text: "سلام دوست عزیز\nقیمت و تعداد آگهی، ویژه و بروزرسانی هر بسته داخل پنل درج شده.\nبرای مشاهده وارد بخش شارژ پنل شوید.",
    time: "۱۸:۲۱",
  },
  {
    id: "customer-thanks",
    direction: "outgoing",
    text: "خیلی ممنونم",
    time: "۱۸:۲۱",
  },
];

function SupportSendIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M20.4 3.6 10.95 13.05M20.4 3.6l-6.05 16.8-3.4-7.35-7.35-3.4L20.4 3.6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
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
        ۲۲ بهمن
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
        <SupportSendIcon className="h-5 w-5" />
      </button>
    </form>
  );
}

export function AccountSupportNewChatPage() {
  const [draftMessage, setDraftMessage] = useState("");
  const [messages, setMessages] = useState<SupportChatMessage[]>(
    initialSupportChatMessages,
  );

  const sendMessage = () => {
    const text = draftMessage.trim();

    if (!text) return;

    setMessages((current) => [
      ...current,
      {
        id: `support-message-${Date.now()}`,
        direction: "outgoing",
        text,
        time: new Intl.DateTimeFormat("fa-IR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      },
    ]);
    setDraftMessage("");
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

          <SupportChatDateChip />

          {messages.slice(2).map((message) => (
            <SupportMessageBubble key={message.id} message={message} />
          ))}
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
