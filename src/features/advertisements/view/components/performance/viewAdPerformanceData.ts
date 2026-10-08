export type PerformanceMetricKey = "views" | "search_impressions" | "chats" | "calls";

export interface PerformanceDayData {
  date?: string;
  full_name?: string;
  value: number;
  percentage?: number;
  is_active?: boolean;
}

export interface MetricConfig {
  key: PerformanceMetricKey;
  chipLabel: string;
  chartTitle: string;
  summaryLabel: string;
  defaultTotal: string;
  infoTitle: string;
  infoDesc: string;
}

export const PERFORMANCE_METRICS: MetricConfig[] = [
  {
    key: "views",
    chipLabel: "بازدید",
    chartTitle: "بازدید آگهی",
    summaryLabel: "بازدید کل:",
    defaultTotal: "۰",
    infoTitle: "بازدید آگهی",
    infoDesc: "تعداد کل دفعاتی که کاربران صفحه این آگهی را باز کرده‌اند.",
  },
  {
    key: "search_impressions",
    chipLabel: "نمایش در جستجو",
    chartTitle: "نمایش در جستجو",
    summaryLabel: "نمایش کل:",
    defaultTotal: "۰",
    infoTitle: "نمایش در صفحه جستجو",
    infoDesc: "تعداد دفعاتی که آگهی شما در نتایج جستجوی کاربران نشان داده شده است.",
  },
  {
    key: "chats",
    chipLabel: "گفتگو",
    chartTitle: "گفتگوی کاربران",
    summaryLabel: "گفتگوی کل:",
    defaultTotal: "۰",
    infoTitle: "گفتگو",
    infoDesc: "تعداد چت‌ها و گفتگوهای شروع شده برای این آگهی.",
  },
  {
    key: "calls",
    chipLabel: "اقدام به تماس",
    chartTitle: "اقدام به تماس",
    summaryLabel: "تماس کل:",
    defaultTotal: "۰",
    infoTitle: "اقدام به تماس",
    infoDesc: "تعداد دفعاتی که کاربران از داخل آگهی برای تماس با شما اقدام کرده‌اند.",
  },
];

export const DEFAULT_PERFORMANCE_DAYS = [
  { date: "۱۰/۲۰", value: 1200 },
  { date: "۱۰/۲۱", value: 2400 },
  { date: "۱۰/۲۲", value: 1800 },
  { date: "۱۰/۲۳", value: 3100 },
  { date: "۱۰/۲۴", value: 2200 },
  { date: "۱۰/۲۵", value: 1285 },
  { date: "امروز", value: 1950 },
];
