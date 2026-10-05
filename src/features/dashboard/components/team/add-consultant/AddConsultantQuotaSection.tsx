import type { Dispatch, SetStateAction } from "react";
import { QuotaStepper } from "../ConsultantCardWidgets";

export function AddConsultantQuotaSection({
  adQuota,
  availableAdBalance,
  availableRenewBalance,
  availableSpecialBalance,
  formatRemaining,
  setAdQuota,
  setSpecialQuota,
  setUpdateQuota,
  specialQuota,
  updateQuota,
}: {
  adQuota: number;
  availableAdBalance: number;
  availableRenewBalance: number;
  availableSpecialBalance: number;
  formatRemaining: (val: number | undefined) => string;
  setAdQuota: Dispatch<SetStateAction<number>>;
  setSpecialQuota: Dispatch<SetStateAction<number>>;
  setUpdateQuota: Dispatch<SetStateAction<number>>;
  specialQuota: number;
  updateQuota: number;
}) {
  const currentAgencyAdRemaining = Math.max(0, availableAdBalance - adQuota);
  const currentAgencyRenewRemaining = Math.max(0, availableRenewBalance - updateQuota);
  const currentAgencySpecialRemaining = Math.max(0, availableSpecialBalance - specialQuota);

  return (
    <section className="grid gap-4 border-t-[8px] border-surface-container bg-surface-container-lowest px-4 py-5">
      <QuotaStepper
        label="سهمیه آگهی"
        max={availableAdBalance}
        remaining={`باقیمانده سهمیه آژانس: ${formatRemaining(currentAgencyAdRemaining)}`}
        remainingClassName="text-primary"
        setValue={setAdQuota}
        value={adQuota}
      />
      <QuotaStepper
        label="سهمیه بروزرسانی"
        max={availableRenewBalance}
        remaining={`باقیمانده سهمیه آژانس: ${formatRemaining(currentAgencyRenewRemaining)}`}
        remainingClassName="text-tertiary"
        setValue={setUpdateQuota}
        value={updateQuota}
      />
      <QuotaStepper
        label="سهمیه ویژه"
        max={availableSpecialBalance}
        remaining={`باقیمانده سهمیه آژانس: ${formatRemaining(currentAgencySpecialRemaining)}`}
        remainingClassName="text-warning"
        setValue={setSpecialQuota}
        value={specialQuota}
      />
    </section>
  );
}
