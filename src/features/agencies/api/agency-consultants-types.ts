export * from "./agency-consultant-performance-types";

export type AgencyConsultantPermissions = {
  manage_advertises: boolean;
  manage_consultants: boolean;
  manage_credits: boolean;
  manage_requests: boolean;
  support: boolean;
};

export type AgencyConsultantSettingsPayload = {
  adQuota: number;
  permissions: AgencyConsultantPermissions | Record<string, boolean>;
  renewQuota: number;
  role: "consultant" | "manager";
  specialQuota: number;
};

export type AddAgencyConsultantPayload = AgencyConsultantSettingsPayload & {
  agentId: number | string;
};

export type AgencyConsultantRequestDecision = "accept" | "reject";

export type AgencyConsultantRequestDecisionPayload = {
  agentId: number | string;
  decision: AgencyConsultantRequestDecision;
};

export type AgencyConsultantMetrics = {
  activeAds?: number;
  activeRequest?: number;
  calls?: number | null;
  publishedAdvertises: number;
  rank?: number;
  rankingScore: number;
  recentAds?: number;
  renewUsed: number;
  specialUsed: number;
  unavailableMetrics?: string[];
  views?: number;
};

export type AgencyConsultantPeriodActivity = {
  advertiseRegistrationProgress: Array<{ month: string; value: number }>;
  period: string;
  publishedAdvertises: number;
  renewUsed: number;
  specialUsed: number;
};

export type AgencyConsultantDto = {
  adQuota: number;
  agencyName?: string;
  agentId?: number;
  avatar?: string;
  isActive: boolean;
  joinedDate?: string;
  metrics: AgencyConsultantMetrics;
  mobile: string;
  name: string;
  permissions: AgencyConsultantPermissions;
  periodActivity?: AgencyConsultantPeriodActivity;
  ranking?: {
    levelSlug: string;
    levelTitle: string;
    rank?: number | null;
    score: number;
  };
  renewQuota: number;
  requestId?: number;
  role: string;
  roleId: number;
  specialQuota: number;
  userId: number;
};

export type AgencyConsultantsPage = {
  data: AgencyConsultantDto[];
  page: number;
  perPage: number;
  total: number;
};

export type AgencyConsultantsParams = {
  page?: number;
  perPage?: number;
  query?: string;
  status?: "active" | "pending" | "all";
};

export type UpdateAgencyConsultantPayload = AgencyConsultantSettingsPayload & {
  agentId: number | string;
};

export type DeactivateAgencyConsultantPayload = {
  agentId: number | string;
  transferTo: "agency" | "member";
  transferUserId?: number | string;
};

export type AgencyConsultantApiItem = {
  _id?: unknown;
  active_ads?: unknown;
  ad_quota?: unknown;
  agency_membership?: unknown;
  agency_name?: unknown;
  agencyName?: unknown;
  agent_id?: unknown;
  avatar?: unknown;
  calls?: unknown;
  first_name?: unknown;
  full_name?: unknown;
  id?: unknown;
  is_active?: unknown;
  joined_date?: unknown;
  joinedDate?: unknown;
  last_name?: unknown;
  member?: unknown;
  membership?: unknown;
  membership_state?: unknown;
  metrics?: {
    active_ads?: unknown;
    calls?: unknown;
    published_advertises?: unknown;
    rank?: unknown;
    ranking_score?: unknown;
    recent_ads?: unknown;
    renew_used?: unknown;
    special_used?: unknown;
    unavailable_metrics?: unknown;
    views?: unknown;
    [key: string]: unknown;
  };
  mobile?: unknown;
  name?: unknown;
  permissions?: unknown;
  period_activity?: unknown;
  phonenumber?: unknown;
  quotas?: unknown;
  ranking?: {
    level_slug?: unknown;
    level_title?: unknown;
    rank?: unknown;
    score?: unknown;
    [key: string]: unknown;
  };
  recent_ads?: unknown;
  renew_quota?: unknown;
  role?: unknown;
  role_id?: unknown;
  request_id?: unknown;
  special_quota?: unknown;
  unavailable_metrics?: unknown;
  user?: unknown;
  user_id?: unknown;
  views?: unknown;
  [key: string]: unknown;
};

export type AgencyConsultantsApiResponse = {
  data?: Record<string, unknown>[];
  page?: number;
  per_page?: number;
  status?: boolean;
  total?: number;
};

export type AgencyConsultantDetailApiResponse = {
  ad_quota?: number;
  agency_membership?: Record<string, unknown>;
  consultant?: Record<string, unknown>;
  data?: Record<string, unknown>;
  member?: Record<string, unknown>;
  membership?: Record<string, unknown>;
  membership_state?: string;
  metrics?: Record<string, unknown>;
  permissions?: Record<string, unknown>;
  quotas?: Record<string, unknown>;
  renew_quota?: number;
  special_quota?: number;
  status?: boolean;
};
