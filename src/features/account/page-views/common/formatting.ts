import type { WalletPayment } from "../../api/account.service";

export function normalizeWalletAmount(value: string) {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[^0-9]/g, "")
    .replace(/^0+(?=\d)/, "");
}

export function formatMoney(value: unknown) {
  const amount =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.replace(/,/g, ""))
        : 0;

  if (!Number.isFinite(amount)) {
    return String(value || "۰");
  }

  return new Intl.NumberFormat("fa-IR").format(amount);
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
