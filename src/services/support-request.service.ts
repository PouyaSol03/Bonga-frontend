import { api } from "../api/api";

export type SupportRequestPayload = {
  category: string;
  priority: "normal" | "important" | "urgent";
  subject: string;
  description: string;
};

export type SupportRequestItem = Record<string, unknown> & {
  assigned_support?: Record<string, unknown> | null;
  category?: string;
  category_label?: string;
  closed_at?: string | null;
  created_at?: string;
  description?: string;
  id?: number | string;
  priority?: "normal" | "important" | "urgent" | string;
  status?: string;
  subject?: string;
  thread_id?: number | string;
  updated_at?: string;
  user?: Record<string, unknown>;
};

export type SupportRequestsPage = {
  data: SupportRequestItem[];
  page: number;
  perPage: number;
  total: number;
};

type SupportRequestsResponse =
  | SupportRequestItem[]
  | {
      data?: SupportRequestItem[];
      page?: number;
      per_page?: number;
      total?: number;
    };

type SupportRequestResponse =
  | SupportRequestItem
  | { data?: SupportRequestItem; request?: SupportRequestItem };

function readSupportRequest(response: SupportRequestResponse): SupportRequestItem {
  const envelope = response as {
    data?: SupportRequestItem;
    request?: SupportRequestItem;
  };

  if (envelope.request) return envelope.request;
  if (envelope.data) return envelope.data;

  return response as SupportRequestItem;
}

export function createSupportRequest(payload: SupportRequestPayload) {
  return api
    .post("support/requests", { json: payload })
    .json<SupportRequestResponse>()
    .then(readSupportRequest);
}

export async function getSupportRequests({
  category,
  page = 1,
  perPage = 20,
  priority,
  status,
}: {
  category?: string;
  page?: number;
  perPage?: number;
  priority?: string;
  status?: string;
} = {}): Promise<SupportRequestsPage> {
  const response = await api
    .get("support/requests", {
      searchParams: {
        category,
        page,
        per_page: perPage,
        priority,
        status,
      },
    })
    .json<SupportRequestsResponse>();
  const data = Array.isArray(response) ? response : response.data ?? [];

  return {
    data,
    page: Array.isArray(response) ? page : response.page ?? page,
    perPage: Array.isArray(response) ? perPage : response.per_page ?? perPage,
    total: Array.isArray(response) ? data.length : response.total ?? data.length,
  };
}
