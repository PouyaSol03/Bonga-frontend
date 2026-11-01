import type { ReactNode } from "react";
import type { WalletPayment } from "../../api/account.service";
import { AdCardTomanIcon } from "../../../advertisements/components/AdCardIcons";
import { Typography } from "../../../../shared/ui/Typography";
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

function PaymentHistoryRow({
  icon,
  label,
  value,
  valueColor = "var(--on-surface)",
}: {
  icon?: ReactNode;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="medium"
        className="text-outline shrink-0 leading-5 font-medium"
      >
        {label}
      </Typography>

      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="medium"
        className="flex min-w-0 items-center gap-1 text-left font-medium"
        style={{ color: valueColor }}
      >
        {value}
        {icon}
      </Typography>
    </div>
  );
}
