import { io, type Socket } from "socket.io-client";

import { getStoredAccessToken } from "../auth/auth-storage";
import { baseUrl } from "./api";
import type { ChatCategory } from "../services/chat.service";

type ChatSocketServerToClientEvents = {
  "chat:error": (payload: { message?: string }) => void;
  "chat:message:new": (payload: ChatMessageNewPayload) => void;
  "chat:read": (payload: ChatReadPayload) => void;
  "chat:typing": (payload: ChatTypingPayload) => void;
};

type ChatSocketClientToServerEvents = {
  "chat:join": (
    payload: { threadId?: string },
    callback?: (payload: ChatJoinPayload) => void,
  ) => void;
  "chat:leave": (payload: { threadId: string }) => void;
  "chat:message:send": (payload: {
    body: string;
    threadId: string;
    type: "text";
  }) => void;
  "chat:read": (payload: { threadId: string }) => void;
  "chat:typing": (payload: { threadId: string; typing: boolean }) => void;
};

export type ChatJoinPayload =
  | {
      data?: {
        thread?: { _id?: number | string; id?: number | string };
        threadId?: number | string;
        thread_id?: number | string;
      };
      thread?: { _id?: number | string; id?: number | string };
      threadId?: number | string;
      thread_id?: number | string;
    }
  | number
  | string;

export type ChatMessageNewPayload = {
  message?: unknown;
};

export type ChatTypingPayload = {
  threadId?: number | string;
  typing?: boolean;
  userId?: number | string;
};

export type ChatReadPayload = {
  threadId?: number | string;
  userId?: number | string;
};

export type ChatSocket = Socket<
  ChatSocketServerToClientEvents,
  ChatSocketClientToServerEvents
>;

const chatSockets = new Map<ChatCategory, ChatSocket>();

function getChatSocketUrl(category: ChatCategory) {
  const socketBaseUrl =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");

  return `${socketBaseUrl.replace(/\/$/, "")}/chats?category=${encodeURIComponent(category)}`;
}

export function readSocketThreadId(payload: ChatJoinPayload) {
  if (typeof payload === "string" || typeof payload === "number") {
    return String(payload);
  }

  return String(
    payload.threadId ??
      payload.thread_id ??
      payload.thread?.id ??
      payload.thread?._id ??
      payload.data?.threadId ??
      payload.data?.thread_id ??
      payload.data?.thread?.id ??
      payload.data?.thread?._id ??
      "",
  );
}

export function getChatSocket(category: ChatCategory = "advertise") {
  const token = getStoredAccessToken();
  let chatSocket = chatSockets.get(category);

  if (!chatSocket) {
    chatSocket = io(getChatSocketUrl(category), {
      auth: {
        token,
      },
      autoConnect: false,
    });
    chatSockets.set(category, chatSocket);
  }

  chatSocket.auth = { token };

  if (!chatSocket.connected) {
    chatSocket.connect();
  }

  return chatSocket;
}

export function joinChatThread({
  category = "advertise",
  onJoined,
  threadId,
}: {
  category?: ChatCategory;
  onJoined?: (threadId: string) => void;
  threadId?: string;
}) {
  const socket = getChatSocket(category);
  const handleJoinPayload = (payload: ChatJoinPayload) => {
    const joinedThreadId = readSocketThreadId(payload);

    if (joinedThreadId) {
      onJoined?.(joinedThreadId);
    }
  };

  socket.emit("chat:join", threadId ? { threadId } : {}, handleJoinPayload);

  return socket;
}

export function leaveChatThread(
  threadId: string,
  category: ChatCategory = "advertise",
) {
  getChatSocket(category).emit("chat:leave", { threadId });
}

export function markChatRead(
  threadId: string,
  category: ChatCategory = "advertise",
) {
  getChatSocket(category).emit("chat:read", { threadId });
}

export function sendChatTextMessage({
  body,
  category = "advertise",
  threadId,
}: {
  body: string;
  category?: ChatCategory;
  threadId: string;
}) {
  getChatSocket(category).emit("chat:message:send", { body, threadId, type: "text" });
}

export function sendChatTyping({
  category = "advertise",
  threadId,
  typing,
}: {
  category?: ChatCategory;
  threadId: string;
  typing: boolean;
}) {
  getChatSocket(category).emit("chat:typing", { threadId, typing });
}
