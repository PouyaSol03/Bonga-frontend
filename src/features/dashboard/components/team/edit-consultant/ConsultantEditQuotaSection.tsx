import type { Dispatch, SetStateAction } from "react";
import { QuotaStepper } from "../ConsultantCardWidgets";

export function ConsultantEditQuotaSection({
  adQuota,
  currentAgencyAdRemaining,
  currentAgencyRenewRemaining,
  currentAgencySpecialRemaining,
  formatRemaining,
  maxAdQuota,
  maxRenewQuota,
  maxSpecialQuota,
  setAdQuota,
  setErrorMessage,
  setSpecialQuota,
  setUpdateQuota,
  specialQuota,
  updateQuota,
}: {
  adQuota: number;
  currentAgencyAdRemaining: number;
  currentAgencyRenewRemaining: number;
  currentAgencySpecialRemaining: number;
  formatRemaining: (val: number | undefined) => string;
  maxAdQuota: number;
  maxRenewQuota: number;
  maxSpecialQuota: number;
  setAdQuota: Dispatch<SetStateAction<number>>;
  setErrorMessage: (msg: string) => void;
  setSpecialQuota: Dispatch<SetStateAction<number>>;
  setUpdateQuota: Dispatch<SetStateAction<number>>;
  specialQuota: number;
  updateQuota: number;
}) {
  return (
    <section className="mt-4 grid gap-4">
      <QuotaStepper
        label="سهمیه آگهی"
        max={maxAdQuota}
        remaining={`باقیمانده سهمیه آژانس: ${formatRemaining(currentAgencyAdRemaining)}`}
        remainingClassName="text-primary"
        setValue={(val) => {
          setErrorMessage("");
          setAdQuota(val);
        }}
        value={adQuota}
      />
      <QuotaStepper
        label="سهمیه بروزرسانی"
        max={maxRenewQuota}
        remaining={`باقیمانده سهمیه آژانس: ${formatRemaining(currentAgencyRenewRemaining)}`}
        remainingClassName="text-tertiary"
        setValue={(val) => {
          setErrorMessage("");
          setUpdateQuota(val);
        }}
        value={updateQuota}
      />
      <QuotaStepper
        label="سهمیه ویژه"
        max={maxSpecialQuota}
        remaining={`باقیمانده سهمیه آژانس: ${formatRemaining(currentAgencySpecialRemaining)}`}
        remainingClassName="text-warning"
        setValue={(val) => {
          setErrorMessage("");
          setSpecialQuota(val);
        }}
        value={specialQuota}
      />
    </section>
  );
}
