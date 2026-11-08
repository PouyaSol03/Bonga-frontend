import type { WalletPayment } from "../../api/account.service";
import { formatMoney, toEnglishDigits } from "../../../../shared/lib/numberUtils";

export { formatMoney };

export function normalizeWalletAmount(value: string) {
  return toEnglishDigits(value)
    .replace(/[^0-9]/g, "")
    .replace(/^0+(?=\d)/, "");
}

export function readPaymentStatus(payment: WalletPayment) {
  const status = String(payment.status ?? "0").toLowerCase();

  switch (status) {
    case "1":
    case "paid":
    case "success":
      return "پرداخت شده";

    case "0":
    case "failed":
    case "error":
      return "نا‌موفق";

    default:
      return status;
  }
}

export function readPaymentStatusColor(payment: WalletPayment) {
  const status = String(payment.status ?? "");

  if (["1", "success", "paid", "ok"].includes(status)) {
    return "var(--tertiary)";
  }

  if (["0", "failed", "error"].includes(status)) {
    return "var(--error)";
  }

  return "var(--on-surface)";
}

export function formatPaymentDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}
