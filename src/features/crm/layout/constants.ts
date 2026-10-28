import type { LatLngTuple } from "leaflet";
import { defaultSelectedCity } from "../../../shared/lib/selectedCityStorage";
import {
  CRM_ADVERTISE_MANAGER,
  CRM_FINANCE_MANAGER,
  SUPPORT,
} from "../../../shared/constants/roles.constants";

export const CRM_BLUE = "#0048c4";
export const DEFAULT_COUNTRY_ID = 2;
export const DEFAULT_CENTER: LatLngTuple = [
  defaultSelectedCity.latitude,
  defaultSelectedCity.longitude,
];
export const advertiseStatusOptions = [
  { label: "در انتظار پرداخت", value: "wait_for_payment" },
  { label: "در انتظار بررسی", value: "wait_for_admin" },
  { label: "نیمه کاره", value: "incomplete" },
  { label: "در انتظار آژانس", value: "wait_for_agency" },
  { label: "تأیید شده", value: "accepted" },
  { label: "رد شده", value: "rejected" },
  { label: "نیازمند ویرایش", value: "needs_edit" },
  { label: "حذف شده", value: "deleted" },
  { label: "منقضی شده", value: "expired" },
];

export const userRoleOptions = [
  { label: "کاربر", value: "user" },
  { label: "مدیر آژانس", value: "real_estate_manager" },
  { label: "مشاور آژانس", value: "real_estate_consultant" },
  { label: "مشاور مستقل", value: "independent_consultant" },
  { label: "مدیریت آگهی", value: CRM_ADVERTISE_MANAGER },
  { label: "مدیریت مالی", value: CRM_FINANCE_MANAGER },
  { label: "پشتیبانی", value: SUPPORT },
  { label: "مدیر کل", value: "superadmin" },
];
export const inputClassName =
  "h-10 w-full rounded-xl border border-[#cccccc] bg-white px-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";
export const modalInputClassName =
  "h-11 w-full rounded-xl border border-[#cccccc] bg-white px-3 text-sm font-medium text-[#303030] outline-none transition placeholder:text-[#999999] focus:border-[#0048c4] focus:ring-2 focus:ring-[#0048c4]/10";
export const primaryButtonClassName =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0048c4] px-4 text-sm font-semibold text-white transition hover:bg-[#003ca5] disabled:cursor-not-allowed disabled:opacity-55";
export const ghostButtonClassName =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[#dce3ef] bg-white px-4 text-sm font-semibold text-[#4d4d4d] transition hover:bg-[#f0f0f0] disabled:cursor-not-allowed disabled:opacity-50";
export const dangerButtonClassName =
  "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#d93645] px-4 text-sm font-semibold text-white transition hover:bg-[#bd2938] disabled:cursor-not-allowed disabled:opacity-55";
export const miniGhostButtonClassName =
  "h-9 rounded-lg border border-[#d7dfeb] bg-white px-2.5 text-sm font-bold text-[#5d6879] transition hover:bg-[#f4f6fa] disabled:cursor-not-allowed disabled:opacity-45";
