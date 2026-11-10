import { TopBar } from "../../../../shared/components/TopBar";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { Button } from "../../../../shared/ui/Button";
import type { AgencyCombinedCheckoutProps } from "./agencyCheckoutTypes";
import { AgencyPaymentMethods } from "./AgencyPaymentMethods";
import { AgencyPublishCost } from "./AgencyPublishCost";
import { consultantUpgradeDisabledWarning } from "./checkoutUpgrades";
import { DisabledUpgradeOptionsSection } from "./DisabledUpgradeOptionsSection";
import { useAgencyUpgradeSelection } from "./useAgencyUpgradeSelection";
export function AgencyCombinedCheckoutView({
  byConsultantMethod,
  children,
  creditCost,
  creditAvailable,
  creditBalances: propCreditBalances,
  creditMethod,
  creditPaymentMethod,
  creditShortage,
  gatewayMethod,
  method,
  onBack,
  onMethodChange,
  onSubmit,
  payableAmount,
  pending,
  price,
  showByConsultant = false,
  onlyShowByConsultant = false,
  showPurchaseDetails = true,
  title = "پرداخت",
  upgradeItems = [],
  walletMethod,
}: AgencyCombinedCheckoutProps) {
  const selection = useAgencyUpgradeSelection({
    byConsultantMethod,
    children,
    creditCost,
    creditAvailable,
    creditBalances: propCreditBalances,
    creditMethod,
    creditPaymentMethod,
    creditRemaining: 0,
    creditShortage,
    gatewayMethod,
    method,
    onBack,
    onMethodChange,
    onSubmit,
    payableAmount,
    pending,
    price,
    showByConsultant,
    onlyShowByConsultant,
    showPurchaseDetails,
    title,
    upgradeItems,
    walletMethod,
  });
  const {
    selectedUpgradeProducts,
    upgradeSelectionEnabled,
    creditBalances,
    toggleUpgrade,
    publishCostLabel,
    submitLabel,
    selectedMethodAvailable,
  } = selection;
  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex h-full min-h-0 flex-1 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        className="bg-surface-container [&_button]:text-on-surface"
        onBack={onBack ?? (() => window.history.back())}
        title={title}
      />

      {children}

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-6">
        <section className="bg-surface-container-lowest" aria-label="هزینه ثبت آگهی و روش پرداخت">
          {showPurchaseDetails && !onlyShowByConsultant ? (
            <>
              <AgencyPublishCost publishCostLabel={publishCostLabel} />
            </>
          ) : null}

          <AgencyPaymentMethods
            {...selection}
            method={method}
            onMethodChange={onMethodChange}
            showByConsultant={showByConsultant}
            onlyShowByConsultant={onlyShowByConsultant}
            creditMethod={creditMethod}
          />
        </section>

        {showPurchaseDetails && !onlyShowByConsultant ? (
          <>
            <div className="bg-surface-container h-2" aria-hidden="true" />
            <DisabledUpgradeOptionsSection
              creditBalances={creditBalances}
              disabledWarning={consultantUpgradeDisabledWarning}
              enabled={upgradeSelectionEnabled}
              isCreditMethod={method === "ad_credit"}
              onToggle={toggleUpgrade}
              selectedProducts={selectedUpgradeProducts}
              upgradeItems={upgradeItems}
            />
          </>
        ) : null}
      </main>

      <footer className="border-outline-var/30 bg-surface-container-lowest shrink-0 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_rgba(26,26,26,0.06)]">
        <Button
          unstyled
          className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedMethodAvailable || pending}
          onClick={() => onSubmit(upgradeSelectionEnabled ? selectedUpgradeProducts : [])}
          type="button"
        >
          {pending ? "در حال پردازش پرداخت..." : submitLabel}
        </Button>
      </footer>
    </PageFrame>
  );
}
