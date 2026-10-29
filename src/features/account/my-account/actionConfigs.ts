import type { AccountAction } from "./types";

export const MANAGE_ADS_PATH = "/account/manage-ads";

export const userBusinessActions: AccountAction[] = [
  { icon: "plus", label: "ایجاد کسب و کار", to: "/account/business/create" },
];

export const loggedOutBusinessActions: AccountAction[] = [
  { icon: "plus", label: "ایجاد کسب و کار", requiresAuth: true, to: "/account/business/create" },
];

export const primaryActions: AccountAction[] = [
  { icon: "identity", label: "تایید هویت", to: "/account/identity" },
  { icon: "user", label: "مشخصات من", to: "/account/profile" },
  { icon: "tag", label: "آگهی‌های من", to: MANAGE_ADS_PATH },
  { icon: "request", label: "مدیریت درخواست", to: "/account/requests" },
  { icon: "bookmark", label: "نشان‌ها", to: "/account/bookmarks" },
  { icon: "eye", label: "بازدیدهای اخیر", to: "/account/recent-views" },
  { icon: "note", label: "یادداشت‌ها", to: "/account/notes" },
  { icon: "wallet", label: "کیف پول", to: "/account/wallet" },
];

export const loggedOutPrimaryActions: AccountAction[] = [
  { icon: "identity", label: "تایید هویت", requiresAuth: true, to: "/account/identity" },
  { icon: "user", label: "مشخصات من", requiresAuth: true, to: "/account/profile" },
  { icon: "tag", label: "آگهی‌های من", requiresAuth: true, to: MANAGE_ADS_PATH },
  { icon: "bookmark", label: "نشان‌ها", requiresAuth: true, to: "/account/bookmarks" },
  { icon: "note", label: "یادداشت‌ها", requiresAuth: true, to: "/account/notes" },
  { icon: "wallet", label: "کیف پول", requiresAuth: true, to: "/account/wallet" },
];

export const secondaryActions: AccountAction[] = [
  { icon: "setting", label: "تنظیمات", to: "/account/about" },
  { icon: "info", label: "درباره ما", to: "/account/about" },
  { icon: "legal", label: "ضوابط و قوانین", to: "/account/about" },
  { icon: "headphone", label: "پشتیبانی", to: "/account/support" },
];
