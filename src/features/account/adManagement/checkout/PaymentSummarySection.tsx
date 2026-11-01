import { Typography } from "../../../../shared/ui/Typography";
import { formatTariffToman } from ".././AdTariffOptionsView";
import type { ApiPaymentCheckoutProps } from "./paymentCheckoutTypes";
import { SummaryRow } from "./SummaryRow";
export function PaymentSummarySection({
  totalPrice,
  payableAmount,
}: Pick<ApiPaymentCheckoutProps, "totalPrice" | "payableAmount">) {
  const discount = Math.max(totalPrice - payableAmount, 0);
  return (
    <section className="bg-surface-container-lowest mt-2 px-4 pt-5 pb-6" aria-label="خلاصه پرداخت">
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 mb-4 text-right text-base leading-6 font-semibold"
      >
        خلاصه پرداخت
      </Typography>
      <SummaryRow label="قیمت" value={formatTariffToman(totalPrice)} />
      <SummaryRow label="تخفیف" value={formatTariffToman(discount)} />
      <div className="border-outline-var my-4 border-t border-dashed" aria-hidden="true" />
      <SummaryRow
        iconClassName="h-6 w-6 text-primary"
        label="جمع پرداختی"
        labelClassName="text-right text-base font-semibold text-on-surface"
        value={formatTariffToman(payableAmount)}
        valueClassName="text-lg font-bold text-primary"
      />
    </section>
  );
}
