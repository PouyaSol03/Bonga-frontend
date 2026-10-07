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
  getActiveAuthRole,
  getStoredAuthSession,
} from "../../shared/auth/auth-storage";
import {
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../shared/constants/roles.constants";
import { RequestManagementView } from "../property-requests/RequestManagementView";

export function DashboardRequestsPage() {
  const session = getStoredAuthSession();
  const activeRole = getActiveAuthRole(session);
  const canManageRequests = Boolean(session?.managerPermissions?.manage_requests);
  const showReceivedTab =
    activeRole === REAL_ESTATE_MANAGER ||
    (activeRole === REAL_ESTATE_CONSULTANT && canManageRequests);

  return (
    <RequestManagementView
      backTo="/account/dashboard"
      showReceivedTab={showReceivedTab}
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
