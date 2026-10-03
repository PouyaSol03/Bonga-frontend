import { useEffect, useState } from "react";
import { DashboardHomeOverview } from "./components/home/DashboardHomeOverview";
import { DashboardView, DashboardReportsView } from "./components";
import {
  authSessionChangedEventName,
  getActiveAuthRole,
  getStoredAuthSession,
} from "../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../shared/constants/roles.constants";
import { getApiErrorMessage } from "../../shared/api/api";
import { useDashboardOverviewByRoleQuery } from "./api/dashboard.hooks";
import type { DashboardRolePersona } from "./api/dashboard.service";

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

  const isRealEstateManager = activeRole === REAL_ESTATE_MANAGER;
  const isAgentRole =
    activeRole === REAL_ESTATE_CONSULTANT ||
    activeRole === INDEPENDENT_CONSULTANT;

  const persona: DashboardRolePersona = isRealEstateManager
    ? "agency"
    : activeRole === REAL_ESTATE_CONSULTANT
      ? "agent_in_agency"
      : "agent";

  const overviewQuery = useDashboardOverviewByRoleQuery(persona, {
    enabled: isRealEstateManager || isAgentRole,
    period: "30d",
  });

  // Real estate manager receives the modern Agency Dashboard UI matching SVG
  if (isRealEstateManager) {
    if (isReportsView) {
      return (
        <DashboardReportsView
          role="REAL_ESTATE_MANAGER"
          dashboard={overviewQuery.data}
          onBack={handleCloseReports}
        />
      );
    }
    return (
      <DashboardView
        role="REAL_ESTATE_MANAGER"
        dashboard={overviewQuery.data}
        isLoading={overviewQuery.isLoading}
        onViewReports={handleOpenReports}
      />
    );
  }

  // Real estate consultants (in-agency and independent) receive the modern Agent Dashboard UI
  if (isAgentRole) {
    const roleType =
      activeRole === INDEPENDENT_CONSULTANT
        ? "INDEPENDENT_CONSULTANT"
        : "REAL_ESTATE_CONSULTANT";

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

  return (
    <DashboardHomeOverview
      dashboard={overviewQuery.data}
      dashboardError={
        overviewQuery.isError
          ? getApiErrorMessage(
              overviewQuery.error,
              "دریافت اطلاعات داشبورد با خطا مواجه شد.",
            )
          : null
      }
      dashboardKind={isAgentRole ? "agent" : undefined}
      isDashboardLoading={overviewQuery.isLoading}
      useDashboardApi={isAgentRole || isRealEstateManager}
    />
  );
}
