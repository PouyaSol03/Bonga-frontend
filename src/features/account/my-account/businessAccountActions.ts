import { DASHBOARD_PATH } from "../../../app/router/routes";
import { MANAGE_ADS_PATH } from "./actionConfigs";
import type { AccountAction } from "./types";
import { getStoredAuthSession } from "../../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../../shared/constants/roles.constants";
import type { MyAgencyProfile } from "../api/account.service";

export function getBusinessAccountActions(
  role?: string | null,
  agencyProfile?: MyAgencyProfile,
): AccountAction[] {
  const membership = agencyProfile?.membership;
  const session = getStoredAuthSession();
  const isManager = role === REAL_ESTATE_MANAGER;
  const isAgentInAgency = role === REAL_ESTATE_CONSULTANT;
  const isManagerWithPermissions =
    isManager &&
    ((membership && (membership.role === "manager" || membership.role_id === 2)) ||
      Boolean(session?.managerPermissions));

  if (isManagerWithPermissions) {
    const permissions = membership?.permissions ?? session?.managerPermissions ?? {};
    const actions: AccountAction[] = [
      { icon: "tag", label: "مدیریت آگهی‌ها", to: MANAGE_ADS_PATH },
    ];

    if (permissions.manage_consultants) {
      actions.push({ icon: "team", label: "مدیریت مشاورین", to: `${DASHBOARD_PATH}/team` });
    }
    if (permissions.manage_requests) {
      actions.push({
        icon: "request",
        label: "مدیریت درخواست‌ها",
        to: `${DASHBOARD_PATH}/requests`,
      });
    }
    if (permissions.manage_credits) {
      actions.push({
        icon: "wallet-add",
        label: "افزایش اعتبار",
        to: `${DASHBOARD_PATH}/payments`,
      });
    }
    if (permissions.support) {
      actions.push({ icon: "message", label: "پشتیبانی", to: "/chat?filter=support" });
    }

    return actions;
  }

  const managerActions: AccountAction[] = [
    { icon: "dashboard", label: "داشبورد", to: DASHBOARD_PATH },
    { icon: "ranking", label: "نشان‌ها و رتبه", to: `${DASHBOARD_PATH}/ranking` },
    { icon: "building", label: "صفحه آژانس", to: `${DASHBOARD_PATH}/agency` },
    { icon: "tag", label: "مدیریت آگهی‌ها", to: MANAGE_ADS_PATH },
    { icon: "request", label: "مدیریت درخواست‌ها", to: `${DASHBOARD_PATH}/requests` },
    { icon: "team", label: "مدیریت مشاورین", to: `${DASHBOARD_PATH}/team` },
    { icon: "wallet", label: "کیف پول", to: "/account/wallet" },
    { icon: "wallet-add", label: "افزایش اعتبار", to: `${DASHBOARD_PATH}/payments` },
    { icon: "message", label: "پیام‌ها", to: "/chat" },
    { icon: "headphone", label: "پشتیبانی", to: "/account/support" },
  ];

  if (role === REAL_ESTATE_MANAGER) {
    const permissions = membership?.permissions ?? session?.managerPermissions ?? {};
    let filtered = managerActions;
    if (permissions.manage_requests === false) {
      filtered = filtered.filter((a) => a.to !== `${DASHBOARD_PATH}/requests`);
    }
    if (permissions.manage_consultants === false) {
      filtered = filtered.filter((a) => a.to !== `${DASHBOARD_PATH}/team`);
    }
    if (permissions.manage_credits === false) {
      filtered = filtered.filter((a) => a.to !== `${DASHBOARD_PATH}/payments`);
    }
    return filtered;
  }

  if (isAgentInAgency) {
    const permissions = membership?.permissions ?? session?.managerPermissions ?? {};
    const actions: AccountAction[] = [
      { icon: "dashboard", label: "داشبورد", to: DASHBOARD_PATH },
      { icon: "ranking", label: "نشان‌ها و رتبه", to: `${DASHBOARD_PATH}/ranking` },
      { icon: "building", label: "صفحه مشاور", to: `${DASHBOARD_PATH}/agent` },
      { icon: "tag", label: "مدیریت آگهی‌ها", to: MANAGE_ADS_PATH },
    ];

    if (permissions.manage_requests) {
      actions.push({
        icon: "request",
        label: "مدیریت درخواست‌ها",
        to: `${DASHBOARD_PATH}/requests`,
      });
    }

    if (permissions.manage_consultants) {
      actions.push({ icon: "team", label: "مدیریت مشاورین", to: `${DASHBOARD_PATH}/team` });
    }
    if (permissions.manage_credits) {
      actions.push({
        icon: "wallet-add",
        label: "افزایش اعتبار",
        to: `${DASHBOARD_PATH}/payments`,
      });
    }

    actions.push(
      { icon: "wallet", label: "کیف پول", to: "/account/wallet" },
      { icon: "message", label: "پیام‌ها", to: "/chat" },
      { icon: "headphone", label: "پشتیبانی", to: "/account/support" },
    );

    return actions;
  }

  if (role === INDEPENDENT_CONSULTANT) {
    return [
      { icon: "dashboard", label: "داشبورد", to: DASHBOARD_PATH },
      { icon: "ranking", label: "نشان‌ها و رتبه", to: `${DASHBOARD_PATH}/ranking` },
      { icon: "building", label: "صفحه مشاور", to: `${DASHBOARD_PATH}/agent` },
      { icon: "tag", label: "مدیریت آگهی‌ها", to: MANAGE_ADS_PATH },
      { icon: "request", label: "مدیریت درخواست‌ها", to: `${DASHBOARD_PATH}/requests` },
      { icon: "wallet", label: "کیف پول", to: "/account/wallet" },
      { icon: "wallet-add", label: "افزایش اعتبار", to: `${DASHBOARD_PATH}/payments` },
      { icon: "message", label: "پیام‌ها", to: "/chat" },
      { icon: "headphone", label: "پشتیبانی", to: "/account/support" },
    ];
  }

  return managerActions;
}
