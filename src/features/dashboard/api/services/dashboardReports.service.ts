import { apiV2 } from "../../../../shared/api/api";
import { toV2Context } from "./dashboardContext";
import type {
  DashboardReportConsultantsActivityData,
  DashboardReportConversionFunnelData,
  DashboardReportPublishedAdsData,
  DashboardReportRankingScoreData,
  DashboardReportRegistrationProgressData,
  DashboardReportViewsData,
  DashboardRolePersona,
  RawRecord,
} from "./dashboard.types";
import { asRecord, toNumber, toStringValue } from "./dashboardNormalizers";

export async function getDashboardReportsPublishedAds(
  role: DashboardRolePersona,
  period = "month",
): Promise<DashboardReportPublishedAdsData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/reports/published-ads`, { searchParams: { period } })
      .json<{ data?: RawRecord }>();
    const d = res.data ?? {};
    const rawBreakdown = Array.isArray(d.breakdown) ? d.breakdown : [];
    return {
      total: toNumber(d.total, 0),
      period: toStringValue(d.period, period),
      periodLabel: toStringValue(d.period_label, period === "year" ? "امسال" : "این ماه"),
      breakdown: rawBreakdown.map((item) => {
        const rec = asRecord(item);
        return {
          categoryId: rec.category_id ? String(rec.category_id) : null,
          type: toStringValue(rec.type),
          label: toStringValue(rec.label),
          count: toNumber(rec.count, 0),
          percent: toNumber(rec.percent, 0),
        };
      }),
    };
  } catch {
    return null;
  }
}

export async function getDashboardReportsViews(
  role: DashboardRolePersona,
  period = "year",
): Promise<DashboardReportViewsData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/reports/views`, { searchParams: { period } })
      .json<{ data?: RawRecord }>();
    const d = res.data ?? {};
    const rawItems = Array.isArray(d.items) ? d.items : [];
    return {
      period: toStringValue(d.period, period),
      totalViews: toNumber(d.total_views, 0),
      deltaPercent: toNumber(d.delta_percent, 0),
      trend: d.trend === "up" ? "up" : "down",
      trendLabel: toStringValue(d.trend_label),
      items: rawItems.map((item) => {
        const rec = asRecord(item);
        return {
          label: toStringValue(rec.label),
          views: toNumber(rec.views, 0),
        };
      }),
    };
  } catch {
    return null;
  }
}

export async function getDashboardReportsConsultantsActivity(
  period = "month",
): Promise<DashboardReportConsultantsActivityData | null> {
  try {
    const res = await apiV2
      .get("agency/dashboard/reports/consultants-activity", { searchParams: { period } })
      .json<{ data?: RawRecord }>();
    const d = res.data ?? {};
    const rawItems = Array.isArray(d.items) ? d.items : [];
    return {
      period: toStringValue(d.period, period),
      totalAds: toNumber(d.total_ads, 0),
      items: rawItems.map((item) => {
        const rec = asRecord(item);
        return {
          consultantId: toStringValue(rec.consultant_id),
          name: toStringValue(rec.name),
          ads: toNumber(rec.ads, 0),
          updates: toNumber(rec.updates, 0),
          specials: toNumber(rec.specials, 0),
        };
      }),
    };
  } catch {
    return null;
  }
}

export async function getDashboardReportsRegistrationProgress(
  role: DashboardRolePersona,
  period = "month",
): Promise<DashboardReportRegistrationProgressData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/reports/registration-progress`, { searchParams: { period } })
      .json<{ data?: RawRecord }>();
    const d = res.data ?? {};
    const rawItems = Array.isArray(d.items) ? d.items : [];
    return {
      period: toStringValue(d.period, period),
      totalCount: toNumber(d.total_count, 0),
      deltaPercent: toNumber(d.delta_percent, 0),
      trend: d.trend === "up" ? "up" : "down",
      trendLabel: toStringValue(d.trend_label),
      items: rawItems.map((item) => {
        const rec = asRecord(item);
        return {
          label: toStringValue(rec.label),
          count: toNumber(rec.count, 0),
        };
      }),
    };
  } catch {
    return null;
  }
}

export async function getDashboardReportsConversionFunnel(
  role: DashboardRolePersona,
  period = "month",
): Promise<DashboardReportConversionFunnelData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/reports/conversion-funnel`, { searchParams: { period } })
      .json<{ data?: RawRecord }>();
    const d = res.data ?? {};
    const rawStages = Array.isArray(d.stages) ? d.stages : [];
    return {
      period: toStringValue(d.period, period),
      stages: rawStages.map((st) => {
        const rec = asRecord(st);
        return {
          id: toStringValue(rec.id),
          label: toStringValue(rec.label),
          count: toNumber(rec.count, 0),
          percentage: toNumber(rec.percentage, 0),
          badgeText: toStringValue(rec.badge_text, `${toNumber(rec.percentage, 0)}%`),
        };
      }),
    };
  } catch {
    return null;
  }
}

export async function getDashboardReportsRankingScore(
  role: DashboardRolePersona,
): Promise<DashboardReportRankingScoreData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/reports/ranking-score`)
      .json<{ data?: RawRecord }>();
    const d = res.data ?? {};
    return {
      rank: toNumber(d.rank, 0),
      rankChangeLastMonth: toNumber(d.rank_change_last_month, 0),
      rankChangeDirection: d.rank_change_direction === "down" ? "down" : "up",
      score: toNumber(d.score, 0),
      levelTitle: toStringValue(d.level_title),
      levelSlug: toStringValue(d.level_slug),
      thresholdLabel: toStringValue(d.threshold_label),
      pointsNeeded: toNumber(d.points_needed, 0),
      targetRank: toNumber(d.target_rank, 0),
      guideUrl: toStringValue(
        d.guide_url,
        role === "agency"
          ? "/account/dashboard/ranking?from=dashboard"
          : "/account/ranking?from=dashboard",
      ),
    };
  } catch {
    return null;
  }
}
