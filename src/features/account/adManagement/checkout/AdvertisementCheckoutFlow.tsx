import { useState } from "react";

import { getApiErrorMessage } from "../../../../shared/api/api";
import { CheckoutPaymentStep } from "./CheckoutPaymentStep";
import { getCheckoutPricing } from "./checkoutPricing";
import { CheckoutStatusPage } from "./CheckoutStatusPage";
import { CheckoutTariffView } from "./CheckoutTariffView";
import type { AgencyPaymentMethod, PaymentMethod, PaymentStep } from "./checkoutTypes";
import { useCheckoutBalances } from "./useCheckoutBalances";
import { useCheckoutContext } from "./useCheckoutContext";
import { useCheckoutDiscount } from "./useCheckoutDiscount";
import { useCheckoutMethodSelection } from "./useCheckoutMethodSelection";
import { useCheckoutNavigation } from "./useCheckoutNavigation";
import { useCheckoutResources } from "./useCheckoutResources";
import { useCheckoutSubmission } from "./useCheckoutSubmission";
import { useConsultantCheckout } from "./useConsultantCheckout";
export function AdvertisementCheckoutFlow({ advertiseId }: { advertiseId: string }) {
  const context = useCheckoutContext(advertiseId);
  const resources = useCheckoutResources(advertiseId, context);
  const balances = useCheckoutBalances(resources, context);
  const consultant = useConsultantCheckout(resources.checkoutQuery.data, context);
  const navigation = useCheckoutNavigation(advertiseId, context, resources.checkoutQuery.error);
  const [step, setStep] = useState<PaymentStep>(context.routeState.paymentStep ?? "options");
  const [selectedUpgradeProducts, setSelectedUpgradeProducts] = useState<string[]>([]);
  const [method, setMethod] = useState<PaymentMethod>("online");
  const [agencyMethod, setAgencyMethod] = useState<AgencyPaymentMethod>("ad_credit");
  const basePricing = getCheckoutPricing(
    resources.checkoutQuery.data,
    selectedUpgradeProducts,
    null,
    balances,
    context,
  );
  const discount = useCheckoutDiscount(
    basePricing.totalPrice,
    basePricing.payableAmount,
    setMethod,
  );
  const pricing = getCheckoutPricing(
    resources.checkoutQuery.data,
    selectedUpgradeProducts,
    discount.appliedDiscount,
    balances,
    context,
  );
  const finishCheckout = useCheckoutSubmission(
    advertiseId,
    resources,
    context,
    navigation,
    consultant.targetConsultantId,
    discount.appliedDiscount,
  );
  useCheckoutMethodSelection(
    resources.checkoutQuery.data,
    balances,
    pricing,
    consultant,
    context.usesAgencyCheckoutOptions,
    agencyMethod,
    setAgencyMethod,
    method,
    setMethod,
  );
  const { checkoutQuery, agentEntitlementsQuery, checkoutPending } = resources;
  const { isBusinessRole, combineCheckoutSteps } = context;
  const { checkoutBackTo } = navigation;
  const checkout = checkoutQuery.data;
  const { hasFreeQuota, freeQuotaRemaining, publishPrice, upgradeItems } = pricing;
  const { setAppliedDiscount } = discount;
  function handleCompleteOptions() {
    if (hasFreeQuota && selectedUpgradeProducts.length === 0) {
      finishCheckout("free_quota");
      return;
    }

    setStep("checkout");
  }
  if (checkoutQuery.isLoading || (isBusinessRole && agentEntitlementsQuery.isLoading)) {
    return (
      <CheckoutStatusPage
        backTo={checkoutBackTo}
        isLoading
        message="در حال دریافت هزینه و روش‌های پرداخت آگهی..."
        title="هزینه ثبت آگهی"
      />
    );
  }

  if (checkoutQuery.isError || (isBusinessRole && agentEntitlementsQuery.isError) || !checkout) {
    return (
      <CheckoutStatusPage
        backTo={checkoutBackTo}
        message={getApiErrorMessage(
          checkoutQuery.error ?? agentEntitlementsQuery.error,
          "دریافت اطلاعات پرداخت و اعتبارها با خطا مواجه شد.",
        )}
        onRetry={() => {
          void checkoutQuery.refetch();
          if (isBusinessRole) void agentEntitlementsQuery.refetch();
        }}
        title="هزینه ثبت آگهی"
      />
    );
  }
  if (combineCheckoutSteps || step === "checkout") {
    return (
      <CheckoutPaymentStep
        context={context}
        resources={resources}
        balances={balances}
        pricing={pricing}
        consultant={consultant}
        navigation={navigation}
        agencyMethod={agencyMethod}
        setAgencyMethod={setAgencyMethod}
        method={method}
        setMethod={setMethod}
        setStep={setStep}
        selectedUpgradeProducts={selectedUpgradeProducts}
        discount={discount}
        finishCheckout={finishCheckout}
      />
    );
  }
  function toggleUpgrade(product: string) {
    setAppliedDiscount(null);
    setSelectedUpgradeProducts((current) => {
      const isSelected = current.includes(product);
      if (isSelected) return current.filter((item) => item !== product);

      if (product === "advertise_update_special") {
        return [
          ...current.filter((item) => item !== "advertise_update" && item !== "advertise_special"),
          product,
        ];
      }

      if (product === "advertise_update" || product === "advertise_special") {
        return [...current.filter((item) => item !== "advertise_update_special"), product];
      }

      return [...current, product];
    });
  }

  return (
    <CheckoutTariffView
      backTo={checkoutBackTo}
      freeQuotaRemaining={freeQuotaRemaining}
      hasFreeQuota={hasFreeQuota}
      onComplete={handleCompleteOptions}
      onToggleUpgrade={toggleUpgrade}
      pending={checkoutPending}
      price={publishPrice}
      selectedUpgradeProducts={selectedUpgradeProducts}
      upgradeItems={upgradeItems}
    ></CheckoutTariffView>
  );
}
