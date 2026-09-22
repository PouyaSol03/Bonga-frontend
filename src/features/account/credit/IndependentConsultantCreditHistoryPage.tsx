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

const paymentTypeLabels: Record<PaymentHistoryItem["payment_type"], string> = {
  gateway: "پرداخت آنلاین",
  unknown: "نامشخص",
  wallet: "کیف پول",
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

function resolvePaymentStatus(item: PaymentHistoryItem): {
  label: string;
  tone: "error" | "success" | "warning";
} {
  const statusCode = Number(item.status_code);
  const statusStr = String(item.status || "").toLowerCase().trim();

  if (
    statusCode === 1 ||
    statusStr === "paid" ||
    statusStr === "success" ||
    statusStr === "successful" ||
    statusStr === "موفق" ||
    statusStr === "پرداخت شده"
  ) {
    return { label: "پرداخت شده", tone: "success" };
  }

  if (
    statusCode === -1 ||
    statusStr === "failed" ||
    statusStr === "error" ||
    statusStr === "canceled" ||
    statusStr === "ناموفق" ||
    statusStr === "لغو شده"
  ) {
    return { label: "ناموفق", tone: "error" };
  }

  if (
    statusCode === 0 ||
    statusStr === "registered" ||
    statusStr === "register" ||
    statusStr === "pending" ||
    statusStr === "wait_for_payment"
  ) {
    return { label: "در انتظار پرداخت", tone: "warning" };
  }

  return { label: "نامشخص", tone: "error" };
}

function isPackageOrPanelPayment(item: PaymentHistoryItem): boolean {
  const paymentFor = String(item.payment_for || "").toLowerCase();
  const paymentForCode = Number(item.payment_for_code);
  const metadata = (item as any)?.metadata;
  const packageId = (item as any)?.package_id;

  if (paymentFor === "package" || paymentForCode === 2 || Boolean(packageId)) {
    return true;
  }

  if (metadata && (metadata.package_kind || metadata.package_scope || metadata.package_title)) {
    return true;
  }

  if (
    paymentFor === "advertise" ||
    paymentFor === "advertise_checkout" ||
    paymentFor === "wallet_charge" ||
    paymentForCode === 0 ||
    paymentForCode === 1 ||
    paymentForCode === 3
  ) {
    return false;
  }

  return false;
}

function resolveServiceLabel(item: PaymentHistoryItem): string {
  const metadata = (item as any)?.metadata;
  const title = metadata?.package_title || metadata?.title;
  const kind = metadata?.package_kind || metadata?.kind;

  if (kind === "panel_subscription" || (typeof title === "string" && title.includes("پنل"))) {
    return title ? `اشتراک پنل (${title})` : "اشتراک پنل";
  }

  if (kind === "credit_bundle" || (typeof title === "string" && title.includes("بسته"))) {
    return title ? `بسته اعتباری (${title})` : "بسته اعتباری";
  }

  if (title) return String(title);

  return "بسته و پنل";
}

function mapPaymentHistoryItem(item: PaymentHistoryItem): CreditPayment {
  const statusInfo = resolvePaymentStatus(item);

  return {
    amount: `${persianNumberFormatter.format(item.price)} تومان`,
    id: formatPaymentReference(item.ref_code),
    method: paymentTypeLabels[item.payment_type] ?? paymentTypeLabels.unknown,
    paidAt: formatPaymentDate(item.created_at),
    service: resolveServiceLabel(item),
    status: statusInfo.label,
    statusTone: statusInfo.tone,
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
        page.data
          .filter(isPackageOrPanelPayment)
          .map(mapPaymentHistoryItem),
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
      className="flex min-h-0 flex-col overflow-hidden bg-surface-container text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account/dashboard/payments" title="تاریخچه پرداخت" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container">
        {payments.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="medium"
              className="m-0 text-outline"
            >
              تراکنشی برای بسته یا پنل یافت نشد.
            </Typography>
          </div>
        ) : (
          payments.map((payment, index) => {
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
          })
        )}
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
      className="mb-2 flex h-[224px] flex-col justify-between bg-surface-container-lowest px-4 py-4 last:mb-0"
      ref={ref}
    >
      <PaymentHistoryRow
        label="وضعیت"
        value={payment.status}
        valueClassName={
          payment.statusTone === "success"
            ? "text-tertiary"
            : payment.statusTone === "warning"
              ? "text-warning"
              : "text-error"
        }
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
  valueClassName = "text-on-surface",
}: {
  label: string;
  value: ReactNode;
  valueClassName?: string;
}) {
  return (
    <div className="flex h-8 shrink-0 items-center justify-between gap-4 text-sm font-medium leading-5 [direction:ltr]">
      <Typography as="span" variant="body" size="medium" weight="regular" className={`min-w-0 truncate text-left ${valueClassName}`}>{value}</Typography>
      <Typography as="span" variant="body" size="medium" weight="regular" className="shrink-0 text-right text-outline [direction:rtl]">{label}</Typography>
    </div>
  );
}
