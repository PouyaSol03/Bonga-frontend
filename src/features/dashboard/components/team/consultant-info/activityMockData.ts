import type { ActivityFilterType, ConsultantActivityItem } from "./types";

export interface ConsultantActivityStat {
  id: string;
  label: string;
  value: string;
}

export const CONSULTANT_ACTIVITY_STATS: ConsultantActivityStat[] = [
  { id: "ad", label: "آگهی", value: "۰" },
  { id: "response", label: "پاسخ به مشتری", value: "۰" },
  { id: "visit", label: "بازدید سرنخ", value: "۰" },
  { id: "followup", label: "پیگیری سرنخ", value: "۰" },
];

export const ACTIVITY_FILTERS: { key: ActivityFilterType; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "ad", label: "آگهی" },
  { key: "followup", label: "پیگیری" },
  { key: "visit", label: "بازدید" },
  { key: "response", label: "پاسخ به مشتری" },
];

export const CONSULTANT_ACTIVITIES: ConsultantActivityItem[] = [
  {
    id: "act-1",
    type: "ad",
    title: "ثبت آگهی",
    subtitle: "...آپارتمان ۱۱۰ متری در هاشم",
    timeAgo: "۲ روز پیش",
  },
  {
    id: "act-2",
    type: "followup",
    title: "ثبت پیگیری",
    subtitle: "پیگیری سرنخ - ناصر اشرفی",
    timeAgo: "۲ روز پیش",
  },
  {
    id: "act-3",
    type: "visit",
    title: "ثبت بازدید",
    subtitle: "بازدید سرنخ - ناصر اشرفی",
    timeAgo: "۲ روز پیش",
  },
  {
    id: "act-4",
    type: "response",
    title: "پاسخ به مشتری",
    subtitle: "پاسخ به کاربر ناصر اشرفی",
    timeAgo: "۲ روز پیش",
  },
];
