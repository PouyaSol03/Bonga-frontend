import { useEffect, useRef, useState } from "react";
import { readText } from "../../../shared/lib/textUtils";
import { joinChatThread, leaveChatThread, markChatRead } from "../api/chat-socket";
import { type ChatCategory, type ChatMessage } from "../api/chat.service";
import {
  readChatMessageAttachment,
  readChatMessageBody,
  readChatMessageLocation,
  readChatMessageType,
} from "./messageContent";
import { dedupeChatMessages, markMessageAsRead } from "./messageIdentity";
import { asRecord } from "./readChatValues";
import { type SentChatMessage } from "./types";

export function useChatSocket({
  activeThreadId,
  chatCategory,
  currentUserId,
  setActiveThreadId,
  refetch,
  showNotice,
}: {
  activeThreadId: string;
  chatCategory: ChatCategory;
  currentUserId: string;
  setActiveThreadId: (id: string) => void;
  refetch: () => unknown;
  showNotice: (message: string) => void;
}) {
  const pendingOutgoingAttachmentsRef = useRef<Set<string>>(new Set());
  const pendingOutgoingLocationsRef = useRef<Set<string>>(new Set());
  const pendingOutgoingBodiesRef = useRef<Map<string, number>>(new Map());
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [readThreadIds, setReadThreadIds] = useState<Set<string>>(() => new Set());
  const [sentMessages, setSentMessages] = useState<SentChatMessage[]>([]);
  useEffect(() => {
    if (!activeThreadId) return;

    const socket = joinChatThread({
      category: chatCategory,
      onJoined: setActiveThreadId,
      threadId: activeThreadId,
    });
    const handleNewMessage = (payload: {
      data?: unknown;
      message?: unknown;
      [key: string]: unknown;
    }) => {
      const data = asRecord(payload.data);
      const rawMessage = payload.message ?? data?.message ?? payload.data ?? payload;

      if (!rawMessage || typeof rawMessage !== "object" || Array.isArray(rawMessage)) return;

      const nextMessage = rawMessage as ChatMessage;
      const body = readChatMessageBody(nextMessage);
      const pendingCount = pendingOutgoingBodiesRef.current.get(body) ?? 0;

      if (pendingCount > 0) {
        pendingOutgoingBodiesRef.current.set(body, pendingCount - 1);
        nextMessage.is_mine = true;
        nextMessage.is_read = false;
        nextMessage.read = false;
        setSentMessages((current) => {
          const optimisticIndex = current.findIndex(
            (message) => message.type === "text" && message.text === body,
          );

          return optimisticIndex < 0
            ? current
            : current.filter((_, index) => index !== optimisticIndex);
        });
      }

      const messageType = readChatMessageType(nextMessage);

      if (messageType === "image") {
        const { attachmentUrl } = readChatMessageAttachment(nextMessage);

        if (pendingOutgoingAttachmentsRef.current.delete(attachmentUrl)) {
          nextMessage.is_mine = true;
        }

        setSentMessages((current) =>
          current.filter(
            (message) => message.type !== "image" || message.attachmentUrl !== attachmentUrl,
          ),
        );
      } else if (messageType === "location") {
        const { latitude, longitude } = readChatMessageLocation(nextMessage);
        const locationKey = `${latitude},${longitude}`;

        if (pendingOutgoingLocationsRef.current.delete(locationKey)) {
          nextMessage.is_mine = true;
        }

        setSentMessages((current) =>
          current.filter(
            (message) =>
              message.type !== "location" ||
              message.latitude !== latitude ||
              message.longitude !== longitude,
          ),
        );
      }

      setLiveMessages((current) => dedupeChatMessages([...current, nextMessage]));
      markChatRead(activeThreadId, chatCategory);
    };
    const handleTyping = (payload: { typing?: boolean; userId?: number | string }) => {
      if (payload.typing) {
        showNotice("در حال نوشتن...");
      }
    };
    const handleRead = (payload: { threadId?: number | string; userId?: number | string }) => {
      const readThreadId = readText(payload.threadId);
      const readerId = readText(payload.userId);

      if (readThreadId && readThreadId !== activeThreadId) return;
      if (readerId && readerId === currentUserId) return;

      setReadThreadIds((current) => new Set(current).add(activeThreadId));
      setLiveMessages((current) => current.map(markMessageAsRead));
      void refetch();
    };
    const handleError = (payload: { message?: string }) => {
      showNotice(payload.message ?? "ارتباط چت با خطا مواجه شد");
    };

    socket.on("chat:message:new", handleNewMessage);
    socket.on("chat:typing", handleTyping);
    socket.on("chat:read", handleRead);
    socket.on("chat:error", handleError);
    markChatRead(activeThreadId, chatCategory);

    return () => {
      socket.off("chat:message:new", handleNewMessage);
      socket.off("chat:typing", handleTyping);
      socket.off("chat:read", handleRead);
      socket.off("chat:error", handleError);
      leaveChatThread(activeThreadId, chatCategory);
    };
  }, [activeThreadId, chatCategory, currentUserId, refetch, showNotice]);

  return {
    liveMessages,
    readThreadIds,
    sentMessages,
    setSentMessages,
    pendingOutgoingAttachmentsRef,
    pendingOutgoingLocationsRef,
    pendingOutgoingBodiesRef,
  };
}
