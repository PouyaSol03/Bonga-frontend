import type { ReactNode } from "react";
import { PageFrame } from "../../../app/PageFrame";
import { TopBar } from "../../../components/TopBar";
import { creditPayments } from "./creditData";

export function IndependentConsultantCreditHistoryPage() {
  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-[#f0f0f0] text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account/credit/panel" title="تاریخچه پرداخت" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#f0f0f0]">
        {creditPayments.map((payment) => (
          <PaymentHistoryCard key={`${payment.service}-${payment.status}`}>
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
          </PaymentHistoryCard>
        ))}
      </main>
    </PageFrame>
  );
}

function PaymentHistoryCard({ children }: { children: ReactNode }) {
  return <section className="mb-2 flex h-[312px] flex-col gap-2 bg-white px-4 py-4 last:mb-0">{children}</section>;
}

function PaymentHistoryRow({
  label,
  value,
  valueClassName = "text-[#1a1a1a]",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between text-base font-medium leading-6 [direction:ltr]">
      <span className={valueClassName}>{value}</span>
      <span className="text-[#808080] [direction:rtl]">{label}</span>
    </div>
  );
}
