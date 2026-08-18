import { api } from "../../../shared/api/api";

export type ChatCategory = "advertise" | "support";
export type ChatFilter = "support" | "not_read" | "my_ads" | "others_ads";
export type ChatMessageType = "text" | "image" | "file" | "location" | "system";
export type ChatReportReason =
  | "spam"
  | "harassment"
  | "fraud"
  | "inappropriate_content"
  | "other";
export type ChatDayOfWeek =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";

export type ChatAvailabilityDay = {
  day_label: string;
  day_of_week: ChatDayOfWeek;
};

export type ChatAvailability = {
  days: ChatAvailabilityDay[];
  end_time: string | null;
  start_time: string | null;
};

export type UpdateChatAvailabilityPayload = {
  days?: ChatDayOfWeek[];
  end_time?: string;
  start_time?: string;
};

export type GetChatsParams = {
  blocked?: boolean;
  category?: ChatCategory;
  filter?: ChatFilter;
  mine?: boolean;
  page?: number;
  perPage?: number;
  search?: string;
  unread?: boolean;
};

export type ChatThread = Record<string, unknown> & {
  _id?: string;
  ad?: Record<string, unknown>;
  advertise?: Record<string, unknown> & {
    form?: Record<string, unknown> & {
      code?: string;
      group?: string;
      title?: string;
    };
    form_code?: string;
    form_title?: string;
    id?: number | string;
    image?: string | null;
    title?: string;
  };
  advertisement?: Record<string, unknown>;
  blocked_by_me?: boolean;
  blocked_me?: boolean;
  category?: ChatCategory;
  created_at?: string;
  id?: number | string;
  is_blocked?: boolean;
  last_message?: ChatMessage | null;
  message?: unknown;
  messages_count?: number | string;
  participant?: Record<string, unknown> & {
    availability?: ChatAvailability;
    avatar?: string | null;
    family?: string;
    full_name?: string;
    id?: number | string;
    name?: string;
    showing_name?: string | null;
  };
  status?: string;
  threadId?: number | string;
  thread_id?: number | string;
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
  metadata?: Record<string, unknown>;
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

export type ChatAttachmentUpload = {
  file_name: string;
  mime_type: string;
  size: number;
  status: boolean;
  url: string;
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
      cursor?: string | null;
      data?:
        | ChatMessage[]
        | {
            cursor?: string | null;
            has_more?: boolean;
            items?: ChatMessage[];
            list?: ChatMessage[];
            messages?: ChatMessage[];
            next_cursor?: string | null;
          };
      has_more?: boolean;
      items?: ChatMessage[];
      list?: ChatMessage[];
      messages?: ChatMessage[];
      meta?: {
        cursor?: string | null;
        has_more?: boolean;
        next_cursor?: string | null;
      };
      next_cursor?: string | null;
      status?: boolean;
    }
  | ChatMessage[];

type ChatUnreadCountResponse = {
  count?: number | string;
  data?: { count?: number | string; unread_count?: number | string } | number | string;
  status?: boolean;
  unread_count?: number | string;
};

type ChatShowingNameResponse =
  | {
      data?: { showing_name?: unknown } | string | null;
      showing_name?: unknown;
      status?: boolean;
    }
  | string
  | null;

export type ChatsPage = {
  data: ChatThread[];
  hasNextPage: boolean;
  page: number;
  perPage: number;
  total: number;
};

export type ChatMessagesPage = {
  data: ChatMessage[];
  nextCursor: string | null;
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

const chatDayOfWeekValues = new Set<ChatDayOfWeek>([
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
]);

function readTime(value: unknown) {
  return typeof value === "string" && /^\d{2}:\d{2}$/.test(value.trim())
    ? value.trim()
    : null;
}

function normalizeChatAvailability(value: unknown): ChatAvailability {
  const root = asRecord(value);
  const data = asRecord(root?.data);
  const source =
    asRecord(root?.availability) ??
    asRecord(data?.availability) ??
    data ??
    root ??
    {};
  const rawDays = Array.isArray(source.days) ? source.days : [];
  const days = rawDays.flatMap((item) => {
    if (typeof item === "string") {
      const day = item.trim().toLowerCase() as ChatDayOfWeek;

      return chatDayOfWeekValues.has(day)
        ? [{ day_label: "", day_of_week: day }]
        : [];
    }

    const day = asRecord(item);
    const dayOfWeek =
      typeof day?.day_of_week === "string"
        ? (day.day_of_week.trim().toLowerCase() as ChatDayOfWeek)
        : null;

    if (!dayOfWeek || !chatDayOfWeekValues.has(dayOfWeek)) return [];

    return [{
      day_label:
        typeof day?.day_label === "string" ? day.day_label.trim() : "",
      day_of_week: dayOfWeek,
    }];
  });

  return {
    days,
    end_time: readTime(source.end_time),
    start_time: readTime(source.start_time),
  };
}

function readChatUnreadCount(response: ChatUnreadCountResponse) {
  const directCount = readNumber(response.count ?? response.unread_count);

  if (directCount !== undefined) return directCount;

  const dataCount = readNumber(response.data);

  if (dataCount !== undefined) return dataCount;

  const data = asRecord(response.data);

  return readNumber(data?.count ?? data?.unread_count) ?? 0;
}

function readChatShowingName(response: ChatShowingNameResponse) {
  if (typeof response === "string") {
    return response.trim() || null;
  }

  if (!response) return null;

  if (typeof response.data === "string") {
    return response.data.trim() || null;
  }

  const data = asRecord(response.data);
  const value = response.showing_name ?? data?.showing_name;

  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function getChats({
  blocked,
  category,
  filter,
  mine,
  page = 1,
  perPage = 10,
  search,
  unread,
}: GetChatsParams = {}): Promise<ChatsPage> {
  const response = await api
    .get("chats", {
      searchParams: {
        blocked,
        category,
        filter,
        mine,
        page,
        per_page: perPage,
        search: search?.trim() || undefined,
        unread,
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

export async function getChatAvailability() {
  const response = await api.get("chats/availability").json<unknown>();

  return normalizeChatAvailability(response);
}

export async function updateChatAvailability(payload: UpdateChatAvailabilityPayload) {
  await api.patch("chats/availability", {
    context: { allowNonJsonResponse: true },
    headers: { Accept: "*/*" },
    json: payload,
  });
}

export async function getChatShowingName() {
  const response = await api.get("chats/showing-name").json<ChatShowingNameResponse>();

  return readChatShowingName(response);
}

export async function updateChatShowingName(showingName: string | null) {
  await api.patch("chats/showing-name", {
    context: { allowNonJsonResponse: true },
    headers: { Accept: "*/*" },
    json: { showing_name: showingName },
  });
}

export async function createOrGetAdvertiseChat(advertiseId: string) {
  const response = await api
    .post(`advertise/${advertiseId}/chats`)
    .json<ChatThreadResponse>();

  return readChatThread(response);
}

export async function createOrGetSupportChat() {
  const response = await api
    .post("support/chat")
    .json<ChatThreadResponse>();

  return readChatThread(response);
}

export async function getChatDetail(threadId: string) {
  const response = await api.get(`chats/${threadId}`).json<ChatThreadResponse>();

  return readChatThread(response);
}

function readCursorValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function readMessageCreatedAt(message: ChatMessage) {
  for (const key of ["created_at", "createdAt", "sent_at", "sentAt"]) {
    const value = message[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return null;
}

export async function getChatMessagesPage(
  threadId: string,
  { cursor, limit = 30 }: { cursor?: string; limit?: number } = {},
): Promise<ChatMessagesPage> {
  const response = await api
    .get(`chats/${threadId}/messages`, {
      searchParams: { cursor, limit },
    })
    .json<ChatMessagesResponse>();
  const data = readChatMessages(response);

  if (Array.isArray(response)) {
    return { data, nextCursor: null };
  }

  const nestedData = asRecord(response.data);
  const explicitCursor = readCursorValue(
    response.next_cursor ??
      response.cursor ??
      response.meta?.next_cursor ??
      response.meta?.cursor ??
      nestedData?.next_cursor ??
      nestedData?.cursor,
  );
  const hasMore =
    response.has_more === true ||
    response.meta?.has_more === true ||
    nestedData?.has_more === true;
  const fallbackCursor = hasMore && data.length > 0
    ? readMessageCreatedAt(data[data.length - 1]) ?? readMessageCreatedAt(data[0])
    : null;

  return {
    data,
    nextCursor: explicitCursor ?? fallbackCursor,
  };
}

export async function getChatMessages(threadId: string) {
  const page = await getChatMessagesPage(threadId);
  return page.data;
}

export async function uploadChatAttachment(threadId: string, file: File) {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Chat attachments cannot exceed 10 MB");
  }

  const formData = new FormData();
  formData.append("file", file);

  return api
    .post(`chats/${threadId}/attachments`, {
      body: formData,
    })
    .json<ChatAttachmentUpload>();
}

export async function sendChatMessage({
  body,
  threadId,
  type,
}: {
  body: string;
  threadId: string;
  type: ChatMessageType;
}) {
  await api.post(`chats/${threadId}/messages`, {
    context: { allowNonJsonResponse: true },
    headers: { Accept: "*/*" },
    json: { body, type },
  });
}

export async function markChatMessagesRead(threadId: string) {
  await api.post(`chats/${threadId}/read`, {
    context: { allowNonJsonResponse: true },
    headers: { Accept: "*/*" },
  });
}

export async function getChatUnreadCount() {
  const response = await api
    .get("chat/unread-count")
    .json<ChatUnreadCountResponse>();

  return readChatUnreadCount(response);
}

export type ChatReportPayload = {
  description?: string;
  messageId?: string;
  reason: ChatReportReason;
  threadId: string;
};

export async function blockChat(threadId: string) {
  await api.post(`chats/${threadId}/block`, {
    context: { allowNonJsonResponse: true },
  });
}

export async function unblockChat(threadId: string) {
  await api.delete(`chats/${threadId}/block`, {
    context: { allowNonJsonResponse: true },
  });
}

export async function deleteChat(threadId: string) {
  await api.delete(`chats/${threadId}`, {
    context: { allowNonJsonResponse: true },
  });
}

export async function deleteChats(threadIds: string[]) {
  const uniqueThreadIds = [...new Set(threadIds.filter(Boolean))];

  await Promise.all(uniqueThreadIds.map((threadId) => deleteChat(threadId)));
}

export async function reportChat({
  description,
  messageId,
  reason,
  threadId,
}: ChatReportPayload) {
  await api.post(`chats/${threadId}/report`, {
    context: { allowNonJsonResponse: true },
    json: {
      ...(messageId ? { message_id: messageId } : {}),
      reason,
      ...(description ? { description } : {}),
    },
  });
}
