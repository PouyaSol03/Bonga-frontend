import {
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { useAccountCreditHistoryInfiniteQuery } from "../api/account.hooks";
import type { PaymentHistoryItem } from "../api/account.service";
import type { CreditPayment } from "./creditData";
import { Typography } from "../../../shared/ui/Typography";

const persianNumberFormatter = new Intl.NumberFormat("fa-IR");

const paymentStatusLabels: Record<PaymentHistoryItem["status"], string> = {
  failed: "ناموفق",
  paid: "پرداخت شده",
  registered: "ثبت شده",
  unknown: "نامشخص",
};

const paymentTypeLabels: Record<PaymentHistoryItem["payment_type"], string> = {
  gateway: "پرداخت آنلاین",
  unknown: "نامشخص",
  wallet: "کیف پول",
};

const paymentForLabels: Record<PaymentHistoryItem["payment_for"], string> = {
  advertise: "آگهی",
  advertise_checkout: "پرداخت آگهی",
  package: "بسته",
  unknown: "نامشخص",
  wallet_charge: "افزایش اعتبار کیف پول",
};

function formatPaymentDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value || "-";

  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    day: "2-digit",
    month: "long",
    timeZone: "Asia/Tehran",
    year: "numeric",
  }).format(date);
}

function formatPaymentReference(value: PaymentHistoryItem["ref_code"]) {
  if (typeof value === "string") {
    return value.trim() || "-";
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return "-";
}

function mapPaymentHistoryItem(item: PaymentHistoryItem): CreditPayment {
  return {
    amount: `${persianNumberFormatter.format(item.price)} تومان`,
    id: formatPaymentReference(item.ref_code),
    method: paymentTypeLabels[item.payment_type] ?? paymentTypeLabels.unknown,
    paidAt: formatPaymentDate(item.created_at),
    service: paymentForLabels[item.payment_for] ?? paymentForLabels.unknown,
    status: paymentStatusLabels[item.status] ?? paymentStatusLabels.unknown,
    statusTone: item.status === "paid" ? "success" : "error",
  };
}

export function IndependentConsultantCreditHistoryPage() {
  const loadMoreObserverRef = useRef<IntersectionObserver | null>(null);
  const {
    data: historyPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useAccountCreditHistoryInfiniteQuery({ perPage: 20 });
  const payments = useMemo(
    () =>
      historyPages?.pages.flatMap((page) =>
        page.data.map(mapPaymentHistoryItem),
      ) ?? [],
    [historyPages],
  );
  const loadMoreTriggerIndex = Math.max(payments.length - 6, 0);
  const loadMoreSentinelRef = useCallback(
    (node: HTMLElement | null) => {
      loadMoreObserverRef.current?.disconnect();
      loadMoreObserverRef.current = null;

      if (!node || !hasNextPage || isFetchingNextPage) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        },
        { root: null, rootMargin: "240px 0px", threshold: 0 },
      );

      observer.observe(node);
      loadMoreObserverRef.current = observer;
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account/credit/panel" title="تاریخچه پرداخت" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        {payments.map((payment, index) => {
          const shouldAttachLoadMoreRef =
            index === loadMoreTriggerIndex &&
            hasNextPage &&
            !isFetchingNextPage;

          return (
            <PaymentHistoryCard
              key={`${payment.id}-${payment.service}-${payment.paidAt}-${index}`}
              payment={payment}
              ref={shouldAttachLoadMoreRef ? loadMoreSentinelRef : undefined}
            />
          );
        })}
      </main>
    </PageFrame>
  );
}

function PaymentHistoryCard({
  payment,
  ref,
}: {
  payment: CreditPayment;
  ref?: (node: HTMLElement | null) => void;
}) {
  return (
    <section
      className="mb-2 flex h-[224px] flex-col justify-between bg-white px-4 py-4 last:mb-0"
      ref={ref}
    >
      <PaymentHistoryRow
        label="وضعیت"
        value={payment.status}
        valueClassName={payment.statusTone === "success" ? "text-[#11a366]" : "text-[#ee3623]"}
      />
      <PaymentHistoryRow label="نوع سرویس" value={payment.service} />
      <PaymentHistoryRow label="هزینه" value={payment.amount} />
      <PaymentHistoryRow label="زمان پرداخت" value={payment.paidAt} />
      <PaymentHistoryRow label="نحوه پرداخت" value={payment.method} />
      <PaymentHistoryRow label="شناسه پرداخت" value={payment.id} />
    </section>
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
