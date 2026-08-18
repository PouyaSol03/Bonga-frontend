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
} from "../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../shared/constants/roles.constants";
import { getApiErrorMessage } from "../../shared/api/api";
import {
  useAgencyDashboardAdvertiseRegistrationProgressQuery,
  useAgencyDashboardConsultantActivityQuery,
  useAgencyDashboardCreditsQuery,
  useAgencyDashboardPublishedAdvertisesQuery,
  useAgencyDashboardRankingProgressQuery,
  useAgencyDashboardRankingQuery,
  useAgentDashboardQuery,
} from "./api/dashboard.hooks";
import {
  mergeAgencyDashboardSections,
  type DashboardPeriod,
} from "./api/dashboard.service";
import { useAgentEntitlementsQuery } from "../packages/api/package.hooks";
import { RequestManagementView } from "../property-requests/RequestManagementView";

export function DashboardHomePage() {
  const [activeRole, setActiveRole] = useState(() =>
    getActiveAuthRole(getStoredAuthSession()),
  );
  const [consultantActivityPeriod, setConsultantActivityPeriod] =
    useState<DashboardPeriod>("month");
  const [publishedAdvertisesPeriod, setPublishedAdvertisesPeriod] =
    useState<DashboardPeriod>("month");
  const [advertiseRegistrationProgressPeriod, setAdvertiseRegistrationProgressPeriod] =
    useState<DashboardPeriod>("month");
  const [rankingProgressPeriod, setRankingProgressPeriod] =
    useState<DashboardPeriod>("month");

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

  const agencyCreditsQuery = useAgencyDashboardCreditsQuery({
    enabled: isRealEstateManager,
    period: "month",
  });
  const agencyConsultantActivityQuery =
    useAgencyDashboardConsultantActivityQuery({
      enabled: isRealEstateManager,
      period: consultantActivityPeriod,
    });
  const agencyPublishedAdvertisesQuery =
    useAgencyDashboardPublishedAdvertisesQuery({
      enabled: isRealEstateManager,
      period: publishedAdvertisesPeriod,
    });
  const agencyAdvertiseRegistrationProgressQuery =
    useAgencyDashboardAdvertiseRegistrationProgressQuery({
      enabled: isRealEstateManager,
      period: advertiseRegistrationProgressPeriod,
    });
  const agencyRankingProgressQuery = useAgencyDashboardRankingProgressQuery({
    enabled: isRealEstateManager,
    period: rankingProgressPeriod,
  });
  const agencyRankingQuery = useAgencyDashboardRankingQuery({
    enabled: isRealEstateManager,
  });

  const agencySectionQueries = [
    agencyCreditsQuery,
    agencyConsultantActivityQuery,
    agencyPublishedAdvertisesQuery,
    agencyAdvertiseRegistrationProgressQuery,
    agencyRankingProgressQuery,
    agencyRankingQuery,
  ];
  const failedAgencySection = agencySectionQueries.find(
    (query) => query.isError,
  );

  // Keep every section independent. A refetch in one chart must never blank the
  // merged dashboard or put the whole route back into its loading skeleton.
  const agencyDashboard = isRealEstateManager
    ? mergeAgencyDashboardSections("month", {
        advertiseRegistrationProgress:
          agencyAdvertiseRegistrationProgressQuery.data,
        consultantActivity: agencyConsultantActivityQuery.data,
        credits: agencyCreditsQuery.data,
        publishedAdvertises: agencyPublishedAdvertisesQuery.data,
        ranking: agencyRankingQuery.data,
        rankingProgress: agencyRankingProgressQuery.data,
      })
    : undefined;

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
  const dashboard = isRealEstateManager ? agencyDashboard : agentDashboard;
  const useDashboardApi = isRealEstateManager || isAgentRole;

  return (
    <DashboardHomeOverview
      agencyChartPeriods={
        isRealEstateManager
          ? {
              advertiseRegistrationProgress:
                advertiseRegistrationProgressPeriod,
              consultantActivity: consultantActivityPeriod,
              publishedAdvertises: publishedAdvertisesPeriod,
              rankingProgress: rankingProgressPeriod,
            }
          : undefined
      }
      agencySectionLoading={
        isRealEstateManager
          ? {
              advertiseRegistrationProgress:
                agencyAdvertiseRegistrationProgressQuery.isLoading,
              consultantActivity: agencyConsultantActivityQuery.isLoading,
              credits: agencyCreditsQuery.isLoading,
              publishedAdvertises: agencyPublishedAdvertisesQuery.isLoading,
              ranking: agencyRankingQuery.isLoading,
              rankingProgress: agencyRankingProgressQuery.isLoading,
            }
          : undefined
      }
      dashboard={dashboard}
      dashboardKind={
        isRealEstateManager ? "agency" : isAgentRole ? "agent" : undefined
      }
      dashboardError={
        isRealEstateManager && failedAgencySection
          ? getApiErrorMessage(
              failedAgencySection.error,
              "دریافت بخشی از اطلاعات داشبورد آژانس با خطا مواجه شد.",
            )
          : isAgentRole && agentDashboardQuery.isError
            ? getApiErrorMessage(
                agentDashboardQuery.error,
                "دریافت اطلاعات داشبورد با خطا مواجه شد.",
              )
            : null
      }
      isDashboardLoading={isAgentRole && agentDashboardQuery.isLoading}
      onAgencyChartPeriodChange={
        isRealEstateManager
          ? {
              advertiseRegistrationProgress:
                setAdvertiseRegistrationProgressPeriod,
              consultantActivity: setConsultantActivityPeriod,
              publishedAdvertises: setPublishedAdvertisesPeriod,
              rankingProgress: setRankingProgressPeriod,
            }
          : undefined
      }
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
