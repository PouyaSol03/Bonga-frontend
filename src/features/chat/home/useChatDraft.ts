import { useEffect, useRef, type Dispatch, type RefObject, type SetStateAction  } from "react";
import { sendChatTextMessage, sendChatTyping } from "../api/chat-socket";
import { type ChatCategory } from "../api/chat.service";
import { createChatMessageId } from "./routeState";
import { type SentChatMessage } from "./types";



export function useChatDraft({
  activeThreadId,
  chatCategory,
  isChatBlocked,
  pendingOutgoingBodiesRef,
  setSentMessages,
  showNotice,
  draftMessage,
  setDraftMessage,
}: {
  activeThreadId: string;
  chatCategory: ChatCategory;
  isChatBlocked: boolean;
  pendingOutgoingBodiesRef: RefObject<Map<string, number>>;
  setSentMessages: Dispatch<SetStateAction<SentChatMessage[]>>;
  showNotice: (message: string) => void;
  draftMessage: string;
  setDraftMessage: (value: string) => void;
}) {
  const typingTimeoutRef = useRef<number | null>(null);
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        window.clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const changeDraftMessage = (nextMessage: string) => {
    setDraftMessage(nextMessage);

    if (!activeThreadId) return;

    sendChatTyping({ category: chatCategory, threadId: activeThreadId, typing: true });

    if (typingTimeoutRef.current) {
      window.clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = window.setTimeout(() => {
      sendChatTyping({ category: chatCategory, threadId: activeThreadId, typing: false });
      typingTimeoutRef.current = null;
    }, 1200);
  };

  const sendMessage = (nextMessage = draftMessage) => {
    if (isChatBlocked) return;

    const text = nextMessage.trim();
    if (!text) return;

    if (activeThreadId) {
      pendingOutgoingBodiesRef.current.set(
        text,
        (pendingOutgoingBodiesRef.current.get(text) ?? 0) + 1,
      );
      setSentMessages((current) => [...current, { id: createChatMessageId(), text, type: "text" }]);
      void sendChatTextMessage({
        body: text,
        category: chatCategory,
        threadId: activeThreadId,
      }).catch(() => {
        setSentMessages((current) => {
          const optimisticIndex = current.findIndex(
            (message) => message.type === "text" && message.text === text,
          );

          return optimisticIndex < 0
            ? current
            : current.filter((_, index) => index !== optimisticIndex);
        });
        showNotice("ارسال پیام با خطا مواجه شد");
      });
    }

    setDraftMessage("");
  };

  return { changeDraftMessage, sendMessage };
}
