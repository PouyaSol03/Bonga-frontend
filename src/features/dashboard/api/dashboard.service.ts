import { api } from "../../../shared/api/api";

export type DashboardPeriod = "month" | "year" | "7d" | "30d" | "90d";
export type DashboardKind = "agency" | "agent";

export type DashboardBalanceDelta = {
  change: number;
  current: number;
  percent: number | null;
  previous: number;
};

export type DashboardConsultantActivity = {
  advertiseCount: number;
  name: string;
  period: string;
  renewCount: number;
  specialCount: number;
  total: number;
  userId: string;
};

export type DashboardRankingEntity = {
  entityId: string;
  levelSlug: string;
  levelTitle: string;
  name: string;
  rank: number | null;
  totalScore: number;
};

export type DashboardUsage = {
  current: number;
  previous: number;
  totalAvailable: number;
};

export type DashboardOverview = {
  advertiseRegistrationProgress: Array<{
    count: number;
    month: string;
  }>;
  rankingProgress: Array<{
    month: string;
    rank: number;
    score: number;
  }>;
  balanceDeltas: {
    adCreditUsed: DashboardBalanceDelta;
    renewCreditUsed: DashboardBalanceDelta;
    specialCreditUsed: DashboardBalanceDelta;
  };
  balances: {
    adCreditBalance: number;
    panelDaysRemaining: number;
    panelExpiresAt: string | null;
    renewCreditBalance: number;
    specialCreditBalance: number;
  };
  consultantActivity: DashboardConsultantActivity[];
  kind: DashboardKind;
  period: string;
  publishedAdvertises: {
    breakdown: Array<{
      categoryId: string | null;
      count: number;
      label: string;
      percent: number;
      type: string;
    }>;
    total: number;
  };
  ranking: {
    current: DashboardRankingEntity;
    rank: number | null;
    topEntities: DashboardRankingEntity[];
  };
  renewUsage: DashboardUsage | null;
  specialUsage: DashboardUsage | null;
  walletCredit: number | null;
  workSummary: {
    createdAdvertises: number;
    expired: number;
    pendingAssignments: number;
    pendingReview: number;
    publishedAdvertises: number;
    rejected: number;
  } | null;
};

export type AgencyDashboardCreditsSection = Pick<
  DashboardOverview,
  "balanceDeltas" | "balances" | "period"
>;

export type AgencyDashboardConsultantActivitySection = Pick<
  DashboardOverview,
  "consultantActivity" | "period"
>;

export type AgencyDashboardPublishedAdvertisesSection = Pick<
  DashboardOverview,
  "period" | "publishedAdvertises"
>;

export type AgencyDashboardAdvertiseRegistrationProgressSection = Pick<
  DashboardOverview,
  "advertiseRegistrationProgress" | "period"
>;

export type AgencyDashboardRankingProgressSection = Pick<
  DashboardOverview,
  "period" | "rankingProgress"
>;

export type AgencyDashboardRankingSection = Pick<DashboardOverview, "ranking">;

export type AgencyDashboardSections = {
  advertiseRegistrationProgress?: AgencyDashboardAdvertiseRegistrationProgressSection;
  consultantActivity?: AgencyDashboardConsultantActivitySection;
  credits?: AgencyDashboardCreditsSection;
  publishedAdvertises?: AgencyDashboardPublishedAdvertisesSection;
  ranking?: AgencyDashboardRankingSection;
  rankingProgress?: AgencyDashboardRankingProgressSection;
};

type RawRecord = Record<string, unknown>;

type AgencyDashboardApiResponse = {
  advertise_registration_progress?: unknown[];
  balance_deltas?: RawRecord;
  balances?: RawRecord;
  consultant_activity?: unknown[];
  period?: unknown;
  published_advertises?: RawRecord;
  ranking?: RawRecord;
  ranking_progress?: unknown[];
  status?: boolean;
};

type AgentDashboardApiResponse = {
  advertise_registration_progress?: unknown[];
  entitlement?: RawRecord;
  period?: unknown;
  published_advertises?: RawRecord;
  ranking?: RawRecord;
  renew_usage?: RawRecord;
  special_usage?: RawRecord;
  status?: boolean;
  usage_deltas?: RawRecord;
  wallet?: RawRecord;
  work_summary?: RawRecord;
};

function asRecord(value: unknown): RawRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as RawRecord)
    : {};
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toNullableNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeDelta(value: unknown): DashboardBalanceDelta {
  const delta = asRecord(value);

  return {
    change: toNumber(delta.change),
    current: toNumber(delta.current),
    percent: toNullableNumber(delta.percent),
    previous: toNumber(delta.previous),
  };
}

function normalizeUsage(value: unknown): DashboardUsage {
  const usage = asRecord(value);

  return {
    current: Math.max(0, toNumber(usage.current)),
    previous: Math.max(0, toNumber(usage.previous)),
    totalAvailable: Math.max(0, toNumber(usage.total_available)),
  };
}

function normalizeRankingEntity(
  value: unknown,
  fallbackRank: number | null = null,
): DashboardRankingEntity {
  const entity = asRecord(value);
  const entityId = String(
    entity.agency_id ?? entity.agent_id ?? entity.id ?? entity._id ?? entity.user_id ?? "",
  ).trim();

  return {
    entityId,
    levelSlug: toText(entity.level_slug),
    levelTitle: toText(entity.level_title),
    name:
      toText(entity.agency_name) ||
      toText(entity.agent_name) ||
      toText(entity.name) ||
      toText(entity.title) ||
      "—",
    rank: toNullableNumber(entity.rank ?? entity.position) ?? fallbackRank,
    totalScore: toNumber(entity.total_score ?? entity.score),
  };
}

function normalizePublishedAdvertises(value: unknown) {
  const publishedAdvertises = asRecord(value);
  const rawBreakdown = Array.isArray(publishedAdvertises.breakdown)
    ? publishedAdvertises.breakdown
    : [];

  return {
    breakdown: rawBreakdown.map((item) => {
      const breakdownItem = asRecord(item);
      const categoryId = breakdownItem.category_id;

      return {
        categoryId:
          categoryId === null || categoryId === undefined
            ? null
            : String(categoryId),
        count: Math.max(0, toNumber(breakdownItem.count)),
        label: toText(breakdownItem.label),
        percent: Math.max(0, toNumber(breakdownItem.percent)),
        type: toText(breakdownItem.type),
      };
    }),
    total: Math.max(0, toNumber(publishedAdvertises.total)),
  };
}

function normalizeBalances(value: unknown) {
  const balances = asRecord(value);

  return {
    adCreditBalance: Math.max(0, toNumber(balances.ad_credit_balance)),
    panelDaysRemaining: Math.max(0, toNumber(balances.panel_days_remaining)),
    panelExpiresAt: toText(balances.panel_expires_at) || null,
    renewCreditBalance: Math.max(0, toNumber(balances.renew_credit_balance)),
    specialCreditBalance: Math.max(0, toNumber(balances.special_credit_balance)),
  };
}

function normalizeBalanceDeltas(value: unknown) {
  const deltas = asRecord(value);

  return {
    adCreditUsed: normalizeDelta(deltas.ad_credit_used),
    renewCreditUsed: normalizeDelta(deltas.renew_credit_used),
    specialCreditUsed: normalizeDelta(deltas.special_credit_used),
  };
}

function normalizeAgencyDashboard(
  response: AgencyDashboardApiResponse,
  requestedPeriod: DashboardPeriod,
): DashboardOverview {
  const ranking = asRecord(response.ranking);
  const currentRanking = normalizeRankingEntity(ranking.current);
  const resolvedRank = toNullableNumber(ranking.rank);
  const rawTopEntities = Array.isArray(ranking.top_agencies)
    ? ranking.top_agencies
    : [];
  const rawConsultantActivity = Array.isArray(response.consultant_activity)
    ? response.consultant_activity
    : [];
  const rawAdvertiseProgress = Array.isArray(response.advertise_registration_progress)
    ? response.advertise_registration_progress
    : [];
  const rawRankingProgress = Array.isArray(response.ranking_progress)
    ? response.ranking_progress
    : [];

  return {
    advertiseRegistrationProgress: rawAdvertiseProgress.map((item) => {
      const progress = asRecord(item);

      return {
        count: Math.max(0, toNumber(progress.count)),
        month: toText(progress.month) || toText(progress.bucket),
      };
    }),
    balanceDeltas: normalizeBalanceDeltas(response.balance_deltas),
    balances: normalizeBalances(response.balances),
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
    period: toText(response.period) || String(requestedPeriod),
    publishedAdvertises: normalizePublishedAdvertises(
      response.published_advertises,
    ),
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
      topEntities: rawTopEntities.map((entity, index) =>
        normalizeRankingEntity(entity, index + 1),
      ),
    },
    renewUsage: null,
    specialUsage: null,
    walletCredit: null,
    workSummary: null,
  };
}

function normalizeAgentDashboard(
  response: AgentDashboardApiResponse,
  requestedPeriod: DashboardPeriod,
): DashboardOverview {
  const ranking = asRecord(response.ranking);
  const currentRanking = normalizeRankingEntity(
    ranking.current,
    toNullableNumber(ranking.rank),
  );
  const rawProgress = Array.isArray(response.advertise_registration_progress)
    ? response.advertise_registration_progress
    : [];
  const wallet = asRecord(response.wallet);
  const workSummary = asRecord(response.work_summary);

  return {
    advertiseRegistrationProgress: rawProgress.map((item) => {
      const progress = asRecord(item);

      return {
        count: Math.max(0, toNumber(progress.count)),
        month: toText(progress.month),
      };
    }),
    balanceDeltas: normalizeBalanceDeltas(response.usage_deltas),
    balances: normalizeBalances(response.entitlement),
    consultantActivity: [],
    kind: "agent",
    period: toText(response.period) || String(requestedPeriod),
    publishedAdvertises: normalizePublishedAdvertises(
      response.published_advertises,
    ),
    ranking: {
      current: {
        ...currentRanking,
        rank: toNullableNumber(ranking.rank) ?? currentRanking.rank,
      },
      rank: toNullableNumber(ranking.rank),
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
            createdAdvertises: Math.max(
              0,
              toNumber(workSummary.created_advertises),
            ),
            expired: Math.max(0, toNumber(workSummary.expired)),
            pendingAssignments: Math.max(
              0,
              toNumber(workSummary.pending_assignments),
            ),
            pendingReview: Math.max(0, toNumber(workSummary.pending_review)),
            publishedAdvertises: Math.max(
              0,
              toNumber(workSummary.published_advertises),
            ),
            rejected: Math.max(0, toNumber(workSummary.rejected)),
          },
  };
}

async function getAgencyDashboardSection(
  path: string,
  period: DashboardPeriod,
) {
  return api
    .get(path, {
      searchParams: { period },
    })
    .json<AgencyDashboardApiResponse>();
}

export async function getAgencyDashboardCredits(
  period: DashboardPeriod = "month",
): Promise<AgencyDashboardCreditsSection> {
  const response = await getAgencyDashboardSection(
    "me/agency/dashboard/credits",
    period,
  );
  const normalized = normalizeAgencyDashboard(response, period);

  return {
    balanceDeltas: normalized.balanceDeltas,
    balances: normalized.balances,
    period: normalized.period,
  };
}

export async function getAgencyDashboardConsultantActivity(
  period: DashboardPeriod = "month",
): Promise<AgencyDashboardConsultantActivitySection> {
  const response = await getAgencyDashboardSection(
    "me/agency/dashboard/consultant-activity",
    period,
  );
  const normalized = normalizeAgencyDashboard(response, period);

  return {
    consultantActivity: normalized.consultantActivity,
    period: normalized.period,
  };
}

export async function getAgencyDashboardPublishedAdvertises(
  period: DashboardPeriod = "month",
): Promise<AgencyDashboardPublishedAdvertisesSection> {
  const response = await getAgencyDashboardSection(
    "me/agency/dashboard/published-advertises",
    period,
  );
  const normalized = normalizeAgencyDashboard(response, period);

  return {
    period: normalized.period,
    publishedAdvertises: normalized.publishedAdvertises,
  };
}

export async function getAgencyDashboardAdvertiseRegistrationProgress(
  period: DashboardPeriod = "month",
): Promise<AgencyDashboardAdvertiseRegistrationProgressSection> {
  const response = await getAgencyDashboardSection(
    "me/agency/dashboard/advertise-registration-progress",
    period,
  );
  const normalized = normalizeAgencyDashboard(response, period);

  return {
    advertiseRegistrationProgress: normalized.advertiseRegistrationProgress,
    period: normalized.period,
  };
}

export async function getAgencyDashboardRankingProgress(
  period: DashboardPeriod = "month",
): Promise<AgencyDashboardRankingProgressSection> {
  const response = await getAgencyDashboardSection(
    "me/agency/dashboard/ranking-progress",
    period,
  );
  const normalized = normalizeAgencyDashboard(response, period);

  return {
    period: normalized.period,
    rankingProgress: normalized.rankingProgress,
  };
}

export async function getAgencyDashboardRanking(): Promise<AgencyDashboardRankingSection> {
  const response = await api
    .get("me/agency/dashboard/ranking")
    .json<AgencyDashboardApiResponse>();
  const normalized = normalizeAgencyDashboard(response, "month");

  return { ranking: normalized.ranking };
}

export function mergeAgencyDashboardSections(
  period: DashboardPeriod,
  sections: AgencyDashboardSections,
): DashboardOverview {
  const empty = normalizeAgencyDashboard({ period }, period);

  return {
    ...empty,
    advertiseRegistrationProgress:
      sections.advertiseRegistrationProgress?.advertiseRegistrationProgress ??
      empty.advertiseRegistrationProgress,
    balanceDeltas: sections.credits?.balanceDeltas ?? empty.balanceDeltas,
    balances: sections.credits?.balances ?? empty.balances,
    consultantActivity:
      sections.consultantActivity?.consultantActivity ??
      empty.consultantActivity,
    period:
      sections.credits?.period ??
      sections.consultantActivity?.period ??
      sections.publishedAdvertises?.period ??
      sections.advertiseRegistrationProgress?.period ??
      sections.rankingProgress?.period ??
      empty.period,
    publishedAdvertises:
      sections.publishedAdvertises?.publishedAdvertises ??
      empty.publishedAdvertises,
    ranking: sections.ranking?.ranking ?? empty.ranking,
    rankingProgress:
      sections.rankingProgress?.rankingProgress ?? empty.rankingProgress,
  };
}

export async function getAgencyDashboard(
  period: DashboardPeriod = "30d",
): Promise<DashboardOverview> {
  const response = await api
    .get("me/agency/dashboard", {
      searchParams: { period },
    })
    .json<AgencyDashboardApiResponse>();

  return normalizeAgencyDashboard(response, period);
}

export async function getAgentDashboard(
  period: DashboardPeriod = "30d",
): Promise<DashboardOverview> {
  const response = await api
    .get("me/agent/dashboard", {
      searchParams: { period },
    })
    .json<AgentDashboardApiResponse>();

  return normalizeAgentDashboard(response, period);
}
