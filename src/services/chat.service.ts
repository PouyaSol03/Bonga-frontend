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
      data?:
        | ChatMessage[]
        | {
            items?: ChatMessage[];
            list?: ChatMessage[];
            messages?: ChatMessage[];
          };
      items?: ChatMessage[];
      list?: ChatMessage[];
      messages?: ChatMessage[];
      status?: boolean;
    }
  | ChatMessage[];

type ChatUnreadCountResponse = {
  count?: number | string;
  data?: { count?: number | string; unread_count?: number | string } | number | string;
  status?: boolean;
  unread_count?: number | string;
};

export type ChatsPage = {
  data: ChatThread[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function readArrayFromRecord<T>(record: Record<string, unknown> | undefined, keys: string[]) {
  if (!record) return undefined;

  for (const key of keys) {
    const value = record[key];

    if (Array.isArray(value)) return value as T[];
  }

  return undefined;
}

function readChatThreads(response: ChatsResponse) {
  if (Array.isArray(response)) return response;

  const data = asRecord(response.data);

  if (Array.isArray(response.data)) return response.data;
  const nestedData =
    readArrayFromRecord<ChatThread>(data, ["chats", "data", "items", "list"]);
  if (nestedData) return nestedData;
  if (Array.isArray(response.chats)) return response.chats;
  if (Array.isArray(response.items)) return response.items;
  if (Array.isArray(response.list)) return response.list;

  return [];
}

function readChatThread(response: ChatThreadResponse) {
  const record = response as Record<string, unknown>;

  if (asRecord(record.thread)) {
    return record.thread as ChatThread;
  }

  if (asRecord(record.data)) {
    return record.data as ChatThread;
  }

  return response as ChatThread;
}

function readChatMessages(response: ChatMessagesResponse) {
  if (Array.isArray(response)) return response;

  const data = asRecord(response.data);

  if (Array.isArray(response.data)) return response.data;
  const nestedData =
    readArrayFromRecord<ChatMessage>(data, ["messages", "data", "items", "list"]);
  if (nestedData) return nestedData;
  if (Array.isArray(response.messages)) return response.messages;
  if (Array.isArray(response.items)) return response.items;
  if (Array.isArray(response.list)) return response.list;

  return [];
}

function readNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function readChatUnreadCount(response: ChatUnreadCountResponse) {
  const directCount = readNumber(response.count ?? response.unread_count);

  if (directCount !== undefined) return directCount;

  const dataCount = readNumber(response.data);

  if (dataCount !== undefined) return dataCount;

  const data = asRecord(response.data);

  return readNumber(data?.count ?? data?.unread_count) ?? 0;
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

export async function getChatUnreadCount() {
  const response = await api
    .get("chat/unread-count")
    .json<ChatUnreadCountResponse>();

  return readChatUnreadCount(response);
}

export function blockChat(threadId: string) {
  return api.post(`chats/${threadId}/block`).json<{ status?: boolean }>();
}

export function deleteChat(threadId: string) {
  return api.delete(`chats/${threadId}`).json<{ status?: boolean }>();
}
