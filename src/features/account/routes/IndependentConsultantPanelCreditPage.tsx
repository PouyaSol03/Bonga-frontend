import { Navigate } from "react-router";
import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
} from "../../../shared/constants/roles.constants";
import { IndependentConsultantCreditPage } from "../credit/independentConsultantCreditViews";

export function IndependentConsultantPanelCreditPage() {
  const activeRole = getActiveAuthRole(getStoredAuthSession());
  const isConsultant =
    activeRole === REAL_ESTATE_CONSULTANT || activeRole === INDEPENDENT_CONSULTANT;

  if (isConsultant) {
    return <Navigate to="/account/credit/packages" replace />;
  }

  return (
    <IndependentConsultantCreditPage
      view={activeRole === REAL_ESTATE_MANAGER ? "panel-bonus" : "panel"}
    />
  );
}
