import { useEffect, useState } from "react";
import { DashboardHomeOverview } from "./components/home/DashboardHomeOverview";
import {
  AgencyDashboardView,
  AgencyDashboardReportsView,
} from "./agency";
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
import { useAgentDashboardQuery } from "./api/dashboard.hooks";
import { useAgentEntitlementsQuery } from "../packages/api/package.hooks";

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

  const agentDashboardQuery = useAgentDashboardQuery({
    enabled: isAgentRole,
    period: "30d",
  });
  const agentEntitlementsQuery = useAgentEntitlementsQuery({
    enabled: isAgentRole,
  });
  const agentDashboard =
    isAgentRole && agentDashboardQuery.data && agentEntitlementsQuery.data
      ? {
          ...agentDashboardQuery.data,
          balances: {
            ...agentDashboardQuery.data.balances,
            ...agentEntitlementsQuery.data,
          },
        }
      : agentDashboardQuery.data;

  // Real estate manager receives the modern Agency Dashboard UI matching SVG
  if (isRealEstateManager) {
    if (isReportsView) {
      return <AgencyDashboardReportsView onBack={handleCloseReports} />;
    }
    return <AgencyDashboardView onViewReports={handleOpenReports} />;
  }

  return (
    <DashboardHomeOverview
      dashboard={agentDashboard}
      dashboardError={
        agentDashboardQuery.isError
          ? getApiErrorMessage(
              agentDashboardQuery.error,
              "دریافت اطلاعات داشبورد با خطا مواجه شد.",
            )
          : null
      }
      dashboardKind={isAgentRole ? "agent" : undefined}
      isDashboardLoading={isAgentRole && agentDashboardQuery.isLoading}
      useDashboardApi={isAgentRole}
    />
  );
}
