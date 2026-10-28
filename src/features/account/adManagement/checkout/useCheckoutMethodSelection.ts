import { useEffect } from "react";

import type { AdvertisementCheckout } from "../../../advertisements/api/advertisement.service";
import { toSafeNumber } from "./checkoutNumbers";
import type { CheckoutPricing } from "./checkoutPricing";
import type { AgencyPaymentMethod, PaymentMethod } from "./checkoutTypes";
import type { CheckoutBalances } from "./useCheckoutBalances";
import type { ConsultantCheckout } from "./useConsultantCheckout";
export function useCheckoutMethodSelection(
  checkout: AdvertisementCheckout | undefined,
  { gatewayMethod, walletMethod }: CheckoutBalances,
  {
    agencyCreditMethod,
    agencyCreditAvailable,
    agencyCreditShortage,
    hasFreeQuota,
    payableAmount,
    is100PercentDiscount,
  }: CheckoutPricing,
  { onlyShowByConsultant, showByConsultant, byConsultantMethod }: ConsultantCheckout,
  usesAgencyCheckoutOptions: boolean,
  agencyMethod: AgencyPaymentMethod,
  setAgencyMethod: (method: AgencyPaymentMethod) => void,
  method: PaymentMethod,
  setMethod: (method: PaymentMethod) => void,
) {
  useEffect(() => {
    if (!checkout) return;

    const timer = setTimeout(() => {
      const gatewayAvailable = gatewayMethod?.available !== false;
      const walletBalance = toSafeNumber(walletMethod?.balance);
      const walletRequired = toSafeNumber(walletMethod?.required, payableAmount);
      const walletShortage = Math.max(
        toSafeNumber(walletMethod?.shortage, walletRequired - walletBalance),
        0,
      );
      const walletAvailable = Boolean(walletMethod && walletShortage <= 0);
      const walletSelectable = Boolean(walletMethod);
      const creditSelectable = Boolean(
        agencyCreditMethod && (agencyCreditAvailable || agencyCreditShortage > 0),
      );

      if (usesAgencyCheckoutOptions) {
        if (onlyShowByConsultant) {
          if (agencyMethod !== "by_consultant") {
            setAgencyMethod("by_consultant");
          }
          return;
        }

        const byConsultantAvailable = showByConsultant && byConsultantMethod?.available !== false;
        const currentMethodSelectable =
          ((agencyMethod === "free_quota" ||
            agencyMethod === "package_credit" ||
            agencyMethod === "ad_credit") &&
            agencyMethod === agencyCreditMethod &&
            creditSelectable) ||
          (agencyMethod === "by_consultant" && byConsultantAvailable) ||
          (agencyMethod === "wallet" && walletSelectable) ||
          (agencyMethod === "gateway" && gatewayAvailable && Boolean(gatewayMethod));

        if (currentMethodSelectable) return;

        if (byConsultantAvailable) {
          setAgencyMethod("by_consultant");
        } else if (agencyCreditMethod && agencyCreditAvailable) {
          setAgencyMethod(agencyCreditMethod);
        } else if (walletAvailable) {
          setAgencyMethod("wallet");
        } else if (gatewayAvailable && gatewayMethod) {
          setAgencyMethod("gateway");
        } else if (creditSelectable && agencyCreditMethod) {
          setAgencyMethod(agencyCreditMethod);
        } else if (walletSelectable) {
          setAgencyMethod("wallet");
        }

        return;
      }

      if (gatewayAvailable && walletShortage > 0) {
        setMethod("online");
      } else if (!gatewayAvailable && walletAvailable) {
        setMethod("wallet");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [
    agencyMethod,
    setAgencyMethod,
    setMethod,
    agencyCreditAvailable,
    agencyCreditMethod,
    agencyCreditShortage,
    byConsultantMethod,
    checkout,
    gatewayMethod,
    hasFreeQuota,
    onlyShowByConsultant,
    payableAmount,
    showByConsultant,
    usesAgencyCheckoutOptions,
    walletMethod,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (is100PercentDiscount && method === "online") {
        setMethod("wallet");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [is100PercentDiscount, method, setMethod]);
}
