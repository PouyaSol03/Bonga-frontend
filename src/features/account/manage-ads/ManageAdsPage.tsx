import { useActiveAuthRole } from "../../../shared/auth/use-active-auth-role";
import { DASHBOARD_ROLES } from "../../../shared/constants/roles.constants";
import { BusinessAdManagementView } from "./BusinessAdManagementView";
import { PersonalMyAdsView } from "./PersonalMyAdsView";

export function ManageAdsPage() {
  const activeRole = useActiveAuthRole();
  const isBusinessUser = activeRole ? DASHBOARD_ROLES.includes(activeRole) : false;

  return isBusinessUser ? <BusinessAdManagementView /> : <PersonalMyAdsView />;
}
