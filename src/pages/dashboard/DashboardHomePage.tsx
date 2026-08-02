import { useEffect, useState } from "react";

import { DashboardHomeOverview } from "./components/home/DashboardHomeOverview";
import {
  AddConsultantPage,
  ConsultantManagementPage,
} from "./components/team/ConsultantManagementPage";
import { ConsultantEditPage } from "./components/team/ConsultantEditPage";
import { ConsultantInfoPage } from "./components/team/ConsultantInfoPage";
import { ConsultantRemovePage } from "./components/team/ConsultantRemovePage";
import { AgencyProfilePage } from "./AgencyProfilePage";
import DashboardPaymentPage from "./DashboardPaymenPage";
import {
  authSessionChangedEventName,
  getActiveAuthRole,
  getStoredAuthSession,
} from "../../core/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../shared/constants/roles.constants";
import { getApiErrorMessage } from "../../core/api/api";
import {
  useAgencyDashboardQuery,
  useAgentDashboardQuery,
} from "../../core/hooks/dashboard.hooks";
import { RequestManagementView } from "../requests/RequestManagementView";

export function DashboardHomePage() {
  const [activeRole, setActiveRole] = useState(() =>
    getActiveAuthRole(getStoredAuthSession()),
  );

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

  const isRealEstateManager = activeRole === REAL_ESTATE_MANAGER;
  const isAgentRole =
    activeRole === REAL_ESTATE_CONSULTANT ||
    activeRole === INDEPENDENT_CONSULTANT;
  const agencyDashboardQuery = useAgencyDashboardQuery({
    enabled: isRealEstateManager,
    period: "30d",
  });
  const agentDashboardQuery = useAgentDashboardQuery({
    enabled: isAgentRole,
    period: "30d",
  });
  const dashboardQuery = isRealEstateManager
    ? agencyDashboardQuery
    : agentDashboardQuery;
  const useDashboardApi = isRealEstateManager || isAgentRole;

  return (
    <DashboardHomeOverview
      dashboard={dashboardQuery.data}
      dashboardKind={
        isRealEstateManager ? "agency" : isAgentRole ? "agent" : undefined
      }
      dashboardError={
        useDashboardApi && dashboardQuery.isError
          ? getApiErrorMessage(
              dashboardQuery.error,
              "دریافت اطلاعات داشبورد با خطا مواجه شد.",
            )
          : null
      }
      isDashboardLoading={useDashboardApi && dashboardQuery.isLoading}
      useDashboardApi={useDashboardApi}
    />
  );
}

export function DashboardRequestsPage() {
  const activeRole = getActiveAuthRole(getStoredAuthSession());

  return (
    <RequestManagementView
      backTo="/account/dashboard"
      showReceivedTab={activeRole === REAL_ESTATE_MANAGER}
    />
  );
}

export function DashboardTeamPage() {
  return <ConsultantManagementPage />;
}

export function DashboardAddConsultantPage() {
  return <AddConsultantPage />;
}

export function DashboardConsultantInfoPage() {
  return <ConsultantInfoPage />;
}

export function DashboardConsultantEditPage() {
  return <ConsultantEditPage />;
}

export function DashboardConsultantRemovePage() {
  return <ConsultantRemovePage />;
}

export function DashboardPaymentsPage() {
  return <DashboardPaymentPage />;
}


export function DashboardAgencyPage() {
  return <AgencyProfilePage />;
}
