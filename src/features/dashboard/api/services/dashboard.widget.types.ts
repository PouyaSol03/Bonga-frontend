import type { AdCardData } from "../../../advertisements/components/AdCard";
import type { DashboardBalanceDelta } from "./dashboard.base.types";

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

export type DashboardCreditsData = {
  balances: {
    adCreditBalance: number;
    renewCreditBalance: number;
    specialCreditBalance: number;
    panelDaysRemaining: number;
    unassignedAdCreditBalance?: number;
    unassignedRenewCreditBalance?: number;
    unassignedSpecialCreditBalance?: number;
    walletBalance?: number;
  };
  balanceDeltas: {
    adCreditUsed: DashboardBalanceDelta;
    renewCreditUsed: DashboardBalanceDelta;
    specialCreditUsed: DashboardBalanceDelta;
  };
};

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

export type DashboardReportsTeaserData = {
  totalViews: number;
  viewsDeltaPercent: number;
  sparklineData: number[];
  publishedAdsCount: number;
  conversionRate: number;
};

export type DashboardRecentAdItem = AdCardData & {
  rawStatus?: string;
  statusCode?: number;
  viewsCount?: number;
  publishedAt?: string;
  confirmDate?: string;
  expireDate?: string;
  assignmentStatus?: string;
};

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

export type DashboardReportViewsData = {
  period: string;
  totalViews: number;
  deltaPercent: number;
  trend: "up" | "down";
  trendLabel: string;
  items: Array<{ label: string; views: number }>;
};

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

export type DashboardReportRegistrationProgressData = {
  period: string;
  totalCount: number;
  deltaPercent: number;
  trend: "up" | "down";
  trendLabel: string;
  items: Array<{ label: string; count: number }>;
};

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
