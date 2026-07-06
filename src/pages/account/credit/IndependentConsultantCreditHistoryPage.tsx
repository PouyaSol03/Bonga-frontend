import type { ReactNode } from "react";

import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { creditPayments, type CreditPayment } from "./creditData";

export function IndependentConsultantCreditHistoryPage() {
  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account/credit/panel" title="تاریخچه پرداخت" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        {creditPayments.map((payment, index) => (
          <PaymentHistoryCard key={`${payment.id}-${payment.service}-${index}`} payment={payment} />
        ))}
      </main>
    </PageFrame>
  );
}

function PaymentHistoryCard({ payment }: { payment: CreditPayment }) {
  return (
    <section className="mb-2 flex h-[224px] flex-col justify-between bg-white px-4 py-4 last:mb-0">
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
      <span className={`min-w-0 truncate text-left ${valueClassName}`}>{value}</span>
      <span className="shrink-0 text-right text-[#808080] [direction:rtl]">{label}</span>
    </div>
  );
}
