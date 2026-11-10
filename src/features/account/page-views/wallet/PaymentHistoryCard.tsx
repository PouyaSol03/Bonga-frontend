import type { WalletPayment } from "../../api/account.service";
import { AdCardTomanIcon } from "../../../advertisements/components/AdCardIcons";
import { PaymentHistoryRow } from "../../components/payment/PaymentHistoryRow";
import {
  formatMoney,
  formatPaymentDate,
  readPaymentStatus,
  readPaymentStatusColor,
} from "../common/formatting";

export function PaymentHistoryCard({ payment }: { payment: WalletPayment }) {
  return (
    <article className="border-outline-var bg-surface-container-lowest flex flex-col gap-y-2 border-b p-4 text-right">
      <PaymentHistoryRow
        label="وضعیت"
        value={readPaymentStatus(payment)}
        valueColor={readPaymentStatusColor(payment)}
      />

      <PaymentHistoryRow
        icon={<AdCardTomanIcon className="text-on-surface-var h-6 w-6" />}
        label="هزینه"
        value={formatMoney(payment.price ?? 0)}
      />

      <PaymentHistoryRow label="زمان پرداخت" value={formatPaymentDate(payment.created_at)} />

      <PaymentHistoryRow label="شناسه پرداخت" value={String(payment.ref_id ?? "-")} />
    </article>
  );
}
