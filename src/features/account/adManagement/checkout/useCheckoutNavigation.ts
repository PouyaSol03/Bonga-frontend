import { useEffect, useMemo } from "react";

import { useNavigate } from "react-router";
import { getApiErrorCode } from "../../../../shared/api/api";
import { getAdStatePath } from ".././adManagementData";
import type { CheckoutContext } from "./useCheckoutContext";
export function useCheckoutNavigation(
  advertiseId: string,
  context: CheckoutContext,
  checkoutError: unknown,
) {
  const navigate = useNavigate();
  const {
    routeState,
    adsHomePath,
    isNewAdCheckout,
    isAgencyAllocationCheckout,
    isConsultantAssignedCheckout,
  } = context;
  const stateAdPath = getAdStatePath(advertiseId);
  const publishState = useMemo(
    () => ({
      ad: routeState.ad,
      assignment: routeState.assignment,
      assignmentId: routeState.assignmentId,
      card: routeState.card ?? routeState.ad,
      consultantId: routeState.consultantId,
      publisherType: routeState.publisherType,
      returnTo: adsHomePath,
      showPaymentSuccess: true,
      status: isNewAdCheckout ? "pending" : "published",
      tab: "status" as const,
    }),
    [
      adsHomePath,
      isNewAdCheckout,
      routeState.ad,
      routeState.assignment,
      routeState.assignmentId,
      routeState.card,
      routeState.consultantId,
      routeState.publisherType,
    ],
  );
  useEffect(() => {
    if (getApiErrorCode(checkoutError) !== "AD_WAITING_FOR_AGENCY") return;

    navigate(stateAdPath, {
      replace: true,
      state: {
        returnTo: adsHomePath,
        status: "wait_for_agency",
        tab: "status",
      },
    });
  }, [checkoutError, stateAdPath, adsHomePath, navigate]);
  const checkoutBackTo = isAgencyAllocationCheckout
    ? `/account/ad-management/allocation-review/${encodeURIComponent(advertiseId)}`
    : isConsultantAssignedCheckout
      ? "/account/ad-management/allocation"
      : isNewAdCheckout
        ? adsHomePath
        : "/new-ad";

  const leaveNewAdPayment = () => {
    navigate(adsHomePath, { replace: true, state: { tab: "status" } });
  };
  return { publishState, stateAdPath, checkoutBackTo, leaveNewAdPayment };
}
export type CheckoutNavigation = ReturnType<typeof useCheckoutNavigation>;
