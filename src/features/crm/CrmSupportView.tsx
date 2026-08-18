import { useEffect, useMemo, useRef, useState, type FormEvent, type UIEvent } from "react";

import {
  joinChatThread,
  leaveChatThread,
  markChatRead,
  sendChatTextMessage,
  sendChatTyping,
} from "../chat/api/chat-socket";
import LinearRefresh from "../../shared/icons/LinearRefresh";
import LinearSearch from "../../shared/icons/LinearSearch";
import LinearSent from "../../shared/icons/LinearSent";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import {
  useInfiniteChatMessagesQuery,
} from "../chat/api/chat.hooks";
import { usePanelSupportChatsQuery } from "../support/api/support.hooks";
import type { ChatMessage, ChatThread } from "../chat/api/chat.service";
import {
  formatSupportConversationDate,
  formatSupportMessageTime,
  mapAccountSupportMessage,
  mergeSupportChatMessages,
  readChatPathText,
  readCurrentAccountUserId,
  readSocketSupportMessage,
  readSupportMessageBody,
  readSupportMessageThreadId,
  readSupportThreadId,
  SupportMessageBubble,
  type SupportChatMessage,
} from "../account/accountSupportViews";
import type { CrmRoutePageProps } from "./CrmLayout";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

function readParticipant(thread: ChatThread) {
  const participant = thread.participant ?? thread.user ?? {};
  const showingName = readChatPathText(participant, ["showing_name", "showingName"]);
  const name = readChatPathText(participant, ["full_name", "fullName"]);
  const firstName = readChatPathText(participant, ["name", "first_name"]);
  const family = readChatPathText(participant, ["family", "last_name"]);

  return {
    avatar: readChatPathText(participant, ["avatar", "image", "profile_image"]),
    mobile: readChatPathText(participant, ["mobile", "phone", "phone_number"]),
    name: showingName || name || `${firstName} ${family}`.trim() || "کاربر بنگاه",
  };
}

function messageTimestamp(message: ChatMessage) {
  const value = readChatPathText(message, ["created_at", "createdAt", "sent_at", "sentAt"]);
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function normalizeSearch(value: string) {
  return value.trim().toLocaleLowerCase("fa-IR");
}

export function CrmSupportView({ notify }: Partial<CrmRoutePageProps>) {
  const [search, setSearch] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState("");
  const [draft, setDraft] = useState("");
  const [isCustomerTyping, setIsCustomerTyping] = useState(false);
  const [liveMessages, setLiveMessages] = useState<SupportChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useMemo(readCurrentAccountUserId, []);
  const chatsQuery = usePanelSupportChatsQuery();
  const threads = chatsQuery.data ?? [];
  const normalizedSearch = normalizeSearch(search);
  const filteredThreads = useMemo(
    () =>
      threads.filter((thread) => {
        if (!normalizedSearch) return true;
        const participant = readParticipant(thread);
        const lastMessage = readSupportMessageBody(
          (thread.last_message ?? {}) as ChatMessage,
        );
        const haystack = [
          participant.name,
          participant.mobile,
          lastMessage,
          readSupportThreadId(thread),
        ]
          .join(" ")
          .toLocaleLowerCase("fa-IR");

        return haystack.includes(normalizedSearch);
      }),
    [normalizedSearch, threads],
  );

  useEffect(() => {
    if (
      selectedThreadId &&
      filteredThreads.some((thread) => readSupportThreadId(thread) === selectedThreadId)
    ) {
      return;
    }

    setSelectedThreadId(readSupportThreadId(filteredThreads[0]) || "");
  }, [filteredThreads, selectedThreadId]);

  const selectedThread = filteredThreads.find(
    (thread) => readSupportThreadId(thread) === selectedThreadId,
  );
  const selectedParticipant = selectedThread ? readParticipant(selectedThread) : null;
  const messagesQuery = useInfiniteChatMessagesQuery(selectedThreadId || null, 30);
  const apiMessages = useMemo(() => {
    const rawMessages = (messagesQuery.data?.pages ?? [])
      .flatMap((page) => page.data)
      .sort((first, second) => messageTimestamp(first) - messageTimestamp(second));

    return rawMessages.flatMap((message, index) => {
      const mapped = mapAccountSupportMessage(
        message,
        index,
        currentUserId,
        selectedThreadId,
      );
      return mapped ? [mapped] : [];
    });
  }, [currentUserId, messagesQuery.data?.pages, selectedThreadId]);
  const messages = useMemo(
    () =>
      mergeSupportChatMessages([
        ...apiMessages,
        ...liveMessages.filter((message) => message.threadId === selectedThreadId),
      ]),
    [apiMessages, liveMessages, selectedThreadId],
  );

  useEffect(() => {
    if (!selectedThreadId) return undefined;

    const socket = joinChatThread({ category: "support", threadId: selectedThreadId });
    const handleNewMessage = (payload: unknown) => {
      const rawMessage = readSocketSupportMessage(payload);
      if (!rawMessage) return;
      const threadId =
        readSupportMessageThreadId(payload) ||
        readSupportMessageThreadId(rawMessage) ||
        selectedThreadId;
      if (threadId !== selectedThreadId) return;

      const mapped = mapAccountSupportMessage(
        rawMessage,
        Date.now(),
        currentUserId,
        selectedThreadId,
      );
      if (!mapped) return;

      setLiveMessages((current) => mergeSupportChatMessages([...current, mapped]));
      markChatRead(selectedThreadId, "support");
    };
    const handleTyping = (payload: {
      threadId?: number | string;
      typing?: boolean;
      userId?: number | string;
    }) => {
      if (String(payload.threadId ?? "") !== selectedThreadId) return;
      if (String(payload.userId ?? "") === currentUserId) return;
      setIsCustomerTyping(payload.typing === true);
    };

    socket.on("chat:message:new", handleNewMessage);
    socket.on("chat:typing", handleTyping);
    markChatRead(selectedThreadId, "support");

    return () => {
      socket.off("chat:message:new", handleNewMessage);
      socket.off("chat:typing", handleTyping);
      leaveChatThread(selectedThreadId, "support");
    };
  }, [currentUserId, selectedThreadId]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages.length, selectedThreadId]);

  useEffect(() => {
    if (!selectedThreadId || !draft.trim()) return undefined;

    sendChatTyping({ category: "support", threadId: selectedThreadId, typing: true });
    const timer = window.setTimeout(() => {
      sendChatTyping({ category: "support", threadId: selectedThreadId, typing: false });
    }, 900);

    return () => {
      window.clearTimeout(timer);
      sendChatTyping({ category: "support", threadId: selectedThreadId, typing: false });
    };
  }, [draft, selectedThreadId]);

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selectedThreadId) return;

    setLiveMessages((current) =>
      mergeSupportChatMessages([
        ...current,
        {
          direction: "outgoing",
          id: `local-${Date.now()}`,
          text: body,
          threadId: selectedThreadId,
          time: formatSupportMessageTime(new Date().toISOString()),
          type: "text",
        },
      ]),
    );
    setDraft("");
    sendChatTextMessage({ body, category: "support", threadId: selectedThreadId });
  };

  const handleMessagesScroll = (event: UIEvent<HTMLElement>) => {
    if (
      event.currentTarget.scrollTop < 80 &&
      messagesQuery.hasNextPage &&
      !messagesQuery.isFetchingNextPage
    ) {
      void messagesQuery.fetchNextPage();
    }
  };

  return (
    <section className="flex h-full min-h-0 flex-col gap-4" dir="rtl">
      <header className="flex shrink-0 items-center justify-between gap-4 rounded-xl bg-white px-5 py-4">
        <div>
          <Typography as="h1" variant="title" size="medium" weight="semibold" className="m-0 text-lg font-bold text-[#1a1a1a]">گفتگوهای پشتیبانی</Typography>
          <Typography as="p" variant="body" size="medium" weight="regular" className="m-0 mt-1 text-sm text-[#808080]">
            پاسخگویی زنده به گفتگوهای فعال کاربران
          </Typography>
        </div>
        <Button unstyled
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#dce3ef] bg-white px-4 text-sm font-semibold text-[#4d4d4d] hover:border-[#0048c4] hover:text-[#0048c4]"
          onClick={() => {
            void chatsQuery.refetch().then(() => notify?.("فهرست گفتگوها بروزرسانی شد."));
          }}
          type="button"
        >
          <LinearRefresh className="h-5 w-5" />
          بروزرسانی
        </Button>
      </header>

      <div className="flex min-h-0 flex-1 gap-4">
        <aside className="flex w-[340px] shrink-0 flex-col overflow-hidden rounded-xl bg-white">
          <label className="m-4 flex h-11 shrink-0 items-center gap-2 rounded-xl border border-[#d9d9d9] px-3 focus-within:border-[#0048c4] focus-within:ring-2 focus-within:ring-[#0048c4]/10">
            <LinearSearch className="h-5 w-5 shrink-0 text-[#808080]" />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-right text-sm outline-none placeholder:text-[#a6a6a6]"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جستجو در گفتگوها"
              type="search"
              value={search}
            />
          </label>

          <div className="min-h-0 flex-1 overflow-y-auto border-t border-[#f0f0f0] p-3">
            {chatsQuery.isLoading ? (
              <Typography as="p" variant="body" size="medium" weight="regular" className="py-16 text-center text-sm text-[#808080]">در حال دریافت گفتگوها...</Typography>
            ) : chatsQuery.isError ? (
              <div className="px-4 py-16 text-center">
                <Typography as="p" variant="body" size="medium" weight="regular" className="text-sm text-[#d92d20]">دریافت گفتگوها با خطا مواجه شد.</Typography>
                <Button unstyled
                  className="mt-3 h-9 rounded-lg bg-[#0048c4] px-4 text-xs font-semibold text-white"
                  onClick={() => void chatsQuery.refetch()}
                  type="button"
                >
                  تلاش دوباره
                </Button>
              </div>
            ) : filteredThreads.length === 0 ? (
              <SearchEmptyState className="min-h-[300px] px-4" />
            ) : (
              <div className="space-y-2">
                {filteredThreads.map((thread) => {
                  const threadId = readSupportThreadId(thread);
                  const participant = readParticipant(thread);
                  const lastMessage = readSupportMessageBody(
                    (thread.last_message ?? {}) as ChatMessage,
                  );
                  const isActive = threadId === selectedThreadId;
                  const unreadCount = Number(thread.unread_count ?? 0) || 0;

                  return (
                    <Button unstyled
                      className={`w-full rounded-xl border px-3 py-3 text-right transition ${
                        isActive
                          ? "border-[#0048c4] bg-[#f3f7ff]"
                          : "border-[#eeeeee] bg-white hover:bg-[#fafcff]"
                      }`}
                      key={threadId}
                      onClick={() => setSelectedThreadId(threadId)}
                      type="button"
                    >
                      <Typography as="span" variant="body" size="medium" weight="regular" className="flex items-start gap-3">
                        {participant.avatar ? (
                          <img
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-full object-cover"
                            src={participant.avatar}
                          />
                        ) : (
                          <Typography as="span" variant="label" size="medium" weight="semibold" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eaf1ff] text-sm font-bold text-[#0048c4]">
                            {participant.name.slice(0, 1)}
                          </Typography>
                        )}
                        <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1">
                          <Typography as="span" variant="body" size="medium" weight="regular" className="flex items-center justify-between gap-2">
                            <strong className="truncate text-sm text-[#1a1a1a]">
                              {participant.name}
                            </strong>
                            {unreadCount > 0 ? (
                              <Typography as="span" variant="label" size="small" weight="semibold" className="rounded-full bg-[#0048c4] px-2 py-0.5 text-[10px] font-bold text-white">
                                {new Intl.NumberFormat("fa-IR").format(unreadCount)}
                              </Typography>
                            ) : null}
                          </Typography>
                          <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 block truncate text-xs text-[#808080]">
                            {lastMessage || "گفتگوی پشتیبانی"}
                          </Typography>
                          <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 block text-[10px] text-[#a6a6a6]">
                            {formatSupportConversationDate(thread.updated_at ?? thread.created_at)}
                          </Typography>
                        </Typography>
                      </Typography>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-white">
          {!selectedThreadId || !selectedParticipant ? (
            <SearchEmptyState
              className="h-full min-h-0 flex-1"
              description="یک گفتگو را از فهرست انتخاب کنید."
              title="گفتگویی انتخاب نشده است"
            />
          ) : (
            <>
              <div className="flex shrink-0 items-center justify-between border-b border-[#eeeeee] px-5 py-4">
                <div className="flex min-w-0 items-center gap-3">
                  <Typography as="span" variant="label" size="medium" weight="semibold" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#eaf1ff] font-bold text-[#0048c4]">
                    {selectedParticipant.name.slice(0, 1)}
                  </Typography>
                  <div className="min-w-0">
                    <strong className="block truncate text-sm text-[#1a1a1a]">
                      {selectedParticipant.name}
                    </strong>
                    <Typography as="span" variant="body" size="small" weight="regular" className="mt-1 block truncate text-xs text-[#808080]">
                      {selectedParticipant.mobile || `شناسه گفتگو: ${selectedThreadId}`}
                    </Typography>
                  </div>
                </div>
                <Typography as="span" variant="label" size="small" weight="semibold" className="rounded-full bg-[#e8f7ef] px-3 py-1.5 text-xs font-semibold text-[#079455]">
                  گفتگوی فعال
                </Typography>
              </div>

              <main
                className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f7f8fa] px-5 py-5"
                onScroll={handleMessagesScroll}
              >
                {messagesQuery.isFetchingNextPage ? (
                  <Typography as="p" variant="body" size="small" weight="regular" className="text-center text-xs text-[#808080]">در حال دریافت پیام‌های قبلی...</Typography>
                ) : null}
                {messagesQuery.isLoading ? (
                  <Typography as="p" variant="body" size="medium" weight="regular" className="py-16 text-center text-sm text-[#808080]">در حال دریافت پیام‌ها...</Typography>
                ) : messages.length === 0 ? (
                  <Typography as="p" variant="body" size="medium" weight="regular" className="mx-auto w-full py-16 text-center text-sm text-[#808080]">هنوز پیامی در این گفتگو وجود ندارد.</Typography>
                ) : (
                  messages.map((message) => (
                    <SupportMessageBubble key={message.id} message={message} />
                  ))
                )}
                {isCustomerTyping ? (
                  <Typography as="p" variant="body" size="small" weight="regular" className="text-right text-xs text-[#808080]">کاربر در حال نوشتن است...</Typography>
                ) : null}
                <div ref={messagesEndRef} />
              </main>

              <form
                className="flex shrink-0 items-center gap-3 border-t border-[#eeeeee] p-4"
                onSubmit={sendMessage}
              >
                <input
                  className="h-11 min-w-0 flex-1 rounded-xl border border-[#d9d9d9] px-4 text-sm outline-none placeholder:text-[#a6a6a6] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10"
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="پیام خود را بنویسید..."
                  value={draft}
                />
                <Button unstyled
                  aria-label="ارسال پیام"
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0048c4] text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!draft.trim()}
                  type="submit"
                >
                  <LinearSent className="h-5 w-5" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
