import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
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
  REAL_ESTATE_MANAGER,
} from "../../shared/constants/roles.constants";
import { isForbiddenApiError } from "../../shared/api/api";
import { getSessionRoleSlugs } from "../../app/router/routes";
import { useDashboardOverviewByRoleQuery } from "./api/dashboard.hooks";
import type { DashboardRolePersona } from "./api/dashboard.service";
import type { DashboardRole } from "./components/DashboardQuickAccessGrid";

export * from "./dashboardSubPages";

export function DashboardHomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isReportsView = searchParams.get("view") === "reports";

  const [activeRole, setActiveRole] = useState(() => getActiveAuthRole(getStoredAuthSession()));

  useEffect(() => {
    function syncActiveRole() {
      setActiveRole(getActiveAuthRole(getStoredAuthSession()));
    }

    window.addEventListener(authSessionChangedEventName, syncActiveRole);
    window.addEventListener("storage", syncActiveRole);

    return () => {
      window.removeEventListener(authSessionChangedEventName, syncActiveRole);
      window.removeEventListener("storage", syncActiveRole);
    };
  }, []);

  const handleOpenReports = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("view", "reports");
      return next;
    });
  };

  const handleCloseReports = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          next.delete("view");
          return next;
        },
        { replace: true }
      );
    }
  };

  const session = getStoredAuthSession();
  const sessionRoles = getSessionRoleSlugs(session);

  const effectiveRole =
    activeRole && (DASHBOARD_ROLES as readonly string[]).includes(activeRole)
      ? activeRole
      : ((sessionRoles.find((r) => (DASHBOARD_ROLES as readonly string[]).includes(r)) as AuthRoleSlug) ??
        activeRole ??
        "user");

  const isRealEstateManager = effectiveRole === REAL_ESTATE_MANAGER;
  const isIndependent = effectiveRole === INDEPENDENT_CONSULTANT;

  const persona: DashboardRolePersona = isRealEstateManager
    ? "agency"
    : isIndependent
      ? "agent"
      : "agent_in_agency";

  const roleType: DashboardRole = isRealEstateManager
    ? "REAL_ESTATE_MANAGER"
    : isIndependent
      ? "INDEPENDENT_CONSULTANT"
      : "REAL_ESTATE_CONSULTANT";

  const overviewQuery = useDashboardOverviewByRoleQuery(persona, {
    enabled: Boolean(session),
    period: "month",
  });

  useEffect(() => {
    if (overviewQuery.isError && isForbiddenApiError(overviewQuery.error)) {
      navigate("/403", { replace: true });
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
