export type TabKey = "info" | "ads" | "performance";
export type PeriodKey = "month" | "year";

export type ConsultantPieDatum = {
  title: string;
  badge: string;
  badgeColorVar: string;
  badgeBgColorVar: string;
  subtitle: string;
  consultantValue: number;
  agencyValue: number;
  consultantColorVar: string;
  agencyColorVar: string;
};

export type ActivityFilterType = "all" | "ad" | "followup" | "visit" | "response";

export type ConsultantActivityItem = {
  id: string;
  type: ActivityFilterType;
  title: string;
  subtitle: string;
  timeAgo: string;
};

export * from "./consultantAdsFilterTypes";
