import { useQuery } from "@tanstack/react-query";
import { useActiveAuthRole } from "../../../../shared/auth/use-active-auth-role";
import { getV2AdvertisementPerformance } from "../../api/v2";
import {
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

export interface AdPerformanceFunnelStage {
  id: string;
  label: string;
  count: number;
  value: string;
  percentage: number;
  badge_color?: string;
  is_final?: boolean;
}

export interface AdPerformanceFunnelData {
  status?: boolean;
  available?: boolean;
  title?: string;
  stages?: AdPerformanceFunnelStage[];
}

export interface AdPerformanceChartsData {
  metric: PerformanceMetricKey;
  week_label: string;
  total_metric_value: number;
  days: PerformanceDayData[];
}

export async function getAdPerformanceSummary(
  adId?: string | number,
): Promise<AdPerformanceSummaryData | null> {
  if (!adId) return null;
  try {
    const res = await getV2AdvertisementPerformance<{ data?: AdPerformanceSummaryData } | AdPerformanceSummaryData>(
      adId,
      "summary",
    );
    if (!res) return null;
    return "data" in res && res.data ? res.data : (res as AdPerformanceSummaryData);
  } catch {
    return null;
  }
}

export async function getAdPerformanceCharts(
  adId?: string | number,
  metric: PerformanceMetricKey = "views",
  weekOffset = 0,
): Promise<AdPerformanceChartsData | null> {
  if (!adId) return null;
  try {
    const res = await getV2AdvertisementPerformance<{ data?: AdPerformanceChartsData } | AdPerformanceChartsData>(
      adId,
      "charts",
      { metric, week_offset: weekOffset },
    );
    if (!res) return null;
    return "data" in res && res.data ? res.data : (res as AdPerformanceChartsData);
  } catch {
    return null;
  }
}

export function useAdPerformanceSummaryQuery(
  adId?: string | number,
  fallbackAd?: Record<string, unknown>,
) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["ad-performance-summary", adId ? String(adId) : "", activeRole],
    queryFn: async () => {
      const live = await getAdPerformanceSummary(adId);
      if (live) return live;
      return {
        views_count: Number(fallbackAd?.view_count ?? fallbackAd?.views ?? 0),
        search_impressions_count: Number(fallbackAd?.search_impressions_count ?? 0),
        calls_count: Number(fallbackAd?.call_count ?? fallbackAd?.calls ?? 0),
        chats_count: Number(fallbackAd?.chats_count ?? 0),
      };
    },
    enabled: Boolean(adId),
    staleTime: 60_000,
  });
}

export async function getAdPerformanceFunnel(
  adId?: string | number,
): Promise<AdPerformanceFunnelData | null> {
  if (!adId) return null;
  try {
    const res = await getV2AdvertisementPerformance<{ data?: AdPerformanceFunnelData } | AdPerformanceFunnelData>(
      adId,
      "conversion-funnel",
    );
    if (!res) return null;
    return "data" in res && res.data ? res.data : (res as AdPerformanceFunnelData);
  } catch {
    return null;
  }
}

export function useAdPerformanceFunnelQuery(adId?: string | number) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["ad-performance-funnel", adId ? String(adId) : "", activeRole],
    queryFn: () => getAdPerformanceFunnel(adId),
    enabled: Boolean(adId),
    staleTime: 60_000,
  });
}

export function useAdPerformanceChartsQuery(
  adId?: string | number,
  metric: PerformanceMetricKey = "views",
  weekOffset = 0,
) {
  const activeRole = useActiveAuthRole();
  return useQuery({
    queryKey: ["ad-performance-charts", adId ? String(adId) : "", metric, weekOffset, activeRole],
    queryFn: async () => {
      const live = await getAdPerformanceCharts(adId, metric, weekOffset);
      if (live) return live;
      return {
        metric,
        week_label: "این هفته",
        total_metric_value: 0,
        days: DEFAULT_PERFORMANCE_DAYS.map((d) => ({ ...d, value: 0 })),
      };
    },
    staleTime: 60_000,
    placeholderData: (previousData) => previousData,
  });
}

