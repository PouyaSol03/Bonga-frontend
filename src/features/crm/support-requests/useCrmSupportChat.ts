import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type UIEvent,
} from "react";
import {
  joinChatThread,
  leaveChatThread,
  markChatRead,
  sendChatTextMessage,
} from "../../chat/api/chat-socket";
import { useInfiniteChatMessagesQuery } from "../../chat/api/chat.hooks";
import { useSendPanelSupportRequestMessageMutation } from "../../support/api/support.hooks";
import type { PanelSupportRequestStatus } from "../../support/api/panel-support.service";
import {
  formatSupportMessageTime,
  mapAccountSupportMessage,
  mergeSupportChatMessages,
  readCurrentAccountUserId,
  readSocketSupportMessage,
  readSupportMessageThreadId,
  type SupportChatMessage,
} from "../../account/accountSupportViews";
import type { CrmRoutePageProps } from "../CrmLayout";
import type { CrmSupportRequest } from "./types";
import { messageTimestamp } from "./supportHelpers";

export function useCrmSupportChat({
  changeStatus,
  notify,
  prefersReducedMotion,
  refetchRequests,
  selectedRequest,
}: {
  changeStatus: (status: PanelSupportRequestStatus) => void;
  notify: CrmRoutePageProps["notify"];
  prefersReducedMotion: boolean;
  refetchRequests: () => void;
  selectedRequest: CrmSupportRequest | undefined;
}) {
  const [draft, setDraft] = useState("");
  const [liveMessages, setLiveMessages] = useState<SupportChatMessage[]>([]);
  const composerRef = useRef<HTMLInputElement | null>(null);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);
  const currentUserId = useMemo(() => readCurrentAccountUserId(), []);

  const sendMessageMutation = useSendPanelSupportRequestMessageMutation();
  const threadId = selectedRequest?.threadId;
  const messagesQuery = useInfiniteChatMessagesQuery(threadId || null, 30);

  useEffect(() => {
    setDraft("");
  }, [selectedRequest?.id]);

  const apiMessages = useMemo(() => {
    if (!threadId) return [];
    const rawMessages = (messagesQuery.data?.pages ?? [])
      .flatMap((messagePage) => messagePage.data)
      .sort((first, second) => messageTimestamp(first) - messageTimestamp(second));

    return rawMessages.flatMap((message, index) => {
      const mapped = mapAccountSupportMessage(message, index, currentUserId, threadId);
      return mapped ? [mapped] : [];
    });
  }, [currentUserId, messagesQuery.data?.pages, threadId]);

  const messages = useMemo(
    () =>
      mergeSupportChatMessages([
        ...apiMessages,
        ...liveMessages.filter((message) => message.threadId === threadId),
      ]),
    [apiMessages, liveMessages, threadId],
  );

  useEffect(() => {
    if (!threadId) return undefined;

    const socket = joinChatThread({ category: "support", threadId });
    const handleNewMessage = (payload: unknown) => {
      const rawMessage = readSocketSupportMessage(payload);
      if (!rawMessage) return;
      const payloadThreadId =
        readSupportMessageThreadId(payload) || readSupportMessageThreadId(rawMessage) || threadId;
      if (payloadThreadId !== threadId) return;

      const mapped = mapAccountSupportMessage(rawMessage, Date.now(), currentUserId, threadId);
      if (!mapped) return;
      setLiveMessages((current) => mergeSupportChatMessages([...current, mapped]));
      markChatRead(threadId, "support");
    };
    const handleSocketError = (payload: { message?: string }) => {
      notify(payload.message || "ارسال پیام زنده با خطا مواجه شد.", "error");
    };

    socket.on("chat:message:new", handleNewMessage);
    socket.on("chat:error", handleSocketError);
    markChatRead(threadId, "support");

    return () => {
      socket.off("chat:message:new", handleNewMessage);
      socket.off("chat:error", handleSocketError);
      leaveChatThread(threadId, "support");
    };
  }, [currentUserId, notify, threadId]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      conversationEndRef.current?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "end",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [messages.length, prefersReducedMotion, selectedRequest?.id]);

  const sendReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body || !selectedRequest || selectedRequest.status === "closed") return;

    if (selectedRequest.threadId) {
      setLiveMessages((current) =>
        mergeSupportChatMessages([
          ...current,
          {
            direction: "outgoing",
            id: `local-${Date.now()}`,
            text: body,
            threadId: selectedRequest.threadId,
            time: formatSupportMessageTime(new Date().toISOString()),
            type: "text",
          },
        ]),
      );
    }
    setDraft("");

    sendMessageMutation.mutate(
      { body, requestId: selectedRequest.id },
      {
        onError: () => {
          if (!selectedRequest.threadId) {
            notify("ارسال پاسخ انجام نشد.", "error");
            setDraft(body);
            return;
          }
          joinChatThread({ category: "support", threadId: selectedRequest.threadId });
          sendChatTextMessage({
            body,
            category: "support",
            threadId: selectedRequest.threadId,
          });
          notify("پاسخ از مسیر گفتگوی زنده ارسال شد.");
        },
        onSuccess: () => {
          notify("پاسخ ارسال شد.");
          if (selectedRequest.status === "open") {
            changeStatus("reviewing");
          }
          void messagesQuery.refetch();
          refetchRequests();
        },
      },
    );

    window.requestAnimationFrame(() => composerRef.current?.focus());
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

  return {
    composerRef,
    conversationEndRef,
    draft,
    handleMessagesScroll,
    isMessagesLoading: messagesQuery.isLoading,
    isSendingMessage: sendMessageMutation.isPending,
    messages,
    sendReply,
    setDraft,
  };
}
