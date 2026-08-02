import { getActiveAuthRole, getStoredAuthSession } from "../../../core/auth/auth-storage";
import { REAL_ESTATE_MANAGER } from "../../../shared/constants/roles.constants";
import { IndependentConsultantCreditPage as CreditPage } from "./independentConsultantCreditViews";

export function IndependentConsultantPanelCreditPage() {
  const activeRole = getActiveAuthRole(getStoredAuthSession());

  return (
    <CreditPage
      view={activeRole === REAL_ESTATE_MANAGER ? "panel-bonus" : "panel"}
    />
  );
}

export function IndependentConsultantPanelCreditBonusPage() {
  return <CreditPage view="panel-bonus" />;
}

export function IndependentConsultantCreditPackagesPage() {
  return <CreditPage view="packages" />;
}
