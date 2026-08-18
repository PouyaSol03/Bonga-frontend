import { io, type Socket } from "socket.io-client";

import { getStoredAccessToken } from "../../../shared/auth/auth-storage";
import { websocketBaseUrl } from "../../../shared/api/api";
import {
  markChatMessagesRead,
  sendChatMessage,
  type ChatCategory,
  type ChatMessageType,
} from "./chat.service";

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
    type: "file" | "image" | "location" | "text";
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
    websocketBaseUrl ||
    (typeof window !== "undefined" ? window.location.origin : "");

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
        token: token ? `Bearer ${token}` : "",
      },
      autoConnect: false,
      transports: ["websocket"],
    });
    chatSockets.set(category, chatSocket);
  }

  chatSocket.auth = { token: token ? `Bearer ${token}` : "" };

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
  void markChatMessagesRead(threadId).catch(() => undefined);
}

function sendChatMessageWithSocketFallback({
  body,
  category,
  fallbackBody,
  fallbackMetadata,
  threadId,
  type,
}: {
  body: string;
  category: ChatCategory;
  fallbackBody?: string;
  fallbackMetadata?:
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
  type: Exclude<ChatMessageType, "system">;
}) {
  return sendChatMessage({ body, threadId, type }).catch(() => {
    getChatSocket(category).emit("chat:message:send", {
      body: fallbackBody ?? body,
      ...(fallbackMetadata ? { metadata: fallbackMetadata } : {}),
      threadId,
      type,
    });
  });
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
  return sendChatMessageWithSocketFallback({
    body,
    category,
    threadId,
    type: "text",
  });
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
  return sendChatMessageWithSocketFallback({
    body: attachmentUrl,
    category,
    fallbackBody: "",
    fallbackMetadata: {
      attachment_url: attachmentUrl,
      file_name: fileName,
      mime_type: mimeType,
      size,
    },
    threadId,
    type: "image",
  });
}


export function sendChatAttachmentMessage({
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
  const type = mimeType.startsWith("image/") ? "image" : "file";

  return sendChatMessageWithSocketFallback({
    body: attachmentUrl,
    category,
    fallbackBody: "",
    fallbackMetadata: {
      attachment_url: attachmentUrl,
      file_name: fileName,
      mime_type: mimeType,
      size,
    },
    threadId,
    type,
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
  const location = {
    address: "",
    lat: latitude,
    lng: longitude,
  };

  return sendChatMessageWithSocketFallback({
    body: JSON.stringify(location),
    category,
    fallbackBody: "",
    fallbackMetadata: {
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
