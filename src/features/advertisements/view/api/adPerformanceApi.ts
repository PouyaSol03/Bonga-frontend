import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../shared/api/api";
import { useActiveAuthRole } from "../../../../shared/auth/use-active-auth-role";
import {
  PERFORMANCE_METRICS,
  DEFAULT_PERFORMANCE_DAYS,
  type PerformanceMetricKey,
  type PerformanceDayData,
} from "../components/performance/viewAdPerformanceData";

export interface AdPerformanceSummaryData {
  views_count: number;
  views_growth_percent?: number;
  search_impressions_count: number;
  search_growth_percent?: number;
  calls_count: number;
  calls_growth_percent?: number;
  chats_count: number;
  chats_growth_percent?: number;
}

export interface AdPerformanceChartsData {
  metric: PerformanceMetricKey;
  week_label: string;
  total_metric_value: number;
  days: PerformanceDayData[];
}

export async function getAdPerformanceSummary(
  adId?: string | number,
  role?: string
): Promise<AdPerformanceSummaryData | null> {
  if (!adId) return null;
  try {
    const res = await api
      .get(`business/advertisements/${encodeURIComponent(String(adId))}/performance/summary`, {
        searchParams: role ? { role } : undefined,
        headers: role ? { "X-Active-Role": role } : undefined,
      })
      .json<{ data: AdPerformanceSummaryData }>();
    return res.data;
  } catch {
    return null;
  }
}

export async function getAdPerformanceCharts(
  adId?: string | number,
  metric: PerformanceMetricKey = "views",
  weekOffset = 0,
  role?: string
): Promise<AdPerformanceChartsData | null> {
  if (!adId) return null;
  try {
    const res = await api
      .get(
        `business/advertisements/${encodeURIComponent(String(adId))}/performance/charts`,
        {
          searchParams: { metric, week_offset: weekOffset, ...(role ? { role } : {}) },
          headers: role ? { "X-Active-Role": role } : undefined,
        }
      )
      .json<{ data: AdPerformanceChartsData }>();
    return res.data;
  } catch {
    return null;
  }
}

export function useAdPerformanceSummaryQuery(
  adId?: string | number,
  fallbackAd?: Record<string, unknown>
) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["ad-performance-summary", adId, activeRole],
    queryFn: async () => {
      const live = await getAdPerformanceSummary(adId, activeRole);
      if (live) return live;
      return {
        views_count: Number(fallbackAd?.view_count ?? fallbackAd?.views ?? 20365),
        search_impressions_count: 2450,
        calls_count: Number(fallbackAd?.call_count ?? fallbackAd?.calls ?? 79),
        chats_count: 54,
      };
    },
    enabled: Boolean(adId),
    staleTime: 60_000,
  });
}

export function useAdPerformanceChartsQuery(
  adId?: string | number,
  metric: PerformanceMetricKey = "views",
  weekOffset = 0
) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["ad-performance-charts", adId, metric, weekOffset, activeRole],
    queryFn: async () => {
      const live = await getAdPerformanceCharts(adId, metric, weekOffset, activeRole);
      if (live) return live;
      const targetMetric = PERFORMANCE_METRICS.find((m) => m.key === metric) ?? PERFORMANCE_METRICS[0];
      return {
        metric,
        week_label: "هفته دوم تیر",
        total_metric_value: Number(targetMetric.defaultTotal.replace(/[^0-9]/g, "")) || 20365,
        days: DEFAULT_PERFORMANCE_DAYS,
      };
    },
    staleTime: 60_000,
  });
}
