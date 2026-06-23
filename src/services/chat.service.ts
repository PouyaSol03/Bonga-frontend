import { api } from "../api/api";

export type ChatThread = Record<string, unknown> & {
  _id?: string;
  ad?: Record<string, unknown>;
  advertise?: Record<string, unknown>;
  advertisement?: Record<string, unknown>;
  created_at?: string;
  id?: number | string;
  last_message?: unknown;
  message?: unknown;
  messages_count?: number | string;
  unread_count?: number | string;
  updated_at?: string;
  user?: Record<string, unknown>;
};

export type ChatMessage = Record<string, unknown> & {
  _id?: string;
  body?: string;
  created_at?: string;
  id?: number | string;
  is_mine?: boolean;
  is_read?: boolean;
  message?: string;
  read?: boolean;
  read_at?: string | null;
  read_by?: Array<number | string>;
  sender_id?: number | string;
  text?: string;
  threadId?: number | string;
  thread_id?: number | string;
  type?: string;
  user_id?: number | string;
};

type ChatsResponse =
  | {
      chats?: ChatThread[];
      data?: ChatThread[];
      items?: ChatThread[];
      list?: ChatThread[];
      page?: number;
      per_page?: number;
      status?: boolean;
      total?: number;
    }
  | ChatThread[];

type ChatThreadResponse =
  | {
      data?: ChatThread;
      status?: boolean;
      thread?: ChatThread;
    }
  | ChatThread;

type ChatMessagesResponse =
  | {
      data?: ChatMessage[];
      items?: ChatMessage[];
      list?: ChatMessage[];
      messages?: ChatMessage[];
      status?: boolean;
    }
  | ChatMessage[];

export type ChatsPage = {
  data: ChatThread[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

function readChatThreads(response: ChatsResponse) {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.chats)) return response.chats;
  if (Array.isArray(response.items)) return response.items;
  if (Array.isArray(response.list)) return response.list;

  return [];
}

function readChatThread(response: ChatThreadResponse) {
  const record = response as Record<string, unknown>;

  if (record.thread && typeof record.thread === "object") {
    return record.thread as ChatThread;
  }

  if (record.data && typeof record.data === "object") {
    return record.data as ChatThread;
  }

  return response as ChatThread;
}

function readChatMessages(response: ChatMessagesResponse) {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response.data)) return response.data;
  if (Array.isArray(response.messages)) return response.messages;
  if (Array.isArray(response.items)) return response.items;
  if (Array.isArray(response.list)) return response.list;

  return [];
}

export async function getChats({
  page = 1,
  perPage = 10,
}: {
  page?: number;
  perPage?: number;
} = {}): Promise<ChatsPage> {
  const response = await api
    .get("chats", {
      searchParams: {
        page,
        per_page: perPage,
      },
    })
    .json<ChatsResponse>();
  const record = Array.isArray(response) ? {} : response;
  const data = readChatThreads(response);
  const currentPage = typeof record.page === "number" ? record.page : page;
  const resolvedPerPage = typeof record.per_page === "number" ? record.per_page : perPage;
  const total = typeof record.total === "number" ? record.total : data.length;

  return {
    data,
    hasNextPage: currentPage * resolvedPerPage < total,
    page: currentPage,
    perPage: resolvedPerPage,
    total,
  };
}

export async function createOrGetAdvertiseChat(advertiseId: string) {
  const response = await api
    .post(`advertise/${advertiseId}/chats`)
    .json<ChatThreadResponse>();

  return readChatThread(response);
}

export async function getChatDetail(threadId: string) {
  const response = await api.get(`chats/${threadId}`).json<ChatThreadResponse>();

  return readChatThread(response);
}

export async function getChatMessages(threadId: string) {
  const response = await api
    .get(`chats/${threadId}/messages`)
    .json<ChatMessagesResponse>();

  return readChatMessages(response);
}

export function blockChat(threadId: string) {
  return api.post(`chats/${threadId}/block`).json<{ status?: boolean }>();
}

export function deleteChat(threadId: string) {
  return api.delete(`chats/${threadId}`).json<{ status?: boolean }>();
}
