import { publicApi } from "../api/api";

export type HomeStats = {
  activeAdvertises: number;
  approvedAgencies: number;
  approvedAgents: number;
  searchesThisMonth: number;
  updatedAt: string | null;
};

type HomeStatsResponse = {
  data?: {
    active_advertises?: unknown;
    approved_agencies?: unknown;
    approved_agents?: unknown;
    searches_this_month?: unknown;
    updated_at?: unknown;
  };
  status?: boolean;
};

function toCount(value: unknown) {
  const parsed = Number(value ?? 0);

  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : 0;
}

export async function getHomeStats(): Promise<HomeStats> {
  const response = await publicApi
    .get("public/home/stats")
    .json<HomeStatsResponse>();
  const data = response.data ?? {};

  return {
    activeAdvertises: toCount(data.active_advertises),
    approvedAgencies: toCount(data.approved_agencies),
    approvedAgents: toCount(data.approved_agents),
    searchesThisMonth: toCount(data.searches_this_month),
    updatedAt: typeof data.updated_at === "string" ? data.updated_at : null,
  };
}
