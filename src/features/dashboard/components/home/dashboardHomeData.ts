export type DashboardMetricTone = "blue" | "green" | "amber" | "neutral";

export type DashboardMetric = {
  description: string;
  descriptionIcon?: "clock";
  icon: "ad" | "calendar" | "chart" | "startup";
  id: string;
  title: string;
  tone: DashboardMetricTone;
  trend: string;
  trendTone: "positive" | "negative" | "neutral";
  value: string;
};

export type DashboardAdTypeDatum = {
  color: string;
  name: string;
  value: number;
};

export type DashboardConsultantDatum = {
  ads: number;
  name: string;
  renewals: number;
  specials: number;
};
