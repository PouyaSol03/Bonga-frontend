import { useMemo } from "react";

import type { AdvertisementCheckoutPaymentMethod } from "../../../advertisements/api/advertisement.service";
import { getCheckoutMethod } from "./checkoutLookup";
import { getCreditBalances, toSafeNumber } from "./checkoutNumbers";
import type { CheckoutContext } from "./useCheckoutContext";
import type { CheckoutResources } from "./useCheckoutResources";
export function useCheckoutBalances(
  { checkoutQuery, agentEntitlementsQuery, walletQuery }: CheckoutResources,
  { isAgencyCheckout, usesAgencyCheckoutOptions }: CheckoutContext,
) {
  const fetchedCreditBalances = useMemo(() => {
    const checkoutData = checkoutQuery.data;
    const checkoutMethod = checkoutData
      ? (getCheckoutMethod(checkoutData, isAgencyCheckout ? "ad_credit" : "package_credit") ??
        getCheckoutMethod(checkoutData, "ad_credit"))
      : undefined;
    const fallback = getCreditBalances(checkoutMethod);
    return {
      ad_credit: agentEntitlementsQuery.data?.adCreditBalance ?? fallback.ad_credit,
      special_credit: agentEntitlementsQuery.data?.specialCreditBalance ?? fallback.special_credit,
      renew_credit: agentEntitlementsQuery.data?.renewCreditBalance ?? fallback.renew_credit,
    };
  }, [agentEntitlementsQuery.data, checkoutQuery.data, isAgencyCheckout]);
  const checkout = checkoutQuery.data;
  const rawWalletMethod = checkout ? getCheckoutMethod(checkout, "wallet") : undefined;
  const userWalletBalance = toSafeNumber(walletQuery.data?.credit, 0);
  const walletMethod: AdvertisementCheckoutPaymentMethod | undefined = useMemo(() => {
    if (rawWalletMethod) {
      return {
        ...rawWalletMethod,
        available: true,
        balance:
          rawWalletMethod.balance !== undefined
            ? toSafeNumber(rawWalletMethod.balance)
            : userWalletBalance,
      };
    }
    if (!checkout) return undefined;
    return {
      available: true,
      balance: userWalletBalance,
      method: "wallet",
    };
  }, [checkout, rawWalletMethod, userWalletBalance]);
  const gatewayMethod = checkout ? getCheckoutMethod(checkout, "gateway") : undefined;
  const packageCreditMethod: AdvertisementCheckoutPaymentMethod | undefined = useMemo(() => {
    const fromCheckout = checkout
      ? (getCheckoutMethod(checkout, isAgencyCheckout ? "ad_credit" : "package_credit") ??
        getCheckoutMethod(checkout, "ad_credit"))
      : undefined;

    if (fromCheckout) {
      return {
        ...fromCheckout,
        balance: fetchedCreditBalances.ad_credit,
        remaining: fetchedCreditBalances.ad_credit,
        balances: {
          ...fromCheckout.balances,
          ad_credit: fetchedCreditBalances.ad_credit,
          renew_credit: fetchedCreditBalances.renew_credit,
          special_credit: fetchedCreditBalances.special_credit,
        },
      };
    }

    if (usesAgencyCheckoutOptions) {
      return {
        available: fetchedCreditBalances.ad_credit > 0,
        balance: fetchedCreditBalances.ad_credit,
        balances: fetchedCreditBalances,
        method: "ad_credit",
      };
    }

    return undefined;
  }, [checkout, isAgencyCheckout, usesAgencyCheckoutOptions, fetchedCreditBalances]);
  return { fetchedCreditBalances, walletMethod, gatewayMethod, packageCreditMethod };
}
export type CheckoutBalances = ReturnType<typeof useCheckoutBalances>;
