import { useEffect, useState } from "react";
import { DashboardView, DashboardReportsView } from "./components";
import {
  authSessionChangedEventName,
  getActiveAuthRole,
  getStoredAuthSession,
  type AuthRoleSlug,
} from "../../shared/auth/auth-storage";
import {
  DASHBOARD_ROLES,
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../shared/constants/roles.constants";
import { isForbiddenApiError } from "../../shared/api/api";
import { replaceRoute } from "../../shared/navigation/navigation";
import { getSessionRoleSlugs } from "../../app/router/routes";
import { useDashboardOverviewByRoleQuery } from "./api/dashboard.hooks";
import type { DashboardRolePersona } from "./api/dashboard.service";
import type { DashboardRole } from "./components/DashboardQuickAccessGrid";

export * from "./dashboardSubPages";

export function DashboardHomePage() {
  const [isReportsView, setIsReportsView] = useState(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      return sp.get("view") === "reports";
    }
    return false;
  });

  const [activeRole, setActiveRole] = useState(() =>
    getActiveAuthRole(getStoredAuthSession()),
  );

  useEffect(() => {
    function syncActiveRole() {
      setActiveRole(getActiveAuthRole(getStoredAuthSession()));
    }
    function handlePopState() {
      const sp = new URLSearchParams(window.location.search);
      setIsReportsView(sp.get("view") === "reports");
    }

    window.addEventListener(authSessionChangedEventName, syncActiveRole);
    window.addEventListener("storage", syncActiveRole);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener(authSessionChangedEventName, syncActiveRole);
      window.removeEventListener("storage", syncActiveRole);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleOpenReports = () => {
    const url = new URL(window.location.href);
    url.searchParams.set("view", "reports");
    window.history.pushState({}, "", url.toString());
    setIsReportsView(true);
  };

  const handleCloseReports = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("view");
    window.history.pushState({}, "", url.toString());
    setIsReportsView(false);
  };

  const session = getStoredAuthSession();
  const sessionRoles = getSessionRoleSlugs(session);

  const effectiveRole =
    activeRole && DASHBOARD_ROLES.includes(activeRole as any)
      ? activeRole
      : (sessionRoles.find((r) => DASHBOARD_ROLES.includes(r as any)) as AuthRoleSlug) ??
        activeRole ??
        "user";

  const isRealEstateManager = effectiveRole === REAL_ESTATE_MANAGER;
  const isIndependent = effectiveRole === INDEPENDENT_CONSULTANT;

  const persona: DashboardRolePersona = isRealEstateManager
    ? "agency"
    : isIndependent
      ? "agent"
      : effectiveRole === REAL_ESTATE_CONSULTANT
        ? "agent_in_agency"
        : (effectiveRole as any);

  const roleType: DashboardRole = isRealEstateManager
    ? "REAL_ESTATE_MANAGER"
    : isIndependent
      ? "INDEPENDENT_CONSULTANT"
      : "REAL_ESTATE_CONSULTANT";

  const overviewQuery = useDashboardOverviewByRoleQuery(persona, {
    enabled: Boolean(session),
    period: "30d",
  });

  useEffect(() => {
    if (overviewQuery.isError && isForbiddenApiError(overviewQuery.error)) {
      replaceRoute("/403", undefined, { rememberCurrent: false });
    }
  }, [overviewQuery.isError, overviewQuery.error]);

  if (isReportsView) {
    return (
      <DashboardReportsView
        role={roleType}
        dashboard={overviewQuery.data}
        onBack={handleCloseReports}
      />
    );
  }

  return (
    <DashboardView
      role={roleType}
      dashboard={overviewQuery.data}
      isLoading={overviewQuery.isLoading}
      onViewReports={handleOpenReports}
    />
  );
}
