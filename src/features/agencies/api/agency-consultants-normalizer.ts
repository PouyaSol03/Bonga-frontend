import {
  asRecord,
  firstText,
  normalizePermissionFlag,
  toAssetUrl,
  toNumber,
  toOptionalNumber,
} from "./agency-helpers";
import type {
  AgencyConsultantApiItem,
  AgencyConsultantDto,
  AgencyConsultantPermissions,
} from "./agency-consultants-types";

export function normalizeAgencyConsultantPermissions(
  value: unknown,
): AgencyConsultantPermissions {
  const permissions = asRecord(value);

  return {
    manage_advertises: normalizePermissionFlag(permissions.manage_advertises),
    manage_consultants: normalizePermissionFlag(permissions.manage_consultants),
    manage_credits: normalizePermissionFlag(permissions.manage_credits),
    manage_requests: normalizePermissionFlag(permissions.manage_requests),
    support: normalizePermissionFlag(permissions.support),
  };
}

export function normalizeAgencyConsultant(
  item: AgencyConsultantApiItem,
): AgencyConsultantDto | null {
  const membership = asRecord(
    item.membership ??
      item.membership_state ??
      item.member ??
      item.agency_membership,
  );
  const user = asRecord(item.user);
  const quotas = asRecord(item.quotas ?? membership.quotas);
  const agentId = toNumber(item.agent_id ?? item.id ?? item._id, Number.NaN);
  const userId = toNumber(item.user_id ?? user.id ?? user._id ?? agentId, Number.NaN);
  const name = firstText(
    item.name,
    item.full_name,
    user.full_name,
    user.name,
    item.first_name && item.last_name
      ? `${String(item.first_name).trim()} ${String(item.last_name).trim()}`
      : undefined,
  );
  const isActiveValue = item.is_active ?? membership.is_active;
  const metrics = asRecord(item.metrics);
  const ranking = asRecord(item.ranking);
  const unavailableMetrics = Array.isArray(item.unavailable_metrics)
    ? (item.unavailable_metrics as string[])
    : Array.isArray(metrics.unavailable_metrics)
      ? (metrics.unavailable_metrics as string[])
      : undefined;

  const levelSlug = firstText(
    ranking.level_slug,
    ranking.levelSlug,
    item.level_slug,
    item.levelSlug,
    "selected_agent",
  );
  const levelTitle = firstText(
    ranking.level_title,
    ranking.levelTitle,
    item.level_title,
    item.levelTitle,
    "مشاور منتخب",
  );
  const rank = toOptionalNumber(ranking.rank ?? metrics.rank ?? item.rank);
  const score = Math.max(
    0,
    toNumber(ranking.score ?? metrics.ranking_score ?? item.ranking_score ?? item.score),
  );

  const rankingObj =
    Object.keys(ranking).length > 0 || item.level_slug || item.level_title || rank !== undefined || score > 0
      ? {
          levelSlug,
          levelTitle,
          rank,
          score,
        }
      : undefined;

  const periodActivity = asRecord(item.period_activity);
  const rawRegistrationProgress = Array.isArray(
    periodActivity.advertise_registration_progress,
  )
    ? periodActivity.advertise_registration_progress
    : [];

  if (!Number.isFinite(userId) || !name) return null;

  return {
    adQuota: Math.max(
      0,
      toNumber(
        item.ad_quota ??
          membership.ad_quota ??
          quotas.ad ??
          quotas.ad_quota,
      ),
    ),
    agencyName: firstText(item.agency_name, item.agencyName),
    agentId: Number.isFinite(agentId) ? agentId : undefined,
    avatar: toAssetUrl(item.avatar ?? user.avatar),
    isActive: normalizePermissionFlag(isActiveValue),
    joinedDate: firstText(item.joined_date, item.joinedDate),
    metrics: {
      activeAds: toOptionalNumber(item.active_ads ?? metrics.active_ads ?? metrics.published_advertises),
      activeRequest: toOptionalNumber(
        metrics.active_request ??
          metrics.active_requests ??
          item.active_request ??
          item.active_requests,
      ),
      calls: item.calls !== undefined ? (item.calls === null ? null : toNumber(item.calls)) : metrics.calls !== undefined ? (metrics.calls === null ? null : toNumber(metrics.calls)) : null,
      publishedAdvertises: Math.max(
        0,
        toNumber(metrics.published_advertises ?? item.active_ads),
      ),
      rank: toOptionalNumber(metrics.rank ?? ranking.rank ?? item.rank),
      rankingScore: Math.max(0, toNumber(metrics.ranking_score ?? ranking.score ?? item.ranking_score ?? item.score)),
      recentAds: toOptionalNumber(item.recent_ads ?? metrics.recent_ads),
      renewUsed: Math.max(0, toNumber(metrics.renew_used)),
      specialUsed: Math.max(0, toNumber(metrics.special_used)),
      unavailableMetrics,
      views: toOptionalNumber(item.views ?? metrics.views),
    },
    mobile: firstText(item.mobile, item.phonenumber, user.mobile, user.phonenumber),
    name,
    permissions: normalizeAgencyConsultantPermissions(
      item.permissions ?? membership.permissions,
    ),
    ranking: rankingObj,
    periodActivity:
      Object.keys(periodActivity).length > 0
        ? {
            advertiseRegistrationProgress: rawRegistrationProgress
              .map((entry) => {
                const row = asRecord(entry);
                const month = firstText(row.month, row.bucket);
                if (!month) return null;
                return {
                  month,
                  value: Math.max(0, toNumber(row.count ?? row.value)),
                };
              })
              .filter(
                (entry): entry is { month: string; value: number } =>
                  entry !== null,
              ),
            period: firstText(periodActivity.period),
            publishedAdvertises: Math.max(
              0,
              toNumber(periodActivity.published_advertises),
            ),
            renewUsed: Math.max(0, toNumber(periodActivity.renew_used)),
            specialUsed: Math.max(0, toNumber(periodActivity.special_used)),
          }
        : undefined,
    renewQuota: Math.max(
      0,
      toNumber(
        item.renew_quota ??
          membership.renew_quota ??
          quotas.renew ??
          quotas.renew_quota,
      ),
    ),
    role: firstText(item.role, membership.role),
    roleId: toNumber(item.role_id ?? membership.role_id),
    requestId: toOptionalNumber(item.request_id),
    specialQuota: Math.max(
      0,
      toNumber(
        item.special_quota ??
          membership.special_quota ??
          quotas.special ??
          quotas.special_quota,
      ),
    ),
    userId,
  };
}
