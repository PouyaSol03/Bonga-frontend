import { useState, useRef, useMemo, useEffect } from "react";
import type { ChatThread } from "../../../services/chat.service";
import { useChatsQuery, useChatMessagesQuery } from "../../../hooks/chat.hooks";
import { joinChatThread, markChatRead, leaveChatThread, sendChatTyping, sendChatTextMessage } from "../../../api/chat-socket";
import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import LinearMoreVertical from "../../../components/(icons)/LinearMoreVertical";
import { SUPPORT_CHAT_PATH, SupportChatComposer, SupportChatDateChip, SupportMessageBubble, formatSupportMessageTime, isOpenSupportThread, mapAccountSupportMessage, mergeSupportChatMessages, readCurrentAccountUserId, readSocketSupportMessage, readSupportMessageThreadId, readSupportThreadId } from "../accountSupportViews";
import type { SupportChatMessage } from "../accountSupportViews";

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
