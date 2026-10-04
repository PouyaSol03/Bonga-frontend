export type TabKey = "info" | "ads" | "performance";
export type PeriodKey = "month" | "year";

export type ConsultantPieDatum = {
  agencyPercent: number;
  badge: string;
  badgeClassName: string;
  color: string;
  lightColor: string;
  subtitle: string;
  title: string;
  value: number;
};

export type ActivityFilterType = "all" | "ad" | "followup" | "visit" | "response";

export type ConsultantActivityItem = {
  id: string;
  type: ActivityFilterType;
  title: string;
  subtitle: string;
  timeAgo: string;
};
