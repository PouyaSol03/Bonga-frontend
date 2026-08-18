import { getActiveAuthRole, getStoredAuthSession } from "../../../shared/auth/auth-storage";
import { REAL_ESTATE_MANAGER } from "../../../shared/constants/roles.constants";
import { IndependentConsultantCreditPage } from "../credit/independentConsultantCreditViews";

export function IndependentConsultantPanelCreditPage() {
  const activeRole = getActiveAuthRole(getStoredAuthSession());

  return (
    <IndependentConsultantCreditPage
      view={activeRole === REAL_ESTATE_MANAGER ? "panel-bonus" : "panel"}
    />
  );
}
