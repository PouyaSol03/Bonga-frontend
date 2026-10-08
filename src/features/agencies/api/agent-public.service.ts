import { publicApi } from "../../../shared/api/api";
import { asRecord, toNumber } from "./agency-helpers";
import {
  normalizePublicAgentDetail,
  normalizePublicAgentListItem,
} from "./agent-public-normalizer";
import type {
  PublicAgentDetailApiResponse,
  PublicAgentDetailDto,
  PublicAgentListDto,
  PublicAgentListParams,
  PublicAgentsApiResponse,
  PublicAgentsPage,
} from "./agent-public.types";

export * from "./agent-public-normalizer";

export async function getPublicAgents({
  agencyId,
  page = 1,
  perPage = 20,
  search,
  sort,
}: PublicAgentListParams = {}): Promise<PublicAgentsPage> {
  const response = await publicApi
    .get("public/agents", {
      searchParams: {
        agency_id: agencyId,
        page,
        per_page: perPage,
        search: search?.trim() || undefined,
        sort,
      },
    })
    .json<PublicAgentsApiResponse>();
  const data = (response.data ?? [])
    .map(normalizePublicAgentListItem)
    .filter((item): item is PublicAgentListDto => Boolean(item));
  const resolvedPage = Math.max(1, toNumber(response.page, page));
  const resolvedPerPage = Math.max(1, toNumber(response.per_page, perPage));
  const total = Math.max(0, toNumber(response.total, data.length));

  return {
    data,
    hasNextPage: resolvedPage * resolvedPerPage < total,
    page: resolvedPage,
    perPage: resolvedPerPage,
    total,
  };
}

export async function getPublicAgentDetail(
  id: number | string,
): Promise<PublicAgentDetailDto> {
  const response = await publicApi
    .get(`public/agents/${encodeURIComponent(String(id))}`)
    .json<PublicAgentDetailApiResponse>();
  const root = asRecord(response);
  const data = asRecord(response.data);
  const nestedAgent = asRecord(
    response.agent ??
      response.consultant ??
      data.agent ??
      data.consultant ??
      data.profile ??
      response.data,
  );
  const agent = normalizePublicAgentDetail({
    id,
    ...root,
    ...data,
    ...nestedAgent,
    agency:
      nestedAgent.agency ??
      nestedAgent.agency_summary ??
      data.agency ??
      data.agency_summary ??
      root.agency ??
      root.agency_summary,
    ranking_summary:
      nestedAgent.ranking_summary ??
      nestedAgent.ranking ??
      data.ranking_summary ??
      data.ranking ??
      root.ranking_summary ??
      root.ranking,
    recent_advertises:
      nestedAgent.recent_advertises ??
      nestedAgent.recent_ads ??
      data.recent_advertises ??
      data.recent_ads ??
      root.recent_advertises ??
      root.recent_ads,
  });

  if (!agent) {
    throw new Error("اطلاعات مشاور معتبر نیست.");
  }

  return agent;
}
