import { api } from "../api/api";

export type DashboardPeriod = "30d" | string;
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
      percent: number;
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

// Kept for compatibility with existing imports outside this dashboard flow.
export type AgentDashboardPeriod = DashboardPeriod;
export type AgentDashboard = DashboardOverview;

type RawRecord = Record<string, unknown>;

type AgencyDashboardApiResponse = {
  balance_deltas?: RawRecord;
  balances?: RawRecord;
  consultant_activity?: unknown[];
  period?: unknown;
  published_advertises?: RawRecord;
  ranking?: RawRecord;
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
  fallbackName = "آژانس",
): DashboardRankingEntity {
  const entity = asRecord(value);
  const entityId = String(
    entity.agency_id ?? entity.agent_id ?? entity.user_id ?? entity.id ?? "",
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
      (entityId ? `${fallbackName} ${entityId}` : fallbackName),
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
        percent: Math.max(0, toNumber(breakdownItem.percent)),
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

  return {
    advertiseRegistrationProgress: [],
    balanceDeltas: normalizeBalanceDeltas(response.balance_deltas),
    balances: normalizeBalances(response.balances),
    consultantActivity: rawConsultantActivity.map((item, index) => {
      const activity = asRecord(item);

      return {
        advertiseCount: Math.max(0, toNumber(activity.advertise_count)),
        name: toText(activity.name) || `مشاور ${index + 1}`,
        period: toText(activity.period) || String(requestedPeriod),
        renewCount: Math.max(0, toNumber(activity.renew_count)),
        specialCount: Math.max(0, toNumber(activity.special_count)),
        total: Math.max(0, toNumber(activity.total)),
        userId: String(activity.user_id ?? index + 1),
      };
    }),
    kind: "agency",
    period: toText(response.period) || String(requestedPeriod),
    publishedAdvertises: normalizePublishedAdvertises(
      response.published_advertises,
    ),
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
    "مشاور",
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
    renewUsage: normalizeUsage(response.renew_usage),
    specialUsage: normalizeUsage(response.special_usage),
    walletCredit: Math.max(0, toNumber(wallet.credit)),
    workSummary: {
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
