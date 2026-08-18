import { api } from "../../../shared/api/api";

export type RecentViewItem = Record<string, unknown> & {
  advertise?: Record<string, unknown> | null;
  advertise_id?: number | string;
  created_at?: string;
  id?: number | string;
};

export type RecentViewsPage = {
  advertises: Record<string, unknown>[];
  data: RecentViewItem[];
  page: number;
  perPage: number;
  total: number;
};

type RecentViewsResponse = {
  advertises?: Record<string, unknown>[];
  data?: RecentViewItem[];
  page?: number;
  per_page?: number;
  total?: number;
};

export async function getRecentViews(params: {
  page?: number;
  perPage?: number;
  includeMissing?: boolean;
} = {}): Promise<RecentViewsPage> {
  const page = params.page ?? 1;
  const perPage = params.perPage ?? 20;
  const response = await api.get("me/views", {
    searchParams: {
      page,
      per_page: perPage,
      include_missing: params.includeMissing,
    },
  }).json<RecentViewsResponse>();

  return {
    advertises: response.advertises ?? [],
    data: response.data ?? [],
    page: response.page ?? page,
    perPage: response.per_page ?? perPage,
    total: response.total ?? response.data?.length ?? response.advertises?.length ?? 0,
  };
}
