export type DashboardPeriod = "week" | "month" | "year" | "7d" | "30d" | "90d";

export type DashboardRolePersona = "agency" | "agent" | "agent_in_agency";

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

export type RawRecord = Record<string, unknown>;

export type AgencyDashboardApiResponse = {
  advertise_registration_progress?: unknown[];
  balance_deltas?: RawRecord;
  balances?: RawRecord;
  consultant_activity?: unknown[];
  data?: RawRecord;
  period?: unknown;
  published_advertises?: RawRecord;
  ranking?: RawRecord;
  ranking_progress?: unknown[];
  sections?: RawRecord;
  status?: boolean;
  urgent_actions?: unknown[];
  tasks?: unknown[];
};

export type AgentDashboardApiResponse = {
  advertise_registration_progress?: unknown[];
  data?: RawRecord;
  entitlement?: RawRecord;
  period?: unknown;
  published_advertises?: RawRecord;
  ranking?: RawRecord;
  renew_usage?: RawRecord;
  sections?: RawRecord;
  special_usage?: RawRecord;
  status?: boolean;
  usage_deltas?: RawRecord;
  wallet?: RawRecord;
  work_summary?: RawRecord;
  urgent_actions?: unknown[];
  tasks?: unknown[];
};

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
