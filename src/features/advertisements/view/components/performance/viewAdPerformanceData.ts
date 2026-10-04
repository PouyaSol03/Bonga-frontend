export type PerformanceMetricKey = "views" | "searchDisplays" | "chats" | "calls";

export interface PerformanceDayData {
  date: string;
  value: number;
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
    chartTitle: "بازدید از آگهی",
    summaryLabel: "بازدید کل:",
    defaultTotal: "۲۰,۳۶۵",
    infoTitle: "بازدید از آگهی",
    infoDesc: "تعداد دفعاتی که کاربران وارد صفحه آگهی شده‌اند و جزئیات آن را دیده‌اند.",
  },
  {
    key: "searchDisplays",
    chipLabel: "نمایش در جستجو",
    chartTitle: "نمایش در صفحه جستجو",
    summaryLabel: "نمایش کل:",
    defaultTotal: "۲,۴۵۰",
    infoTitle: "نمایش در صفحه جستجو",
    infoDesc: "تعداد دفعاتی که آگهی شما در نتایج جستجو به کاربران نمایش داده شده است.",
  },
  {
    key: "chats",
    chipLabel: "چت‌ها",
    chartTitle: "گفتگوها (چت‌ها)",
    summaryLabel: "چت کل:",
    defaultTotal: "۱۸",
    infoTitle: "گفتگوها (چت‌ها)",
    infoDesc: "تعداد گفتگوهایی که کاربران از طریق بخش چت برای این آگهی شروع کرده‌اند.",
  },
  {
    key: "calls",
    chipLabel: "تماس",
    chartTitle: "اقدام به تماس",
    summaryLabel: "تماس کل:",
    defaultTotal: "۱۴",
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
