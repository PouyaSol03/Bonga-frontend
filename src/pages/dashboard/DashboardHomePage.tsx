import { DashboardHomeOverview } from "../../components/dashboard/home/DashboardHomeOverview";
import {
  AddConsultantPage,
  ConsultantManagementPage,
} from "../../components/dashboard/team/ConsultantManagementPage";
import { ConsultantEditPage } from "../../components/dashboard/team/ConsultantEditPage";
import { ConsultantInfoPage } from "../../components/dashboard/team/ConsultantInfoPage";
import { ConsultantRemovePage } from "../../components/dashboard/team/ConsultantRemovePage";
import DashboardAgencyEditPage from "./DashboardAgencyEditPage";
import { AgencyProfilePage } from "./AgencyProfilePage";
import DashboardChatPage from "./DashboardChatPage";
import DashboardPaymentPage from "./DashboardPaymenPage";
import { getActiveAuthRole, getStoredAuthSession } from "../../auth/auth-storage";
import { REAL_ESTATE_MANAGER } from "../../constants/roles.constants";
import { RequestManagementView } from "../requests/RequestManagementView";

export function DashboardHomePage() {
  return <DashboardHomeOverview />;
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
  if (typeof window !== "undefined" && window.matchMedia("(min-width: 501px)").matches) {
    return <DashboardAgencyEditPage />;
  }

  return <AgencyProfilePage />;
}

export function DashboardMessagesPage() {
  return <DashboardChatPage />;
}
