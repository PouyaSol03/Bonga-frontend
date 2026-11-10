import { useQuery } from "@tanstack/react-query";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SUPER_ADMIN } from "../../../shared/constants/roles.constants";
import { useAppTheme } from "../../../shared/theme/themeStorage";
import { useMyProfileQuery } from "../../account/api/account.hooks";
import {
  countCrmAdvertisesByStatus,
  listCrmAgencies,
  listCrmAgents,
  listCrmUsers,
} from "../api/crm.service";
import { normalizeAgencyStatus } from "./agencyFormatters";
import {
  allowedCrmSectionsForRoles,
  crmSessionRoleSlugs,
  navigationItems,
  primaryCrmRoleLabel,
} from "./navigation";
import type { CrmSection, ToastState } from "./types";
export function useCrmShell() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const prefersReducedMotion = useReducedMotion();

  const [refreshNonce, setRefreshNonce] = useState(0);

  const [toast, setToast] = useState<ToastState | null>(null);

  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 768px)").matches);

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

  const crmRoleSlugs = crmSessionRoleSlugs();

  const allowedSections = allowedCrmSectionsForRoles(crmRoleSlugs);

  const visibleNavigationItems = navigationItems.filter((item) =>
    allowedSections.has(item.section),
  );

  const roleLabel = primaryCrmRoleLabel(crmRoleSlugs);

  const profileName =
    [profile?.name, profile?.family]
      .map((value) => value?.trim())
      .filter(Boolean)
      .join(" ") || "مدیر سامانه";

  const { isDark, toggleTheme } = useAppTheme();

  const isSuperAdmin = crmRoleSlugs.includes(SUPER_ADMIN);

  const { data: pendingAdsCount } = useQuery({
    enabled: isDesktop && (isSuperAdmin || allowedSections.has("advertises")),
    queryFn: () => countCrmAdvertisesByStatus("wait_for_admin"),
    queryKey: ["crm", "badges", "advertises", refreshNonce],
    staleTime: 30_000,
  });

  const { data: crmUsers } = useQuery({
    enabled: isDesktop && (isSuperAdmin || allowedSections.has("users")),
    queryFn: () => listCrmUsers(),
    queryKey: ["crm", "badges", "users", refreshNonce],
    staleTime: 30_000,
  });

  const { data: crmAgencies } = useQuery({
    enabled: isDesktop && (isSuperAdmin || allowedSections.has("agencies")),
    queryFn: () => listCrmAgencies(),
    queryKey: ["crm", "badges", "agencies", refreshNonce],
    staleTime: 30_000,
  });

  const { data: crmConsultants } = useQuery({
    enabled: isDesktop && (isSuperAdmin || allowedSections.has("consultants")),
    queryFn: () => listCrmAgents(),
    queryKey: ["crm", "badges", "consultants", refreshNonce],
    staleTime: 30_000,
  });

  const pendingCounts = useMemo<Partial<Record<CrmSection, number>>>(() => {
    const counts: Partial<Record<CrmSection, number>> = {};

    if (pendingAdsCount !== undefined) {
      counts.advertises = pendingAdsCount;
    }

    if (crmUsers) {
      counts.users = crmUsers.filter((u) => {
        const hasNational = Boolean(u.nationalnumber && String(u.nationalnumber).trim());
        const isAuth =
          u.authorized === true ||
          u.authorized === 1 ||
          u.authorized === "1" ||
          Number(u.authorized) === 1;
        return hasNational && !isAuth;
      }).length;
    }

    if (crmAgencies) {
      counts.agencies = crmAgencies.filter(
        (a) => normalizeAgencyStatus(a.status) === "wait",
      ).length;
    }

    if (crmConsultants) {
      counts.consultants = crmConsultants.filter((c) => {
        const s = String(c.status ?? "")
          .trim()
          .toLowerCase();
        return s === "pending" || s === "wait" || s === "0";
      }).length;
    }

    return counts;
  }, [pendingAdsCount, crmUsers, crmAgencies, crmConsultants]);
  return {
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    prefersReducedMotion,
    refreshNonce,
    setRefreshNonce,
    toast,
    isDesktop,
    notify,
    visibleNavigationItems,
    roleLabel,
    profileName,
    isDark,
    toggleTheme,
    pendingCounts,
  };
}
