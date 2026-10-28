import { REAL_ESTATE_MANAGER } from "../../../../shared/constants/roles.constants";
import type { AdvertisementCheckout } from "../../../advertisements/api/advertisement.service";
import { useAgencyConsultantsQuery } from "../../../agencies/api/agency.hooks";
import { getCheckoutMethod } from "./checkoutLookup";
import type { CheckoutContext } from "./useCheckoutContext";
export function useConsultantCheckout(
  checkout: AdvertisementCheckout | undefined,
  {
    routeState,
    managerPermissions,
    isAgencyConsultantWithAdManagement,
    authSession,
    activeRole,
    activeV2Role,
  }: CheckoutContext,
) {
  const checkoutRecord = checkout as Record<string, unknown> | undefined;
  const contextRecord = checkoutRecord?.context as Record<string, unknown> | undefined;
  const targetConsultantId =
    routeState.consultantId ||
    (routeState.ad as Record<string, unknown> | undefined)?.consultant_id ||
    (routeState.ad as Record<string, unknown> | undefined)?.assigned_consultant_id ||
    (routeState.ad as Record<string, unknown> | undefined)?.assignedConsultantId ||
    (routeState.ad as Record<string, unknown> | undefined)?.publisher_agent_id ||
    checkoutRecord?.consultant_id ||
    checkoutRecord?.assigned_consultant_id ||
    checkoutRecord?.agent_id ||
    contextRecord?.consultant_id ||
    contextRecord?.assigned_consultant_id ||
    contextRecord?.agent_id ||
    (typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("consultant_id") ||
        new URLSearchParams(window.location.search).get("consultantId")
      : null);

  const hasConsultantManagementPermission = Boolean(managerPermissions?.manage_consultants);
  const isAgencyConsultantWithFullPermissions =
    isAgencyConsultantWithAdManagement && hasConsultantManagementPermission;

  const consultantsQuery = useAgencyConsultantsQuery({
    enabled: isAgencyConsultantWithFullPermissions,
    page: 1,
    perPage: 100,
  });
  const currentUserId = authSession?.userId;
  const currentMobile = authSession?.mobile;
  const myConsultant = (consultantsQuery.data?.data ?? []).find(
    (c) =>
      (currentUserId &&
        (String(c.userId) === String(currentUserId) ||
          String(c.agentId) === String(currentUserId))) ||
      (currentMobile && c.mobile === currentMobile),
  );
  const myConsultantAgentId = myConsultant?.agentId ? String(myConsultant.agentId) : undefined;
  const myConsultantUserId = myConsultant?.userId ? String(myConsultant.userId) : undefined;

  const isOwnConsultant = Boolean(
    targetConsultantId &&
    ((myConsultantAgentId && String(targetConsultantId) === myConsultantAgentId) ||
      (myConsultantUserId && String(targetConsultantId) === myConsultantUserId) ||
      (currentUserId && String(targetConsultantId) === String(currentUserId))),
  );

  const hasChangedConsultant = Boolean(
    targetConsultantId &&
    !isOwnConsultant &&
    (routeState.consultantAssignmentSelected ||
      routeState.consultantChanged ||
      routeState.consultantId ||
      routeState.publisherType === "consultant" ||
      routeState.publisherType === "agent" ||
      Boolean(targetConsultantId)),
  );

  const onlyShowByConsultant = Boolean(
    isAgencyConsultantWithFullPermissions && hasChangedConsultant,
  );

  const canSendToConsultant =
    activeRole === REAL_ESTATE_MANAGER ||
    activeV2Role === "agency" ||
    isAgencyConsultantWithAdManagement;

  const showByConsultant = Boolean(
    (canSendToConsultant && Boolean(targetConsultantId)) || onlyShowByConsultant,
  );

  const rawByConsultantMethod = checkout
    ? (getCheckoutMethod(checkout, "by_consultant") ?? getCheckoutMethod(checkout, "consultant"))
    : undefined;
  const byConsultantMethod =
    rawByConsultantMethod ??
    (showByConsultant ? { method: "by_consultant", available: true } : undefined);
  return { targetConsultantId, onlyShowByConsultant, showByConsultant, byConsultantMethod };
}
export type ConsultantCheckout = ReturnType<typeof useConsultantCheckout>;
