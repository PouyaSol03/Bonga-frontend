import { Typography } from "../../../../shared/ui/Typography";
import type { CrmRecord } from "../../api/crm.service";
import { readText } from "../paymentBankHelpers";
import {
  readPaymentMethod,
  readPaymentStatus,
  readPaymentStatusLabel,
} from "../paymentHelpers";

export function PaymentStatusBadge({ payment }: { payment: CrmRecord }) {
  const status = readPaymentStatus(payment);
  const config = {
    failed: "bg-[#fff0f0] text-[#cc3342]",
    pending: "bg-[#fff3e8] text-[#ff6d00]",
    success: "bg-[#ebfaf3] text-[#0b8b55]",
    unknown: "bg-[#f1f3f6] text-[#697587]",
  }[status];

  return (
    <Typography
      as="span"
      variant="label"
      size="small"
      weight="semibold"
      className={`inline-flex min-w-[92px] justify-center rounded-full px-2.5 py-1.5 text-xs font-bold ${config}`}
    >
      {readPaymentStatusLabel(payment)}
    </Typography>
  );
}

export function PaymentMethodBadge({ payment }: { payment: CrmRecord }) {
  const method = readPaymentMethod(payment);
  const config = {
    gateway: { label: "درگاه بانکی", style: "bg-[#eef4ff] text-[#0048c4]" },
    wallet: { label: "کیف پول / اعتبار", style: "bg-[#f3efff] text-[#6a3cc3]" },
    unknown: {
      label: readText(payment, ["method", "payment_method"], "نامشخص"),
      style: "bg-[#f1f3f6] text-[#697587]",
    },
  }[method];

  return (
    <Typography
      as="span"
      variant="label"
      size="small"
      weight="semibold"
      className={`inline-flex rounded-lg px-2.5 py-1.5 text-xs font-bold whitespace-nowrap ${config.style}`}
    >
      {config.label}
    </Typography>
  );
}
