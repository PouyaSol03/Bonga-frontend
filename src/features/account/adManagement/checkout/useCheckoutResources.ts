import {
  useAdvertisementCheckoutQuery,
  useAgencyAdvertisementCheckoutQuery,
  useConsultantAdvertisementCheckoutQuery,
  useSubmitAdvertisementCheckoutMutation,
  useSubmitAgencyAdvertisementCheckoutMutation,
  useSubmitConsultantAdvertisementCheckoutMutation,
} from "../../../advertisements/api/advertisement.hooks";
import { useAgentEntitlementsQuery } from "../../../packages/api/package.hooks";
import { useWalletQuery } from "../../api/account.hooks";
import type { CheckoutContext } from "./useCheckoutContext";
export function useCheckoutResources(
  advertiseId: string,
  { isAgencyCheckout, isConsultantCheckout, isBusinessRole }: CheckoutContext,
) {
  const personalCheckoutQuery = useAdvertisementCheckoutQuery(
    advertiseId,
    !isAgencyCheckout && !isConsultantCheckout,
  );
  const agencyCheckoutQuery = useAgencyAdvertisementCheckoutQuery(advertiseId, isAgencyCheckout);
  const consultantCheckoutQuery = useConsultantAdvertisementCheckoutQuery(
    advertiseId,
    isConsultantCheckout,
  );
  const personalCheckoutMutation = useSubmitAdvertisementCheckoutMutation();
  const agencyCheckoutMutation = useSubmitAgencyAdvertisementCheckoutMutation();
  const consultantCheckoutMutation = useSubmitConsultantAdvertisementCheckoutMutation();
  const checkoutQuery = isAgencyCheckout
    ? agencyCheckoutQuery
    : isConsultantCheckout
      ? consultantCheckoutQuery
      : personalCheckoutQuery;
  const checkoutPending = isAgencyCheckout
    ? agencyCheckoutMutation.isPending
    : isConsultantCheckout
      ? consultantCheckoutMutation.isPending
      : personalCheckoutMutation.isPending;
  const agentEntitlementsQuery = useAgentEntitlementsQuery({ enabled: isBusinessRole });
  const walletQuery = useWalletQuery();
  return {
    checkoutQuery,
    checkoutPending,
    personalCheckoutMutation,
    agencyCheckoutMutation,
    consultantCheckoutMutation,
    agentEntitlementsQuery,
    walletQuery,
  };
}
export type CheckoutResources = ReturnType<typeof useCheckoutResources>;
