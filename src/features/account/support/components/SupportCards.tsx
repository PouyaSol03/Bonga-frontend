import { Link } from "react-router";
import LinearWavingHand from "../../../../shared/icons/LinearWavingHand";
import { Typography } from "../../../../shared/ui/Typography";
import { SUPPORT_NEW_CHAT_PATH, type Conversation } from "../types";

export function SupportAgents() {
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

export function WelcomeCard() {
  return (
    <section
      className="bg-tertiary-container/30 rounded-2xl px-4 py-4"
      aria-labelledby="support-welcome-title"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="bg-tertiary-container/50 text-tertiary grid h-10 w-10 shrink-0 place-items-center rounded-full"
          >
            <LinearWavingHand className="h-6 w-6" />
          </Typography>
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="text-tertiary m-0 text-base leading-none font-semibold"
            id="support-welcome-title"
          >
            خوش آمدید
          </Typography>
        </div>

        <SupportAgents />
      </div>

      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface m-0 mt-2.5 text-right text-sm font-normal"
      >
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
    <div className="mx-auto flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center px-6 text-center">
      <img
        alt=""
        aria-hidden="true"
        className="h-auto w-[72px] shrink-0"
        src="/vectors/NoSupportChat.svg"
      />

      <Typography
        as="h3"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0 mt-5 text-base leading-6 font-semibold"
      >
        هنوز گفتگویی ندارید!
      </Typography>

      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface-var m-0 mt-2 max-w-[270px] text-sm leading-6 font-normal"
      >
        اگر سوال یا مشکلی دارید، پیام خود را برای پشتیبان ارسال کنید.
      </Typography>
    </div>
  );
}

export function ConversationCard({ conversation }: { conversation: Conversation }) {
  return (
    <Link
      className="border-outline-var bg-surface-container-lowest active:bg-surface-container focus-visible:ring-primary/20 block w-full rounded-2xl border px-4 py-5 text-right outline-none focus-visible:ring-2"
      state={{ thread: conversation.thread, threadId: conversation.id }}
      to={`${SUPPORT_NEW_CHAT_PATH}?thread_id=${encodeURIComponent(conversation.id)}`}
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="flex items-center justify-between gap-3"
      >
        <Typography
          as="span"
          variant="body"
          size="small"
          weight="regular"
          className="text-outline text-xs leading-none font-normal"
        >
          {conversation.date}
        </Typography>
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-xs leading-none font-medium ${
            conversation.isOpen
              ? "bg-tertiary-container/40 text-tertiary"
              : "bg-surface-container text-outline"
          }`}
        >
          {conversation.isOpen ? "باز" : "بسته شده"}
        </Typography>
      </Typography>

      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className="text-on-surface-var mt-3 block truncate text-sm leading-4 font-normal"
      >
        {conversation.message}
      </Typography>
    </Link>
  );
}
