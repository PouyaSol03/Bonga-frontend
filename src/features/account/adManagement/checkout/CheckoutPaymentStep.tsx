import { useNavigate } from "react-router";
import { AgencyCombinedCheckoutView } from "./AgencyCombinedCheckoutView";
import { ApiPaymentCheckoutView } from "./ApiPaymentCheckoutView";
import type { CheckoutPricing } from "./checkoutPricing";
import type { AgencyPaymentMethod, PaymentMethod, PaymentStep } from "./checkoutTypes";
import type { CheckoutBalances } from "./useCheckoutBalances";
import type { CheckoutContext } from "./useCheckoutContext";
import { useCheckoutDiscount } from "./useCheckoutDiscount";
import type { CheckoutNavigation } from "./useCheckoutNavigation";
import type { CheckoutResources } from "./useCheckoutResources";
import { useCheckoutSubmission } from "./useCheckoutSubmission";
import type { ConsultantCheckout } from "./useConsultantCheckout";
export function CheckoutPaymentStep({
  context,
  resources,
  balances,
  pricing,
  consultant,
  navigation,
  agencyMethod,
  setAgencyMethod,
  method,
  setMethod,
  setStep,
  selectedUpgradeProducts,
  discount,
  finishCheckout,
}: {
  context: CheckoutContext;
  resources: CheckoutResources;
  balances: CheckoutBalances;
  pricing: CheckoutPricing;
  consultant: ConsultantCheckout;
  navigation: CheckoutNavigation;
  agencyMethod: AgencyPaymentMethod;
  setAgencyMethod: (method: AgencyPaymentMethod) => void;
  method: PaymentMethod;
  setMethod: (method: PaymentMethod) => void;
  setStep: (step: PaymentStep) => void;
  selectedUpgradeProducts: string[];
  discount: ReturnType<typeof useCheckoutDiscount>;
  finishCheckout: ReturnType<typeof useCheckoutSubmission>;
}) {
  const navigate = useNavigate();
  const { combineCheckoutSteps, usesAgencyCheckoutOptions, isNewAdCheckout } = context;
  const { checkoutPending } = resources;
  const { fetchedCreditBalances, gatewayMethod, walletMethod, packageCreditMethod } = balances;
  const {
    agencyCreditCost,
    agencyCreditAvailable,
    agencyCreditMethod,
    agencyCreditRemaining,
    agencyCreditShortage,
    payableAmount,
    publishPrice,
    upgradeItems,
    finalPayable,
    totalPrice,
  } = pricing;
  const { byConsultantMethod, showByConsultant, onlyShowByConsultant } = consultant;
  const { leaveNewAdPayment, stateAdPath } = navigation;
  const {
    appliedDiscount,
    discountError,
    discountInput,
    discountLoading,
    handleApplyDiscount,
    setDiscountInput,
    setDiscountError,
    handleRemoveDiscount,
  } = discount;
  if (combineCheckoutSteps) {
    return (
      <AgencyCombinedCheckoutView
        byConsultantMethod={byConsultantMethod}
        creditCost={agencyCreditCost}
        creditAvailable={agencyCreditAvailable}
        creditBalances={fetchedCreditBalances}
        creditMethod={agencyCreditMethod}
        creditPaymentMethod={packageCreditMethod}
        creditRemaining={agencyCreditRemaining}
        creditShortage={agencyCreditShortage}
        gatewayMethod={gatewayMethod}
        method={agencyMethod}
        onBack={
          isNewAdCheckout ? leaveNewAdPayment : () => navigate(stateAdPath, { replace: true })
        }
        onMethodChange={setAgencyMethod}
        onSubmit={(extraItems) => finishCheckout(agencyMethod, extraItems)}
        payableAmount={payableAmount}
        pending={checkoutPending}
        price={publishPrice}
        showByConsultant={showByConsultant}
        onlyShowByConsultant={onlyShowByConsultant}
        title="پرداخت"
        upgradeItems={upgradeItems}
        walletMethod={walletMethod}
      ></AgencyCombinedCheckoutView>
    );
  }

  if (usesAgencyCheckoutOptions) {
    return (
      <AgencyCombinedCheckoutView
        byConsultantMethod={byConsultantMethod}
        creditCost={agencyCreditCost}
        creditAvailable={agencyCreditAvailable}
        creditBalances={fetchedCreditBalances}
        creditMethod={agencyCreditMethod}
        creditPaymentMethod={packageCreditMethod}
        creditRemaining={agencyCreditRemaining}
        creditShortage={agencyCreditShortage}
        gatewayMethod={gatewayMethod}
        method={agencyMethod}
        onBack={isNewAdCheckout ? leaveNewAdPayment : () => setStep("options")}
        onMethodChange={setAgencyMethod}
        onSubmit={(extraItems) => finishCheckout(agencyMethod, extraItems)}
        payableAmount={payableAmount}
        pending={checkoutPending}
        price={publishPrice}
        showByConsultant={showByConsultant}
        onlyShowByConsultant={onlyShowByConsultant}
        showPurchaseDetails={false}
        title="پرداخت"
        upgradeItems={upgradeItems}
        walletMethod={walletMethod}
      ></AgencyCombinedCheckoutView>
    );
  }

  return (
    <ApiPaymentCheckoutView
      appliedDiscount={appliedDiscount}
      discountError={discountError}
      discountInput={discountInput}
      discountLoading={discountLoading}
      gatewayMethod={gatewayMethod}
      method={method}
      onApplyDiscount={handleApplyDiscount}
      onBack={isNewAdCheckout ? leaveNewAdPayment : () => setStep("options")}
      onDiscountInputChange={(val) => {
        setDiscountInput(val);
        if (discountError) setDiscountError(null);
      }}
      onMethodChange={setMethod}
      onRemoveDiscount={handleRemoveDiscount}
      onSubmit={() =>
        finishCheckout(method === "wallet" ? "wallet" : "gateway", selectedUpgradeProducts)
      }
      payableAmount={finalPayable}
      pending={checkoutPending}
      totalPrice={totalPrice}
      walletMethod={walletMethod}
    ></ApiPaymentCheckoutView>
  );
}
