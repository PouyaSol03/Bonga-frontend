import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import type { CrmRecord } from "../../api/crm.service";
import { readNestedRecord } from "../paymentBankHelpers";
import {
  BankInfoSection,
  RelatedInfoSection,
  TransactionInfoSection,
  UserInfoSection,
} from "./PaymentDetailsSections";
import { ClosePlainIcon } from "./PaymentIcons";

export function PaymentDetailsModal({
  onClose,
  payment,
}: {
  onClose: () => void;
  payment: CrmRecord | null;
}) {
  useEffect(() => {
    if (!payment) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, payment]);

  const user = payment ? readNestedRecord(payment, ["user", "payer", "customer", "owner"]) : {};
  const agency = payment ? readNestedRecord(payment, ["agency"]) : {};
  const advertise = payment ? readNestedRecord(payment, ["advertise"]) : {};
  const linkedPackage = payment ? readNestedRecord(payment, ["package"]) : {};

  return (
    <AnimatePresence>
      {payment ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[#152033]/45 p-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          role="presentation"
        >
          <motion.section
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-label="جزئیات پرداخت"
            aria-modal="true"
            className="flex h-[calc(100dvh-32px)] max-h-[820px] w-[min(820px,100%)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_80px_rgba(18,32,57,0.25)]"
            initial={{ opacity: 0, scale: 0.98, y: 12 }}
            role="dialog"
            transition={{ duration: 0.18 }}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-[#edf0f5] px-5 py-4">
              <div>
                <Typography
                  as="h2"
                  variant="title"
                  size="medium"
                  weight="semibold"
                  className="m-0 text-base font-black text-[#263042]"
                >
                  جزئیات پرداخت
                </Typography>
                <Typography
                  as="p"
                  variant="body"
                  size="medium"
                  weight="regular"
                  className="m-0 mt-1 text-sm text-[#8a94a3]"
                >
                  اطلاعات کامل تراکنش و موارد متصل به آن
                </Typography>
              </div>
              <Button
                unstyled
                aria-label="بستن"
                className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f5f8] text-[#596477]"
                onClick={onClose}
                type="button"
              >
                <ClosePlainIcon />
              </Button>
            </header>

            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              <TransactionInfoSection payment={payment} />
              <BankInfoSection payment={payment} />
              <UserInfoSection payment={payment} user={user} />
              <RelatedInfoSection
                advertise={advertise}
                agency={agency}
                linkedPackage={linkedPackage}
                payment={payment}
              />
            </div>

            <footer className="flex shrink-0 justify-end border-t border-[#edf0f5] px-5 py-4">
              <Button
                unstyled
                className="h-10 rounded-xl bg-[#0048c4] px-5 text-sm font-bold text-white"
                onClick={onClose}
                type="button"
              >
                بستن
              </Button>
            </footer>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
