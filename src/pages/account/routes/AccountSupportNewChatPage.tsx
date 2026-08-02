import { useEffect, useMemo, useRef, useState, type UIEvent } from "react";

import {
  joinChatThread,
  leaveChatThread,
  markChatRead,
  sendChatAttachmentMessage,
  sendChatTextMessage,
  sendChatTyping,
} from "../../../core/api/chat-socket";
import { PageFrame } from "../../../app/layout/PageFrame";
import LinearMoreVertical from "../../../shared/icons/LinearMoreVertical";
import { TopBar } from "../../../shared/components/TopBar";
import {
  useCreateSupportChatMutation,
  useInfiniteChatMessagesQuery,
  useUploadChatAttachmentMutation,
} from "../../../core/hooks/chat.hooks";
import type { ChatMessage } from "../../../core/services/chat.service";
import {
  SUPPORT_CHAT_PATH,
  SupportChatComposer,
  SupportChatDateChip,
  SupportMessageBubble,
  formatSupportMessageTime,
  mapAccountSupportMessage,
  mergeSupportChatMessages,
  readChatPathText,
  readCurrentAccountUserId,
  readSocketSupportMessage,
  readSupportMessageThreadId,
  readSupportThreadId,
  type SupportChatMessage,
} from "../accountSupportViews";
import { Typography } from "../../../shared/ui/Typography";

function readMessageTimestamp(message: ChatMessage) {
  const value = readChatPathText(message, [
    "created_at",
    "createdAt",
    "sent_at",
    "sentAt",
    "date",
  ]);
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
}

export function AccountSupportNewChatPage() {
  const selectedThreadId =
    new URLSearchParams(window.location.search).get("thread_id") ?? "";
  const [createdThreadId, setCreatedThreadId] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [liveMessages, setLiveMessages] = useState<SupportChatMessage[]>([]);
  const currentUserId = useMemo(readCurrentAccountUserId, []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLElement | null>(null);
  const hasRequestedSupportChatRef = useRef(false);
  const createSupportChatPromiseRef = useRef<Promise<string> | null>(null);
  const createSupportChatMutation = useCreateSupportChatMutation();
  const uploadAttachmentMutation = useUploadChatAttachmentMutation();
  const activeThreadId = selectedThreadId || createdThreadId;
  const messagesQuery = useInfiniteChatMessagesQuery(activeThreadId || null, 30);

  useEffect(() => {
    if (
      selectedThreadId ||
      createdThreadId ||
      hasRequestedSupportChatRef.current
    ) {
      return;
    }

    hasRequestedSupportChatRef.current = true;
    createSupportChatMutation.mutate(undefined, {
      onError: () => {
        setErrorMessage("شروع گفتگوی پشتیبانی با خطا مواجه شد. دوباره تلاش کنید.");
      },
      onSuccess: (thread) => {
        const threadId = readSupportThreadId(thread);
        if (!threadId) {
          setErrorMessage("شناسه گفتگوی پشتیبانی از سرور دریافت نشد.");
          return;
        }

        // A newly created support thread must be joined before its first message.
        joinChatThread({ category: "support", threadId });
        setCreatedThreadId(threadId);
      },
    });
  }, [createSupportChatMutation, createdThreadId, selectedThreadId]);

  const apiMessages = useMemo(() => {
    if (!activeThreadId) return [];

    const rawMessages = (messagesQuery.data?.pages ?? [])
      .flatMap((page) => page.data)
      .sort((first, second) => readMessageTimestamp(first) - readMessageTimestamp(second));

    return rawMessages.flatMap((message, index) => {
      const mapped = mapAccountSupportMessage(
        message,
        index,
        currentUserId,
        activeThreadId,
      );

      return mapped ? [mapped] : [];
    });
  }, [activeThreadId, currentUserId, messagesQuery.data?.pages]);

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

    const socket = joinChatThread({ category: "support", threadId: activeThreadId });
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
            message.text === mappedMessage.text &&
            message.attachmentUrl === mappedMessage.attachmentUrl,
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
    const handleTyping = (payload: {
      threadId?: number | string;
      typing?: boolean;
      userId?: number | string;
    }) => {
      if (String(payload.threadId ?? "") !== activeThreadId) return;
      if (String(payload.userId ?? "") === currentUserId) return;
      setIsAgentTyping(payload.typing === true);
    };

    const handleSocketError = (payload: { message?: string }) => {
      setErrorMessage(payload.message || "ارسال پیام با خطا مواجه شد. دوباره تلاش کنید.");
    };

    socket.on("chat:message:new", handleNewMessage);
    socket.on("chat:typing", handleTyping);
    socket.on("chat:error", handleSocketError);
    markChatRead(activeThreadId, "support");

    return () => {
      socket.off("chat:message:new", handleNewMessage);
      socket.off("chat:typing", handleTyping);
      socket.off("chat:error", handleSocketError);
      leaveChatThread(activeThreadId, "support");
    };
  }, [activeThreadId, currentUserId]);

  useEffect(() => {
    if (!activeThreadId || !draftMessage.trim()) return undefined;

    sendChatTyping({ category: "support", threadId: activeThreadId, typing: true });
    const timer = window.setTimeout(() => {
      sendChatTyping({ category: "support", threadId: activeThreadId, typing: false });
    }, 900);

    return () => {
      window.clearTimeout(timer);
      sendChatTyping({ category: "support", threadId: activeThreadId, typing: false });
    };
  }, [activeThreadId, draftMessage]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages.length]);

  const ensureSupportThread = async () => {
    if (activeThreadId) {
      joinChatThread({ category: "support", threadId: activeThreadId });
      return activeThreadId;
    }

    if (!createSupportChatPromiseRef.current) {
      createSupportChatPromiseRef.current = createSupportChatMutation
        .mutateAsync()
        .then((thread) => {
          const threadId = readSupportThreadId(thread);
          if (!threadId) throw new Error("Missing support thread id");

          // Keep join and send on the same socket and in this exact order.
          joinChatThread({ category: "support", threadId });
          setCreatedThreadId(threadId);
          return threadId;
        })
        .finally(() => {
          createSupportChatPromiseRef.current = null;
        });
    }

    const pendingThread = createSupportChatPromiseRef.current;
    if (!pendingThread) throw new Error("Unable to start support chat");
    return pendingThread;
  };

  const sendMessage = () => {
    const text = draftMessage.trim();
    if (!text) return;

    setErrorMessage("");
    void ensureSupportThread()
      .then((threadId) => {
        const optimisticMessage: SupportChatMessage = {
          direction: "outgoing",
          id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          text,
          threadId,
          time: formatSupportMessageTime(new Date().toISOString()),
          type: "text",
        };

        setLiveMessages((current) =>
          mergeSupportChatMessages([...current, optimisticMessage]),
        );
        setDraftMessage("");
        joinChatThread({ category: "support", threadId });
        sendChatTextMessage({ body: text, category: "support", threadId });
      })
      .catch(() => {
        setErrorMessage("ارسال پیام انجام نشد. اتصال خود را بررسی و دوباره تلاش کنید.");
      });
  };

  const uploadAttachment = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("حجم فایل نباید بیشتر از ۱۰ مگابایت باشد.");
      return;
    }

    setErrorMessage("");
    void ensureSupportThread()
      .then(async (threadId) => {
        const attachment = await uploadAttachmentMutation.mutateAsync({ file, threadId });
        const fileName = attachment.file_name || file.name;
        const mimeType = attachment.mime_type || file.type || "application/octet-stream";
        const size = attachment.size || file.size;

        setLiveMessages((current) =>
          mergeSupportChatMessages([
            ...current,
            {
              attachmentUrl: attachment.url,
              direction: "outgoing",
              fileName,
              id: `local-file-${Date.now()}`,
              mimeType,
              text: fileName,
              threadId,
              time: formatSupportMessageTime(new Date().toISOString()),
              type: mimeType.startsWith("image/") ? "image" : "file",
            },
          ]),
        );
        joinChatThread({ category: "support", threadId });
        sendChatAttachmentMessage({
          attachmentUrl: attachment.url,
          category: "support",
          fileName,
          mimeType,
          size,
          threadId,
        });
      })
      .catch(() => {
        setErrorMessage("بارگذاری فایل انجام نشد. دوباره تلاش کنید.");
      });
  };

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    if (
      event.currentTarget.scrollTop < 80 &&
      messagesQuery.hasNextPage &&
      !messagesQuery.isFetchingNextPage
    ) {
      void messagesQuery.fetchNextPage();
    }
  };

  const isStarting = createSupportChatMutation.isPending && !activeThreadId;
  const isSending = isStarting || uploadAttachmentMutation.isPending;

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

      <main
        className="min-h-0 flex-1 overflow-y-auto bg-white px-2.5 pb-[92px] pt-3"
        onScroll={handleScroll}
        ref={scrollAreaRef}
      >
        {messagesQuery.isFetchingNextPage ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="pb-3 text-center text-xs text-[#808080]">در حال دریافت پیام‌های قبلی...</Typography>
        ) : null}

        {isStarting ? (
          <Typography as="p" variant="body" size="medium" weight="regular" className="py-16 text-center text-sm text-[#808080]">در حال شروع گفتگو...</Typography>
        ) : (
          <div className="space-y-2.5">
            {messages.slice(0, 2).map((message) => (
              <SupportMessageBubble key={message.id} message={message} />
            ))}

            {messages.length > 2 ? <SupportChatDateChip /> : null}

            {messages.slice(2).map((message) => (
              <SupportMessageBubble key={message.id} message={message} />
            ))}

            {isAgentTyping ? (
              <Typography as="p" variant="body" size="small" weight="regular" className="px-3 py-1 text-right text-xs text-[#808080]">
                پشتیبان در حال نوشتن است...
              </Typography>
            ) : null}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-20 bg-white px-2 pb-3 pt-2">
        {errorMessage ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mb-2 px-2 text-center text-xs leading-5 text-[#d92d20]">
            {errorMessage}
          </Typography>
        ) : null}
        <input
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) uploadAttachment(file);
            event.target.value = "";
          }}
          ref={fileInputRef}
          type="file"
        />
        <SupportChatComposer
          isSending={isSending}
          message={draftMessage}
          onAttachmentClick={() => fileInputRef.current?.click()}
          onChange={setDraftMessage}
          onSubmit={sendMessage}
        />
      </footer>
    </PageFrame>
  );
}
