import { userBusinessActions } from "./actionConfigs";
import type { AccountAction } from "./types";
import { getProfileDisplayName, getAgencyDisplayName } from "./accountHeaderHelpers";
import {
  getStoredAuthSession,
  setStoredAuthSession,
  type AuthSession,
  type ManagerPermissions,
} from "../../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
  USER,
} from "../../../shared/constants/roles.constants";
import type { MyAgencyProfile, UserProfile } from "../api/account.service";

export function getAccountSwitchActions(
  authSession: AuthSession | null,
  activeRole?: string | null,
  profile?: UserProfile,
  agencyProfile?: MyAgencyProfile,
): AccountAction[] {
  if (!authSession) return [];

  const actions: AccountAction[] = [];
  const profileName = getProfileDisplayName(profile) || "کاربر شناسا";
  const agencyName = getAgencyDisplayName(agencyProfile);

  if (Array.isArray(profile?.accounts) && profile.accounts.length > 0) {
    for (const acc of profile.accounts) {
      if (acc.context === "personal" || acc.role_slug === "user" || acc.type === "user") {
        actions.push({
          activeRole: USER,
          icon: "user",
          label: acc.name || profileName,
          to: "/account",
          onClick: () => {
            const current = getStoredAuthSession();
            if (current?.managerPermissions) {
              setStoredAuthSession({ ...current, managerPermissions: undefined });
            }
          },
        });
      } else if (
        acc.context === "agency" ||
        acc.role_slug === "real_estate_manager" ||
        acc.type === "agency"
      ) {
        actions.push({
          activeRole: REAL_ESTATE_MANAGER,
          icon: "agency",
          label: acc.name || agencyName,
          to: "/account",
          onClick: () => {
            const current = getStoredAuthSession();
            if (current?.managerPermissions) {
              setStoredAuthSession({ ...current, managerPermissions: undefined });
            }
          },
        });
      } else if (
        acc.context === "agency-consultant" ||
        acc.role_slug === "real_estate_consultant" ||
        (acc.type === "agent" && Boolean(acc.agency_id || acc.agency))
      ) {
        const agencyTitle = acc.agency?.name?.trim() || agencyProfile?.name?.trim() || agencyName;
        const consultantLabel = agencyTitle ? `مشاور آژانس ${agencyTitle}` : "مشاور آژانس";

        actions.push({
          activeRole: REAL_ESTATE_CONSULTANT,
          icon: "building",
          label: consultantLabel,
          to: "/account",
          onClick: () => {
            const current = getStoredAuthSession();
            if (current) {
              setStoredAuthSession({
                ...current,
                activeRole: REAL_ESTATE_CONSULTANT,
                managerPermissions: (acc.permissions as ManagerPermissions) ?? undefined,
              });
            }
          },
        });
      } else if (
        acc.context === "independent-consultant" ||
        acc.role_slug === "independent_consultant" ||
        (acc.type === "agent" && !acc.agency_id && !acc.agency)
      ) {
        actions.push({
          activeRole: INDEPENDENT_CONSULTANT,
          icon: "user",
          label: "مشاور مستقل",
          to: "/account",
          onClick: () => {
            const current = getStoredAuthSession();
            if (current?.managerPermissions) {
              setStoredAuthSession({ ...current, managerPermissions: undefined });
            }
          },
        });
      }
    }

    return actions.filter((action) => action.activeRole !== activeRole);
  }

  if (authSession.roles.some((role) => role.slug === USER)) {
    actions.push({
      activeRole: USER,
      icon: "user",
      label: profileName,
      to: "/account",
    });
  }

  if (authSession.roles.some((role) => role.slug === REAL_ESTATE_MANAGER)) {
    actions.push({
      activeRole: REAL_ESTATE_MANAGER,
      icon: "agency",
      label: agencyName,
      to: "/account",
    });
  }

  if (authSession.roles.some((role) => role.slug === REAL_ESTATE_CONSULTANT)) {
    actions.push({
      activeRole: REAL_ESTATE_CONSULTANT,
      icon: "building",
      label: agencyProfile?.name?.trim() ? `مشاور آژانس ${agencyName}` : "مشاور آژانس",
      to: "/account",
    });
  }

  if (authSession.roles.some((role) => role.slug === INDEPENDENT_CONSULTANT)) {
    actions.push({
      activeRole: INDEPENDENT_CONSULTANT,
      icon: "user",
      label: "مشاور مستقل",
      to: "/account",
    });
  }

  return actions.filter((action) => action.activeRole !== activeRole);
}

export function getCreatedBusinessActions(
  authSession: AuthSession | null,
  profile?: UserProfile,
  agencyProfile?: MyAgencyProfile,
  activeRole?: string | null,
) {
  if (!authSession) return userBusinessActions;

  const isAgencyPending = Boolean(
    profile?.agency_id &&
    (profile?.agency_status === 0 ||
      profile?.agency_status === "0" ||
      profile?.agency_status === "wait" ||
      String(profile?.agency_status).toLowerCase() === "wait"),
  );

  if (isAgencyPending) {
    return [
      {
        badge: "در انتظار",
        disabled: true,
        icon: "info" as const,
        label: "در انتظار ادمین برای تایید کسب و کار شما",
        tone: "warning" as const,
      },
    ];
  }

  const actions = getAccountSwitchActions(authSession, activeRole ?? USER, profile, agencyProfile);

  if (actions.length > 0) return actions;

  return userBusinessActions;
}

