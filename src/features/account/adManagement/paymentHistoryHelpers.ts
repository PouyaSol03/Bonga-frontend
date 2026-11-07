import { formatMoney } from "../../../shared/lib/numberUtils";
import { readText } from "../../../shared/lib/textUtils";
import type { AdvertisementPayment } from "../../advertisements/api/advertisement.service";

export type AdPayment = AdvertisementPayment;

export function readPaymentStatus(payment: AdPayment) {
  const raw = payment.status ?? payment.payment_status;
  const status = String(raw ?? "-")
    .trim()
    .toLowerCase();

  if (
    raw === 1 ||
    status === "1" ||
    ["paid", "success", "successful", "پرداخت شده"].includes(status)
  ) {
    return "پرداخت شده";
  }

  if (raw === -1 || status === "-1" || ["failed", "error", "rejected", "ناموفق"].includes(status)) {
    return "ناموفق";
  }

  if (
    raw === 0 ||
    status === "0" ||
    ["pending", "registered", "register", "در انتظار"].includes(status)
  ) {
    return "در انتظار";
  }

  return String(raw ?? "-");
}

export function readPaymentStatusClassName(payment: AdPayment) {
  const status = readPaymentStatus(payment);

  if (status === "پرداخت شده") return "text-tertiary";
  if (status === "ناموفق") return "text-error";
  if (status === "در انتظار" || status === "در انتظار پرداخت") return "text-warning";

  return "text-on-surface";
}

const paymentItemLabels: Record<string, string> = {
  advertise_publish: "انتشار آگهی",
  advertise_update: "بروزرسانی",
  advertise_special: "ویژه",
  advertise_extend: "تمدید",
  advertise_update_special: "بروزرسانی و ویژه",
};

export function readPaymentService(payment: AdPayment) {
  if (Array.isArray(payment.items) && payment.items.length > 0) {
    return payment.items.map((item) => paymentItemLabels[String(item)] ?? String(item)).join(" + ");
  }

  return readText(
    payment.service ??
      payment.service_name ??
      payment.package_name ??
      payment.plan_name ??
      payment.title ??
      payment.type,
    "پرداخت آگهی",
  );
}

export function readPaymentAmount(payment: AdPayment) {
  const amount = payment.amount ?? payment.price ?? payment.cost ?? payment.total;
  const text = readText(amount, "-");

  if (text === "-" || /تومان|ریال|﷼/.test(text)) return text;

  return `${formatMoney(text)} تومان`;
}

export function readPaymentDate(payment: AdPayment) {
  const value = payment.created_at ?? payment.paid_at ?? payment.payment_date ?? payment.date;
  const text = readText(value, "-");
  if (text === "-") return text;

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return text;

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function readPaymentMethod(payment: AdPayment) {
  const raw = payment.method ?? payment.payment_method ?? payment.payment_type;
  const value = String(raw ?? "")
    .trim()
    .toLowerCase();

  if (raw === 0 || value === "0" || value === "gateway" || value === "port") return "پرداخت آنلاین";
  if (raw === 1 || value === "1" || value === "wallet") return "کیف پول";
  if (value === "free_quota") return "سهمیه رایگان";
  if (value === "ad_credit" || value === "package_credit") return "اعتبار بسته";

  return readText(raw, "پرداخت آنلاین");
}

export function readPaymentTrackingCode(payment: AdPayment) {
  return readText(
    payment.tracking_code ??
      payment.track_code ??
      payment.ref_code ??
      payment.ref_id ??
      payment.reference_id ??
      payment.payment_id ??
      payment.authority ??
      payment.id,
    "-",
  );
}

export function readAdIdFromPath() {
  const match = window.location.pathname.match(
    /^\/account\/(?:my-ads|manage-ads)\/([^/]+)\/payment-history\/?$/,
  );

  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

export function readQueryAdId() {
  return new URLSearchParams(window.location.search).get("adId") ?? undefined;
}

export function readEntityId(entity: unknown) {
  if (!entity || typeof entity !== "object") return undefined;

  const record = entity as Record<string, unknown>;
  const id = record.id ?? record._id ?? record.advertise_id ?? record.advertiseId;

  if (typeof id === "string" && id.trim()) return id;
  if (typeof id === "number") return String(id);

  return undefined;
}

export function firstArray<T>(values: unknown[]) {
  for (const value of values) {
    if (Array.isArray(value)) return value as T[];
  }

  return [];
}

export function readPaymentsFromRecord(value: unknown): AdPayment[] {
  if (!value || typeof value !== "object") return [];

  const record = value as Record<string, unknown>;

  return firstArray<AdPayment>([
    record.payments,
    record.payment_history,
    record.paymentHistory,
    record.transactions,
    record.transaction_history,
    record.transactionHistory,
  ]);
}

export function resolveAdPayments(
  ad: unknown,
  routeState: {
    paymentHistory?: AdPayment[];
    adPayments?: AdPayment[];
    payments?: AdPayment[];
  },
) {
  const routePayments = firstArray<AdPayment>([
    routeState.paymentHistory,
    routeState.adPayments,
    routeState.payments,
  ]);

  if (routePayments.length > 0) return routePayments;

  return readPaymentsFromRecord(ad);
}
