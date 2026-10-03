export type AgentRoleType =
  | "REAL_ESTATE_CONSULTANT"
  | "INDEPENDENT_CONSULTANT";

export interface AgentTaskItem {
  id: string;
  title: string;
  count: number;
}

export interface AgentCreditMetric {
  key: "ads" | "refresh" | "featured";
  label: string;
  count: number;
  trendPercent: number;
  trendType: "increase" | "decrease";
}

export interface AgentUrgentAction {
  id: string;
  title: string;
  subtitle: string;
  count: number;
  severity: "critical" | "warning" | "caution";
}

export interface AgentNotificationItem {
  id: string;
  title: string;
  timeAgo: string;
  body: string;
  type: "deal_approval" | "ad_published" | "ad_stopped";
  adTitle?: string;
}

export interface AgentRecentAd {
  id: string;
  title: string;
  imageUrl: string;
  priceFormatted: string;
  areaSqm: number;
  roomCount: number;
  buildYear: number;
  timeAndLocation: string;
}

export interface FunnelStage {
  id: string;
  label: string;
  valueText: string;
  percentageText: string;
  color: string;
}
