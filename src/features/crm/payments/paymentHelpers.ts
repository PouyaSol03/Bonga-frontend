import { formatNumber } from "../../../shared/lib/numberUtils";
import type { CrmRecord } from "../api/crm.service";
import { formatPaymentDate } from "./paymentDateUtils";
import { readNestedRecord, readText } from "./paymentBankHelpers";
import type { PaymentMethod, PaymentStatus } from "./types";

export function readPaymentStatus(payment: CrmRecord): PaymentStatus {
  const status = String(payment.status ?? payment.payment_status ?? "")
    .trim()
    .toLowerCase();

  if (["1", "paid", "success", "successful", "completed", "پرداخت شده", "موفق"].includes(status))
    return "success";
  if (
    ["-1", "failed", "error", "rejected", "cancelled", "canceled", "ناموفق", "رد شده"].includes(
      status,
    )
  )
    return "failed";
  if (["0", "pending", "processing", "در انتظار", "در حال پردازش", "ثبت شده"].includes(status))
    return "pending";

  return "unknown";
}

export function readPaymentStatusLabel(payment: CrmRecord): string {
  return readText(payment, ["status", "payment_status"], "نامشخص");
}

export function readPaymentMethod(payment: CrmRecord): PaymentMethod {
  const method = String(payment.payment_type ?? payment.method ?? payment.payment_method ?? "")
    .trim()
    .toLowerCase();

  if (["0", "online", "gateway", "bank", "درگاه", "پرداخت آنلاین"].includes(method))
    return "gateway";
  if (["1", "wallet", "credit", "کیف پول", "اعتبار"].includes(method)) return "wallet";

  return "unknown";
}

export function readPaymentMethodLabel(payment: CrmRecord): string {
  return {
    gateway: "درگاه بانکی",
    wallet: "کیف پول / اعتبار",
    unknown: readText(payment, ["method", "payment_method"], "نامشخص"),
  }[readPaymentMethod(payment)];
}

export function readPaymentPurposeLabel(payment: CrmRecord): string {
  const purpose = String(payment.payment_for ?? "")
    .trim()
    .toLowerCase();
  return (
    (
      {
        "0": "پرداخت آگهی",
        "1": "شارژ کیف پول",
        "2": "خرید بسته",
        "3": "تسویه آگهی",
        advertise: "پرداخت آگهی",
        advertise_payment: "پرداخت آگهی",
        advertise_settlement: "تسویه آگهی",
        package: "خرید بسته",
        package_purchase: "خرید بسته",
        wallet: "شارژ کیف پول",
        wallet_charge: "شارژ کیف پول",
      } as Record<string, string>
    )[purpose] ?? readText(payment, ["payment_for"], "نامشخص")
  );
}

export function readPaymentUserName(payment: CrmRecord): string {
  const user = readNestedRecord(payment, ["user", "payer", "customer", "owner"]);
  const fullName = [
    readText(user, ["name", "first_name"], ""),
    readText(user, ["family", "last_name"], ""),
  ]
    .filter(Boolean)
    .join(" ");

  return fullName || readText(payment, ["user_name", "payer_name", "customer_name", "name"], "-");
}

export function readPaymentMobile(payment: CrmRecord): string {
  const user = readNestedRecord(payment, ["user", "payer", "customer", "owner"]);
  return readText(
    payment,
    ["mobile", "phone", "user_mobile"],
    readText(user, ["mobile", "phone"], "-"),
  );
}

export function readPaymentNumericAmount(payment: CrmRecord): number {
  const value =
    payment.amount ?? payment.price ?? payment.cost ?? payment.total ?? payment.final_price;
  const number = Number(String(value ?? 0).replace(/[^\d.-]/g, ""));
  return Number.isFinite(number) ? number : 0;
}

export function readPaymentAmount(payment: CrmRecord): string {
  const value =
    payment.amount ?? payment.price ?? payment.cost ?? payment.total ?? payment.final_price;
  if (typeof value === "string" && /تومان|ریال|﷼/.test(value)) return value;

  const amount = readPaymentNumericAmount(payment);
  return amount ? `${formatNumber(amount)} تومان` : "-";
}

export function readPaymentDate(payment: CrmRecord): string {
  const value = readText(
    payment,
    ["paid_at", "created_at", "payment_date", "date", "updated_at"],
    "-",
  );
  return formatPaymentDate(value);
}

export function readPaymentUpdatedDate(payment: CrmRecord): string {
  return formatPaymentDate(readText(payment, ["updated_at"], "-"));
}

export function readPaymentId(payment: CrmRecord): string {
  return readText(payment, ["id", "_id"], "-");
}
