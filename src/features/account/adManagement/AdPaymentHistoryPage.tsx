import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { useAdvertisementPaymentsQuery } from "../../advertisements/api/advertisement.hooks";
import type {
  AdvertisementItem,
} from "../../advertisements/api/advertisement.service";
import {
  adManagementPaths,
  getAdStatePath,
  getAdManagementRouteState,
  type ConsultantAd,
} from "./adManagementData";
import { PaymentHistoryRow } from "../components/payment/PaymentHistoryRow";
import {
  EmptyPaymentHistory,
  PaymentHistoryError,
  PaymentHistoryLoading,
} from "./AdPaymentHistoryFeedback";
import {
  readAdIdFromPath,
  readEntityId,
  readPaymentAmount,
  readPaymentDate,
  readPaymentMethod,
  readPaymentService,
  readPaymentStatus,
  readPaymentStatusClassName,
  readPaymentTrackingCode,
  readQueryAdId,
  resolveAdPayments,
  type AdPayment,
} from "./paymentHistoryHelpers";

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
  const adId =
    readAdIdFromPath() ??
    readQueryAdId() ??
    readEntityId(routeState.ad) ??
    readEntityId(routeState.card);
  const backTo =
    routeState.paymentHistoryReturnTo ?? (adId ? getAdStatePath(adId) : adManagementPaths.root);
  const paymentsQuery = useAdvertisementPaymentsQuery(adId ?? null);
  const fallbackPayments = resolveAdPayments(routeState.ad, routeState);
  const payments = paymentsQuery.data ?? fallbackPayments;
  const ad = routeState.ad;
  const showEmpty = !paymentsQuery.isLoading && !paymentsQuery.isError && payments.length === 0;

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
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
        className="bg-surface-container [&_a]:text-on-surface"
        title="تاریخچه پرداخت"
      />

      <main className="bg-surface-container-lowest flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto">
        {paymentsQuery.isLoading && fallbackPayments.length === 0 ? (
          <PaymentHistoryLoading />
        ) : null}

        {paymentsQuery.isError && payments.length === 0 ? (
          <PaymentHistoryError onRetry={() => void paymentsQuery.refetch()} />
        ) : null}

        {!paymentsQuery.isLoading && payments.length > 0 ? (
          <div className="bg-surface-container">
            {payments.map((payment, index) => (
              <PaymentHistoryCard
                key={`${readPaymentTrackingCode(payment)}-${index}`}
                payment={payment}
              />
            ))}
          </div>
        ) : null}

        {showEmpty ? (
          <EmptyPaymentHistory
            ad={ad}
            adId={adId}
            card={routeState.card}
            returnTo={routeState.returnTo}
          />
        ) : null}
      </main>
    </PageFrame>
  );
}

function PaymentHistoryCard({ payment }: { payment: AdPayment }) {
  return (
    <article className="bg-surface-container-lowest mb-2 flex min-h-[224px] flex-col justify-between gap-y-2 p-4 text-right last:mb-0">
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
