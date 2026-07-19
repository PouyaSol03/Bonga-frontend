import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode, type SelectHTMLAttributes } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { LatLngTuple } from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Polygon,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

import { getApiErrorMessage } from "../../api/api";
import { AdCard, type AdCardData } from "../../components/AdCard";
import LinearCheckmark from "../../components/(icons)/LinearCheckmark";
import LinearCancel from "../../components/(icons)/LinearCancel";
import LinearDelete from "../../components/(icons)/LinearDelete";
import LinearEdit2 from "../../components/(icons)/LinearEdit2";
import LinearFlag from "../../components/(icons)/LinearFlag";
import { mapAdvertisementToAdCard, type AdvertisementItem } from "../../services/advertisement.service";
import { useMyProfileQuery } from "../../hooks/account.hooks";
import { useNeighborhoodListQuery } from "../../hooks/neighborhood.hooks";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { readStoredSelectedCity } from "../../lib/selectedCityStorage";
import { searchMapTileConfig } from "../search/searchMapData";
import { RouteLink } from "../../routes/RouteLink";
import { pushRoute } from "../../routes/navigation";
import { SwitchButton } from "../../components/SwitchButton";
import { SelectionCheckIndicator } from "../../components/SelectionCheckIndicator";
import { CrmAdvertiseDetailView } from "./CrmAdvertiseDetailView";
import { getCrmAdvertiseCreatePath, getCrmAdvertiseEditPath, getCrmAdvertiseEditState } from "./crmAdvertiseNavigation";
import { CrmCostsView, CrmPackagesView } from "./CrmBillingViews";
import { CrmPaymentsView } from "./CrmPaymentsView";
import { CrmReportsView } from "./CrmReportsView";
import { CrmSupportView } from "./CrmSupportView";
import { CrmSupportRequestsView } from "./CrmSupportRequestsView";
import {
  deleteCrmCity,
  deleteCrmNeighborhood,
  getCrmRecordId,
  listCrmAdvertiseForms,
  listCrmAdvertises,
  listCrmAgencies,
  listCrmAgents,
  listCrmAgencyAgents,
  listCrmCategories,
  listCrmCities,
  listCrmNeighborhoods,
  listCrmUsers,
  updateCrmAgencyStatus,
  saveCrmCategory,
  saveCrmCity,
  saveCrmNeighborhood,
  saveCrmUser,
  toggleCrmUserAuthorization,
  toggleCrmUserStatus,
  updateCrmAdvertiseStatus,
  updateCrmConsultant,
  type CrmConsultantPayload,
  type CrmConsultantStatus,
  type CrmRecord,
} from "../../services/crm.service";

const CRM_BLUE = "#0048c4";
const DEFAULT_COUNTRY_ID = "000000000000000000000001";
const DEFAULT_CENTER: LatLngTuple = [36.2972, 59.6067];

type CrmSection =
  | "overview"
  | "advertises"
  | "users"
  | "consultants"
  | "agencies"
  | "categories"
  | "locations"
  | "forms"
  | "packages"
  | "payments"
  | "costs"
  | "reports"
  | "requests"
  | "support";

type ToastState = {
  id: number;
  message: string;
  tone: "error" | "success";
};

type ModalField = {
  label: string;
  name: string;
  options?: Array<{ label: string; value: string }>;
  type?: "checklist" | "email" | "geofence" | "map-point" | "neighborhood-multi" | "number" | "select" | "textarea" | "text";
  value?: unknown;
};

type EditorState = {
  fields: ModalField[];
  onSubmit: (values: Record<string, string>) => Promise<void>;
  title: string;
};

type ConfirmState = {
  body: string;
  confirmLabel?: string;
  onConfirm: (promptValue?: string) => Promise<void>;
  prompt?: {
    label: string;
    placeholder?: string;
    required?: boolean;
  };
  title: string;
};

const sectionMeta: Record<CrmSection, { path: string; subtitle: string; title: string }> = {
  overview: {
    path: "/crm",
    subtitle: "نمای کلی عملیات و دسترسی سریع به بخش‌های مدیریتی",
    title: "داشبورد مدیریت",
  },
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
  packages: { path: "/crm/packages", subtitle: "ساخت و ویرایش بسته‌ها و اعتبار پنل", title: "بسته‌ها و اعتبار" },
  payments: { path: "/crm/payments", subtitle: "مشاهده و پیگیری تمام تراکنش‌های مالی کاربران", title: "تاریخچه پرداخت‌ها" },
  costs: { path: "/crm/costs", subtitle: "تنظیم هزینه عملیات اعتباری سامانه", title: "مدیریت هزینه‌ها" },
  reports: { path: "/crm/reports", subtitle: "مشاهده و بررسی گزارش‌های تخلف آگهی‌ها و کاربران", title: "گزارش‌های تخلف" },
  requests: { path: "/crm/requests", subtitle: "مشاهده و پاسخگویی به درخواست‌های پشتیبانی کاربران", title: "درخواست‌ها" },
  support: { path: "/crm/support", subtitle: "پاسخگویی فوری به مشتریان حاضر در صف پشتیبانی", title: "پشتیبانی" },
};

const navigationItems: Array<{ icon: IconName; section: CrmSection }> = [
  { icon: "home", section: "overview" },
  { icon: "ads", section: "advertises" },
  { icon: "users", section: "users" },
  { icon: "users", section: "consultants" },
  { icon: "building", section: "agencies" },
  { icon: "category", section: "categories" },
  { icon: "location", section: "locations" },
  { icon: "form", section: "forms" },
  { icon: "wallet", section: "packages" },
  { icon: "payment", section: "payments" },
  { icon: "settings", section: "costs" },
  { icon: "reports", section: "reports" },
  { icon: "form", section: "requests" },
  { icon: "support", section: "support" },
];

const advertiseStatusOptions = [
  { label: "ثبت شده", value: "0" },
  { label: "در انتظار مدیر", value: "1" },
  { label: "در انتظار مشاور", value: "2" },
  { label: "تأیید شده", value: "3" },
  { label: "رد شده", value: "-1" },
  { label: "نیازمند ویرایش", value: "-4" },
  { label: "حذف شده", value: "-2" },
  { label: "منقضی شده", value: "-3" },
];

const userRoleOptions = [
  { label: "کاربر", value: "user" },
  { label: "مدیر آژانس", value: "real_estate_manager" },
  { label: "مشاور آژانس", value: "real_estate_consultant" },
  { label: "مشاور مستقل", value: "independent_consultant" },
  { label: "مدیر کل", value: "superadmin" },
];

function getCurrentSection(): CrmSection {
  const path = window.location.pathname.replace(/\/+$/, "") || "/crm";

  if (path === "/crm/advertises" || path.startsWith("/crm/advertises/")) return "advertises";
  if (path === "/crm/users") return "users";
  if (path === "/crm/consultants") return "consultants";
  if (path === "/crm/agencies") return "agencies";
  if (path === "/crm/categories") return "categories";
  if (path === "/crm/locations") return "locations";
  if (path === "/crm/forms") return "forms";
  if (path === "/crm/packages") return "packages";
  if (path === "/crm/payments") return "payments";
  if (path === "/crm/costs") return "costs";
  if (path === "/crm/reports") return "reports";
  if (path === "/crm/requests") return "requests";
  if (path === "/crm/support") return "support";

  return "overview";
}

function getCurrentAdvertiseDetailId() {
  const match = window.location.pathname.match(/^\/crm\/advertises\/([^/]+)\/?$/);
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function stringifyValue(value: unknown, fallback = "") {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);

  return JSON.stringify(value, null, 2);
}

function readText(record: CrmRecord, keys: string[], fallback = "-") {
  for (const key of keys) {
    const value = record[key];

    if (typeof value === "string" && value.trim()) return value;
    if (typeof value === "number") return String(value);
  }

  return fallback;
}


function readArray(record: CrmRecord, key: string) {
  return Array.isArray(record[key]) ? (record[key] as unknown[]) : [];
}

function readNestedText(record: CrmRecord, keys: string[], childKeys = ["name", "title", "label"]) {
  for (const key of keys) {
    const value = record[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      const text = readText(value as CrmRecord, childKeys, "");
      if (text) return text;
    }
  }
  return "";
}

function advertiseLocationLabel(advertise: CrmRecord, fallback = "موقعیت ثبت نشده") {
  const city = readText(advertise, ["city_name"], "") || readNestedText(advertise, ["city"]);
  const neighborhood = readText(advertise, ["neighborhood_name", "district_name"], "") ||
    readNestedText(advertise, ["neighborhood", "district"]);
  const address = readText(advertise, ["address", "full_address", "formatted_address"], "");

  return address || [city, neighborhood].filter(Boolean).join("، ") || fallback;
}

function formatMoney(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) && number !== 0
    ? new Intl.NumberFormat("fa-IR").format(number)
    : "-";
}

function advertiseStatusLabel(status: unknown) {
  const key = String(status ?? "");
  return (
    {
      "-3": "منقضی شده",
      "-2": "حذف شده",
      "-1": "رد شده",
      "-4": "نیازمند ویرایش",
      "0": "ثبت شده",
      "1": "در انتظار بررسی",
      "2": "در انتظار مشاور",
      "3": "منتشر شده",
    }[key] ?? key ?? "-"
  );
}

function normalizeCrmUserRoleSlug(value: string) {
  const normalized = value.trim().toLowerCase();

  if (
    normalized === "super-admin" ||
    normalized === "super_admin" ||
    normalized === "super admin" ||
    normalized === "superadmin"
  ) {
    return "superadmin";
  }

  return normalized;
}

function userRoleSlugs(user: CrmRecord) {
  if (Array.isArray(user.roles)) {
    const slugs = user.roles
      .map((role) => {
        if (typeof role === "string") return role;
        if (role && typeof role === "object" && typeof (role as CrmRecord).slug === "string") {
          return String((role as CrmRecord).slug);
        }

        return "";
      })
      .map(normalizeCrmUserRoleSlug)
      .filter(Boolean);

    return Array.from(new Set(slugs));
  }

  const roleSlugs = Array.isArray(user.role_slugs)
    ? user.role_slugs.filter((role): role is string => typeof role === "string" && Boolean(role.trim()))
    : [];
  const fallback = roleSlugs.length > 0 ? roleSlugs : [readText(user, ["role"], "")].filter(Boolean);

  return Array.from(new Set(fallback.map(normalizeCrmUserRoleSlug)));
}

function parseJsonValue(value: string, fieldLabel: string, fallback: unknown) {
  if (!value.trim()) return fallback;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    throw new Error(`${fieldLabel} باید JSON معتبر باشد.`);
  }
}

function cleanEmptyValues(values: CrmRecord) {
  return Object.fromEntries(
    Object.entries(values).filter(([, value]) => value !== "" && value !== undefined),
  );
}

function getCategoryChildren(category: CrmRecord) {
  return Array.isArray(category.children) ? (category.children as CrmRecord[]) : [];
}

function getCategoryLabel(category: CrmRecord) {
  return readText(category, ["name", "title", "label"]);
}

function fullName(user: CrmRecord) {
  return [readText(user, ["name"], ""), readText(user, ["family"], "")]
    .filter(Boolean)
    .join(" ") || "-";
}

function mapCrmAdvertiseToCard(advertise: CrmRecord, index: number): AdCardData {
  const mapped = mapAdvertisementToAdCard(advertise as AdvertisementItem, index);
  const rawPrice = formatMoney(advertise.price);

  return {
    ...mapped,
    agency: readText(advertise, ["agency_name", "publisher_name"], mapped.agency),
    imageCount: mapped.imageCount || String(readArray(advertise, "images").length || 1),
    pricePrimary: mapped.pricePrimary && mapped.pricePrimary !== "-" ? mapped.pricePrimary : rawPrice,
    status: advertiseStatusLabel(advertise.status),
    timeAndLocation: advertiseLocationLabel(advertise, mapped.timeAndLocation),
  };
}

export function CrmPage({ embeddedContent }: { embeddedContent?: ReactNode } = {}) {
  const section = embeddedContent ? "advertises" : getCurrentSection();
  const advertiseDetailId = getCurrentAdvertiseDetailId();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [refreshNonce, setRefreshNonce] = useState(0);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [isDesktop, setIsDesktop] = useState(() =>
    window.matchMedia("(min-width: 768px)").matches,
  );
  const { data: profile } = useMyProfileQuery();
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const sync = () => setIsDesktop(media.matches);

    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const notify = useCallback((message: string, tone: ToastState["tone"] = "success") => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const wasUpdated = params.get("updated") === "1";
    const wasCreated = params.get("created") === "1";

    if (!wasUpdated && !wasCreated) return undefined;

    const notifyTimer = window.setTimeout(() => {
      notify(wasCreated ? "آگهی با موفقیت ثبت شد." : "آگهی با موفقیت ویرایش شد.");
    }, 0);
    params.delete("updated");
    params.delete("created");
    const search = params.toString();
    window.history.replaceState(
      window.history.state ?? {},
      "",
      `${window.location.pathname}${search ? `?${search}` : ""}`,
    );

    return () => window.clearTimeout(notifyTimer);
  }, [notify]);

  if (!isDesktop) {
    return <DesktopRequiredPage />;
  }

  const profileName = [profile?.name, profile?.family]
    .map((value) => value?.trim())
    .filter(Boolean)
    .join(" ") || "مدیر سامانه";

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#f3f3f3] text-[#1a1a1a]" dir="rtl">
      <header className="flex h-[80px] shrink-0 items-center justify-between bg-white px-6">
        <img className="h-[32px] w-[146px] object-contain" src="/images/logo/logo-dashboard.png" alt="بنگاه" />

        <div className="flex items-center gap-3">
          <button
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#e4e4e4] bg-white px-4 text-sm font-semibold text-[#4d4d4d] transition hover:border-[#0048c4] hover:text-[#0048c4]"
            onClick={() => setRefreshNonce((value) => value + 1)}
            type="button"
          >
            <CrmIcon name="refresh" />
            تازه‌سازی
          </button>

          <div className="hidden h-10 max-w-[230px] items-center gap-2 rounded-xl bg-[#f5f5f5] px-3 xl:flex">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e4e8f4] text-[#0048c4]">
              <CrmIcon name="account" />
            </span>
            <div className="min-w-0">
              <p className="m-0 truncate text-sm font-semibold text-[#1a1a1a]">{profileName}</p>
              <p className="m-0 truncate text-xs font-medium text-[#808080]">مدیر کل سامانه</p>
            </div>
          </div>

          <RouteLink
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-semibold text-white no-underline transition hover:bg-[#003ba1]"
            to="/home"
          >
            <CrmIcon name="account" />
            بازگشت به سایت
          </RouteLink>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-6 overflow-hidden p-6">
        <aside
          className={`flex h-full shrink-0 flex-col gap-6 rounded-xl bg-white p-4 transition-[width] duration-300 ${
            isSidebarCollapsed ? "w-[80px]" : "w-[264px]"
          }`}
        >
          <div className={`flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-between"}`}>
            {!isSidebarCollapsed ? (
              <div>
                <p className="m-0 text-sm font-semibold text-[#1a1a1a]">مرکز مدیریت</p>
                <p className="m-0 mt-1 text-xs font-medium text-[#808080]">مدیریت کل سامانه</p>
              </div>
            ) : null}

            <button
              aria-label={isSidebarCollapsed ? "باز کردن منو" : "جمع کردن منو"}
              className="grid h-10 w-10 place-items-center rounded-lg bg-[#e9eaee] text-[#4d4d4d] transition hover:bg-[#dfe1e6]"
              onClick={() => setIsSidebarCollapsed((value) => !value)}
              type="button"
            >
              <span className={isSidebarCollapsed ? "rotate-180" : ""}><ChevronIcon /></span>
            </button>
          </div>

          {!isSidebarCollapsed ? (
            <div className="flex min-h-16 items-center gap-3 rounded-xl border border-[#f0f0f0] px-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0048c414] text-[#0048c4]">
                <CrmIcon name="home" size={20} />
              </span>
              <div className="min-w-0">
                <strong className="block truncate text-sm font-semibold text-[#303030]">پنل سوپر ادمین</strong>
                <span className="mt-1 block truncate text-xs text-[#808080]">دسترسی کامل مدیریتی</span>
              </div>
            </div>
          ) : null}

          <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto" aria-label="منوی مدیریت">
            {navigationItems.map((item) => {
              const itemMeta = sectionMeta[item.section];
              const isActive = section === item.section;

              return (
                <RouteLink
                  aria-current={isActive ? "page" : undefined}
                  className={`relative flex h-10 items-center rounded-xl text-sm no-underline transition ${
                    isActive ? "bg-[#0048c414] text-[#0048c4]" : "text-[#303030] hover:bg-[#f5f7fb]"
                  } ${isSidebarCollapsed ? "justify-center px-0" : "gap-2 px-3"}`}
                  key={item.section}
                  title={isSidebarCollapsed ? itemMeta.title : undefined}
                  to={itemMeta.path}
                >
                  <span className="shrink-0"><CrmIcon name={item.icon} /></span>
                  {!isSidebarCollapsed ? (
                    <span className={isActive ? "font-bold" : "font-medium"}>{itemMeta.title}</span>
                  ) : isActive ? (
                    <span className="absolute mt-8 h-1 w-1 rounded-full bg-[#0048c4]" />
                  ) : null}
                </RouteLink>
              );
            })}
          </nav>

          <RouteLink
            className={`flex h-10 items-center rounded-xl border border-[#f0f0f0] text-sm text-[#4d4d4d] no-underline transition hover:bg-[#f5f7fb] ${
              isSidebarCollapsed ? "justify-center" : "gap-2 px-3"
            }`}
            title={isSidebarCollapsed ? "حساب کاربری" : undefined}
            to="/account"
          >
            <CrmIcon name="account" />
            {!isSidebarCollapsed ? <span className="font-medium">حساب کاربری</span> : null}
          </RouteLink>
        </aside>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="h-full min-h-0"
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -8, scale: 0.995 }}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.995 }}
              key={embeddedContent ? "advertise-editor" : advertiseDetailId ? `advertise-${advertiseDetailId}` : section}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: "easeOut" }}
            >
              {embeddedContent ? (
                <div className="h-full min-h-0 w-full overflow-hidden rounded-xl bg-white">
                  {embeddedContent}
                </div>
              ) : advertiseDetailId ? (
                <CrmAdvertiseDetailView
                  advertiseId={advertiseDetailId}
                  notify={notify}
                  refreshNonce={refreshNonce}
                />
              ) : (
                <>
                  {section === "overview" ? <OverviewView notify={notify} refreshNonce={refreshNonce} /> : null}
                  {section === "advertises" ? <AdvertisesView notify={notify} refreshNonce={refreshNonce} /> : null}
                  {section === "users" ? <UsersView notify={notify} refreshNonce={refreshNonce} /> : null}
                  {section === "consultants" ? <ConsultantsView notify={notify} refreshNonce={refreshNonce} /> : null}
                  {section === "agencies" ? <AgenciesView notify={notify} refreshNonce={refreshNonce} /> : null}
                  {section === "categories" ? <CategoriesView notify={notify} refreshNonce={refreshNonce} /> : null}
                  {section === "locations" ? <LocationsView notify={notify} refreshNonce={refreshNonce} /> : null}
                  {section === "forms" ? <AdvertiseFormsView notify={notify} refreshNonce={refreshNonce} /> : null}
                  {section === "packages" ? <CrmPackagesView notify={notify} refreshNonce={refreshNonce} /> : null}
                  {section === "payments" ? <CrmPaymentsView notify={notify} refreshNonce={refreshNonce} /> : null}
                  {section === "costs" ? <CrmCostsView notify={notify} refreshNonce={refreshNonce} /> : null}
                  {section === "reports" ? <CrmReportsView notify={notify} refreshNonce={refreshNonce} /> : null}
                  {section === "requests" ? (
                    <CrmSupportRequestsView notify={notify} refreshNonce={refreshNonce} />
                  ) : null}
                  {section === "support" ? <CrmSupportView /> : null}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {toast ? <Toast key={toast.id} toast={toast} /> : null}
    </div>
  );

}

function DesktopRequiredPage() {
  return (
    <div className="grid h-screen w-full place-items-center bg-[#eef3fb] px-5" dir="rtl">
      <section className="w-full max-w-md rounded-3xl border border-[#dfe6f2] bg-white p-8 text-center shadow-[0_24px_70px_rgba(24,50,90,0.12)]">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]">
          <CrmIcon name="desktop" size={32} />
        </div>
        <h1 className="m-0 mt-5 text-lg font-bold text-[#1e2633]">نسخه مدیریت برای دسکتاپ طراحی شده است</h1>
        <p className="m-0 mt-2 text-sm leading-7 text-[#6f7888]">
          برای استفاده کامل از جدول‌ها، فرم‌ها و نقشه مدیریت، این صفحه را روی لپ‌تاپ یا نمایشگر بزرگ‌تر باز کنید.
        </p>
        <RouteLink
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#0048c4] px-6 text-sm font-bold text-white no-underline"
          to="/account"
        >
          بازگشت به حساب من
        </RouteLink>
      </section>
    </div>
  );
}

type ViewProps = {
  notify: (message: string, tone?: ToastState["tone"]) => void;
  refreshNonce: number;
};

function OverviewView({ notify, refreshNonce }: ViewProps) {
  const adsQuery = useQuery({
    queryFn: () => listCrmAdvertises(),
    queryKey: ["crm", "overview", "advertises", refreshNonce],
  });
  const usersQuery = useQuery({
    queryFn: () => listCrmUsers(),
    queryKey: ["crm", "overview", "users", refreshNonce],
  });
  const agenciesQuery = useQuery({
    queryFn: () => listCrmAgencies(),
    queryKey: ["crm", "overview", "agencies", refreshNonce],
  });
  const formsQuery = useQuery({
    queryFn: listCrmAdvertiseForms,
    queryKey: ["crm", "overview", "forms", refreshNonce],
  });

  useQueryErrorToast([adsQuery.error, usersQuery.error, agenciesQuery.error, formsQuery.error], notify);

  const isLoading =
    adsQuery.isLoading || usersQuery.isLoading || agenciesQuery.isLoading || formsQuery.isLoading;

  const metrics = [
    {
      icon: "ads" as const,
      label: "آگهی‌ها",
      path: "/crm/advertises",
      value: adsQuery.data?.length ?? 0,
    },
    {
      icon: "users" as const,
      label: "کاربران",
      path: "/crm/users",
      value: usersQuery.data?.length ?? 0,
    },
    {
      icon: "building" as const,
      label: "آژانس‌ها",
      path: "/crm/agencies",
      value: agenciesQuery.data?.length ?? 0,
    },
    {
      icon: "form" as const,
      label: "فرم‌های آگهی",
      path: "/crm/forms",
      value: formsQuery.data?.length ?? 0,
    },
  ];

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="آمار کلی">
        {metrics.map((metric) => (
          <RouteLink
            className="group rounded-2xl bg-white p-5 no-underline transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,72,196,0.08)]"
            key={metric.label}
            to={metric.path}
          >
            <div className="flex items-center justify-between">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4] transition group-hover:bg-[#0048c4] group-hover:text-white">
                <CrmIcon name={metric.icon} size={22} />
              </span>
              <CrmIcon name="arrow" size={18} />
            </div>
            <strong className="mt-5 block text-3xl font-black text-[#1e2633]">
              {isLoading ? "…" : new Intl.NumberFormat("fa-IR").format(metric.value)}
            </strong>
            <span className="mt-1 block text-sm font-medium text-[#7b8493]">{metric.label}</span>
          </RouteLink>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <Panel>
          <PanelHeader
            action={<TextLink label="مشاهده همه" to="/crm/advertises" />}
            subtitle="آخرین آگهی‌های دریافت‌شده در پنل"
            title="آگهی‌های اخیر"
          />
          <div className="mt-4 divide-y divide-[#edf0f5]">
            {adsQuery.isLoading ? (
              <ListSkeleton count={6} />
            ) : adsQuery.data?.length ? (
              adsQuery.data.slice(0, 6).map((ad) => (
                <RouteLink
                  className="flex min-h-14 items-center justify-between gap-4 py-3 text-[#273142] no-underline transition hover:text-[#0048c4]"
                  key={getCrmRecordId(ad)}
                  to={`/crm/advertises/${encodeURIComponent(getCrmRecordId(ad))}`}
                >
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-bold">{readText(ad, ["title"])}</p>
                    <p className="m-0 mt-1 text-sm text-[#9098a6]">
                      کد پیگیری: {readText(ad, ["track_code"])}
                    </p>
                  </div>
                  <StatusBadge status={ad.status} />
                </RouteLink>
              ))
            ) : (
              <EmptyState compact description="هنوز آگهی‌ای دریافت نشده است." />
            )}
          </div>
        </Panel>

        <Panel>
          <PanelHeader subtitle="دسترسی سریع به عملیات پرتکرار" title="ابزارهای مدیریت" />
          <div className="mt-4 grid gap-3">
            {[
              { description: "بررسی و تعیین وضعیت آگهی‌ها", icon: "ads" as const, label: "صف بررسی آگهی", to: "/crm/advertises" },
              { description: "ساخت و مدیریت حساب‌ها", icon: "users" as const, label: "مدیریت کاربران", to: "/crm/users" },
              { description: "ویرایش شهر، محله و محدوده", icon: "location" as const, label: "موقعیت‌ها", to: "/crm/locations" },
              { description: "مشاهده و پیگیری تراکنش‌های کاربران", icon: "payment" as const, label: "تاریخچه پرداخت‌ها", to: "/crm/payments" },
              { description: "بررسی گزارش‌های آگهی و کاربران", icon: "reports" as const, label: "گزارش‌های تخلف", to: "/crm/reports" },
            ].map((item) => (
              <RouteLink
                className="flex items-center gap-3 rounded-xl border border-[#f0f0f0] p-3.5 text-[#273142] no-underline transition hover:border-[#cbd8ed] hover:bg-[#fbfcff]"
                key={item.label}
                to={item.to}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]">
                  <CrmIcon name={item.icon} size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block text-sm">{item.label}</strong>
                  <small className="mt-1 block text-sm text-[#8b94a3]">{item.description}</small>
                </span>
                <CrmIcon name="arrow" size={17} />
              </RouteLink>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function AdvertisesView({ notify, refreshNonce }: ViewProps) {
  const queryClient = useQueryClient();
  const [trackCode, setTrackCode] = useState("");
  const [status, setStatus] = useState("");
  const filters = useMemo(
    () => ({ status, trackCode: trackCode.trim() }),
    [status, trackCode],
  );
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const query = useQuery({
    queryFn: () =>
      listCrmAdvertises({
        status: filters.status === "" ? undefined : Number(filters.status),
        trackCode: filters.trackCode,
      }),
    queryKey: ["crm", "advertises", filters, refreshNonce],
  });

  useQueryErrorToast([query.error], notify);

  const statusMutation = useMutation({
    mutationFn: ({ id, nextStatus, reason }: { id: string; nextStatus: number; reason?: string }) =>
      updateCrmAdvertiseStatus(id, nextStatus, reason),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "advertises"] });
      await queryClient.invalidateQueries({ queryKey: ["crm", "overview", "advertises"] });
      notify("وضعیت آگهی به‌روزرسانی شد.");
    },
  });

  const updateStatus = async (id: string, nextStatus: number) => {
    try {
      await statusMutation.mutateAsync({ id, nextStatus });
    } catch (error) {
      notify(getApiErrorMessage(error, "به‌روزرسانی وضعیت آگهی ناموفق بود."), "error");
    }
  };

  const openRejectModal = (id: string) => {
    setConfirm({
      body: "دلیل رد یا نیاز به اصلاح آگهی برای کاربر نمایش داده می‌شود.",
      confirmLabel: "ثبت دلیل",
      onConfirm: async (reason) => {
        await statusMutation.mutateAsync({ id, nextStatus: -4, reason });
      },
      prompt: {
        label: "دلیل نیاز به اصلاح",
        placeholder: "مثلاً تصاویر واضح نیست یا اطلاعات آگهی کامل نیست.",
        required: true,
      },
      title: "نیاز به اصلاح آگهی",
    });
  };

  return (
    <>
      <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white px-6 pb-6 pt-3 text-[#1a1a1a] [direction:rtl]">
        <div className="shrink-0">
          <nav aria-label="وضعیت آگهی‌ها" className="flex justify-end overflow-x-auto">
            <div className="inline-flex min-w-max items-center gap-12">
              {[{ label: "همه آگهی‌ها", value: "" }, ...advertiseStatusOptions].map((option) => {
                const isActive = status === option.value;

                return (
                  <button
                    aria-current={isActive ? "page" : undefined}
                    className={`relative h-10 whitespace-nowrap bg-transparent px-0 text-sm font-semibold transition ${isActive ? "text-[#0048c4]" : "text-[#666666] hover:text-[#303030]"}`}
                    key={option.value || "all"}
                    onClick={() => setStatus(option.value)}
                    type="button"
                  >
                    {option.label}
                    {isActive ? <span className="absolute -bottom-px right-0 h-0.5 w-full rounded-full bg-[#0048c4]" /> : null}
                  </button>
                );
              })}
            </div>
          </nav>

          <div className="mt-9 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <button
                className={`inline-flex h-10 items-center gap-2 rounded-xl border bg-white px-4 text-sm font-semibold transition ${showFilters ? "border-[#0048c4] text-[#0048c4]" : "border-[#cccccc] text-[#1a1a1a] hover:border-[#0048c4] hover:text-[#0048c4]"}`}
                onClick={() => setShowFilters((value) => !value)}
                type="button"
              >
                <CrmIcon name="filter" size={19} />
                فیلترها
              </button>

              <label className="relative block h-10 w-[min(360px,42vw)] min-w-[240px]">
                <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#4d4d4d]"><CrmIcon name="search" size={19} /></span>
                <input
                  className="h-full w-full rounded-xl border border-[#cccccc] bg-white pl-12 pr-4 text-right text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4]"
                  onChange={(event) => setTrackCode(event.target.value)}
                  placeholder="جستجو با کد پیگیری"
                  type="search"
                  value={trackCode}
                />
              </label>
            </div>

            <PrimaryButton icon="plus" label="ثبت آگهی جدید" onClick={() => pushRoute(getCrmAdvertiseCreatePath())} />
          </div>
        </div>

        {showFilters ? <form
          className="mt-5 flex shrink-0 flex-wrap items-end gap-3 rounded-xl bg-[#f5f5f5] p-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <FilterField label="کد پیگیری">
            <input
              className={inputClassName}
              onChange={(event) => setTrackCode(event.target.value)}
              placeholder="مثلاً ۱۲۳۴۵"
              value={trackCode}
            />
          </FilterField>
          <FilterField label="وضعیت">
            <CrmSelect className={inputClassName} onChange={(event) => setStatus(event.target.value)} value={status}>
              <option value="">همه وضعیت‌ها</option>
              {advertiseStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </CrmSelect>
          </FilterField>
          {(status || trackCode) ? (
            <button
              className={ghostButtonClassName}
              onClick={() => {
                setStatus("");
                setTrackCode("");
              }}
              type="button"
            >
              پاک کردن فیلتر
            </button>
          ) : null}
        </form> : null}

        <div className="mt-6 min-h-0 flex-1 overflow-y-auto overflow-x-hidden pl-1">
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2 2xl:grid-cols-3">
          {query.isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div className="h-[430px] animate-pulse rounded-xl border border-[#f0f0f0] bg-white p-4" key={index}>
                <div className="h-[224px] rounded-2xl bg-[#e7ebf2]" />
                <div className="mt-4 h-5 w-2/5 rounded-full bg-[#e7ebf2]" />
                <div className="mt-3 h-4 w-4/5 rounded-full bg-[#eef0f4]" />
                <div className="mt-3 h-4 w-3/5 rounded-full bg-[#eef0f4]" />
              </div>
            ))
          ) : query.data?.length ? (
            query.data.map((ad, index) => {
              const id = getCrmRecordId(ad);
              const card = mapCrmAdvertiseToCard(ad, index);
              return (
                <article
                  className="overflow-hidden rounded-xl border border-[#f0f0f0] bg-white p-3 transition hover:border-[#d9e2f2]"
                  key={id}
                >
                  <div>
                    <AdCard
                      ad={card}
                      showStatusBadge
                      state={{ ad, card, status: ad.status }}
                      to={`/crm/advertises/${encodeURIComponent(id)}`}
                      variant="dashboard"
                    />
                  </div>

                  <div className="mt-3 border-t border-[#f0f0f0] pt-3">
                    <div className="mb-3 flex items-center px-1 text-xs text-[#808080]">
                      <span>کد پیگیری: <strong className="font-semibold text-[#4d4d4d]">{readText(ad, ["track_code"])}</strong></span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
                      <SmallActionButton icon={<LinearEdit2 className="h-4 w-4" />} label="ویرایش" onClick={() => pushRoute(getCrmAdvertiseEditPath(id), getCrmAdvertiseEditState(id))} tone="primary" />
                      <SmallActionButton icon={<LinearCheckmark className="h-4 w-4" />} label="تأیید" onClick={() => updateStatus(id, 3)} tone="success" />
                      <SmallActionButton icon={<LinearCancel className="h-4 w-4" />} label="رد" onClick={() => openRejectModal(id)} tone="warning" />
                      <SmallActionButton
                        icon={<LinearDelete className="h-4 w-4" />}
                        label="حذف"
                        onClick={() => setConfirm({
                          body: "این آگهی از فهرست فعال خارج و در وضعیت حذف‌شده قرار می‌گیرد.",
                          confirmLabel: "حذف آگهی",
                          onConfirm: async () => { await statusMutation.mutateAsync({ id, nextStatus: -2 }); },
                          title: "حذف آگهی",
                        })}
                        tone="danger"
                      />
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full rounded-xl border border-dashed border-[#d9d9d9] bg-[#fafafa]">
              <EmptyState description="آگهی‌ای مطابق فیلترهای انتخابی پیدا نشد." />
            </div>
          )}
          </div>
        </div>
      </section>

      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} notify={notify} />
    </>
  );
}

function UsersView({ notify, refreshNonce }: ViewProps) {
  const queryClient = useQueryClient();
  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const filters = useMemo(
    () => ({ mobile: mobile.trim(), name: name.trim() }),
    [mobile, name],
  );
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const query = useQuery({
    queryFn: () => listCrmUsers(filters),
    queryKey: ["crm", "users", filters, refreshNonce],
  });

  useQueryErrorToast([query.error], notify);

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmRecord }) =>
      saveCrmUser(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "users"] });
      await queryClient.invalidateQueries({ queryKey: ["crm", "overview", "users"] });
      notify("اطلاعات کاربر ذخیره شد.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: toggleCrmUserStatus,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "users"] });
      notify("وضعیت کاربر تغییر کرد.");
    },
  });

  const authorizationMutation = useMutation({
    mutationFn: toggleCrmUserAuthorization,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "users"] });
      notify("وضعیت تایید کد ملی کاربر تغییر کرد.");
    },
  });

  const openUserEditor = (user: CrmRecord = {}) => {
    const id = getCrmRecordId(user) || null;

    setEditor({
      fields: [
        { label: "نام", name: "name", value: user.name },
        { label: "نام خانوادگی", name: "family", value: user.family },
        ...(!id ? [{ label: "کد ملی", name: "nationalnumber", value: user.nationalnumber }] : []),
        { label: "شماره موبایل", name: "mobile", value: user.mobile },
        { label: "ایمیل", name: "email", type: "email", value: user.email },
        {
          label: "نقش‌های کاربر",
          name: "role_slugs",
          options: userRoleOptions,
          type: "checklist",
          value: userRoleSlugs(user),
        },
      ],
      onSubmit: async (values) => {
        const allowedRoleSlugs = new Set(userRoleOptions.map((option) => option.value));
        const selectedRoleSlugs = Array.from(new Set(
          (values.role_slugs ?? "")
            .split(",")
            .map(normalizeCrmUserRoleSlug)
            .filter((role) => allowedRoleSlugs.has(role)),
        ));

        const payload: CrmRecord = {
          email: values.email ?? "",
          family: values.family ?? "",
          mobile: values.mobile ?? "",
          name: values.name ?? "",
          roles: selectedRoleSlugs,
        };

        if (!id) {
          payload.nationalnumber = values.nationalnumber ?? "";
        }

        await saveMutation.mutateAsync({ id, payload });
      },
      title: id ? "ویرایش کاربر" : "ساخت کاربر جدید",
    });
  };

  const handleToggleStatus = (id: string) => statusMutation.mutateAsync(id);
  const handleToggleAuthorization = (id: string) => authorizationMutation.mutateAsync(id);

  const renderUsersTable = (users: CrmRecord[], emptyMessage: string) => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-separate border-spacing-0 text-right">
        <thead>
          <tr className="text-sm font-bold text-[#4d4d4d]">
            <TableHead>نام</TableHead>
            <TableHead>موبایل</TableHead>
            <TableHead>نقش‌ها</TableHead>
            <TableHead>وضعیت</TableHead>
            <TableHead>تایید کد ملی</TableHead>
            <TableHead>اعتبار</TableHead>
            <TableHead>عملیات</TableHead>
          </tr>
        </thead>
        <tbody>
          {users.length ? (
            users.map((user) => {
              const id = getCrmRecordId(user);
              const isActive = Number(user.status) === 1;
              const isAuthorized = Number(user.authorized) === 1;
              const roles = userRoleSlugs(user);

              return (
                <tr key={id}>
                  <TableCell><span className="font-bold text-[#1a1a1a]">{fullName(user)}</span></TableCell>
                  <TableCell><span dir="ltr">{readText(user, ["mobile"])}</span></TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5">
                        {roles.length > 0 ? roles.map((role) => (
                          <span
                            className="rounded-lg border border-[#cbd8ed] bg-[#f6f9ff] px-2 py-1 text-xs font-bold text-[#0048c4]"
                            key={role}
                          >
                            {userRoleOptions.find((option) => option.value === role)?.label ?? role}
                          </span>
                        )) : <span className="text-xs text-[#919aa8]">بدون نقش</span>}
                      </div>
                  </TableCell>
                  <TableCell><UserStatusBadge status={user.status} /></TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${
                        isAuthorized
                          ? "bg-[#e9f8f0] text-[#0b8b55]"
                          : "bg-[#f4f6f8] text-[#7b8494]"
                      }`}
                    >
                      {isAuthorized ? "تایید شده" : "تایید نشده"}
                    </span>
                  </TableCell>
                  <TableCell>{formatMoney(user.credit)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      <SmallActionButton label="ویرایش" onClick={() => openUserEditor(user)} />
                      <SmallActionButton
                        label={isActive ? "غیرفعال‌سازی" : "فعال‌سازی"}
                        onClick={() => setConfirm({
                          body: isActive
                            ? "دسترسی این کاربر تا زمان فعال‌سازی دوباره محدود می‌شود."
                            : "حساب این کاربر دوباره فعال می‌شود.",
                          confirmLabel: isActive ? "غیرفعال کن" : "فعال کن",
                          onConfirm: async () => { await handleToggleStatus(id); },
                          title: isActive ? "غیرفعال‌سازی کاربر" : "فعال‌سازی کاربر",
                        })}
                        tone={isActive ? "danger" : "success"}
                      />
                      <SmallActionButton
                        label={isAuthorized ? "لغو تایید کد ملی" : "تایید کد ملی"}
                        onClick={() => setConfirm({
                          body: isAuthorized
                            ? "تایید کد ملی این کاربر لغو می‌شود و وضعیت احراز هویت او به تایید نشده تغییر می‌کند."
                            : "کد ملی این کاربر به عنوان تایید شده ثبت می‌شود.",
                          confirmLabel: isAuthorized ? "لغو تایید" : "تایید کن",
                          onConfirm: async () => { await handleToggleAuthorization(id); },
                          title: isAuthorized ? "لغو تایید کد ملی" : "تایید کد ملی",
                        })}
                        tone={isAuthorized ? "danger" : "success"}
                      />
                    </div>
                  </TableCell>
                </tr>
              );
            })
          ) : (
            <TableEmptyRow columns={7} message={emptyMessage} />
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <Panel>
        <PanelHeader
          action={<PrimaryButton icon="plus" label="کاربر جدید" onClick={() => openUserEditor()} />}
          subtitle="جستجو بر اساس نام یا شماره موبایل و مدیریت سطح دسترسی کاربران"
          title="فهرست کاربران"
        />

        <form
          className="mt-5 flex flex-wrap items-end gap-3 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <FilterField label="شماره موبایل">
            <input className={inputClassName} onChange={(event) => setMobile(event.target.value)} placeholder="0912..." value={mobile} />
          </FilterField>
          <FilterField label="نام کاربر">
            <input className={inputClassName} onChange={(event) => setName(event.target.value)} placeholder="نام یا نام خانوادگی" value={name} />
          </FilterField>
          {(mobile || name) ? (
            <button
              className={ghostButtonClassName}
              onClick={() => {
                setMobile("");
                setName("");
              }}
              type="button"
            >
              پاک کردن فیلتر
            </button>
          ) : null}
        </form>

        <div className="mt-5 space-y-4">
          {query.isLoading ? (
            <section className="overflow-hidden rounded-xl border border-[#f0f0f0] bg-white">
              <div className="border-b border-[#e6e6e6] px-4 py-3">
                <div className="h-5 w-40 animate-pulse rounded bg-[#e9edf3]" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] border-separate border-spacing-0 text-right">
                  <tbody><TableLoadingRows columns={7} rows={4} /></tbody>
                </table>
              </div>
            </section>
          ) : query.data?.length ? (
            <section className="overflow-hidden rounded-xl border border-[#f0f0f0] bg-white">
              <div className="flex items-center justify-between gap-3 border-b border-[#f0f0f0] bg-[#fafafa] px-4 py-3">
                <h3 className="m-0 text-sm font-bold text-[#1a1a1a]">همه کاربران</h3>
                <span className="rounded-lg bg-[#eaf1ff] px-2.5 py-1 text-xs font-bold text-[#0048c4]">
                  {new Intl.NumberFormat("fa-IR").format(query.data.length)} کاربر
                </span>
              </div>
              {renderUsersTable(query.data, "کاربری مطابق جستجوی شما پیدا نشد.")}
            </section>
          ) : (
            <div className="rounded-xl border border-dashed border-[#d9d9d9] bg-[#fafafa] px-4 py-10 text-center text-sm text-[#7b8494]">
              کاربری مطابق جستجوی شما پیدا نشد.
            </div>
          )}
        </div>
      </Panel>

      <EditorModal editor={editor} isPending={saveMutation.isPending} onClose={() => setEditor(null)} notify={notify} />
      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} notify={notify} />
    </>
  );
}


function consultantAgencyId(consultant: CrmRecord) {
  const directId = readText(
    consultant,
    ["agency_id", "real_estate_agency_id", "agencyId"],
    "",
  );

  if (directId) return directId;

  const agency = consultant.agency ?? consultant.real_estate_agency;
  return agency && typeof agency === "object" && !Array.isArray(agency)
    ? getCrmRecordId(agency as CrmRecord)
    : "";
}

function consultantAgencyName(consultant: CrmRecord, agencyNames: Map<string, string>) {
  const directName = readText(
    consultant,
    ["agency_name", "real_estate_agency_name", "agency"],
    "",
  ) || readNestedText(consultant, ["agency", "real_estate_agency"], ["name", "title"]);

  if (directName) return directName;

  const agencyId = consultantAgencyId(consultant);
  return agencyId ? agencyNames.get(agencyId) ?? "آژانس ثبت‌شده" : "مستقل";
}

function consultantStatusValue(consultant: CrmRecord): CrmConsultantStatus {
  const rawStatus = String(
    consultant.consultant_status
      ?? consultant.status
      ?? consultant.consultant_status_text
      ?? "pending",
  ).trim().toLowerCase();

  // Read older API values safely, but only send the current string contract.
  if (rawStatus === "1" || rawStatus === "accept" || rawStatus === "accepted" || rawStatus === "approved") {
    return "approved";
  }
  if (rawStatus === "2" || rawStatus === "reject" || rawStatus === "rejected") {
    return "rejected";
  }
  return "pending";
}

function consultantStatusLabel(status: CrmConsultantStatus) {
  if (status === "approved") return "تأیید شده";
  if (status === "rejected") return "رد شده";
  return "در انتظار";
}

function consultantStatusTone(status: CrmConsultantStatus) {
  if (status === "approved") return "text-[#0b8b55]";
  if (status === "rejected") return "text-[#cc3342]";
  return "text-[#a06a00]";
}

function consultantApiIdentifier(value: string) {
  const normalized = value.trim();
  return /^\d+$/.test(normalized) ? Number(normalized) : normalized;
}

function buildCrmConsultantPayload(
  consultant: CrmRecord,
  overrides: Partial<CrmConsultantPayload> = {},
): CrmConsultantPayload {
  const agencyId = consultantAgencyId(consultant);
  const type = readText(consultant, ["type"], "") === "dependent" || agencyId
    ? "dependent"
    : "independent";

  return {
    name: readText(consultant, ["name"], ""),
    family: readText(consultant, ["family"], ""),
    mobile: readText(consultant, ["mobile", "phone"], ""),
    status: consultantStatusValue(consultant),
    type,
    agency_id: type === "dependent" && agencyId ? consultantApiIdentifier(agencyId) : null,
    ...overrides,
  };
}

function ConsultantsView({ notify, refreshNonce }: ViewProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search.trim(), 350);
  const [statusFilter, setStatusFilter] = useState("");
  const [agencyOnly, setAgencyOnly] = useState(false);
  const [agencyIdFilter, setAgencyIdFilter] = useState("");
  const appliedFilters = useMemo(
    () => ({
      agencyId: agencyOnly ? agencyIdFilter : "",
      agencyOnly,
      search: debouncedSearch,
      status: statusFilter,
    }),
    [agencyIdFilter, agencyOnly, debouncedSearch, statusFilter],
  );
  const [editor, setEditor] = useState<EditorState | null>(null);

  const usersQuery = useQuery({
    queryFn: () => listCrmAgents({
      agencyId: appliedFilters.agencyId || undefined,
      page: 1,
      perPage: 100,
      search: appliedFilters.search || undefined,
      status: appliedFilters.status === "" ? undefined : appliedFilters.status as CrmConsultantStatus,
      type: appliedFilters.agencyOnly ? "dependent" : undefined,
    }),
    queryKey: [
      "crm",
      "consultants",
      "agents",
      appliedFilters.search,
      appliedFilters.status,
      appliedFilters.agencyOnly,
      appliedFilters.agencyId,
      refreshNonce,
    ],
  });
  const agenciesQuery = useQuery({
    queryFn: () => listCrmAgencies(),
    queryKey: ["crm", "consultants", "agencies", refreshNonce],
  });

  useQueryErrorToast([usersQuery.error, agenciesQuery.error], notify);

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmRecord | CrmConsultantPayload }) =>
      id
        ? updateCrmConsultant(id, payload as CrmConsultantPayload)
        : saveCrmUser(null, payload as CrmRecord),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["crm", "consultants"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "users"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "overview", "users"] }),
      ]);
      notify("اطلاعات مشاور ذخیره شد.");
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ consultant, status }: { consultant: CrmRecord; status: Exclude<CrmConsultantStatus, "pending"> }) => {
      const id = getCrmRecordId(consultant);
      return updateCrmConsultant(id, buildCrmConsultantPayload(consultant, { status }));
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["crm", "consultants"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "users"] }),
      ]);
      notify("وضعیت مشاور تغییر کرد.");
    },
    onError: (error) => {
      notify(getApiErrorMessage(error, "تغییر وضعیت مشاور ناموفق بود."), "error");
    },
  });

  const agencies = agenciesQuery.data ?? [];
  const agencyNames = useMemo<Map<string, string>>(
    () => new Map<string, string>(
      agencies.map((agency) => [
        getCrmRecordId(agency),
        readText(agency, ["name", "title"], "آژانس بدون نام"),
      ] as [string, string]),
    ),
    [agencies],
  );

  const consultants = useMemo(() => {
    const normalizedSearch = appliedFilters.search.trim().toLocaleLowerCase("fa-IR");

    return (usersQuery.data ?? []).filter((consultant) => {
      const agencyId = consultantAgencyId(consultant);
      const agencyName = consultantAgencyName(consultant, agencyNames);
      const isAgencyConsultant = readText(consultant, ["type"], "") === "dependent" || Boolean(agencyId);
      const matchesSearch = !normalizedSearch || [
        fullName(consultant),
        readText(consultant, ["mobile", "phone"], ""),
        agencyName,
      ].join(" ").toLocaleLowerCase("fa-IR").includes(normalizedSearch);
      const matchesStatus = appliedFilters.status === "" || consultantStatusValue(consultant) === appliedFilters.status;
      const matchesAgencyMode = !appliedFilters.agencyOnly || isAgencyConsultant;
      const matchesAgency = !appliedFilters.agencyOnly || !appliedFilters.agencyId || agencyId === appliedFilters.agencyId;

      return matchesSearch && matchesStatus && matchesAgencyMode && matchesAgency;
    });
  }, [agencyNames, appliedFilters, usersQuery.data]);

  const openConsultantEditor = (consultant: CrmRecord = {}) => {
    const id = getCrmRecordId(consultant) || null;
    const currentAgencyId = consultantAgencyId(consultant);
    const currentStatus = consultantStatusValue(consultant);

    setEditor({
      fields: [
        { label: "نام", name: "name", value: consultant.name },
        { label: "نام خانوادگی", name: "family", value: consultant.family },
        { label: "شماره موبایل", name: "mobile", value: consultant.mobile },
        {
          label: "آژانس محل فعالیت",
          name: "agency_id",
          options: [
            { label: "مشاور مستقل", value: "" },
            ...agencies.map((agency) => ({
              label: readText(agency, ["name", "title"], "آژانس بدون نام"),
              value: getCrmRecordId(agency),
            })),
          ],
          type: "select",
          value: currentAgencyId,
        },
        ...(id ? [{
          label: "وضعیت مشاور",
          name: "status",
          options: [
            { label: "در انتظار", value: "pending" },
            { label: "تأیید شده", value: "approved" },
            { label: "رد شده", value: "rejected" },
          ],
          type: "select" as const,
          value: currentStatus,
        }] : []),
      ],
      onSubmit: async (values) => {
        const selectedAgencyId = values.agency_id?.trim() ?? "";

        if (id) {
          const selectedStatus = values.status;
          if (selectedStatus !== "pending" && selectedStatus !== "approved" && selectedStatus !== "rejected") {
            throw new Error("یک وضعیت معتبر برای مشاور انتخاب کنید.");
          }

          await saveMutation.mutateAsync({
            id,
            payload: {
              name: values.name?.trim() ?? "",
              family: values.family?.trim() ?? "",
              mobile: values.mobile?.trim() ?? "",
              status: selectedStatus,
              type: selectedAgencyId ? "dependent" : "independent",
              agency_id: selectedAgencyId ? consultantApiIdentifier(selectedAgencyId) : null,
            },
          });
          return;
        }

        const consultantRole = selectedAgencyId
          ? "real_estate_consultant"
          : "independent_consultant";

        await saveMutation.mutateAsync({
          id: null,
          payload: {
            agency_id: selectedAgencyId || null,
            email: readText(consultant, ["email"], ""),
            family: values.family ?? "",
            mobile: values.mobile ?? "",
            name: values.name ?? "",
            roles: ["user", consultantRole],
          },
        });
      },
      title: id ? "ویرایش مشاور" : "افزودن مشاور جدید",
    });
  };

  return (
    <>
      <Panel>
        <PanelHeader
          action={<PrimaryButton icon="plus" label="مشاور جدید" onClick={() => openConsultantEditor()} />}
          subtitle="مشاوران مستقل و وابسته به آژانس را جستجو، فیلتر و مدیریت کنید."
          title="مدیریت مشاورین"
        />

        <form className="mt-5 grid grid-cols-1 gap-3 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-4 lg:grid-cols-[minmax(220px,1fr)_190px_250px_minmax(220px,1fr)_auto]" onSubmit={(event) => event.preventDefault()}>
          <FilterField label="جستجو">
            <input
              className={inputClassName}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="نام، موبایل یا آژانس"
              type="search"
              value={search}
            />
          </FilterField>

          <FilterField label="وضعیت">
            <CrmSelect className={inputClassName} onChange={(event) => setStatusFilter(event.target.value)} value={statusFilter}>
              <option value="">همه وضعیت‌ها</option>
              <option value="pending">در انتظار</option>
              <option value="approved">تأیید شده</option>
              <option value="rejected">رد شده</option>
            </CrmSelect>
          </FilterField>

          <div className="flex min-h-[66px] items-end">
            <div className="flex h-10 w-full items-center justify-between rounded-xl border border-[#dce3ef] bg-white px-3">
              <div>
                <span className="block text-sm font-semibold text-[#303030]">فقط مشاوران آژانس</span>
              </div>
              <SwitchButton
                ariaLabel="فیلتر مشاوران وابسته به آژانس"
                checked={agencyOnly}
                onChange={(checked) => {
                  setAgencyOnly(checked);
                  if (!checked) setAgencyIdFilter("");
                }}
              />
            </div>
          </div>

          <FilterField label="آژانس">
            <CrmSelect
              className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-[#f0f0f0] disabled:text-[#a0a0a0]`}
              disabled={!agencyOnly}
              onChange={(event) => setAgencyIdFilter(event.target.value)}
              value={agencyIdFilter}
            >
              <option value="">همه آژانس‌ها</option>
              {agencies.map((agency) => {
                const id = getCrmRecordId(agency);
                return <option key={id} value={id}>{readText(agency, ["name", "title"], "آژانس بدون نام")}</option>;
              })}
            </CrmSelect>
          </FilterField>
          <div className="flex items-end gap-2">
            {(search || statusFilter || agencyOnly) ? <button className={ghostButtonClassName} onClick={() => { setSearch(""); setStatusFilter(""); setAgencyOnly(false); setAgencyIdFilter(""); }} type="button">پاک کردن</button> : null}
          </div>
        </form>

        <div className="mt-5 overflow-hidden rounded-xl border border-[#f0f0f0] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-separate border-spacing-0 text-right">
              <thead>
                <tr>
                  <TableHead>نام مشاور</TableHead>
                  <TableHead>شماره موبایل</TableHead>
                  <TableHead>آژانس</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </tr>
              </thead>
              <tbody>
                {usersQuery.isLoading || agenciesQuery.isLoading ? (
                  <TableLoadingRows columns={5} rows={6} />
                ) : consultants.length ? (
                  consultants.map((consultant, index) => {
                    const id = getCrmRecordId(consultant);
                    const status = consultantStatusValue(consultant);
                    const agencyName = consultantAgencyName(consultant, agencyNames);
                    const isIndependent = agencyName === "مستقل";

                    return (
                      <motion.tr
                        animate={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 8 }}
                        key={id}
                        transition={{ delay: Math.min(index * 0.035, 0.28), duration: 0.2 }}
                      >
                        <TableCell><span className="font-bold text-[#1a1a1a]">{fullName(consultant)}</span></TableCell>
                        <TableCell><span dir="ltr">{readText(consultant, ["mobile", "phone"])}</span></TableCell>
                        <TableCell>
                          <span className={`inline-flex rounded-lg border px-2.5 py-1 text-xs font-bold ${isIndependent ? "border-[#dce3ef] bg-[#f7f8fa] text-[#596477]" : "border-[#cfe4ff] bg-[#eef4ff] text-[#0048c4]"}`}>
                            {agencyName}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <SwitchButton
                              ariaLabel={`تغییر وضعیت ${fullName(consultant)}`}
                              checked={status === "approved"}
                              onChange={() => statusMutation.mutate({
                                consultant,
                                status: status === "approved" ? "rejected" : "approved",
                              })}
                            />
                            <span className={`text-xs font-bold ${consultantStatusTone(status)}`}>
                              {consultantStatusLabel(status)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <SmallActionButton
                            disabled={saveMutation.isPending || statusMutation.isPending}
                            icon={<LinearEdit2 className="h-4 w-4" />}
                            label="ویرایش"
                            onClick={() => openConsultantEditor(consultant)}
                            tone="primary"
                          />
                        </TableCell>
                      </motion.tr>
                    );
                  })
                ) : (
                  <TableEmptyRow columns={5} message="مشاوری مطابق فیلترهای انتخابی پیدا نشد." />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Panel>

      <EditorModal editor={editor} isPending={saveMutation.isPending} onClose={() => setEditor(null)} notify={notify} />
    </>
  );
}

function AgenciesView({ notify, refreshNonce }: ViewProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const filterName = name.trim();
  const [agentsAgency, setAgentsAgency] = useState<CrmRecord | null>(null);
  const [agentEditor, setAgentEditor] = useState<EditorState | null>(null);

  const query = useQuery({
    queryFn: () => listCrmAgencies({ name: filterName }),
    queryKey: ["crm", "agencies", filterName, refreshNonce],
  });
  const agencyAgentsQuery = useQuery({
    enabled: Boolean(agentsAgency),
    queryFn: () => listCrmAgencyAgents(getCrmRecordId(agentsAgency ?? {})),
    queryKey: ["crm", "agencies", getCrmRecordId(agentsAgency ?? {}), "agents"],
  });
  const agencyOptionsQuery = useQuery({
    queryFn: () => listCrmAgencies(),
    queryKey: ["crm", "agencies", "editor-options", refreshNonce],
  });

  useQueryErrorToast([query.error, agencyAgentsQuery.error, agencyOptionsQuery.error], notify);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "accept" | "reject" }) =>
      updateCrmAgencyStatus(id, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "agencies"] });
      await queryClient.invalidateQueries({ queryKey: ["crm", "overview", "agencies"] });
      notify("وضعیت آژانس به‌روزرسانی شد.");
    },
  });

  const agentSaveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CrmRecord }) => saveCrmUser(id, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["crm", "agencies"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "consultants"] }),
        queryClient.invalidateQueries({ queryKey: ["crm", "users"] }),
      ]);
      notify("اطلاعات مشاور ذخیره شد.");
    },
  });

  const openAgencyAgentEditor = (agent: CrmRecord) => {
    const id = getCrmRecordId(agent);
    if (!id) return;

    const currentAgencyId = consultantAgencyId(agent) || getCrmRecordId(agentsAgency ?? {});
    const agencyOptions = agencyOptionsQuery.data ?? [];

    setAgentsAgency(null);
    setAgentEditor({
      fields: [
        { label: "نام", name: "name", value: agent.name },
        { label: "نام خانوادگی", name: "family", value: agent.family },
        { label: "شماره موبایل", name: "mobile", value: agent.mobile ?? agent.phone },
        { label: "ایمیل", name: "email", type: "email", value: agent.email },
        {
          label: "آژانس محل فعالیت",
          name: "agency_id",
          options: [
            { label: "مشاور مستقل", value: "" },
            ...agencyOptions.map((agency) => ({
              label: readText(agency, ["name", "title"], "آژانس بدون نام"),
              value: getCrmRecordId(agency),
            })),
          ],
          type: "select",
          value: currentAgencyId,
        },
      ],
      onSubmit: async (values) => {
        const selectedAgencyId = values.agency_id?.trim() ?? "";
        const consultantRole = selectedAgencyId ? "real_estate_consultant" : "independent_consultant";

        await agentSaveMutation.mutateAsync({
          id,
          payload: {
            agency_id: selectedAgencyId || null,
            email: values.email ?? "",
            family: values.family ?? "",
            mobile: values.mobile ?? "",
            name: values.name ?? "",
            roles: ["user", consultantRole],
          },
        });
      },
      title: "ویرایش مشاور",
    });
  };

  return (
    <>
      <Panel>
        <PanelHeader
          subtitle="در این بخش فقط می‌توانید درخواست آژانس را تایید یا رد کنید."
          title="فهرست آژانس‌ها"
        />

        <form
          className="mt-5 flex flex-wrap items-end gap-3 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <FilterField label="نام آژانس">
            <input className={inputClassName} onChange={(event) => setName(event.target.value)} placeholder="جستجوی نام" value={name} />
          </FilterField>
          {name ? (
            <button
              className={ghostButtonClassName}
              onClick={() => {
                setName("");
              }}
              type="button"
            >
              پاک کردن فیلتر
            </button>
          ) : null}
        </form>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[850px] border-separate border-spacing-0 text-right">
            <thead>
              <tr className="text-sm font-bold text-[#4d4d4d]">
                <TableHead>نام آژانس</TableHead>
                <TableHead>شماره تماس</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>موقعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </tr>
            </thead>
            <tbody>
              {query.isLoading ? (
                <TableLoadingRows columns={5} rows={6} />
              ) : query.data?.length ? (
                query.data.map((agency) => {
                  const id = getCrmRecordId(agency);
                  const normalizedStatus = normalizeAgencyStatus(agency.status);
                  const isUpdatingThisAgency =
                    statusMutation.isPending && statusMutation.variables?.id === id;

                  return (
                    <tr key={id}>
                      <TableCell>
                        <span className="font-bold text-[#1a1a1a]">{readText(agency, ["name"])}</span>
                        <small className="mt-1 block text-sm text-[#9aa2af]">{id}</small>
                      </TableCell>
                      <TableCell><span dir="ltr">{readText(agency, ["phone1", "phone2", "phone3"])}</span></TableCell>
                      <TableCell>
                        <CrmSelect
                          aria-label={`وضعیت ${readText(agency, ["name"])}`}
                          className={`h-10 min-w-[156px] rounded-lg border border-[#dce3ef] bg-white pr-3 text-sm font-bold outline-none transition focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10 disabled:cursor-not-allowed disabled:opacity-60 ${agencyStatusTextTone(agency.status)}`}
                          disabled={!id || isUpdatingThisAgency}
                          onChange={async (event) => {
                            const status = event.target.value;

                            if (status !== "accept" && status !== "reject") return;

                            try {
                              await statusMutation.mutateAsync({ id, status });
                            } catch (error) {
                              notify(getApiErrorMessage(error, "به‌روزرسانی وضعیت آژانس ناموفق بود."), "error");
                            }
                          }}
                          value={normalizedStatus === "wait" ? "" : normalizedStatus}
                        >
                          <option disabled hidden value="">انتخاب وضعیت</option>
                          <option className="bg-white text-[#0b8b55]" style={{ backgroundColor: "#ffffff", color: "#0b8b55" }} value="accept">تایید</option>
                          <option className="bg-white text-[#cc3342]" style={{ backgroundColor: "#ffffff", color: "#cc3342" }} value="reject">رد شده</option>
                        </CrmSelect>
                      </TableCell>
                      <TableCell><span dir="ltr">{readText(agency, ["lat"])}, {readText(agency, ["lng"])}</span></TableCell>
                      <TableCell>
                        <SmallActionButton
                          icon={<CrmIcon name="users" size={16} />}
                          label="مشاوران"
                          onClick={() => setAgentsAgency(agency)}
                        />
                      </TableCell>
                    </tr>
                  );
                })
              ) : (
                <TableEmptyRow columns={5} message="آژانسی مطابق جستجوی شما پیدا نشد." />
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <AgencyAgentsModal
        agency={agentsAgency}
        agents={agencyAgentsQuery.data ?? []}
        isLoading={agencyAgentsQuery.isLoading}
        onClose={() => setAgentsAgency(null)}
        onEdit={openAgencyAgentEditor}
      />
      <EditorModal
        editor={agentEditor}
        isPending={agentSaveMutation.isPending}
        notify={notify}
        onClose={() => setAgentEditor(null)}
      />
    </>
  );
}

function AgencyAgentsModal({
  agency,
  agents,
  isLoading,
  onClose,
  onEdit,
}: {
  agency: CrmRecord | null;
  agents: CrmRecord[];
  isLoading: boolean;
  onClose: () => void;
  onEdit: (agent: CrmRecord) => void;
}) {
  if (!agency) return null;

  return (
    <ModalShell onClose={onClose}>
      <section className="max-h-[calc(100vh-64px)] w-[min(900px,calc(100vw-64px))] overflow-hidden rounded-xl bg-white shadow-[0_24px_70px_rgba(14,34,68,0.18)]" dir="rtl">
        <div className="flex h-16 items-center justify-between border-b border-[#f0f0f0] px-6">
          <div><h2 className="m-0 text-base font-bold">مشاوران {readText(agency, ["name"], "آژانس")}</h2><p className="m-0 mt-1 text-sm text-[#919aa8]">فهرست مشاوران وابسته به این آژانس</p></div>
          <button aria-label="بستن" className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f5f8] text-[#596477]" onClick={onClose} type="button"><CrmIcon name="close" size={18} /></button>
        </div>
        <div className="max-h-[calc(100vh-160px)] overflow-auto p-6">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-right">
            <thead><tr><TableHead>نام مشاور</TableHead><TableHead>شماره موبایل</TableHead><TableHead>نوع</TableHead><TableHead>وضعیت</TableHead><TableHead>عملیات</TableHead></tr></thead>
            <tbody>{isLoading ? <TableLoadingRows columns={5} rows={5} /> : agents.length ? agents.map((agent) => {
              const status = Number(agent.consultant_status ?? agent.status);
              return (
                <tr key={getCrmRecordId(agent)}>
                  <TableCell><strong>{fullName(agent)}</strong></TableCell>
                  <TableCell><span dir="ltr">{readText(agent, ["mobile", "phone"], "-")}</span></TableCell>
                  <TableCell>{agent.type === "independent" ? "مستقل" : "وابسته"}</TableCell>
                  <TableCell><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status === 1 ? "bg-[#ebfaf3] text-[#0b8b55]" : status === 2 ? "bg-[#fff0f0] text-[#cc3342]" : "bg-[#fff7df] text-[#a06a00]"}`}>{status === 1 ? "تأیید شده" : status === 2 ? "رد شده" : "در انتظار"}</span></TableCell>
                  <TableCell>
                    <SmallActionButton
                      icon={<LinearEdit2 className="h-4 w-4" />}
                      label="ویرایش"
                      onClick={() => onEdit(agent)}
                      tone="primary"
                    />
                  </TableCell>
                </tr>
              );
            }) : <TableEmptyRow columns={5} message="مشاوری برای این آژانس ثبت نشده است." />}</tbody>
          </table>
        </div>
      </section>
    </ModalShell>
  );
}

function CategoriesView({ notify, refreshNonce }: ViewProps) {
  const queryClient = useQueryClient();
  const [editor, setEditor] = useState<EditorState | null>(null);

  const query = useQuery({
    queryFn: listCrmCategories,
    queryKey: ["crm", "categories", refreshNonce],
  });

  useQueryErrorToast([query.error], notify);

  const saveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmRecord }) =>
      saveCrmCategory(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "categories"] });
      notify("دسته‌بندی ذخیره شد.");
    },
  });

  const openCategoryEditor = (category: CrmRecord = {}) => {
    const id = getCrmRecordId(category) || null;
    const parent = category.parent_id;
    const parentId = parent && typeof parent === "object"
      ? getCrmRecordId(parent as CrmRecord)
      : stringifyValue(parent);

    setEditor({
      fields: [
        { label: "نام دسته‌بندی", name: "name", value: category.name },
        { label: "شناسه والد", name: "parent_id", value: parentId },
        { label: "کد", name: "code", value: category.code },
        { label: "نامک", name: "slug", value: category.slug },
      ],
      onSubmit: async (values) => {
        await saveMutation.mutateAsync({ id, payload: cleanEmptyValues(values) });
      },
      title: id ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید",
    });
  };

  return (
    <>
      <Panel>
        <PanelHeader
          subtitle="ساختار درختی دسته‌بندی‌ها را بدون تغییر سایر بخش‌های برنامه مدیریت کنید."
          title="درخت دسته‌بندی‌ها"
        />

        <div className="mt-5 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-4">
          {query.isLoading ? (
            <ListSkeleton count={7} />
          ) : query.data?.length ? (
            <CategoryTree categories={query.data} onEdit={openCategoryEditor} />
          ) : (
            <EmptyState description="هنوز دسته‌بندی‌ای ثبت نشده است." />
          )}
        </div>
      </Panel>

      <EditorModal editor={editor} isPending={saveMutation.isPending} onClose={() => setEditor(null)} notify={notify} />
    </>
  );
}

function CategoryTree({ categories, depth = 0, onEdit }: { categories: CrmRecord[]; depth?: number; onEdit: (category: CrmRecord) => void }) {
  return (
    <div className="space-y-2">
      {categories.map((category) => {
        const id = getCrmRecordId(category);
        const children = getCategoryChildren(category);

        return (
          <div key={id || `${getCategoryLabel(category)}-${depth}`}>
            <div
              className="flex min-h-14 items-center justify-between gap-3 rounded-xl border border-[#f0f0f0] bg-white px-4 transition hover:border-[#d9e2f2] hover:bg-[#fbfcff]"
              style={{ marginRight: depth * 24 }}
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]">
                  <CrmIcon name="category" size={18} />
                </span>
                <div className="min-w-0">
                  <strong className="block truncate text-sm text-[#1a1a1a]">{getCategoryLabel(category)}</strong>
                  <small className="mt-1 block truncate text-sm text-[#969eab]">
                    {readText(category, ["code", "slug"], id)}
                  </small>
                </div>
              </div>
              {/* <SmallActionButton label="ویرایش" onClick={() => onEdit(category)} /> */}
            </div>
            {children.length ? <div className="mt-2"><CategoryTree categories={children} depth={depth + 1} onEdit={onEdit} /></div> : null}
          </div>
        );
      })}
    </div>
  );
}

function LocationsView({ notify, refreshNonce }: ViewProps) {
  const queryClient = useQueryClient();
  const [citySearch, setCitySearch] = useState("");
  const cityFilter = citySearch.trim();
  const [cityId, setCityId] = useState("");
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const citiesQuery = useQuery({
    queryFn: () => listCrmCities({ query: cityFilter }),
    queryKey: ["crm", "cities", cityFilter, refreshNonce],
  });

  useEffect(() => {
    if (cityId || !citiesQuery.data?.length) return;
    setCityId(getCrmRecordId(citiesQuery.data[0]));
  }, [citiesQuery.data, cityId]);

  const neighborhoodsQuery = useQuery({
    enabled: Boolean(cityId),
    queryFn: () => listCrmNeighborhoods({ cityId }),
    queryKey: ["crm", "neighborhoods", cityId, refreshNonce],
  });

  useQueryErrorToast([citiesQuery.error, neighborhoodsQuery.error], notify);

  const citySaveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmRecord }) =>
      saveCrmCity(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "cities"] });
      notify("اطلاعات شهر ذخیره شد.");
    },
  });

  const cityDeleteMutation = useMutation({
    mutationFn: deleteCrmCity,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "cities"] });
      notify("شهر حذف شد.");
    },
  });

  const neighborhoodSaveMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string | null; payload: CrmRecord }) =>
      saveCrmNeighborhood(id, payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "neighborhoods"] });
      notify("اطلاعات محله ذخیره شد.");
    },
  });

  const neighborhoodDeleteMutation = useMutation({
    mutationFn: deleteCrmNeighborhood,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["crm", "neighborhoods"] });
      notify("محله حذف شد.");
    },
  });

  const openCityEditor = (city: CrmRecord = {}) => {
    const id = getCrmRecordId(city) || null;

    setEditor({
      fields: [
        { label: "نام شهر", name: "name", value: city.name },
        { label: "شناسه کشور", name: "country_id", value: city.country_id ?? DEFAULT_COUNTRY_ID },
        {
          label: "موقعیت شهر روی نقشه",
          name: "location",
          type: "map-point",
          value: stringifyValue({
            lat: Number(city.lat) || 36.2605,
            lng: Number(city.lng) || 59.6168,
          }),
        },
      ],
      onSubmit: async (values) => {
        const { location, ...cityValues } = values;
        const point = parseMapPointValue(location);

        await citySaveMutation.mutateAsync({
          id,
          payload: cleanEmptyValues({
            ...cityValues,
            lat: point.lat,
            lng: point.lng,
          }),
        });
      },
      title: id ? "ویرایش شهر" : "ثبت شهر جدید",
    });
  };

  const openNeighborhoodEditor = (neighborhood: CrmRecord = {}) => {
    const id = getCrmRecordId(neighborhood) || null;

    setEditor({
      fields: [
        { label: "نام محله", name: "name", value: neighborhood.name },
        { label: "شناسه شهر", name: "city_id", value: neighborhood.city_id ?? cityId },
        { label: "عرض جغرافیایی", name: "lat", type: "number", value: neighborhood.lat ?? DEFAULT_CENTER[0] },
        { label: "طول جغرافیایی", name: "lng", type: "number", value: neighborhood.lng ?? DEFAULT_CENTER[1] },
        { label: "محدوده جغرافیایی", name: "polygon", type: "geofence", value: stringifyValue(neighborhood.polygon) },
      ],
      onSubmit: async (values) => {
        const polygon = values.polygon
          ? parseJsonValue(values.polygon, "محدوده جغرافیایی", undefined)
          : undefined;
        await neighborhoodSaveMutation.mutateAsync({
          id,
          payload: cleanEmptyValues({
            ...values,
            lat: values.lat ? Number(values.lat) : undefined,
            lng: values.lng ? Number(values.lng) : undefined,
            polygon,
          }),
        });
      },
      title: id ? "ویرایش محله" : "ثبت محله جدید",
    });
  };

  const handleDeleteCity = async (id: string) => {
    await cityDeleteMutation.mutateAsync(id);
    if (cityId === id) setCityId("");
  };

  const handleDeleteNeighborhood = (id: string) =>
    neighborhoodDeleteMutation.mutateAsync(id);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
        <Panel>
          <PanelHeader
            action={<PrimaryButton icon="plus" label="شهر جدید" onClick={() => openCityEditor()} />}
            subtitle="فهرست شهرهای قابل استفاده در جستجو و ثبت آگهی"
            title="شهرها"
          />
          <form
            className="mt-4 flex items-end gap-2 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3"
            onSubmit={(event) => event.preventDefault()}
          >
            <FilterField className="flex-1" label="جستجوی شهر">
              <input className={inputClassName} onChange={(event) => setCitySearch(event.target.value)} placeholder="نام شهر" value={citySearch} />
            </FilterField>
          </form>

          <div className="mt-4 max-h-[calc(100vh-320px)] overflow-auto rounded-xl border border-[#f0f0f0]">
            <table className="w-full min-w-[620px] border-separate border-spacing-0 text-right">
              <thead>
                <tr className="text-sm font-bold text-[#4d4d4d]">
                  <TableHead>نام</TableHead>
                  <TableHead>کد</TableHead>
                  <TableHead>موقعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </tr>
              </thead>
              <tbody>
                {citiesQuery.isLoading ? (
                  <TableLoadingRows columns={4} rows={6} />
                ) : citiesQuery.data?.length ? (
                  citiesQuery.data.map((city) => {
                    const id = getCrmRecordId(city);
                    const selected = cityId === id;

                    return (
                      <tr className={selected ? "bg-[#f6f9ff]" : ""} key={id}>
                        <TableCell>
                          <button className={`text-sm font-bold ${selected ? "text-[#0048c4]" : "text-[#1a1a1a]"}`} onClick={() => setCityId(id)} type="button">
                            {readText(city, ["name"])}
                          </button>
                          <small className="mt-1 block max-w-[140px] truncate text-sm text-[#9aa2af]">{id}</small>
                        </TableCell>
                        <TableCell>{readText(city, ["code"])}</TableCell>
                        <TableCell><span className="text-sm" dir="ltr">{readText(city, ["lat"])}, {readText(city, ["lng"])}</span></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <SmallActionButton label="ویرایش" onClick={() => openCityEditor(city)} />
                            <SmallActionButton
                              label="حذف"
                              onClick={() => setConfirm({
                                body: "با حذف شهر ممکن است محله‌های وابسته قابل استفاده نباشند.",
                                confirmLabel: "حذف شهر",
                                onConfirm: () => handleDeleteCity(id),
                                title: "حذف شهر",
                              })}
                              tone="danger"
                            />
                          </div>
                        </TableCell>
                      </tr>
                    );
                  })
                ) : (
                  <TableEmptyRow columns={4} message="شهری پیدا نشد." />
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <PanelHeader
            action={<PrimaryButton disabled={!cityId} icon="plus" label="محله جدید" onClick={() => openNeighborhoodEditor()} />}
            subtitle={cityId ? "محله‌های شهر انتخاب‌شده و محدوده جغرافیایی آن‌ها" : "ابتدا یک شهر را انتخاب کنید."}
            title="محله‌ها"
          />

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#f0f0f0] bg-[#fafafa] p-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef4ff] text-[#0048c4]"><CrmIcon name="location" size={20} /></span>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-sm font-bold text-[#4f5a6c]">شناسه شهر انتخاب‌شده</p>
              <p className="m-0 mt-1 truncate text-sm text-[#9098a6]" dir="ltr">{cityId || "-"}</p>
            </div>
          </div>

          <div className="mt-4 max-h-[calc(100vh-320px)] overflow-auto rounded-xl border border-[#f0f0f0]">
            <table className="w-full min-w-[620px] border-separate border-spacing-0 text-right">
              <thead>
                <tr className="text-sm font-bold text-[#4d4d4d]">
                  <TableHead>نام</TableHead>
                  <TableHead>شناسه شهر</TableHead>
                  <TableHead>موقعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </tr>
              </thead>
              <tbody>
                {!cityId ? (
                  <TableEmptyRow columns={4} message="برای مشاهده محله‌ها یک شهر انتخاب کنید." />
                ) : neighborhoodsQuery.isLoading ? (
                  <TableLoadingRows columns={4} rows={6} />
                ) : neighborhoodsQuery.data?.length ? (
                  neighborhoodsQuery.data.map((neighborhood) => {
                    const id = getCrmRecordId(neighborhood);

                    return (
                      <tr key={id}>
                        <TableCell>
                          <span className="font-bold text-[#1a1a1a]">{readText(neighborhood, ["name"])}</span>
                          <small className="mt-1 block max-w-[140px] truncate text-sm text-[#9aa2af]">{id}</small>
                        </TableCell>
                        <TableCell><span className="block max-w-[130px] truncate text-sm" dir="ltr">{readText(neighborhood, ["city_id"], cityId)}</span></TableCell>
                        <TableCell><span className="text-sm" dir="ltr">{readText(neighborhood, ["lat"])}, {readText(neighborhood, ["lng"])}</span></TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <SmallActionButton label="ویرایش" onClick={() => openNeighborhoodEditor(neighborhood)} />
                            <SmallActionButton
                              label="حذف"
                              onClick={() => setConfirm({
                                body: "این محله و محدوده جغرافیایی ثبت‌شده آن حذف می‌شود.",
                                confirmLabel: "حذف محله",
                                onConfirm: async () => { await handleDeleteNeighborhood(id); },
                                title: "حذف محله",
                              })}
                              tone="danger"
                            />
                          </div>
                        </TableCell>
                      </tr>
                    );
                  })
                ) : (
                  <TableEmptyRow columns={4} message="برای این شهر محله‌ای ثبت نشده است." />
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <EditorModal
        editor={editor}
        isPending={citySaveMutation.isPending || neighborhoodSaveMutation.isPending}
        onClose={() => setEditor(null)}
        notify={notify}
        wide
      />
      <ConfirmModal confirm={confirm} onClose={() => setConfirm(null)} notify={notify} />
    </>
  );
}

function AdvertiseFormsView({ notify, refreshNonce }: ViewProps) {
  const [selectedForm, setSelectedForm] = useState("");
  const query = useQuery({
    queryFn: listCrmAdvertiseForms,
    queryKey: ["crm", "forms", refreshNonce],
  });

  useQueryErrorToast([query.error], notify);

  const forms = useMemo(() => {
    if (!selectedForm) return query.data ?? [];
    return (query.data ?? []).filter((form) => readText(form, ["code"], "") === selectedForm);
  }, [query.data, selectedForm]);

  return (
    <Panel>
      <PanelHeader
        action={
          <select
            className="h-10 min-w-[240px] rounded-xl border border-[#dce3ef] bg-white px-3 text-sm text-[#384457] outline-none transition focus:border-[#0048c4]"
            onChange={(event) => setSelectedForm(event.target.value)}
            value={selectedForm}
          >
            <option value="">همه فرم‌ها</option>
            {(query.data ?? []).map((form) => {
              const code = readText(form, ["code"], getCrmRecordId(form));
              return <option key={code} value={code}>{readText(form, ["title"], code)}</option>;
            })}
          </select>
        }
        subtitle="این بخش فقط ساختار فرم‌های عمومی ثبت آگهی را نمایش می‌دهد."
        title="تعریف فرم‌های آگهی"
      />

      <div className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-4">
        {query.isLoading ? (
          Array.from({ length: 4 }).map((_, index) => <FormCardSkeleton key={index} />)
        ) : forms.length ? (
          forms.map((form) => <AdvertiseFormCard form={form} key={readText(form, ["code"], getCrmRecordId(form))} />)
        ) : (
          <div className="col-span-full"><EmptyState description="فرم آگهی‌ای برای نمایش پیدا نشد." /></div>
        )}
      </div>
    </Panel>
  );
}

function AdvertiseFormCard({ form }: { form: CrmRecord }) {
  const fields = readArray(form, "fields") as CrmRecord[];

  return (
    <article className="overflow-hidden rounded-xl border border-[#f0f0f0] bg-white">
      <header className="flex items-start justify-between gap-3 border-b border-[#f0f0f0] bg-[#fafafa] p-4">
        <div className="min-w-0">
          <h3 className="m-0 truncate text-sm font-bold text-[#1a1a1a]">{readText(form, ["title", "code"])}</h3>
          <p className="m-0 mt-1 text-sm text-[#9098a6]">
            {readText(form, ["code"])} · {readText(form, ["group"])}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#eef4ff] px-2.5 py-1 text-sm font-bold text-[#0048c4]">
          {new Intl.NumberFormat("fa-IR").format(fields.length)} فیلد
        </span>
      </header>
      <div className="max-h-[420px] divide-y divide-[#edf0f5] overflow-y-auto px-4">
        {fields.map((field, index) => {
          const options = readArray(field, "options") as CrmRecord[];

          return (
            <div className="py-3" key={`${readText(field, ["key"], String(index))}-${index}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <code className="block truncate text-sm font-bold text-[#0048c4]">{readText(field, ["key"])}</code>
                  <span className="mt-1 block truncate text-sm text-[#596477]">{readText(field, ["label"])}</span>
                </div>
                <div className="flex shrink-0 flex-wrap justify-end gap-1">
                  <FieldMeta>{readText(field, ["type"])}</FieldMeta>
                  {field.unit ? <FieldMeta>{stringifyValue(field.unit)}</FieldMeta> : null}
                  {field.searchable ? <FieldMeta>قابل جستجو</FieldMeta> : null}
                  {field.required ? <FieldMeta>الزامی</FieldMeta> : null}
                </div>
              </div>
              {options.length ? (
                <p className="m-0 mt-2 line-clamp-2 text-sm leading-5 text-[#929aa8]">
                  گزینه‌ها: {options.slice(0, 10).map((option) => readText(option, ["label", "value"])).join("، ")}
                  {options.length > 10 ? " ..." : ""}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </article>
  );
}

function EditorModal({
  editor,
  isPending,
  notify,
  onClose,
  wide = false,
}: {
  editor: EditorState | null;
  isPending: boolean;
  notify: ViewProps["notify"];
  onClose: () => void;
  wide?: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!editor) {
      setValues({});
      return;
    }

    setValues(
      Object.fromEntries(
        editor.fields.map((field) => [
          field.name,
          (field.type === "checklist" || field.type === "neighborhood-multi") && Array.isArray(field.value)
            ? field.value.map((item) => String(item)).join(",")
            : stringifyValue(field.value),
        ]),
      ),
    );
  }, [editor]);

  if (!editor) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await editor.onSubmit(values);
      onClose();
    } catch (error) {
      notify(getApiErrorMessage(error, error instanceof Error ? error.message : "ذخیره اطلاعات ناموفق بود."), "error");
    }
  };

  return (
    <ModalShell onClose={isPending ? undefined : onClose}>
      <form
        className={`max-h-[calc(100vh-64px)] overflow-hidden rounded-xl bg-white shadow-[0_24px_70px_rgba(14,34,68,0.18)] ${
          wide ? "w-[min(960px,calc(100vw-64px))]" : "w-[min(760px,calc(100vw-64px))]"
        }`}
        onSubmit={submit}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#f0f0f0] px-6">
          <div>
            <h2 className="m-0 text-base font-bold text-[#1a1a1a]">{editor.title}</h2>
            <p className="m-0 mt-1 text-sm text-[#919aa8]">فیلدهای لازم را تکمیل و سپس ذخیره کنید.</p>
          </div>
          <button
            aria-label="بستن"
            className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f5f8] text-[#596477] transition hover:bg-[#e9edf3]"
            disabled={isPending}
            onClick={onClose}
            type="button"
          >
            <CrmIcon name="close" size={18} />
          </button>
        </div>

        <div className="max-h-[calc(100vh-208px)] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            {editor.fields.map((field) => {
              const value = values[field.name] ?? "";

              if (field.type === "map-point") {
                return (
                  <div className="col-span-2" key={field.name}>
                    <label className="mb-2 block text-sm font-bold text-[#4d4d4d]">{field.label}</label>
                    <CityPointEditor
                      onChange={(point) => {
                        setValues((current) => ({
                          ...current,
                          [field.name]: JSON.stringify(point),
                        }));
                      }}
                      value={value}
                    />
                  </div>
                );
              }

              if (field.type === "neighborhood-multi") {
                return (
                  <div className="col-span-2" key={field.name}>
                    <label className="mb-2 block text-sm font-bold text-[#4f5a6c]">{field.label}</label>
                    <CrmNeighborhoodMultiField
                      onChange={(ids) => setValues((current) => ({ ...current, [field.name]: ids.join(",") }))}
                      value={value}
                    />
                  </div>
                );
              }

              if (field.type === "geofence") {
                return (
                  <div className="col-span-2" key={field.name}>
                    <label className="mb-2 block text-sm font-bold text-[#4f5a6c]">{field.label}</label>
                    <NeighborhoodPolygonEditor
                      lat={Number(values.lat) || DEFAULT_CENTER[0]}
                      lng={Number(values.lng) || DEFAULT_CENTER[1]}
                      onChange={({ lat, lng, polygon }) => {
                        setValues((current) => ({
                          ...current,
                          lat: String(lat),
                          lng: String(lng),
                          [field.name]: polygon,
                        }));
                      }}
                      value={value}
                    />
                  </div>
                );
              }

              if (field.type === "checklist") {
                const selectedValues = value.split(",").map((item) => item.trim()).filter(Boolean);

                return (
                  <fieldset className="col-span-2" key={field.name}>
                    <legend className="mb-2 block text-sm font-bold text-[#4f5a6c]">{field.label}</legend>
                    <p className="m-0 mb-3 text-xs leading-5 text-[#8b94a3]">
                      هر نقش مستقل است و می‌توانید بیش از یک مورد را برای کاربر فعال کنید.
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {(field.options ?? []).map((option) => {
                        const isChecked = selectedValues.includes(option.value);

                        return (
                          <label
                            className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                              isChecked
                                ? "border-[#0048c4] bg-[#f2f6ff] text-[#0048c4]"
                                : "border-[#d9d9d9] bg-white text-[#333333] hover:border-[#b9c7dd]"
                            }`}
                            key={option.value}
                          >
                            <input
                              checked={isChecked}
                              className="h-4 w-4 shrink-0 accent-[#0048c4]"
                              name={field.name}
                              onChange={() => {
                                const nextValues = isChecked
                                  ? selectedValues.filter((item) => item !== option.value)
                                  : [...selectedValues, option.value];

                                setValues((current) => ({
                                  ...current,
                                  [field.name]: nextValues.join(","),
                                }));
                              }}
                              type="checkbox"
                              value={option.value}
                            />
                            <span className="text-sm font-bold">{option.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                );
              }

              const isWide = field.type === "textarea";

              return (
                <label className={isWide ? "col-span-2" : ""} key={field.name}>
                  <span className="mb-2 block text-sm font-bold text-[#4f5a6c]">{field.label}</span>
                  {field.type === "select" ? (
                    <CrmSelect
                      className={modalInputClassName}
                      name={field.name}
                      onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                      value={value}
                    >
                      {(field.options ?? []).map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </CrmSelect>
                  ) : field.type === "textarea" ? (
                    <textarea
                      className={`${modalInputClassName} min-h-24 resize-y py-3`}
                      dir={field.label.includes("JSON") ? "ltr" : "rtl"}
                      name={field.name}
                      onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                      rows={4}
                      value={value}
                    />
                  ) : (
                    <input
                      className={modalInputClassName}
                      dir={field.type === "number" || field.type === "email" ? "ltr" : "rtl"}
                      name={field.name}
                      onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
                      step={field.type === "number" ? "any" : undefined}
                      type={field.type ?? "text"}
                      value={value}
                    />
                  )}
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex h-20 items-center justify-end gap-3 border-t border-[#f0f0f0] px-6">
          <button className={ghostButtonClassName} disabled={isPending} onClick={onClose} type="button">انصراف</button>
          <button className={primaryButtonClassName} disabled={isPending} type="submit">
            {isPending ? <LoadingSpinner /> : <CrmIcon name="save" size={18} />}
            {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

function ConfirmModal({
  confirm,
  notify,
  onClose,
}: {
  confirm: ConfirmState | null;
  notify: ViewProps["notify"];
  onClose: () => void;
}) {
  const [isPending, setIsPending] = useState(false);
  const [promptValue, setPromptValue] = useState("");

  useEffect(() => {
    if (!confirm) {
      setIsPending(false);
      setPromptValue("");
    }
  }, [confirm]);

  if (!confirm) return null;

  const trimmedPromptValue = promptValue.trim();
  const isPromptInvalid = Boolean(confirm.prompt?.required && !trimmedPromptValue);

  const handleConfirm = async () => {
    if (isPromptInvalid) {
      notify("لطفاً دلیل را وارد کنید.", "error");
      return;
    }

    setIsPending(true);

    try {
      await confirm.onConfirm(confirm.prompt ? trimmedPromptValue : undefined);
      onClose();
    } catch (error) {
      notify(getApiErrorMessage(error, "انجام عملیات ناموفق بود."), "error");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <ModalShell onClose={isPending ? undefined : onClose}>
      <section className="w-[min(440px,calc(100vw-40px))] rounded-xl bg-white p-6 shadow-[0_24px_70px_rgba(14,34,68,0.18)]" dir="rtl">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0f0] text-[#d62f3e]">
          <CrmIcon name="warning" size={24} />
        </div>
        <h2 className="m-0 mt-4 text-base font-bold text-[#1a1a1a]">{confirm.title}</h2>
        <p className="m-0 mt-2 text-sm leading-7 text-[#707a8a]">{confirm.body}</p>
        {confirm.prompt ? (
          <label className="mt-4 block">
            <span className="mb-2 block text-sm font-bold text-[#4f5a6c]">{confirm.prompt.label}</span>
            <textarea
              className={`${modalInputClassName} min-h-28 resize-y py-3`}
              disabled={isPending}
              onChange={(event) => setPromptValue(event.target.value)}
              placeholder={confirm.prompt.placeholder}
              value={promptValue}
            />
          </label>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <button className={ghostButtonClassName} disabled={isPending} onClick={onClose} type="button">انصراف</button>
          <button className={dangerButtonClassName} disabled={isPending || isPromptInvalid} onClick={handleConfirm} type="button">
            {isPending ? <LoadingSpinner /> : null}
            {isPending ? "در حال انجام..." : confirm.confirmLabel ?? "تأیید"}
          </button>
        </div>
      </section>
    </ModalShell>
  );
}

function CityPointEditor({
  onChange,
  value,
}: {
  onChange: (value: { lat: number; lng: number }) => void;
  value: string;
}) {
  const initialPoint = useMemo(() => parseMapPointValue(value), [value]);
  const [point, setPoint] = useState<LatLngTuple>([initialPoint.lat, initialPoint.lng]);

  useEffect(() => {
    setPoint([initialPoint.lat, initialPoint.lng]);
  }, [initialPoint.lat, initialPoint.lng]);

  const selectPoint = (nextPoint: LatLngTuple) => {
    const normalized = {
      lat: Number(nextPoint[0].toFixed(7)),
      lng: Number(nextPoint[1].toFixed(7)),
    };

    setPoint([normalized.lat, normalized.lng]);
    onChange(normalized);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[#cccccc] bg-white">
      <div className="border-b border-[#e5e5e5] bg-[#fafafa] px-4 py-3">
        <p className="m-0 text-sm leading-6 text-[#4d4d4d]">
          نقشه را جابه‌جا کنید تا نشانگر روی موقعیت دقیق آژانس قرار بگیرد.
        </p>
      </div>
      <div className="relative h-[340px] w-full overflow-hidden">
        <MapContainer attributionControl={false} center={point} className="h-full w-full" scrollWheelZoom zoom={15} zoomControl={false}>
          <TileLayer
            attribution={searchMapTileConfig.attribution}
            tms={searchMapTileConfig.isTms}
            url={searchMapTileConfig.urlTemplate}
          />
          <MapCenterCollector onSelect={selectPoint} />
        </MapContainer>
        <span className="pointer-events-none absolute left-1/2 top-1/2 z-[500] -translate-x-1/2 -translate-y-full"><MapPickerPinIcon /></span>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-[#e5e5e5] px-4 py-3 text-sm">
        <span className="font-medium text-[#4d4d4d]">مختصات انتخاب‌شده</span>
        <strong className="font-mono text-[#0048c4]" dir="ltr">
          {point[0].toFixed(6)}, {point[1].toFixed(6)}
        </strong>
      </div>
    </div>
  );
}

function CrmNeighborhoodMultiField({ onChange, value }: { onChange: (ids: string[]) => void; value: string }) {
  const [query, setQuery] = useState("");
  const cityId = readStoredSelectedCity()?.id ?? "";
  const selectedIds = value.split(",").map((item) => item.trim()).filter(Boolean);
  const neighborhoodsQuery = useNeighborhoodListQuery({ cityId, enabled: Boolean(cityId), perPage: 50, q: query });

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]);
  };

  return (
    <div className="rounded-xl border border-[#d7dce5] bg-white p-3">
      <input
        className={modalInputClassName}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="جستجوی محله..."
        value={query}
      />
      {!cityId ? <p className="m-0 mt-2 text-xs text-[#cc3342]">ابتدا شهر را در سایت انتخاب کنید.</p> : null}
      {selectedIds.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedIds.map((id) => {
            const neighborhood = neighborhoodsQuery.data?.find((item) => String(item.id ?? item._id) === id);
            return <button className="rounded-lg bg-[#eef4ff] px-2.5 py-1.5 text-xs font-bold text-[#0048c4]" key={id} onClick={() => toggle(id)} type="button">{neighborhood?.name ?? id} ×</button>;
          })}
        </div>
      ) : null}
      <div className="mt-3 max-h-56 space-y-1 overflow-y-auto">
        {neighborhoodsQuery.isLoading ? <p className="px-2 text-sm text-[#7b8494]">در حال جستجو...</p> : neighborhoodsQuery.data?.map((neighborhood) => {
          const id = String(neighborhood.id ?? neighborhood._id ?? "");
          const checked = selectedIds.includes(id);
          return (
            <button aria-pressed={checked} className={`flex h-14 w-full items-center justify-between gap-3 rounded-[10px] px-2 text-right text-base transition-colors active:bg-[#0048c40a] ${checked ? "text-[#0048c4]" : "text-[#1a1a1a] hover:bg-[#f5f7fa]"}`} key={id} onClick={() => toggle(id)} type="button">
              <span className="min-w-0 flex-1 truncate">{neighborhood.name}</span><SelectionCheckIndicator checked={checked} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MapCenterCollector({ onSelect }: { onSelect: (point: LatLngTuple) => void }) {
  useMapEvents({
    moveend(event) {
      const center = event.target.getCenter();
      onSelect([center.lat, center.lng]);
    },
  });

  return null;
}

function MapPickerPinIcon() {
  return <svg aria-hidden="true" className="h-[42px] w-[31px] drop-shadow-[0_8px_14px_rgba(26,26,26,0.18)]" fill="none" viewBox="0 0 31 42"><ellipse cx="15" cy="40.5" fill="#1A1A1A" fillOpacity=".12" rx="6" ry="1.5"/><path d="M20.738 30.061C26.721 27.916 31 22.199 31 15.484 31 6.932 24.06 0 15.5 0S0 6.932 0 15.484c0 6.715 4.279 12.431 10.261 14.577 2.136.868 3.947 2.591 3.947 4.778v3.87a1.292 1.292 0 0 0 2.584 0v-3.87c0-2.187 1.811-3.91 3.946-4.778Z" fill="#11A366"/><circle cx="15.5" cy="15" r="6" fill="white"/></svg>;
}

function parseMapPointValue(value: string) {
  try {
    const point = JSON.parse(value) as { lat?: unknown; lng?: unknown };
    const lat = Number(point.lat);
    const lng = Number(point.lng);

    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
  } catch {
    // Fall back to the application's default map center.
  }

  return { lat: DEFAULT_CENTER[0], lng: DEFAULT_CENTER[1] };
}

function NeighborhoodPolygonEditor({
  lat,
  lng,
  onChange,
  value,
}: {
  lat: number;
  lng: number;
  onChange: (value: { lat: number; lng: number; polygon: string }) => void;
  value: string;
}) {
  const initialPoints = useMemo(() => polygonStringToPoints(value), [value]);
  const [points, setPoints] = useState<LatLngTuple[]>(initialPoints);

  useEffect(() => {
    setPoints(initialPoints);
  }, [initialPoints]);

  const updatePoints = (nextPoints: LatLngTuple[]) => {
    setPoints(nextPoints);

    const coordinateTotals = nextPoints.reduce(
          (sum, point) => [sum[0] + point[0], sum[1] + point[1]] as LatLngTuple,
          [0, 0] as LatLngTuple,
        );
    const center: LatLngTuple = nextPoints.length
      ? [coordinateTotals[0] / nextPoints.length, coordinateTotals[1] / nextPoints.length]
      : [lat, lng];

    onChange({
      lat: Number(center[0].toFixed(7)),
      lng: Number(center[1].toFixed(7)),
      polygon: pointsToPolygonString(nextPoints),
    });
  };

  const center: LatLngTuple = points[0] ?? [lat, lng];

  return (
    <div className="overflow-hidden rounded-2xl border border-[#dce3ef] bg-[#f8faff]">
      <div className="flex items-center justify-between gap-3 border-b border-[#dce3ef] px-4 py-3">
        <p className="m-0 text-sm leading-5 text-[#4d4d4d]">
          برای ساخت محدوده، روی نقشه کلیک کنید. با حداقل سه نقطه یک چندضلعی ساخته می‌شود.
        </p>
        <div className="flex shrink-0 gap-2">
          <button className={miniGhostButtonClassName} disabled={!points.length} onClick={() => updatePoints(points.slice(0, -1))} type="button">حذف آخرین نقطه</button>
          <button className={miniGhostButtonClassName} disabled={!points.length} onClick={() => updatePoints([])} type="button">پاک کردن</button>
        </div>
      </div>
      <div className="h-[320px] w-full overflow-hidden">
        <MapContainer center={center} className="h-full w-full" scrollWheelZoom zoom={13}>
          <TileLayer
            attribution={searchMapTileConfig.attribution}
            tms={searchMapTileConfig.isTms}
            url={searchMapTileConfig.urlTemplate}
          />
          <PolygonClickCollector onAdd={(point) => updatePoints([...points, point])} />
          {points.length >= 3 ? <Polygon pathOptions={{ color: CRM_BLUE, fillOpacity: 0.18, weight: 2 }} positions={points} /> : null}
          {points.map((point, index) => (
            <CircleMarker center={point} key={`${point[0]}-${point[1]}-${index}`} pathOptions={{ color: CRM_BLUE, fillColor: "white", fillOpacity: 1, weight: 2 }} radius={5} />
          ))}
        </MapContainer>
      </div>
      <textarea className="block min-h-20 w-full resize-y border-0 border-t border-[#dce3ef] bg-white p-3 font-mono text-sm leading-5 text-[#596477] outline-none" dir="ltr" readOnly value={pointsToPolygonString(points)} />
    </div>
  );
}

function PolygonClickCollector({ onAdd }: { onAdd: (point: LatLngTuple) => void }) {
  useMapEvents({
    click(event) {
      onAdd([event.latlng.lat, event.latlng.lng]);
    },
  });

  return null;
}

function polygonStringToPoints(value: string): LatLngTuple[] {
  if (!value.trim()) return [];

  try {
    const polygon = JSON.parse(value) as { coordinates?: unknown };
    const coordinates = Array.isArray(polygon.coordinates) ? polygon.coordinates : [];
    const firstRing = Array.isArray(coordinates[0]) ? coordinates[0] : [];
    const points = firstRing
      .map((coordinate) => {
        if (!Array.isArray(coordinate) || coordinate.length < 2) return null;
        const longitude = Number(coordinate[0]);
        const latitude = Number(coordinate[1]);
        return Number.isFinite(latitude) && Number.isFinite(longitude)
          ? ([latitude, longitude] as LatLngTuple)
          : null;
      })
      .filter((point): point is LatLngTuple => point !== null);

    if (points.length > 1) {
      const first = points[0];
      const last = points[points.length - 1];
      if (first[0] === last[0] && first[1] === last[1]) points.pop();
    }

    return points;
  } catch {
    return [];
  }
}

function pointsToPolygonString(points: LatLngTuple[]) {
  if (points.length < 3) return "";

  const coordinates = points.map(([latitude, longitude]) => [longitude, latitude]);
  coordinates.push([...coordinates[0]]);

  return JSON.stringify({ type: "Polygon", coordinates: [coordinates] }, null, 2);
}

function ModalShell({ children, onClose }: { children: ReactNode; onClose?: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[80] grid place-items-center bg-[#1a1a1a]/35 p-8 backdrop-blur-[2px]"
      onMouseDown={() => onClose?.()}
    >
      <div onMouseDown={(event) => event.stopPropagation()}>{children}</div>
    </div>
  );
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl bg-white p-6 ${className}`}>
      {children}
    </section>
  );
}

function PanelHeader({
  action,
  subtitle,
  title,
}: {
  action?: ReactNode;
  subtitle?: string;
  title: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="m-0 text-base font-semibold leading-7 text-[#1a1a1a]">{title}</h2>
        {subtitle ? <p className="m-0 mt-1 text-sm font-normal leading-6 text-[#808080]">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

function FilterField({ children, className = "", label }: { children: ReactNode; className?: string; label: string }) {
  return (
    <label className={`min-w-[190px] ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-[#4d4d4d]">{label}</span>
      {children}
    </label>
  );
}

function TableHead({ children }: { children: ReactNode }) {
  return <th className="border-b border-[#e5e5e5] bg-[#fafafa] px-4 py-3.5 text-right text-sm font-semibold text-[#4d4d4d] first:rounded-r-xl last:rounded-l-xl">{children}</th>;
}

function TableCell({ children }: { children: ReactNode }) {
  return <td className="border-b border-[#f0f0f0] px-4 py-4 align-middle text-sm text-[#4d4d4d]">{children}</td>;
}

function TableLoadingRows({ columns, rows }: { columns: number; rows: number }) {
  return Array.from({ length: rows }).map((_, rowIndex) => (
    <tr key={rowIndex}>
      {Array.from({ length: columns }).map((__, columnIndex) => (
        <td className="border-b border-[#edf0f5] px-3 py-4" key={columnIndex}>
          <span className="block h-4 animate-pulse rounded-full bg-[#edf0f4]" style={{ width: `${58 + ((rowIndex + columnIndex) % 4) * 9}%` }} />
        </td>
      ))}
    </tr>
  ));
}

function TableEmptyRow({ columns, message }: { columns: number; message: string }) {
  return (
    <tr>
      <td className="py-14 text-center text-sm text-[#8f98a6]" colSpan={columns}>{message}</td>
    </tr>
  );
}

function StatusBadge({ status }: { status: unknown }) {
  const key = String(status ?? "");
  const tone = key === "3" || key === "1"
    ? key === "3" ? "bg-[#ebfaf3] text-[#0b8b55]" : "bg-[#fff7df] text-[#a06a00]"
    : key === "0"
      ? "bg-[#eef4ff] text-[#0048c4]"
      : "bg-[#fff0f0] text-[#cc3342]";

  return <span className={`inline-flex min-w-[82px] justify-center rounded-full px-2.5 py-1.5 text-sm font-bold ${tone}`}>{advertiseStatusLabel(status)}</span>;
}

function normalizeAgencyStatus(status: unknown): "wait" | "accept" | "reject" {
  const normalized = String(status ?? "").trim().toLowerCase();

  if (normalized === "accept" || normalized === "accepted" || normalized === "approved") {
    return "accept";
  }

  if (normalized === "reject" || normalized === "rejected" || normalized === "denied") {
    return "reject";
  }

  return "wait";
}

function agencyStatusTextTone(status: unknown) {
  const normalized = normalizeAgencyStatus(status);
  if (normalized === "accept") return "text-[#0b8b55]";
  if (normalized === "reject") return "text-[#cc3342]";
  return "text-[#303030]";
}

function UserStatusBadge({ status }: { status: unknown }) {
  const isActive = Number(status) === 1;
  return (
    <span className={`inline-flex min-w-[78px] justify-center rounded-full px-2.5 py-1.5 text-sm font-bold ${isActive ? "bg-[#ebfaf3] text-[#0b8b55]" : "bg-[#fff0f0] text-[#cc3342]"}`}>
      {isActive ? "فعال" : "غیرفعال"}
    </span>
  );
}

function PrimaryButton({
  disabled = false,
  icon,
  label,
  onClick,
}: {
  disabled?: boolean;
  icon: IconName;
  label: string;
  onClick: () => void;
}) {
  return (
    <button className={primaryButtonClassName} disabled={disabled} onClick={onClick} type="button">
      <CrmIcon name={icon} size={18} />
      {label}
    </button>
  );
}

function SmallActionButton({
  disabled = false,
  icon,
  label,
  onClick,
  tone = "default",
}: {
  disabled?: boolean;
  icon?: ReactNode;
  label: string;
  onClick: () => void;
  tone?: "danger" | "default" | "primary" | "success" | "warning";
}) {
  const classes = {
    danger: "border-[#f1c7cc] bg-[#fff7f8] text-[#c63242] hover:bg-[#fff0f1]",
    default: "border-[#d8e1ef] bg-white text-[#3e5d88] hover:border-[#b8c9e2] hover:bg-[#f8faff]",
    primary: "border-[#c9daf8] bg-[#eef4ff] text-[#0048c4] hover:border-[#0048c4] hover:bg-[#e3edff]",
    success: "border-[#bfe6d2] bg-[#f5fcf8] text-[#087d4b] hover:bg-[#ebfaf3]",
    warning: "border-[#f0ddb1] bg-[#fffaf0] text-[#9b6800] hover:bg-[#fff5da]",
  }[tone];

  return (
    <button
      className={`inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border px-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${classes}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon}{label}
    </button>
  );
}

function CrmSelect({ children, className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block w-full">
      <select className={`${className} appearance-none pl-10`} {...props}>
        {children}
      </select>
      <span className="pointer-events-none absolute left-3 top-1/2 grid -translate-y-1/2 place-items-center text-[#687386]" aria-hidden="true">
        <svg fill="none" height="16" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="16">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </span>
  );
}

function TextLink({ label, to }: { label: string; to: string }) {
  return (
    <RouteLink className="inline-flex items-center gap-1 text-sm font-bold text-[#0048c4] no-underline" to={to}>
      {label}
      <CrmIcon name="arrow" size={15} />
    </RouteLink>
  );
}

function FieldMeta({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-[#f0f2f6] px-2 py-1 text-sm font-medium text-[#6d7788]">{children}</span>;
}

function EmptyState({ compact = false, description }: { compact?: boolean; description: string }) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-8" : "py-14"}`}>
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef4ff] text-[#0048c4]"><CrmIcon name="empty" size={24} /></span>
      <p className="m-0 mt-3 text-sm font-medium text-[#8992a1]">{description}</p>
    </div>
  );
}

function ListSkeleton({ count }: { count: number }) {
  return (
    <div className="divide-y divide-[#edf0f5]">
      {Array.from({ length: count }).map((_, index) => (
        <div className="flex items-center justify-between gap-4 py-4" key={index}>
          <div className="flex-1 space-y-2">
            <span className="block h-4 w-2/5 animate-pulse rounded-full bg-[#edf0f4]" />
            <span className="block h-3 w-1/4 animate-pulse rounded-full bg-[#f1f3f6]" />
          </div>
          <span className="block h-7 w-20 animate-pulse rounded-full bg-[#edf0f4]" />
        </div>
      ))}
    </div>
  );
}

function FormCardSkeleton() {
  return (
    <div className="h-[320px] animate-pulse rounded-xl border border-[#f0f0f0] bg-white p-4">
      <div className="h-5 w-2/5 rounded-full bg-[#edf0f4]" />
      <div className="mt-3 h-3 w-1/4 rounded-full bg-[#f1f3f6]" />
      <div className="mt-7 space-y-4">
        {Array.from({ length: 6 }).map((_, index) => <div className="h-10 rounded-xl bg-[#f1f3f6]" key={index} />)}
      </div>
    </div>
  );
}

function Toast({ toast }: { toast: ToastState }) {
  return (
    <div className={`fixed bottom-6 left-1/2 z-[100] flex min-w-[320px] -translate-x-1/2 items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-[0_18px_60px_rgba(18,38,72,0.2)] ${toast.tone === "error" ? "border-[#f2c8cd]" : "border-[#c6e8d7]"}`} dir="rtl">
      <span className={`grid h-8 w-8 place-items-center rounded-xl ${toast.tone === "error" ? "bg-[#fff0f0] text-[#cc3342]" : "bg-[#ebfaf3] text-[#0b8b55]"}`}>
        <CrmIcon name={toast.tone === "error" ? "warning" : "check"} size={18} />
      </span>
      <span className="text-sm font-semibold text-[#3a4558]">{toast.message}</span>
    </div>
  );
}

function LoadingSpinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />;
}

function useQueryErrorToast(errors: Array<unknown>, notify: ViewProps["notify"]) {
  const error = errors.find(Boolean);

  useEffect(() => {
    if (!error) return;
    notify(getApiErrorMessage(error, "دریافت اطلاعات از سرور ناموفق بود."), "error");
  }, [error, notify]);
}

const inputClassName = "h-10 w-full rounded-xl border border-[#cccccc] bg-white px-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";
const modalInputClassName = "h-11 w-full rounded-xl border border-[#cccccc] bg-white px-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";
const primaryButtonClassName = "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-semibold text-white transition hover:bg-[#003ca5] disabled:cursor-not-allowed disabled:opacity-55";
const ghostButtonClassName = "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dce3ef] bg-white px-4 text-sm font-semibold text-[#4d4d4d] transition hover:bg-[#f0f0f0] disabled:cursor-not-allowed disabled:opacity-50";
const dangerButtonClassName = "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#d93645] px-4 text-sm font-semibold text-white transition hover:bg-[#bd2938] disabled:cursor-not-allowed disabled:opacity-55";
const miniGhostButtonClassName = "h-9 rounded-lg border border-[#d7dfeb] bg-white px-2.5 text-sm font-bold text-[#5d6879] transition hover:bg-[#f4f6fa] disabled:cursor-not-allowed disabled:opacity-45";

type IconName =
  | "account"
  | "ads"
  | "arrow"
  | "building"
  | "category"
  | "check"
  | "close"
  | "desktop"
  | "empty"
  | "filter"
  | "form"
  | "home"
  | "location"
  | "plus"
  | "refresh"
  | "save"
  | "search"
  | "users"
  | "warning"
  | "wallet"
  | "payment"
  | "reports"
  | "settings"
  | "support";

function CrmIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    fill: "none",
    height: size,
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 1.8,
    viewBox: "0 0 24 24",
    width: size,
  };

  if (name === "home") return <svg {...common}><path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.8V21h13V9.8"/><path d="M9.5 21v-6h5v6"/></svg>;
  if (name === "ads") return <svg {...common}><path d="M4 6.5h16v11H4z"/><path d="M8 17.5V20m8-2.5V20M8 10h5m-5 3h8"/><path d="M7 3.5h10"/></svg>;
  if (name === "users") return <svg {...common}><circle cx="9" cy="8" r="3"/><path d="M3.5 19c.4-3.4 2.3-5 5.5-5s5.1 1.6 5.5 5"/><circle cx="17" cy="9" r="2.2"/><path d="M15.5 14.5c2.9-.6 4.6.8 5 3.5"/></svg>;
  if (name === "building") return <svg {...common}><path d="M4 21V7l8-4v18M12 9h8v12M7.5 9.5h1m-1 4h1m-1 4h1m7-5h1m-1 4h1"/><path d="M2 21h20"/></svg>;
  if (name === "category") return <svg {...common}><rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/></svg>;
  if (name === "location") return <svg {...common}><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
  if (name === "form") return <svg {...common}><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4M9 12h6m-6 4h6"/></svg>;
  if (name === "wallet") return <svg {...common}><path d="M4 6h15a2 2 0 0 1 2 2v10H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h12"/><path d="M16 11h5v4h-5a2 2 0 0 1 0-4Z"/></svg>;
  if (name === "payment") return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M7 15h4"/><circle cx="17" cy="14" r="1.5"/></svg>;
  if (name === "reports") return <LinearFlag aria-hidden="true" height={size} width={size} />;
  if (name === "settings") return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></svg>;
  if (name === "support") return <svg {...common}><path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8m-8 3h5"/><path d="M18 18.5a2.5 2.5 0 0 0 2.5 2.5"/></svg>;
  if (name === "account") return <svg {...common}><circle cx="12" cy="8" r="3.5"/><path d="M5 21c.5-4.3 2.8-6.5 7-6.5s6.5 2.2 7 6.5"/></svg>;
  if (name === "refresh") return <svg {...common}><path d="M20 7v5h-5"/><path d="M18.7 16a8 8 0 1 1 .8-7"/></svg>;
  if (name === "plus") return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
  if (name === "search") return <svg {...common}><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>;
  if (name === "filter") return <svg {...common}><path d="M4 6h16M7 12h10m-7 6h4"/><circle cx="8" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="18" r="1" fill="currentColor" stroke="none"/></svg>;
  if (name === "arrow") return <svg {...common}><path d="m9 6 6 6-6 6"/></svg>;
  if (name === "close") return <svg {...common}><path d="m6 6 12 12M18 6 6 18"/></svg>;
  if (name === "save") return <svg {...common}><path d="M5 4h12l2 2v14H5z"/><path d="M8 4v6h8V4M8 20v-6h8v6"/></svg>;
  if (name === "warning") return <svg {...common}><path d="M10.2 4.2 2.8 18a2 2 0 0 0 1.8 3h14.8a2 2 0 0 0 1.8-3L13.8 4.2a2 2 0 0 0-3.6 0Z"/><path d="M12 9v4m0 4h.01"/></svg>;
  if (name === "check") return <svg {...common}><path d="m5 12 4 4L19 6"/></svg>;
  if (name === "desktop") return <svg {...common}><rect x="2.5" y="3.5" width="19" height="13" rx="2"/><path d="M8 21h8m-4-4.5V21"/></svg>;
  if (name === "empty") return <svg {...common}><path d="M4 6h16v14H4z"/><path d="M8 3h8v3M8 11h8m-8 4h5"/></svg>;

  return null;
}

function ChevronIcon() {
  return (
    <svg fill="none" height="18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="18">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
