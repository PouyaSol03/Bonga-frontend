import type { NotificationCategory } from "./api/notification.service";
import type { AgencyConsultantRequestDecision } from "../agencies/api/agency.service";

export type { AgencyConsultantRequestDecision };

export type AgencyConsultantRequestDisplayState =
  | AgencyConsultantRequestDecision
  | "cancel";

export type NotificationFilterOption = {
  id: NotificationCategory;
  label: string;
};

export const notificationDeleteThreshold = 72;
export const notificationDeleteActionWidth = 84;
export const agencyConsultantRequestType = "agency_consultant_request";
export const notificationsPerPage = 20;

export const categoryColorClassNames: Record<NotificationCategory, string> = {
  advertise: "bg-tertiary",
  chats: "bg-primary",
  requests: "bg-warning",
  support: "bg-tertiary",
  systems: "bg-outline",
  trades: "bg-primary",
};

export const notificationFilterOptions: NotificationFilterOption[] = [
  { id: "advertise", label: "آگهی‌ها" },
  { id: "trades", label: "معاملات" },
  { id: "requests", label: "درخواست‌ها" },
  { id: "chats", label: "چت‌ها" },
  { id: "systems", label: "سیستم" },
  { id: "support", label: "پشتیبانی" },
];

export const allPreferenceCategories = notificationFilterOptions.map(
  (option) => option.id,
);

export const notificationManagementOptions: Array<{
  category: NotificationCategory;
  description: string;
  label: string;
}> = [
  { category: "advertise", description: "انتشار مجدد و وضعیت آگهی‌ها", label: "آگهی‌ها" },
  { category: "trades", description: "ثبت، تایید و نتیجه معاملات", label: "معاملات" },
  { category: "requests", description: "درخواست‌های جدید و پاسخ‌ها", label: "درخواست‌ها" },
  { category: "chats", description: "گفتگوها", label: "چت‌ها" },
  { category: "systems", description: "امنیت حساب و بروزرسانی‌ها", label: "سیستم" },
];
