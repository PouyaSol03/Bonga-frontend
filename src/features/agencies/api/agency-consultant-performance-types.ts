import type { AdCardData } from "../../advertisements/components/AdCard";

export type ConsultantAdvertisementsParams = {
  agentId: number | string;
  page?: number;
  perPage?: number;
  status?: "active" | "expired" | "all";
};

export type ConsultantAdvertisementsPage = {
  data: AdCardData[];
  page: number;
  perPage: number;
  total: number;
};

export type ConsultantActivityItemDto = {
  created_at: string;
  id: string;
  subtitle: string;
  title: string;
  type: string;
};

export type ConsultantActivitiesParams = {
  agentId: number | string;
  page?: number;
  perPage?: number;
  period?: "week" | "month" | "year";
  type?: "all" | "ad" | "response" | "visit" | "followup";
};

export type ConsultantActivityStatsDto = {
  period: string;
  source?: string;
  stats: {
    ad: number;
    followup: number | null;
    response: number | null;
    visit: number | null;
  };
  unavailableMetrics: string[];
  visit_semantics?: string;
};

export type ConsultantActivityFeedDto = {
  activities: ConsultantActivityItemDto[];
  page: number;
  perPage: number;
  period: string;
  source?: string;
  total: number;
  visit_semantics?: string;
};

export type ConsultantActivitiesDto = {
  activities: ConsultantActivityItemDto[];
  page: number;
  perPage: number;
  period: string;
  stats: {
    ad: number;
    followup: number | null;
    response: number | null;
    visit: number | null;
  };
  total: number;
  unavailableMetrics: string[];
};

export type ConsultantPerformanceChartSlice = {
  color: string;
  label: string;
  percentage: number;
  value: number;
};

export type ConsultantPerformanceDistribution = {
  key: string;
  slices: ConsultantPerformanceChartSlice[];
  title: string;
  total: number;
};

export type ConsultantPerformanceChartsDto = {
  distributions: ConsultantPerformanceDistribution[];
  period: "month" | "year";
  progress: { label: string; value: number }[];
};

export type ConsultantMetricParams = {
  agentId: number | string;
  period?: "week" | "month" | "year";
  from?: string;
  to?: string;
};

export type ConsultantMetricSlice = {
  color?: string;
  key: "agent" | "rest_of_agency" | string;
  label: string;
  percentage: number;
  value: number;
};

export type ConsultantMetricData = {
  agent_count: number;
  agent_id?: number;
  count: number;
  count_semantics?: string;
  metric?: string;
  period?: string;
  period_end?: string;
  period_start?: string;
  slices: ConsultantMetricSlice[];
  title?: string;
  total_count: number;
};

export type ConsultantMetricType =
  | "published-ads"
  | "renewal-usage"
  | "special-usage";
