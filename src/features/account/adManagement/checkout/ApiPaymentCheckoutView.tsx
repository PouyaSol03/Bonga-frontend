import { TopBar } from "../../../../shared/components/TopBar";
import { PageFrame } from "../../../../shared/layout/PageFrame";
import { Button } from "../../../../shared/ui/Button";
import { formatShortPayment } from "../../../payments/components/formatShortPayment";
import { toSafeNumber } from "./checkoutNumbers";
import type { ApiPaymentCheckoutProps } from "./paymentCheckoutTypes";
import { PaymentDiscountSection } from "./PaymentDiscountSection";
import { PaymentSummarySection } from "./PaymentSummarySection";
import { PersonalPaymentMethods } from "./PersonalPaymentMethods";
export function ApiPaymentCheckoutView({
  appliedDiscount,
  children,
  discountError,
  discountInput = "",
  discountLoading = false,
  gatewayMethod,
  method,
  onApplyDiscount,
  onBack,
  onDiscountInputChange,
  onMethodChange,
  onRemoveDiscount,
  onSubmit,
  payableAmount,
  pending,
  totalPrice,
  walletMethod,
  submitLabelPrefix = "پرداخت و انتشار",
}: ApiPaymentCheckoutProps) {
  const is100PercentDiscount = Boolean(
    appliedDiscount?.is_free ||
    appliedDiscount?.disable_gateway ||
    (appliedDiscount && payableAmount === 0),
  );
  const walletBalance = toSafeNumber(walletMethod?.balance);
  const walletRequired = appliedDiscount
    ? Math.max(payableAmount, 0)
    : Math.max(toSafeNumber(walletMethod?.required), Math.max(payableAmount, 0));
  const walletDeficit = appliedDiscount
    ? Math.max(walletRequired - walletBalance, 0)
    : Math.max(toSafeNumber(walletMethod?.shortage), walletRequired - walletBalance, 0);
  const walletSupported = Boolean(walletMethod);
  const walletSufficient = is100PercentDiscount || walletDeficit <= 0;
  const gatewayAvailable =
    !is100PercentDiscount && gatewayMethod?.available !== false && Boolean(gatewayMethod);
  const selectedMethodAvailable = is100PercentDiscount
    ? true
    : method === "wallet"
      ? (walletSupported || payableAmount === 0) && walletSufficient
      : gatewayAvailable;

  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar className="[&_button]:text-on-surface" onBack={onBack} title="پرداخت" />

      {children}

      <main className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-[76px]">
        <PersonalPaymentMethods
          method={method}
          onMethodChange={onMethodChange}
          walletSupported={walletSupported}
          walletBalance={walletBalance}
          walletDeficit={walletDeficit}
          gatewayAvailable={gatewayAvailable}
          is100PercentDiscount={is100PercentDiscount}
        />

        <PaymentDiscountSection
          appliedDiscount={appliedDiscount}
          discountError={discountError}
          discountInput={discountInput}
          discountLoading={discountLoading}
          onApplyDiscount={onApplyDiscount}
          onDiscountInputChange={onDiscountInputChange}
          onRemoveDiscount={onRemoveDiscount}
        />

        <PaymentSummarySection totalPrice={totalPrice} payableAmount={payableAmount} />
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-3 pb-3 shadow-sm">
        <Button
          unstyled
          className="bg-primary text-on-primary inline-flex h-11 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!selectedMethodAvailable || pending}
          onClick={onSubmit}
          type="button"
        >
          {pending
            ? "در حال پردازش پرداخت..."
            : is100PercentDiscount
              ? "تأیید و ثبت رایگان"
              : `${submitLabelPrefix} - ${formatShortPayment(payableAmount)}`}
        </Button>
      </footer>
    </PageFrame>
  );
}
