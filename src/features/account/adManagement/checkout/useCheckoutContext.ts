import { getActiveV2Role } from "../../../../shared/api/api";
import { getActiveAuthRole, getStoredAuthSession } from "../../../../shared/auth/auth-storage";
import {
  INDEPENDENT_CONSULTANT,
  REAL_ESTATE_CONSULTANT,
  REAL_ESTATE_MANAGER,
  USER,
} from "../../../../shared/constants/roles.constants";
import {
  adManagementPaths,
  getAdManagementRouteState,
  hasAgencyAllocationCheckoutMarker,
  hasNewAdCheckoutMarker,
} from ".././adManagementData";
export function useCheckoutContext(advertiseId: string) {
  const routeState = getAdManagementRouteState();
  const authSession = getStoredAuthSession();
  const activeRole = getActiveAuthRole(authSession);
  const activeV2Role = getActiveV2Role();
  const managerPermissions =
    authSession?.contextPermissions?.real_estate_consultant ?? authSession?.managerPermissions;
  const hasAdManagementPermission = Boolean(
    managerPermissions?.manage_advertises ?? managerPermissions?.ad_management,
  );
  const isAgencyConsultantWithAdManagement =
    (activeRole === REAL_ESTATE_CONSULTANT || activeV2Role === "agency-consultant") &&
    hasAdManagementPermission;

  const adsHomePath = adManagementPaths.root;
  const isBusinessRole =
    activeRole !== USER &&
    Boolean(
      activeRole === REAL_ESTATE_MANAGER ||
      activeRole === REAL_ESTATE_CONSULTANT ||
      activeRole === INDEPENDENT_CONSULTANT,
    );
  const isAgencyAllocationCheckout =
    routeState.paymentFlow === "agency-allocation" ||
    hasAgencyAllocationCheckoutMarker(advertiseId);
  const isNewAdCheckout =
    routeState.paymentFlow === "new-ad" || hasNewAdCheckoutMarker(advertiseId);

  const isAgencyCheckout =
    activeRole === REAL_ESTATE_MANAGER ||
    activeV2Role === "agency" ||
    isAgencyConsultantWithAdManagement ||
    routeState.publisherType === "agency" ||
    routeState.isAgencyPublisher === true ||
    isAgencyAllocationCheckout;

  const isConsultantCheckout =
    !isAgencyCheckout &&
    (activeRole === REAL_ESTATE_CONSULTANT ||
      routeState.publisherType === "agent" ||
      routeState.publisherType === "consultant");

  const isConsultantAssignedCheckout = isConsultantCheckout;
  const usesAgencyCheckoutOptions = isBusinessRole || isAgencyCheckout;
  const combineCheckoutSteps = isBusinessRole || isAgencyCheckout;
  return {
    routeState,
    authSession,
    activeRole,
    activeV2Role,
    managerPermissions,
    isAgencyConsultantWithAdManagement,
    adsHomePath,
    isBusinessRole,
    isAgencyAllocationCheckout,
    isNewAdCheckout,
    isAgencyCheckout,
    isConsultantCheckout,
    isConsultantAssignedCheckout,
    usesAgencyCheckoutOptions,
    combineCheckoutSteps,
  };
}
export type CheckoutContext = ReturnType<typeof useCheckoutContext>;
