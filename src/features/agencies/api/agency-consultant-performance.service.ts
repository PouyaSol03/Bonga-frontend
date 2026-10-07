import { apiV2 } from "../../../shared/api/api";
import {
  mapAdvertisementToAdCard,
  type AdvertisementItem,
} from "../../advertisements/api/advertisement.service";
import type {
  ConsultantActivitiesDto,
  ConsultantActivitiesParams,
  ConsultantActivityFeedDto,
  ConsultantActivityItemDto,
  ConsultantActivityStatsDto,
  ConsultantAdvertisementsPage,
  ConsultantAdvertisementsParams,
  ConsultantMetricData,
  ConsultantMetricParams,
  ConsultantMetricType,
  ConsultantPerformanceChartsDto,
} from "./agency-consultants-types";
import { agencyConsultantPath } from "./agency-consultants.service";
import { toNumber } from "./agency.service";

const emptyMetricData: ConsultantMetricData = {
  agent_count: 0,
  count: 0,
  slices: [],
  total_count: 0,
};

function normalizeStats(stats: Record<string, unknown> = {}) {
  return {
    ad: Math.max(0, toNumber(stats.ad, 0)),
    followup: stats.followup !== undefined ? (stats.followup as number | null) : null,
    response: stats.response !== undefined ? (stats.response as number | null) : null,
    visit: stats.visit !== undefined ? (stats.visit as number | null) : null,
  };
}

export async function getMyAgencyConsultantAdvertisements({
  agentId,
  page = 1,
  perPage = 15,
  status = "active",
}: ConsultantAdvertisementsParams): Promise<ConsultantAdvertisementsPage> {
  const res = await apiV2
    .get(agencyConsultantPath(agentId, "advertisements"), {
      searchParams: { page, per_page: perPage, status },
    })
    .json<{ data?: (AdvertisementItem | Record<string, unknown>)[]; page?: number; per_page?: number; total?: number }>();

  const list = Array.isArray(res.data) ? res.data : [];
  return {
    data: list.map((item, i) => mapAdvertisementToAdCard(item as AdvertisementItem, i)),
    page: Math.max(1, toNumber(res.page, page)),
    perPage: Math.max(1, toNumber(res.per_page, perPage)),
    total: Math.max(0, toNumber(res.total, list.length)),
  };
}

export async function getMyAgencyConsultantActivityStats({
  agentId,
  period = "week",
}: {
  agentId: number | string;
  period?: "week" | "month" | "year";
}): Promise<ConsultantActivityStatsDto> {
  const res = await apiV2
    .get(agencyConsultantPath(agentId, "performance/activity-stats"), {
      searchParams: { period },
    })
    .json<{
      period?: string;
      source?: string;
      stats?: Record<string, unknown>;
      unavailable_metrics?: string[];
      visit_semantics?: string;
    }>();

  return {
    period: res.period ?? period,
    source: res.source,
    stats: normalizeStats(res.stats),
    unavailableMetrics: Array.isArray(res.unavailable_metrics) ? res.unavailable_metrics : [],
    visit_semantics: res.visit_semantics,
  };
}

export async function getMyAgencyConsultantActivityFeed({
  agentId,
  page = 1,
  perPage = 20,
  period = "week",
  type = "all",
}: ConsultantActivitiesParams): Promise<ConsultantActivityFeedDto> {
  const res = await apiV2
    .get(agencyConsultantPath(agentId, "performance/activity-feed"), {
      searchParams: { page, per_page: perPage, period, type },
    })
    .json<{
      activities?: ConsultantActivityItemDto[];
      page?: number;
      per_page?: number;
      period?: string;
      source?: string;
      total?: number;
      visit_semantics?: string;
    }>();

  return {
    activities: Array.isArray(res.activities) ? res.activities : [],
    page: Math.max(1, toNumber(res.page, page)),
    perPage: Math.max(1, toNumber(res.per_page, perPage)),
    period: res.period ?? period,
    source: res.source,
    total: Math.max(0, toNumber(res.total, 0)),
    visit_semantics: res.visit_semantics,
  };
}

export async function getMyAgencyConsultantActivities({
  agentId,
  page = 1,
  perPage = 20,
  period = "week",
  type = "all",
}: ConsultantActivitiesParams): Promise<ConsultantActivitiesDto> {
  const res = await apiV2
    .get(agencyConsultantPath(agentId, "performance/activities"), {
      searchParams: { page, per_page: perPage, period, type },
    })
    .json<{
      activities?: ConsultantActivityItemDto[];
      page?: number;
      per_page?: number;
      period?: string;
      stats?: Record<string, unknown>;
      total?: number;
      unavailable_metrics?: string[];
    }>();

  return {
    activities: Array.isArray(res.activities) ? res.activities : [],
    page: Math.max(1, toNumber(res.page, page)),
    perPage: Math.max(1, toNumber(res.per_page, perPage)),
    period: res.period ?? period,
    stats: normalizeStats(res.stats),
    total: Math.max(0, toNumber(res.total, 0)),
    unavailableMetrics: Array.isArray(res.unavailable_metrics) ? res.unavailable_metrics : [],
  };
}

export async function getMyAgencyConsultantCharts({
  agentId,
  period = "month",
}: {
  agentId: number | string;
  period?: "week" | "month" | "year";
}): Promise<ConsultantPerformanceChartsDto> {
  const res = await apiV2
    .get(agencyConsultantPath(agentId, "performance/charts"), {
      searchParams: { period },
    })
    .json<{
      distributions?: ConsultantPerformanceChartsDto["distributions"];
      period?: "month" | "year";
      progress?: { label: string; value: number }[];
    }>();

  return {
    distributions: Array.isArray(res.distributions) ? res.distributions : [],
    period: res.period ?? (period === "week" ? "month" : period),
    progress: Array.isArray(res.progress) ? res.progress : [],
  };
}

export async function getMyAgencyConsultantMetric(
  metric: ConsultantMetricType,
  { agentId, period = "month", from, to }: ConsultantMetricParams,
): Promise<ConsultantMetricData> {
  const searchParams: Record<string, string> =
    from && to ? { from, to } : period ? { period } : {};

  const res = await apiV2
    .get(agencyConsultantPath(agentId, `metrics/${metric}`), { searchParams })
    .json<{ data?: ConsultantMetricData }>();

  return res.data ?? emptyMetricData;
}

export const getMyAgencyConsultantPublishedAdsMetric = (p: ConsultantMetricParams) =>
  getMyAgencyConsultantMetric("published-ads", p);

export const getMyAgencyConsultantRenewalUsageMetric = (p: ConsultantMetricParams) =>
  getMyAgencyConsultantMetric("renewal-usage", p);

export const getMyAgencyConsultantSpecialUsageMetric = (p: ConsultantMetricParams) =>
  getMyAgencyConsultantMetric("special-usage", p);
