import type { CrmSection, IconName } from "./types";
import {
  CRM_ADVERTISE_MANAGER,
  CRM_FINANCE_MANAGER,
  SUPPORT,
  SUPER_ADMIN,
} from "../../../shared/constants/roles.constants";
import { getStoredAuthSession, normalizeAuthRoleSlug } from "../../../shared/auth/auth-storage";

export const sectionMeta: Record<CrmSection, { path: string; subtitle: string; title: string }> = {
  advertises: {
    path: "/crm/advertises",
    subtitle: "بررسی، ویرایش، تأیید و مدیریت وضعیت آگهی‌ها",
    title: "مدیریت آگهی‌ها",
  },
  users: {
    path: "/crm/users",
    subtitle: "ساخت، ویرایش، فعال‌سازی و مدیریت نقش کاربران",
    title: "مدیریت کاربران",
  },
  consultants: {
    path: "/crm/consultants",
    subtitle: "مدیریت مشاوران مستقل و وابسته به آژانس",
    title: "مدیریت مشاورین",
  },
  agencies: {
    path: "/crm/agencies",
    subtitle: "مدیریت پروفایل و اطلاعات آژانس‌های املاک",
    title: "مدیریت آژانس‌ها",
  },
  categories: {
    path: "/crm/categories",
    subtitle: "ساختار درختی دسته‌بندی‌ها و اطلاعات نمایشی آن‌ها",
    title: "دسته‌بندی‌ها",
  },
  locations: {
    path: "/crm/locations",
    subtitle: "شهرها، محله‌ها و محدوده‌های جغرافیایی سامانه",
    title: "مدیریت موقعیت‌ها",
  },
  forms: {
    path: "/crm/forms",
    subtitle: "مشاهده ساختار فرم‌های ثبت آگهی و فیلدهای پویا",
    title: "فرم‌های آگهی",
  },
  packages: {
    path: "/crm/packages",
    subtitle: "ساخت و ویرایش بسته‌ها و اعتبار پنل",
    title: "بسته‌ها و اعتبار",
  },
  payments: {
    path: "/crm/payments",
    subtitle: "مشاهده و پیگیری تمام تراکنش‌های مالی کاربران",
    title: "تاریخچه پرداخت‌ها",
  },
  costs: {
    path: "/crm/costs",
    subtitle: "تنظیم هزینه عملیات اعتباری سامانه",
    title: "مدیریت هزینه‌ها",
  },
  reports: {
    path: "/crm/reports",
    subtitle: "مشاهده و بررسی گزارش‌های تخلف آگهی‌ها و کاربران",
    title: "گزارش‌های تخلف",
  },
  requests: {
    path: "/crm/requests",
    subtitle: "مشاهده و پاسخگویی به درخواست‌های ثبت‌شده در بخش پشتیبانی",
    title: "درخواست‌های پشتیبانی",
  },
  propertyRequests: {
    path: "/crm/property-requests",
    subtitle: "مشاهده درخواست‌هایی که کاربران برای یافتن آگهی مناسب ثبت کرده‌اند",
    title: "درخواست‌های یافتن آگهی",
  },
  support: {
    path: "/crm/support",
    subtitle: "پاسخگویی فوری به مشتریان حاضر در صف پشتیبانی",
    title: "پشتیبانی",
  },
  discounts: {
    path: "/crm/discounts",
    subtitle: "تعریف کدهای تخفیف، درصد تخفیف و تعیین سرویس‌های مجاز",
    title: "مدیریت کدهای تخفیف",
  },
  feedback: {
    path: "/crm/feedback",
    subtitle: "مدیریت و ویرایش معیارهای بازخورد پروفایل آژانس و مشاور",
    title: "معیارهای بازخورد",
  },
};

export const navigationItems: Array<{ icon: IconName; section: CrmSection }> = [
  { icon: "ads", section: "advertises" },
  { icon: "users", section: "users" },
  { icon: "users", section: "consultants" },
  { icon: "building", section: "agencies" },
  { icon: "category", section: "categories" },
  { icon: "location", section: "locations" },
  { icon: "form", section: "forms" },
  { icon: "wallet", section: "packages" },
  { icon: "payment", section: "payments" },
  { icon: "payment", section: "discounts" },
  { icon: "check", section: "feedback" },
  { icon: "settings", section: "costs" },
  { icon: "reports", section: "reports" },
  { icon: "requests", section: "requests" },
  { icon: "ads", section: "propertyRequests" },
  { icon: "support", section: "support" },
];

export const roleSectionAccess: Record<string, CrmSection[]> = {
  [SUPER_ADMIN]: navigationItems.map((item) => item.section),
  [CRM_ADVERTISE_MANAGER]: ["advertises"],
  [CRM_FINANCE_MANAGER]: ["payments", "packages", "costs"],
  [SUPPORT]: ["support"],
};

export const crmRoleLabels: Record<string, { subtitle: string; title: string }> = {
  [SUPER_ADMIN]: {
    subtitle: "دسترسی کامل مدیریتی",
    title: "پنل سوپر ادمین",
  },
  [CRM_ADVERTISE_MANAGER]: {
    subtitle: "دسترسی مدیریت آگهی",
    title: "مدیریت آگهی",
  },
  [CRM_FINANCE_MANAGER]: {
    subtitle: "دسترسی مدیریت مالی",
    title: "مدیریت مالی",
  },
  [SUPPORT]: {
    subtitle: "دسترسی پشتیبانی",
    title: "پشتیبانی",
  },
};
export function crmSessionRoleSlugs() {
  const session = getStoredAuthSession();
  if (!session) return [];

  return Array.from(
    new Set([
      normalizeAuthRoleSlug(session.activeRole ?? session.role),
      normalizeAuthRoleSlug(session.role),
      ...session.roles.map((role) => normalizeAuthRoleSlug(role.slug ?? role.name)),
    ]),
  );
}

export function allowedCrmSectionsForRoles(roles: string[]) {
  const sections = new Set<CrmSection>();

  for (const role of roles) {
    for (const section of roleSectionAccess[role] ?? []) {
      sections.add(section);
    }
  }

  return sections;
}

export function primaryCrmRoleLabel(roles: string[]) {
  const primaryRole =
    roles.find((role) => role === SUPER_ADMIN) ??
    roles.find((role) => roleSectionAccess[role]) ??
    SUPER_ADMIN;

  return crmRoleLabels[primaryRole] ?? crmRoleLabels[SUPER_ADMIN];
}
