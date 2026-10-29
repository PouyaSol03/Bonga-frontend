import { useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";
import { formatNumber } from "../../../../shared/lib/numberUtils";
import { Typography } from "../../../../shared/ui/Typography";
import type { CrmRecord } from "../../api/crm.service";
import { readPaymentNumericAmount, readPaymentStatus } from "../paymentHelpers";
import { CheckIcon, ClockIcon, CloseIcon, ReceiptIcon } from "./PaymentIcons";

export function buildPaymentMetrics(payments: CrmRecord[], total: number) {
  const successful = payments.filter((payment) => readPaymentStatus(payment) === "success");
  const pending = payments.filter((payment) => readPaymentStatus(payment) === "pending");
  const failed = payments.filter((payment) => readPaymentStatus(payment) === "failed");
  const successfulAmount = successful.reduce(
    (sum, payment) => sum + readPaymentNumericAmount(payment),
    0,
  );

  return [
    {
      caption: "نتیجه فیلتر",
      icon: <ReceiptIcon />,
      iconClassName: "bg-[#eef4ff] text-[#0048c4]",
      label: "کل تراکنش‌ها",
      value: formatNumber(total),
    },
    {
      caption: "در صفحه فعلی",
      icon: <CheckIcon />,
      iconClassName: "bg-[#ebfaf3] text-[#0b8b55]",
      label: "مجموع پرداخت موفق",
      value: `${formatNumber(successfulAmount)} تومان`,
    },
    {
      caption: "در صفحه فعلی",
      icon: <ClockIcon />,
      iconClassName: "bg-[#fff3e8] text-[#ff6d00]",
      label: "در انتظار پرداخت",
      value: formatNumber(pending.length),
    },
    {
      caption: "در صفحه فعلی",
      icon: <CloseIcon />,
      iconClassName: "bg-[#fff0f0] text-[#cc3342]",
      label: "پرداخت ناموفق",
      value: formatNumber(failed.length),
    },
  ];
}

export function PaymentMetricsSection({
  isLoading,
  payments,
  total,
}: {
  isLoading: boolean;
  payments: CrmRecord[];
  total: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  const metrics = useMemo(() => buildPaymentMetrics(payments, total), [payments, total]);

  return (
    <section
      className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      aria-label="خلاصه پرداخت‌ها"
    >
      {metrics.map((metric, index) => (
        <motion.article
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white p-5"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          key={metric.label}
          transition={{ delay: prefersReducedMotion ? 0 : index * 0.04, duration: 0.2 }}
        >
          <div className="flex items-center justify-between gap-3">
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className={`grid h-11 w-11 place-items-center rounded-2xl ${metric.iconClassName}`}
            >
              {metric.icon}
            </Typography>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="semibold"
              className="text-xs font-semibold text-[#a0a7b2]"
            >
              {metric.caption}
            </Typography>
          </div>
          <strong className="mt-5 block text-2xl font-black text-[#1e2633]">
            {isLoading ? "…" : metric.value}
          </strong>
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="mt-1 block text-sm font-medium text-[#7b8493]"
          >
            {metric.label}
          </Typography>
        </motion.article>
      ))}
    </section>
  );
}
