import type {
  AgencyDashboardApiResponse,
  AgentDashboardApiResponse,
  DashboardOverview,
  DashboardPeriod,
} from "./dashboard.types";
import {
  asRecord,
  normalizeBalanceDeltas,
  normalizeBalances,
  normalizePublishedAdvertises,
  normalizeRankingEntity,
  normalizeTasks,
  normalizeUrgentActions,
  normalizeUsage,
  toNullableNumber,
  toNumber,
  toText,
} from "./dashboardNormalizers";

export function normalizeAgencyDashboard(
  response: AgencyDashboardApiResponse,
  requestedPeriod: DashboardPeriod,
): DashboardOverview {
  const payload = asRecord(response.data ?? response);
  const sections = asRecord(payload.sections ?? response.sections);
  const creditsSection = asRecord(sections.credits);
  const rankingBadgeSection = asRecord(sections["ranking-badge"] ?? sections.ranking_badge);
  const consultantActivitySection = asRecord(
    sections["consultant-activity"] ?? sections.consultant_activity,
  );
  const reportsTeaserSection = asRecord(sections["reports-teaser"] ?? sections.reports_teaser);
  const registrationProgressSection = asRecord(
    sections["registration-progress"] ?? sections.registration_progress ??
      sections["advertise-registration-progress"] ?? sections.advertise_registration_progress,
  );
  const rankingProgressSection = asRecord(
    sections["ranking-progress"] ?? sections.ranking_progress,
  );
  const tasksSection = asRecord(sections.tasks);
  const urgentActionsSection = asRecord(sections["urgent-actions"] ?? sections.urgent_actions);

  const rawRanking = asRecord(rankingBadgeSection.ranking ?? payload.ranking ?? response.ranking);
  const currentRanking = normalizeRankingEntity(
    rawRanking.current ?? (rankingBadgeSection.badge_title ? rankingBadgeSection : undefined),
  );
  const resolvedRank = toNullableNumber(rawRanking.rank ?? rankingBadgeSection.rank);
  const rawTopEntities = Array.isArray(rawRanking.top_agencies) ? rawRanking.top_agencies : [];
  const rawConsultantActivityCandidate =
    consultantActivitySection.items ?? payload.consultant_activity ?? response.consultant_activity;
  const rawConsultantActivity: unknown[] = Array.isArray(rawConsultantActivityCandidate)
    ? rawConsultantActivityCandidate
    : [];
  const rawAdvertiseProgressCandidate =
    registrationProgressSection.items ??
    payload.advertise_registration_progress ??
    response.advertise_registration_progress;
  const rawAdvertiseProgress: unknown[] = Array.isArray(rawAdvertiseProgressCandidate)
    ? rawAdvertiseProgressCandidate
    : [];
  const rawRankingProgressCandidate =
    rankingProgressSection.items ?? payload.ranking_progress ?? response.ranking_progress;
  const rawRankingProgress: unknown[] = Array.isArray(rawRankingProgressCandidate)
    ? rawRankingProgressCandidate
    : [];
  const rawBalances = creditsSection.balances ?? payload.balances ?? response.balances;
  const rawBalanceDeltas =
    creditsSection.balance_deltas ?? payload.balance_deltas ?? response.balance_deltas;
  const rawPublishedAdvertises =
    reportsTeaserSection.published_ads_count !== undefined
      ? reportsTeaserSection
      : (payload.published_advertises ?? response.published_advertises);

  return {
    advertiseRegistrationProgress: rawAdvertiseProgress.map((item) => {
      const progress = asRecord(item);

      return {
        count: Math.max(0, toNumber(progress.count)),
        month: toText(progress.month) || toText(progress.bucket),
      };
    }),
    balanceDeltas: normalizeBalanceDeltas(rawBalanceDeltas),
    balances: normalizeBalances(rawBalances),
    consultantActivity: rawConsultantActivity.map((item) => {
      const activity = asRecord(item);

      return {
        advertiseCount: Math.max(0, toNumber(activity.advertise_count)),
        name: toText(activity.name) || "—",
        period: toText(activity.period) || String(requestedPeriod),
        renewCount: Math.max(0, toNumber(activity.renew_count)),
        specialCount: Math.max(0, toNumber(activity.special_count)),
        total: Math.max(0, toNumber(activity.total)),
        userId: String(activity.user_id ?? ""),
      };
    }),
    kind: "agency",
    period: toText(payload.period ?? response.period) || String(requestedPeriod),
    publishedAdvertises: normalizePublishedAdvertises(rawPublishedAdvertises),
    rankingProgress: rawRankingProgress
      .map((item) => {
        const progress = asRecord(item);
        const rank = toNullableNumber(progress.rank);
        if (rank === null || rank <= 0) return null;

        return {
          month: toText(progress.month) || toText(progress.bucket),
          rank,
          score: Math.max(0, toNumber(progress.score)),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null),
    ranking: {
      current: {
        ...currentRanking,
        rank: resolvedRank ?? currentRanking.rank,
      },
      rank: resolvedRank,
      topEntities: rawTopEntities.map((entity, index) => normalizeRankingEntity(entity, index + 1)),
    },
    renewUsage: null,
    specialUsage: null,
    walletCredit: null,
    workSummary: null,
    urgentActions: normalizeUrgentActions(
      urgentActionsSection.items ?? payload.urgent_actions ?? response.urgent_actions,
    ),
    tasks: normalizeTasks(tasksSection.items ?? payload.tasks ?? response.tasks),
  };
}

export function normalizeAgentDashboard(
  response: AgentDashboardApiResponse,
  requestedPeriod: DashboardPeriod,
): DashboardOverview {
  const payload = asRecord(response.data ?? response);
  const sections = asRecord(payload.sections ?? response.sections);
  const creditsSection = asRecord(sections.credits);
  const rankingBadgeSection = asRecord(sections["ranking-badge"] ?? sections.ranking);
  const rawRanking = asRecord(rankingBadgeSection.ranking ?? payload.ranking ?? response.ranking);
  const currentRanking = normalizeRankingEntity(
    rawRanking.current ?? (rankingBadgeSection.badge_title ? rankingBadgeSection : undefined),
    toNullableNumber(rawRanking.rank ?? rankingBadgeSection.rank),
  );
  const rawProgressCandidate =
    payload.advertise_registration_progress ?? response.advertise_registration_progress;
  const rawProgress: unknown[] = Array.isArray(rawProgressCandidate) ? rawProgressCandidate : [];
  const wallet = asRecord(payload.wallet ?? response.wallet);
  const workSummary = asRecord(payload.work_summary ?? response.work_summary);

  return {
    advertiseRegistrationProgress: rawProgress.map((item) => {
      const progress = asRecord(item);

      return {
        count: Math.max(0, toNumber(progress.count)),
        month: toText(progress.month),
      };
    }),
    balanceDeltas: normalizeBalanceDeltas(
      creditsSection.balance_deltas ?? payload.usage_deltas ?? response.usage_deltas,
    ),
    balances: normalizeBalances(
      creditsSection.balances ?? payload.entitlement ?? response.entitlement,
    ),
    consultantActivity: [],
    kind: "agent",
    period: toText(response.period) || String(requestedPeriod),
    publishedAdvertises: normalizePublishedAdvertises(response.published_advertises),
    ranking: {
      current: {
        ...currentRanking,
        rank: toNullableNumber(rawRanking.rank ?? rankingBadgeSection.rank) ?? currentRanking.rank,
      },
      rank: toNullableNumber(rawRanking.rank ?? rankingBadgeSection.rank),
      topEntities: [],
    },
    rankingProgress: [],
    renewUsage: normalizeUsage(response.renew_usage),
    specialUsage: normalizeUsage(response.special_usage),
    walletCredit: Math.max(0, toNumber(wallet.credit)),
    workSummary:
      Object.keys(workSummary).length === 0
        ? null
        : {
            createdAdvertises: Math.max(0, toNumber(workSummary.created_advertises)),
            expired: Math.max(0, toNumber(workSummary.expired)),
            pendingAssignments: Math.max(0, toNumber(workSummary.pending_assignments)),
            pendingReview: Math.max(0, toNumber(workSummary.pending_review)),
            publishedAdvertises: Math.max(0, toNumber(workSummary.published_advertises)),
            rejected: Math.max(0, toNumber(workSummary.rejected)),
          },
    urgentActions: normalizeUrgentActions(response.urgent_actions),
    tasks: normalizeTasks(response.tasks),
  };
}
