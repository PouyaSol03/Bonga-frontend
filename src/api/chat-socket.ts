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
    metadata?:
      | {
          attachment_url: string;
          file_name: string;
          mime_type: string;
          size: number;
        }
      | {
          address: string;
          lat: number;
          lng: number;
        };
    threadId: string;
    type: "image" | "location" | "text";
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
  data?: unknown;
  message?: unknown;
  [key: string]: unknown;
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

function getChatSocketUrl() {
  const socketBaseUrl =
    baseUrl || (typeof window !== "undefined" ? window.location.origin : "");

  return `${socketBaseUrl.replace(/\/$/, "")}/chat`;
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
    chatSocket = io(getChatSocketUrl(), {
      auth: {
        token,
      },
      autoConnect: false,
      transports: ["websocket"],
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

export function sendChatImageMessage({
  attachmentUrl,
  category = "advertise",
  fileName,
  mimeType,
  size,
  threadId,
}: {
  attachmentUrl: string;
  category?: ChatCategory;
  fileName: string;
  mimeType: string;
  size: number;
  threadId: string;
}) {
  getChatSocket(category).emit("chat:message:send", {
    body: "",
    metadata: {
      attachment_url: attachmentUrl,
      file_name: fileName,
      mime_type: mimeType,
      size,
    },
    threadId,
    type: "image",
  });
}

export function sendChatLocationMessage({
  category = "advertise",
  latitude,
  longitude,
  threadId,
}: {
  category?: ChatCategory;
  latitude: number;
  longitude: number;
  threadId: string;
}) {
  getChatSocket(category).emit("chat:message:send", {
    body: "",
    metadata: {
      address: "",
      lat: latitude,
      lng: longitude,
    },
    threadId,
    type: "location",
  });
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
