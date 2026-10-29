import { motion, useReducedMotion } from "motion/react";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { getCrmRecordId, type CrmRecord } from "../../api/crm.service";
import { readPaymentReference } from "../paymentBankHelpers";
import {
  readPaymentAmount,
  readPaymentDate,
  readPaymentId,
  readPaymentPurposeLabel,
} from "../paymentHelpers";
import { PaymentMethodBadge, PaymentStatusBadge } from "./PaymentBadges";
import { InfoIcon } from "./PaymentIcons";
import { TableCell } from "./PaymentTableElements";

export function PaymentTableRows({
  onSelectPayment,
  payments,
}: {
  onSelectPayment: (payment: CrmRecord) => void;
  payments: CrmRecord[];
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {payments.map((payment, index) => (
        <motion.tr
          animate={{ opacity: 1, y: 0 }}
          className="group text-sm text-[#344054]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 5 }}
          key={getCrmRecordId(payment) || `${readPaymentReference(payment)}-${index}`}
          transition={{
            delay: prefersReducedMotion ? 0 : Math.min(index, 8) * 0.025,
            duration: 0.16,
          }}
        >
          <TableCell>
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="semibold"
              className="inline-flex rounded-lg bg-[#f4f6f9] px-2.5 py-1.5 font-mono text-xs font-bold text-[#4d5b70] [direction:ltr]"
            >
              {readPaymentId(payment)}
            </Typography>
          </TableCell>
          <TableCell>
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="semibold"
              className="font-semibold whitespace-nowrap text-[#344054]"
            >
              {readPaymentPurposeLabel(payment)}
            </Typography>
          </TableCell>
          <TableCell>
            <strong className="whitespace-nowrap text-[#1f2937]">
              {readPaymentAmount(payment)}
            </strong>
          </TableCell>
          <TableCell>
            <PaymentStatusBadge payment={payment} />
          </TableCell>
          <TableCell>
            <PaymentMethodBadge payment={payment} />
          </TableCell>
          <TableCell>
            <Typography
              as="span"
              variant="body"
              size="medium"
              weight="regular"
              className="whitespace-nowrap text-[#5f6b7c]"
            >
              {readPaymentDate(payment)}
            </Typography>
          </TableCell>
          <TableCell>
            <Button
              unstyled
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#c9daf8] bg-[#eef4ff] px-3 text-sm font-bold text-[#0048c4] transition hover:border-[#0048c4] hover:bg-[#e3edff]"
              onClick={() => onSelectPayment(payment)}
              type="button"
            >
              <InfoIcon /> جزئیات
            </Button>
          </TableCell>
        </motion.tr>
      ))}
    </>
  );
}
