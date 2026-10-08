import { apiV2, getV2RoleSegment, type V2RoleSegment } from "../../../shared/api/api";
import { getStoredAuthSession, getActiveAuthRole } from "../../../shared/auth/auth-storage";

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

export type DashboardUrgentActionItem = {
  id: string;
  count: number;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium";
  priorityLabel: string;
  to: string;
};

export type DashboardTaskItemPayload = {
  id: string;
  count: number;
  label: string;
  to: string;
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
    unassignedAdCreditBalance?: number;
    panelDaysRemaining: number;
    panelExpiresAt: string | null;
    renewCreditBalance: number;
    unassignedRenewCreditBalance?: number;
    specialCreditBalance: number;
    unassignedSpecialCreditBalance?: number;
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
  urgentActions?: DashboardUrgentActionItem[];
  tasks?: DashboardTaskItemPayload[];
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
  urgent_actions?: unknown[];
  tasks?: unknown[];
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
  urgent_actions?: unknown[];
  tasks?: unknown[];
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

function toStringValue(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  const str = String(value).trim();
  return str || fallback;
}

function toNumberOrUndefined(value: unknown): number | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

const normalizeBalanceDelta = normalizeDelta;

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
    unassignedAdCreditBalance: balances.unassigned_ad_credit_balance !== undefined
      ? Math.max(0, toNumber(balances.unassigned_ad_credit_balance))
      : Math.max(0, toNumber(balances.ad_credit_balance)),
    panelDaysRemaining: Math.max(0, toNumber(balances.panel_days_remaining)),
    panelExpiresAt: toText(balances.panel_expires_at) || null,
    renewCreditBalance: Math.max(0, toNumber(balances.renew_credit_balance)),
    unassignedRenewCreditBalance: balances.unassigned_renew_credit_balance !== undefined
      ? Math.max(0, toNumber(balances.unassigned_renew_credit_balance))
      : Math.max(0, toNumber(balances.renew_credit_balance)),
    specialCreditBalance: Math.max(0, toNumber(balances.special_credit_balance)),
    unassignedSpecialCreditBalance: balances.unassigned_special_credit_balance !== undefined
      ? Math.max(0, toNumber(balances.unassigned_special_credit_balance))
      : Math.max(0, toNumber(balances.special_credit_balance)),
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

function normalizeUrgentActions(value: unknown): DashboardUrgentActionItem[] {
  if (!Array.isArray(value)) return [];

  return value.map((item, index) => {
    const rec = asRecord(item);
    const priority =
      rec.priority === "critical" || rec.priority === "high" || rec.priority === "medium"
        ? rec.priority
        : "medium";

    return {
      id: String(rec.id ?? `urgent_${index}`),
      count: Math.max(0, toNumber(rec.count)),
      title: toText(rec.title) || "اقدام فوری",
      description: toText(rec.description),
      priority,
      priorityLabel:
        toText(rec.priority_label) ||
        (priority === "critical" ? "خیلی بالا" : priority === "high" ? "بالا" : "متوسط"),
      to: toText(rec.to) || "/account/dashboard",
    };
  });
}

function normalizeTasks(value: unknown): DashboardTaskItemPayload[] {
  if (!Array.isArray(value)) return [];

  return value.map((item, index) => {
    const rec = asRecord(item);
    return {
      id: String(rec.id ?? `task_${index}`),
      count: Math.max(0, toNumber(rec.count)),
      label: toText(rec.label) || "مورد",
      to: toText(rec.to) || "/account/manage-ads",
    };
  });
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
    urgentActions: normalizeUrgentActions(response.urgent_actions),
    tasks: normalizeTasks(response.tasks),
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
    urgentActions: normalizeUrgentActions(response.urgent_actions),
    tasks: normalizeTasks(response.tasks),
  };
}

function toV2Context(role?: DashboardRolePersona | string | null): V2RoleSegment {
  if (role === "agency" || role === "real_estate_manager") return "agency";
  if (
    role === "agent" ||
    role === "agent_in_agency" ||
    role === "agency-consultant" ||
    role === "real_estate_consultant"
  ) {
    const session = getStoredAuthSession();
    const active = session ? getActiveAuthRole(session) : null;
    if (active === "independent_consultant") {
      return "independent-consultant";
    }
    return "agency-consultant";
  }
  if (role === "independent-consultant" || role === "independent_consultant") {
    return "independent-consultant";
  }
  if (role === "superadmin" || role === "super-admin") return "superadmin";
  if (role === "personal" || role === "user") return "personal";
  return getV2RoleSegment(role);
}

async function getAgencyDashboardSection(
  path: string,
  period: DashboardPeriod,
) {
  return apiV2
    .get(`agency/dashboard/${path}`, {
      searchParams: { period },
    })
    .json<AgencyDashboardApiResponse>();
}

export async function getAgencyDashboardCredits(
  period: DashboardPeriod = "month",
): Promise<AgencyDashboardCreditsSection> {
  const response = await getAgencyDashboardSection(
    "credits",
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
    "consultant-activity",
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
    "published-advertises",
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
    "advertise-registration-progress",
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
    "ranking-progress",
    period,
  );
  const normalized = normalizeAgencyDashboard(response, period);

  return {
    period: normalized.period,
    rankingProgress: normalized.rankingProgress,
  };
}

export async function getAgencyDashboardRanking(): Promise<AgencyDashboardRankingSection> {
  const response = await apiV2
    .get("agency/dashboard/ranking")
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
  period: DashboardPeriod = "month",
): Promise<DashboardOverview> {
  const response = await apiV2
    .get("agency/dashboard/overview", {
      searchParams: { period },
    })
    .json<AgencyDashboardApiResponse>();

  return normalizeAgencyDashboard(response, period);
}

export async function getAgentDashboard(
  period: DashboardPeriod = "month",
): Promise<DashboardOverview> {
  const context = toV2Context("agent");
  const response = await apiV2
    .get(`${context}/dashboard/overview`, {
      searchParams: { period },
    })
    .json<AgentDashboardApiResponse>();

  return normalizeAgentDashboard(response, period);
}

export interface AgentBadge {
  slug: string;
  title: string;
  level: number;
  earned: boolean;
  current_value: number;
  next_target: number | null;
  progress: number;
  thresholds: number[];
}

export interface AgentBadgesApiResponse {
  status: boolean;
  badges: AgentBadge[];
}

export interface AgentBadgeDetailApiResponse {
  status: boolean;
  badge: AgentBadge;
}

export async function getAgentBadges(): Promise<AgentBadge[]> {
  const context = toV2Context("agent");
  const response = await apiV2.get(`${context}/dashboard/badges`).json<AgentBadgesApiResponse>();
  return response.badges ?? [];
}

export async function getAgentBadge(slug: string): Promise<AgentBadge | null> {
  const context = toV2Context("agent");
  const response = await apiV2.get(`${context}/dashboard/badges/${slug}`).json<AgentBadgeDetailApiResponse>();
  return response.badge ?? null;
}

export async function getAgentRanking(): Promise<unknown> {
  const context = toV2Context("agent");
  return apiV2.get(`${context}/dashboard/ranking`).json();
}

export async function getAgentRankingProgress(): Promise<unknown> {
  const context = toV2Context("agent");
  return apiV2.get(`${context}/dashboard/ranking-progress`).json();
}

export async function getAgentWorkSummary(): Promise<unknown> {
  const context = toV2Context("agent");
  return apiV2.get(`${context}/dashboard/work-summary`).json();
}

export type DashboardRolePersona = "agency" | "agent" | "agent_in_agency";

export async function getDashboardOverviewByRole(
  role: DashboardRolePersona,
  period: DashboardPeriod = "month",
): Promise<DashboardOverview> {
  const context = toV2Context(role);
  try {
    const response = await apiV2
      .get(`${context}/dashboard/overview`, {
        searchParams: { period },
      })
      .json<AgencyDashboardApiResponse & AgentDashboardApiResponse>();

    return role === "agency"
      ? normalizeAgencyDashboard(response, period)
      : normalizeAgentDashboard(response, period);
  } catch {
    if (role === "agency") {
      return getAgencyDashboard(period);
    }
    return getAgentDashboard(period);
  }
}

export async function getDashboardTasks(
  role: DashboardRolePersona,
): Promise<{ totalCount: number; items: DashboardTaskItemPayload[] }> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/tasks`)
      .json<{ data?: { total_count?: number; items?: unknown[] } }>();
    const items = normalizeTasks(res.data?.items);
    return {
      totalCount: toNumber(
        res.data?.total_count,
        items.reduce((acc, i) => acc + i.count, 0),
      ),
      items,
    };
  } catch {
    return { totalCount: 0, items: [] };
  }
}

export async function getDashboardUrgentActions(
  role: DashboardRolePersona,
): Promise<DashboardUrgentActionItem[]> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/urgent-actions`)
      .json<{ data?: { items?: unknown[] } }>();
    return normalizeUrgentActions(res.data?.items);
  } catch {
    return [];
  }
}

export type DashboardRankingBadgeData = {
  categoryLabel: string;
  badgeTitle: string;
  levelSlug: string;
  currentScore: number;
  nextLevelScore: number;
  rank: number;
  totalCompetitors: number;
  changeFromLastMonth: number;
  targetUrl: string;
};

export async function getDashboardRankingBadge(
  role: DashboardRolePersona,
): Promise<DashboardRankingBadgeData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/ranking-badge`)
      .json<{ data?: RawRecord }>();
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
      targetUrl: toStringValue(d.target_url, role === "agency" ? "/account/dashboard/ranking" : "/account/ranking"),
    };
  } catch {
    return null;
  }
}

export type DashboardCreditsData = {
  balances: {
    adCreditBalance: number;
    renewCreditBalance: number;
    specialCreditBalance: number;
    panelDaysRemaining: number;
    unassignedAdCreditBalance?: number;
    walletBalance?: number;
  };
  balanceDeltas: {
    adCreditUsed: DashboardBalanceDelta;
    renewCreditUsed: DashboardBalanceDelta;
    specialCreditUsed: DashboardBalanceDelta;
  };
};

export async function getDashboardCredits(
  role: DashboardRolePersona,
): Promise<DashboardCreditsData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/credits`)
      .json<{ data?: RawRecord }>();
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

export type DashboardNotificationWidgetData = {
  unreadCount: number;
  latest: {
    id: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
  } | null;
  items: Array<{
    id: string;
    title: string;
    message: string;
    createdAt: string;
    isRead: boolean;
  }>;
};

export async function getDashboardNotifications(
  role: DashboardRolePersona,
): Promise<DashboardNotificationWidgetData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/notifications`)
      .json<{ data?: RawRecord }>();
    const d = res.data ?? {};
    const rawLatest = asRecord(d.latest);
    const rawItems = Array.isArray(d.items) ? d.items : [];
    return {
      unreadCount: toNumber(d.unread_count, 0),
      latest: d.latest
        ? {
            id: toStringValue(rawLatest.id),
            title: toStringValue(rawLatest.title),
            message: toStringValue(rawLatest.message),
            createdAt: toStringValue(rawLatest.created_at),
            isRead: Boolean(rawLatest.is_read),
          }
        : null,
      items: rawItems.map((item) => {
        const rec = asRecord(item);
        return {
          id: toStringValue(rec.id),
          title: toStringValue(rec.title),
          message: toStringValue(rec.message),
          createdAt: toStringValue(rec.created_at),
          isRead: Boolean(rec.is_read),
        };
      }),
    };
  } catch {
    return null;
  }
}

export type DashboardReportsTeaserData = {
  totalViews: number;
  viewsDeltaPercent: number;
  sparklineData: number[];
  publishedAdsCount: number;
  conversionRate: number;
};

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
      sparklineData: Array.isArray(d.sparkline_data) ? d.sparkline_data.map((n) => toNumber(n, 0)) : [],
      publishedAdsCount: toNumber(d.published_ads_count, 0),
      conversionRate: toNumber(d.conversion_rate, 0),
    };
  } catch {
    return null;
  }
}

export type DashboardRecentAdItem = {
  id: string;
  title: string;
  coverImage?: string;
  cityTitle?: string;
  districtTitle?: string;
  categoryTitle?: string;
  dealType?: string;
  depositAmount?: number;
  rentAmount?: number;
  status: string;
  assignmentStatus?: string;
  statusCode?: number;
  viewsCount?: number;
  publishedAt?: string;
  confirmDate?: string;
  expireDate?: string;
};

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
    return items.map((raw) => {
      const rec = asRecord(raw);
      return {
        id: toStringValue(rec.id),
        title: toStringValue(rec.title),
        coverImage: rec.cover_image ? String(rec.cover_image) : undefined,
        cityTitle: rec.city_title ? String(rec.city_title) : undefined,
        districtTitle: rec.district_title ? String(rec.district_title) : undefined,
        categoryTitle: rec.category_title ? String(rec.category_title) : undefined,
        dealType: rec.deal_type ? String(rec.deal_type) : undefined,
        depositAmount: toNumberOrUndefined(rec.deposit_amount),
        rentAmount: toNumberOrUndefined(rec.rent_amount),
        status: toStringValue(rec.status, "active"),
        assignmentStatus: rec.assignment_status ? String(rec.assignment_status) : undefined,
        statusCode: toNumberOrUndefined(rec.status_code),
        viewsCount: toNumberOrUndefined(rec.views_count),
        publishedAt: rec.published_at ? String(rec.published_at) : undefined,
        confirmDate: rec.confirm_date ? String(rec.confirm_date) : undefined,
        expireDate: rec.expire_date ? String(rec.expire_date) : undefined,
      };
    });
  } catch {
    return [];
  }
}

// -------------------------------------------------------------
// Reports & Analytics Endpoints (dashboard-reports-charts-api-contract.md)
// -------------------------------------------------------------

export type DashboardReportPublishedAdsData = {
  total: number;
  period: string;
  periodLabel: string;
  breakdown: Array<{
    categoryId?: string | null;
    type: string;
    label: string;
    count: number;
    percent: number;
  }>;
};

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

export type DashboardReportViewsData = {
  period: string;
  totalViews: number;
  deltaPercent: number;
  trend: "up" | "down";
  trendLabel: string;
  items: Array<{ label: string; views: number }>;
};

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

export type DashboardReportConsultantsActivityData = {
  period: string;
  totalAds: number;
  items: Array<{
    consultantId: string;
    name: string;
    ads: number;
    updates: number;
    specials: number;
  }>;
};

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

export type DashboardReportRegistrationProgressData = {
  period: string;
  totalCount: number;
  deltaPercent: number;
  trend: "up" | "down";
  trendLabel: string;
  items: Array<{ label: string; count: number }>;
};

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

export type DashboardReportConversionFunnelStage = {
  id: string;
  label: string;
  count: number;
  percentage: number;
  badgeText: string;
};

export type DashboardReportConversionFunnelData = {
  period: string;
  stages: DashboardReportConversionFunnelStage[];
};

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

export type DashboardReportRankingScoreData = {
  rank: number;
  rankChangeLastMonth: number;
  rankChangeDirection: "up" | "down";
  score: number;
  levelTitle: string;
  levelSlug: string;
  thresholdLabel: string;
  pointsNeeded: number;
  targetRank: number;
  guideUrl: string;
};

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
      guideUrl: toStringValue(d.guide_url, role === "agency" ? "/account/dashboard/ranking" : "/account/ranking"),
    };
  } catch {
    return null;
  }
}

export type DashboardReportsOverviewData = {
  period: string;
  publishedAds?: DashboardReportPublishedAdsData;
  views?: DashboardReportViewsData;
  consultantsActivity?: DashboardReportConsultantsActivityData;
  registrationProgress?: DashboardReportRegistrationProgressData;
  conversionFunnel?: DashboardReportConversionFunnelData;
  rankingScore?: DashboardReportRankingScoreData;
};

export async function getDashboardReportsOverview(
  role: DashboardRolePersona,
  period = "month",
): Promise<DashboardReportsOverviewData | null> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/reports/overview`, { searchParams: { period } })
      .json<{ data?: RawRecord }>();
    const d = res.data ?? {};
    return {
      period: toStringValue(d.period, period),
      publishedAds: d.published_ads ? (d.published_ads as any) : undefined,
      views: d.views ? (d.views as any) : undefined,
      consultantsActivity: d.consultants_activity ? (d.consultants_activity as any) : undefined,
      registrationProgress: d.registration_progress ? (d.registration_progress as any) : undefined,
      conversionFunnel: d.conversion_funnel ? (d.conversion_funnel as any) : undefined,
      rankingScore: d.ranking_score ? (d.ranking_score as any) : undefined,
    };
  } catch {
    return null;
  }
}
