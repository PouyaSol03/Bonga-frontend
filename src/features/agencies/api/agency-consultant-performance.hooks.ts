import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../shared/api/query-keys";
import {
  getMyAgencyConsultantActivities,
  getMyAgencyConsultantActivityFeed,
  getMyAgencyConsultantActivityStats,
  getMyAgencyConsultantAdvertisements,
  getMyAgencyConsultantCharts,
  getMyAgencyConsultantPublishedAdsMetric,
  getMyAgencyConsultantRenewalUsageMetric,
  getMyAgencyConsultantSpecialUsageMetric,
} from "./agency-consultant-performance.service";
import type {
  ConsultantActivitiesParams,
  ConsultantAdvertisementsParams,
  ConsultantMetricParams,
} from "./agency-consultants-types";

export function useAgencyConsultantAdvertisementsQuery({
  agentId,
  enabled = true,
  page = 1,
  perPage = 15,
  status = "active",
}: ConsultantAdvertisementsParams & { enabled?: boolean }) {
  return useQuery({
    enabled: enabled && Boolean(agentId) && String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantAdvertisements({ agentId, page, perPage, status }),
    queryKey: queryKeys.agencies.consultantAdvertisements(agentId, {
      page,
      perPage,
      status,
    }),
  });
}

export function useAgencyConsultantActivitiesQuery({
  agentId,
  enabled = true,
  page = 1,
  perPage = 20,
  period = "week",
  type = "all",
}: ConsultantActivitiesParams & { enabled?: boolean }) {
  return useQuery({
    enabled: enabled && Boolean(agentId) && String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantActivities({ agentId, page, perPage, period, type }),
    queryKey: queryKeys.agencies.consultantActivities(agentId, {
      page,
      perPage,
      period,
      type,
    }),
  });
}

export function useAgencyConsultantActivityStatsQuery({
  agentId,
  enabled = true,
  period = "week",
}: {
  agentId?: number | string;
  enabled?: boolean;
  period?: "week" | "month" | "year";
}) {
  return useQuery({
    enabled: enabled && Boolean(agentId) && String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantActivityStats({ agentId: agentId as number | string, period }),
    queryKey: queryKeys.agencies.consultantActivityStats(agentId ?? "", period),
  });
}

export function useAgencyConsultantActivityFeedQuery({
  agentId,
  enabled = true,
  page = 1,
  perPage = 20,
  period = "week",
  type = "all",
}: ConsultantActivitiesParams & { enabled?: boolean }) {
  return useQuery({
    enabled: enabled && Boolean(agentId) && String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantActivityFeed({ agentId, page, perPage, period, type }),
    queryKey: queryKeys.agencies.consultantActivityFeed(agentId, {
      page,
      perPage,
      period,
      type,
    }),
  });
}

export function useAgencyConsultantChartsQuery({
  agentId,
  enabled = true,
  period = "month",
}: {
  agentId?: number | string;
  enabled?: boolean;
  period?: "week" | "month" | "year";
}) {
  return useQuery({
    enabled: enabled && Boolean(agentId) && String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantCharts({ agentId: agentId as number | string, period }),
    queryKey: queryKeys.agencies.consultantCharts(agentId ?? "", period),
  });
}

export function useAgencyConsultantPublishedAdsMetricQuery({
  agentId,
  period = "month",
  from,
  to,
  enabled = true,
}: ConsultantMetricParams & { enabled?: boolean }) {
  return useQuery({
    enabled: enabled && Boolean(agentId) && String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantPublishedAdsMetric({ agentId, period, from, to }),
    queryKey: queryKeys.agencies.consultantMetricPublishedAds(agentId, {
      period,
      from,
      to,
    }),
  });
}

export function useAgencyConsultantRenewalUsageMetricQuery({
  agentId,
  period = "month",
  from,
  to,
  enabled = true,
}: ConsultantMetricParams & { enabled?: boolean }) {
  return useQuery({
    enabled: enabled && Boolean(agentId) && String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantRenewalUsageMetric({ agentId, period, from, to }),
    queryKey: queryKeys.agencies.consultantMetricRenewalUsage(agentId, {
      period,
      from,
      to,
    }),
  });
}

export function useAgencyConsultantSpecialUsageMetricQuery({
  agentId,
  period = "month",
  from,
  to,
  enabled = true,
}: ConsultantMetricParams & { enabled?: boolean }) {
  return useQuery({
    enabled: enabled && Boolean(agentId) && String(agentId) !== "0",
    queryFn: () =>
      getMyAgencyConsultantSpecialUsageMetric({ agentId, period, from, to }),
    queryKey: queryKeys.agencies.consultantMetricSpecialUsage(agentId, {
      period,
      from,
      to,
    }),
  });
}
