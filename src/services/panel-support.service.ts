import { api } from "../api/api";
import type { ChatThread } from "./chat.service";
import type { SupportRequestItem } from "./support-request.service";

export type PanelSupportRequestStatus = "open" | "reviewing" | "closed";

export type PanelSupportRequestFilters = {
  category?: string;
  page?: number;
  perPage?: number;
  priority?: string;
  status?: PanelSupportRequestStatus;
};

export type PanelSupportRequestsPage = {
  data: SupportRequestItem[];
  page: number;
  perPage: number;
  total: number;
};

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as UnknownRecord)
    : undefined;
}

function readArray<T>(payload: unknown, keys: string[]): T[] {
  if (Array.isArray(payload)) return payload as T[];

  const record = asRecord(payload);
  if (!record) return [];

  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value as T[];

    const nested = asRecord(value);
    if (nested) {
      const rows = readArray<T>(nested, keys);
      if (rows.length > 0) return rows;
    }
  }

  return [];
}

function readNumber(value: unknown, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function findPagination(payload: unknown): UnknownRecord {
  const record = asRecord(payload);
  if (!record) return {};

  if (
    ["total", "count", "page", "current_page", "per_page", "perPage"].some(
      (key) => record[key] !== undefined,
    )
  ) {
    return record;
  }

  for (const key of ["data", "meta", "pagination", "result"]) {
    const nested = findPagination(record[key]);
    if (Object.keys(nested).length > 0) return nested;
  }

  return {};
}

export async function listPanelSupportRequests({
  category,
  page = 1,
  perPage = 20,
  priority,
  status,
}: PanelSupportRequestFilters = {}): Promise<PanelSupportRequestsPage> {
  const payload = await api
    .get("panel/support/requests", {
      searchParams: {
        category,
        page,
        per_page: perPage,
        priority,
        status,
      },
    })
    .json<unknown>();
  const data = readArray<SupportRequestItem>(payload, [
    "data",
    "items",
    "list",
    "requests",
  ]);
  const pagination = findPagination(payload);

  return {
    data,
    page: readNumber(pagination.page ?? pagination.current_page, page),
    perPage: readNumber(pagination.per_page ?? pagination.perPage, perPage),
    total: readNumber(pagination.total ?? pagination.count, data.length),
  };
}

export async function listPanelSupportChats() {
  const payload = await api.get("panel/support/chats").json<unknown>();
  return readArray<ChatThread>(payload, ["data", "items", "list", "chats", "threads"]);
}

export function assignPanelSupportRequest(requestId: string, supportUserId: number) {
  return api
    .patch(`panel/support/requests/${encodeURIComponent(requestId)}/assign`, {
      json: { support_user_id: supportUserId },
    })
    .json<unknown>();
}

export function updatePanelSupportRequestStatus(
  requestId: string,
  status: PanelSupportRequestStatus,
) {
  return api
    .patch(`panel/support/requests/${encodeURIComponent(requestId)}/status`, {
      json: { status },
    })
    .json<unknown>();
}

export function sendPanelSupportRequestMessage(requestId: string, body: string) {
  return api
    .post(`panel/support/requests/${encodeURIComponent(requestId)}/messages`, {
      json: { body, type: "text" },
    })
    .json<unknown>();
}
