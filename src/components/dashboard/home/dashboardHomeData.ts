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

export type DashboardProgressDatum = {
  ads: number;
  month: string;
  requests: number;
};

export type DashboardActivity = {
  amount: string;
  label: string;
  tone: "blue" | "green" | "amber";
};

export type DashboardConsultantRank = {
  ads: number;
  name: string;
  score: number;
  status: string;
};

export const dashboardMetrics: DashboardMetric[] = [
  {
    description: "افزایش استفاده در روز قبل",
    icon: "ad",
    id: "ad-credit",
    title: "مانده اعتبار آگهی",
    tone: "blue",
    trend: "۴۴٪",
    trendTone: "positive",
    value: "۳۴",
  },
  {
    description: "افزایش استفاده در روز قبل",
    icon: "chart",
    id: "renew-credit",
    title: "مانده بروزرسانی",
    tone: "green",
    trend: "۴۴٪",
    trendTone: "positive",
    value: "۲۱",
  },
  {
    description: "افزایش در روز قبل",
    icon: "startup",
    id: "special-credit",
    title: "مانده ویژه",
    tone: "amber",
    trend: "۱۶٪",
    trendTone: "negative",
    value: "۱۱",
  },
  {
    description: "۱۳۸ روز تا پایان اعتبار",
    descriptionIcon: "clock",
    icon: "calendar",
    id: "panel-credit",
    title: "مانده بروزرسانی",
    tone: "neutral",
    trend: "",
    trendTone: "neutral",
    value: "۲۵۶ روز",
  },
];

export const adTypeData: DashboardAdTypeDatum[] = [
  { color: "#4C6BD8", name: "فروش", value: 48 },
  { color: "#7F98E6", name: "اجاره", value: 40 },
  { color: "#B2C0F4", name: "پروژه و مشارکت", value: 12 },
];

export const consultantActivityData: DashboardConsultantDatum[] = [
  { ads: 60, name: "عبادی", renewals: 50, specials: 20 },
  { ads: 80, name: "اشرفی", renewals: 30, specials: 40 },
  { ads: 40, name: "مطهری", renewals: 50, specials: 10 },
  { ads: 10, name: "رفیعی", renewals: 40, specials: 2 },
  { ads: 100, name: "زکی", renewals: 0, specials: 0 },
  { ads: 70, name: "محمدی", renewals: 60, specials: 32 },
  { ads: 50, name: "علیرضا", renewals: 40, specials: 8 },
];

export const monthlyProgressData: DashboardProgressDatum[] = [
  { ads: 42, month: "فروردین", requests: 18 },
  { ads: 58, month: "اردیبهشت", requests: 24 },
  { ads: 51, month: "خرداد", requests: 21 },
  { ads: 77, month: "تیر", requests: 34 },
  { ads: 64, month: "مرداد", requests: 29 },
  { ads: 88, month: "شهریور", requests: 38 },
  { ads: 73, month: "مهر", requests: 31 },
  { ads: 95, month: "آبان", requests: 44 },
  { ads: 82, month: "آذر", requests: 36 },
  { ads: 107, month: "دی", requests: 48 },
  { ads: 99, month: "بهمن", requests: 42 },
  { ads: 126, month: "اسفند", requests: 54 },
];

export const dashboardActivities: DashboardActivity[] = [
  { amount: "۱۲۸", label: "بازدید امروز", tone: "blue" },
  { amount: "۴۲", label: "درخواست جدید", tone: "green" },
  { amount: "۱۸", label: "آگهی نیازمند بررسی", tone: "amber" },
];

export const consultantRanks: DashboardConsultantRank[] = [
  { ads: 48, name: "محمدی", score: 92, status: "فعال" },
  { ads: 39, name: "اشرفی", score: 86, status: "رو به رشد" },
  { ads: 34, name: "زکی", score: 81, status: "فعال" },
  { ads: 28, name: "مطهری", score: 74, status: "نیازمند پیگیری" },
];
