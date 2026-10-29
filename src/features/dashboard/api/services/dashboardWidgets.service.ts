import { apiV2 } from "../../../../shared/api/api";
import {
  mapAdvertisementToAdCard,
  type AdvertisementItem,
} from "../../../advertisements/api/advertisement.service";
import { toV2Context } from "./dashboardContext";
import type {
  DashboardCreditsData,
  DashboardNotificationWidgetData,
  DashboardRankingBadgeData,
  DashboardRecentAdItem,
  DashboardReportsTeaserData,
  DashboardRolePersona,
  RawRecord,
} from "./dashboard.types";
import {
  asRecord,
  normalizeBalanceDelta,
  toNumber,
  toNumberOrUndefined,
  toStringValue,
} from "./dashboardNormalizers";

export async function getDashboardRankingBadge(
  role: DashboardRolePersona,
): Promise<DashboardRankingBadgeData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2.get(`${context}/dashboard/ranking-badge`).json<{ data?: RawRecord }>();
    const d = res.data ?? {};
    return {
      categoryLabel: toStringValue(d.category_label, role === "agency" ? "سطح آژانس" : "سطح مشاور"),
      badgeTitle: toStringValue(d.badge_title, "تازه‌کار"),
      levelSlug: toStringValue(d.level_slug, "newbie"),
      currentScore: toNumber(d.current_score, 0),
      nextLevelScore: toNumber(d.next_level_score, 0),
      rank: toNumber(d.rank, 0),
      totalCompetitors: toNumber(d.total_competitors, 0),
      changeFromLastMonth: toNumber(d.change_from_last_month, 0),
      targetUrl: toStringValue(
        d.target_url,
        role === "agency"
          ? "/account/dashboard/ranking?from=dashboard"
          : "/account/ranking?from=dashboard",
      ),
    };
  } catch {
    return null;
  }
}

export async function getDashboardCredits(
  role: DashboardRolePersona,
): Promise<DashboardCreditsData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2.get(`${context}/dashboard/credits`).json<{ data?: RawRecord }>();
    const d = res.data ?? {};
    const rawBalances = asRecord(d.balances);
    const rawDeltas = asRecord(d.balance_deltas);
    return {
      balances: {
        adCreditBalance: toNumber(rawBalances.ad_credit_balance, 0),
        renewCreditBalance: toNumber(rawBalances.renew_credit_balance, 0),
        specialCreditBalance: toNumber(rawBalances.special_credit_balance, 0),
        panelDaysRemaining: toNumber(rawBalances.panel_days_remaining, 0),
        unassignedAdCreditBalance: toNumberOrUndefined(rawBalances.unassigned_ad_credit_balance),
        unassignedRenewCreditBalance: toNumberOrUndefined(
          rawBalances.unassigned_renew_credit_balance,
        ),
        unassignedSpecialCreditBalance: toNumberOrUndefined(
          rawBalances.unassigned_special_credit_balance,
        ),
        walletBalance: toNumberOrUndefined(rawBalances.wallet_balance),
      },
      balanceDeltas: {
        adCreditUsed: normalizeBalanceDelta(rawDeltas.ad_credit_used),
        renewCreditUsed: normalizeBalanceDelta(rawDeltas.renew_credit_used),
        specialCreditUsed: normalizeBalanceDelta(rawDeltas.special_credit_used),
      },
    };
  } catch {
    return null;
  }
}

export async function getDashboardNotifications(
  role: DashboardRolePersona,
): Promise<DashboardNotificationWidgetData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2.get(`${context}/dashboard/notifications`).json<{ data?: RawRecord }>();
    const d = res.data ?? {};
    const rawLatest = asRecord(d.latest);
    const latest =
      d.latest && rawLatest.id
        ? {
            id: toStringValue(rawLatest.id),
            title: toStringValue(rawLatest.title),
            message: toStringValue(rawLatest.message),
            createdAt: toStringValue(rawLatest.created_at),
            isRead: Boolean(rawLatest.is_read),
          }
        : null;
    const rawItems = Array.isArray(d.items) ? d.items : [];
    const items = rawItems.map((item) => {
      const rec = asRecord(item);
      return {
        id: toStringValue(rec.id),
        title: toStringValue(rec.title),
        message: toStringValue(rec.message),
        createdAt: toStringValue(rec.created_at),
        isRead: Boolean(rec.is_read),
      };
    });
    if (items.length === 0 && latest) {
      items.push(latest);
    }
    return {
      unreadCount: toNumber(d.unread_count, 0),
      latest,
      items,
    };
  } catch {
    return null;
  }
}

export async function getDashboardReportsTeaser(
  role: DashboardRolePersona,
  period = "month",
): Promise<DashboardReportsTeaserData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/reports-teaser`, { searchParams: { period } })
      .json<{ data?: RawRecord }>();
    const d = res.data ?? {};
    return {
      totalViews: toNumber(d.total_views, 0),
      viewsDeltaPercent: toNumber(d.views_delta_percent, 0),
      sparklineData: Array.isArray(d.sparkline_data)
        ? d.sparkline_data.map((n) => toNumber(n, 0))
        : [],
      publishedAdsCount: toNumber(d.published_ads_count, 0),
      conversionRate: toNumber(d.conversion_rate, 0),
    };
  } catch {
    return null;
  }
}

export async function getDashboardRecentAds(
  role: DashboardRolePersona,
  limit = 5,
): Promise<DashboardRecentAdItem[]> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/recent-ads`, { searchParams: { limit } })
      .json<{ data?: { items?: unknown[] } }>();
    const items = Array.isArray(res.data?.items) ? res.data!.items : [];
    return items.map((raw, index) => {
      const rec = asRecord(raw);
      const card = mapAdvertisementToAdCard(rec as unknown as AdvertisementItem, index);
      const statusLabel = (rec.status_label as string) || (rec.status as string) || card.status;

      return {
        ...card,
        status: statusLabel,
        rawStatus: toStringValue(rec.status),
        statusCode: toNumberOrUndefined(rec.status_code),
        viewsCount: toNumberOrUndefined(rec.views_count),
        publishedAt: rec.published_at ? String(rec.published_at) : undefined,
        confirmDate: rec.confirm_date ? String(rec.confirm_date) : undefined,
        expireDate: rec.expire_date ? String(rec.expire_date) : undefined,
        assignmentStatus: rec.assignment_status ? String(rec.assignment_status) : undefined,
      };
    });
  } catch {
    return [];
  }
}
