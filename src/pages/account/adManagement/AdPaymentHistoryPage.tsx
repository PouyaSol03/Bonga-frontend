import type { ReactNode } from "react";

import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { useAdvertisementDetailQuery } from "../../../hooks/advertisement.hooks";
import { RouteLink } from "../../../routes/RouteLink";
import type { AdvertisementItem } from "../../../services/advertisement.service";
import {
  adManagementPaths,
  getAdIncreaseVisitsPath,
  getAdStatePath,
  getAdManagementRouteState,
  type ConsultantAd,
} from "./adManagementData";
import { Typography } from "../../../components/ui/Typography";

type AdPayment = Record<string, unknown> & {
  amount?: number | string;
  created_at?: string;
  id?: number | string;
  method?: string;
  payment_method?: string;
  service?: string;
  service_name?: string;
  status?: string;
  tracking_code?: string;
};

type AdPaymentHistoryRouteState = ReturnType<typeof getAdManagementRouteState> & {
  ad?: AdvertisementItem | ConsultantAd;
  card?: ConsultantAd;
  adPayments?: AdPayment[];
  paymentHistory?: AdPayment[];
  payments?: AdPayment[];
  paymentHistoryReturnTo?: string;
  returnTo?: string;
  status?: unknown;
};

export function AdPaymentHistoryPage() {
  const routeState = getAdManagementRouteState() as AdPaymentHistoryRouteState;
  const adId = readAdIdFromPath() ?? readQueryAdId() ?? readEntityId(routeState.ad) ?? readEntityId(routeState.card);
  const backTo = routeState.paymentHistoryReturnTo ?? (adId ? getAdStatePath(adId) : adManagementPaths.root);
  const query = useAdvertisementDetailQuery(adId ?? null);
  const ad = query.data ?? routeState.ad;
  const payments = resolveAdPayments(ad, routeState);
  const showEmpty = !query.isLoading && !query.isError && payments.length === 0;

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        backState={{
          ad: routeState.ad,
          card: routeState.card,
          status: routeState.status,
          returnTo: routeState.returnTo,
          tab: routeState.tab,
        }}
        backTo={backTo}
        className="bg-[#f0f0f0] [&_a]:text-[#1a1a1a]"
        title="تاریخچه پرداخت"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {query.isLoading ? <PaymentHistoryLoading /> : null}

        {query.isError && payments.length === 0 ? (
          <PaymentHistoryError onRetry={() => void query.refetch()} />
        ) : null}

        {!query.isLoading && payments.length > 0 ? (
          <div className="bg-[#f0f0f0]">
            {payments.map((payment, index) => (
              <PaymentHistoryCard
                key={`${readPaymentTrackingCode(payment)}-${index}`}
                payment={payment}
              />
            ))}
          </div>
        ) : null}

        {showEmpty ? (
          <EmptyPaymentHistory ad={ad} adId={adId} card={routeState.card} returnTo={routeState.returnTo} />
        ) : null}
      </main>
    </PageFrame>
  );
}

function readAdIdFromPath() {
  const match = window.location.pathname.match(/^\/account\/my-ads\/([^/]+)\/payment-history\/?$/);

  return match?.[1] ? decodeURIComponent(match[1]) : undefined;
}

function readQueryAdId() {
  return new URLSearchParams(window.location.search).get("adId") ?? undefined;
}

function readEntityId(entity: unknown) {
  if (!entity || typeof entity !== "object") return undefined;

  const record = entity as Record<string, unknown>;
  const id = record.id ?? record._id ?? record.advertise_id ?? record.advertiseId;

  if (typeof id === "string" && id.trim()) return id;
  if (typeof id === "number") return String(id);

  return undefined;
}

function resolveAdPayments(ad: unknown, routeState: AdPaymentHistoryRouteState) {
  const routePayments = firstArray<AdPayment>([
    routeState.paymentHistory,
    routeState.adPayments,
    routeState.payments,
  ]);

  if (routePayments.length > 0) return routePayments;

  const adPayments = readPaymentsFromRecord(ad);

  return adPayments;
}

function readPaymentsFromRecord(value: unknown): AdPayment[] {
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

function firstArray<T>(values: unknown[]) {
  for (const value of values) {
    if (Array.isArray(value)) return value as T[];
  }

  return [];
}

function PaymentHistoryLoading() {
  return (
    <div className="flex h-full min-h-[360px] items-center justify-center px-4 text-sm font-medium leading-5 text-[#808080]">
      در حال دریافت تاریخچه پرداخت...
    </div>
  );
}

function PaymentHistoryError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex h-full min-h-[360px] flex-col items-center justify-center px-8 text-center">
      <Typography as="p" variant="body" size="medium" weight="medium" className="m-0 text-sm font-medium leading-6 text-[#1a1a1a]">
        دریافت تاریخچه پرداخت با خطا مواجه شد.
      </Typography>
      <button
        className="mt-4 h-10 rounded-lg bg-[#0048c4] px-6 text-sm font-medium leading-5 text-white"
        onClick={onRetry}
        type="button"
      >
        تلاش مجدد
      </button>
    </div>
  );
}

function EmptyPaymentHistory({
  ad,
  adId,
  card,
  returnTo,
}: {
  ad?: AdvertisementItem | ConsultantAd;
  adId?: string;
  card?: ConsultantAd;
  returnTo?: string;
}) {
  return (
    <section className="flex h-full min-h-[430px] flex-col items-center justify-center px-8 pb-12 text-center">
      <img src="/vectors/NoPaymentHistory.svg" alt="" />
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 mt-3 text-base font-semibold leading-6 text-[#1a1a1a]">
        هیچ تراکنشی برای نمایش وجود ندارد
      </Typography>
      <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-2 max-w-[260px] text-xs font-normal leading-5 text-[#4d4d4d]">
        پس از اولین پرداخت برای این آگهی، سابقه‌ها در این بخش نمایش داده می‌شود
      </Typography>

      <RouteLink
        className="mt-4 inline-flex h-10 min-w-[112px] items-center justify-center gap-2 rounded-lg bg-[#0048c4] px-4 text-sm font-medium leading-5 text-white no-underline"
        state={{
          ad: card ?? ad,
          card,
          paymentFlow: "upgrade",
          paymentHistoryReturnTo: window.location.pathname,
          returnTo,
          tab: "status",
        }}
        to={adId ? getAdIncreaseVisitsPath(adId) : adManagementPaths.payment}
      >
        <Typography as="span" variant="body" size="medium" weight="regular">افزایش بازدید</Typography>
        <ArrowLeftIcon className="h-4 w-4" />
        {adId ? <Typography as="span" variant="body" size="medium" weight="regular" className="sr-only">برای آگهی {adId}</Typography> : null}
      </RouteLink>
    </section>
  );
}

function PaymentHistoryCard({ payment }: { payment: AdPayment }) {
  return (
    <article className="mb-2 flex min-h-[224px] flex-col justify-between bg-white px-4 py-4 text-right last:mb-0">
      <PaymentHistoryRow
        label="وضعیت"
        value={readPaymentStatus(payment)}
        valueClassName={readPaymentStatusClassName(payment)}
      />
      <PaymentHistoryRow label="نوع سرویس" value={readPaymentService(payment)} />
      <PaymentHistoryRow label="هزینه" value={readPaymentAmount(payment)} />
      <PaymentHistoryRow label="زمان پرداخت" value={readPaymentDate(payment)} />
      <PaymentHistoryRow label="نحوه پرداخت" value={readPaymentMethod(payment)} />
      <PaymentHistoryRow label="شناسه پرداخت" value={readPaymentTrackingCode(payment)} />
    </article>
  );
}

function PaymentHistoryRow({
  label,
  value,
  valueClassName = "text-[#1a1a1a]",
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex h-8 shrink-0 items-center justify-between gap-4 text-sm font-medium leading-5 [direction:ltr]">
      <Typography as="span" variant="body" size="medium" weight="regular" className={`min-w-0 truncate text-left ${valueClassName}`}>{value}</Typography>
      <Typography as="span" variant="body" size="medium" weight="regular" className="shrink-0 text-right text-[#808080] [direction:rtl]">{label}</Typography>
    </div>
  );
}

function readPaymentStatus(payment: AdPayment) {
  const status = String(payment.status ?? payment.payment_status ?? "-");

  switch (status) {
    case "paid":
    case "success":
    case "successful":
    case "پرداخت شده":
      return "پرداخت شده";

    case "failed":
    case "error":
    case "rejected":
    case "ناموفق":
      return "ناموفق";

    case "pending":
    case "در انتظار":
      return "در انتظار";

    default:
      return status;
  }
}

function readPaymentStatusClassName(payment: AdPayment) {
  const status = String(payment.status ?? payment.payment_status ?? "");

  if (["paid", "success", "successful", "پرداخت شده"].includes(status)) return "text-[#11a366]";
  if (["failed", "error", "rejected", "ناموفق"].includes(status)) return "text-[#ee3623]";

  return "text-[#1a1a1a]";
}

function readPaymentService(payment: AdPayment) {
  return readText(
    payment.service ??
      payment.service_name ??
      payment.package_name ??
      payment.plan_name ??
      payment.title ??
      payment.type,
    "افزایش بازدید",
  );
}

function readPaymentAmount(payment: AdPayment) {
  const amount = payment.amount ?? payment.price ?? payment.cost ?? payment.total;
  const text = readText(amount, "-");

  if (text === "-" || /تومان|ریال|﷼/.test(text)) return text;

  return `${formatMoney(text)} تومان`;
}

function readPaymentDate(payment: AdPayment) {
  return readText(payment.created_at ?? payment.paid_at ?? payment.payment_date ?? payment.date, "-");
}

function readPaymentMethod(payment: AdPayment) {
  return readText(payment.method ?? payment.payment_method, "پرداخت آنلاین");
}

function readPaymentTrackingCode(payment: AdPayment) {
  return readText(
    payment.tracking_code ?? payment.track_code ?? payment.ref_id ?? payment.reference_id ?? payment.id,
    "-",
  );
}

function readText(value: unknown, fallback = "") {
  if (typeof value === "string" && value.trim()) return value;
  if (typeof value === "number") return String(value);

  return fallback;
}

function formatMoney(value: unknown) {
  const amount =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value.replace(/,/g, ""))
        : 0;

  if (!Number.isFinite(amount)) return String(value || "۰");

  return new Intl.NumberFormat("fa-IR").format(amount);
}

function ArrowLeftIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="M15 6L9 12L15 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}
