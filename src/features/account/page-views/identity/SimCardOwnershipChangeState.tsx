import { useState } from "react";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import { RadioIndicator } from "../../../../shared/components/RadioIndicator";
import { simCardOwnershipReasons, type SimCardOwnershipReason } from "./types";

export function SimCardOwnershipChangeState({ onSubmit }: { onSubmit: () => void }) {
  const [selectedReason, setSelectedReason] = useState<SimCardOwnershipReason>("selling");

  return (
    <>
      <section className="px-9 pt-8">
        <div aria-label="دلیل تغییر مالکیت سیم‌کارت" className="space-y-12" role="radiogroup">
          {simCardOwnershipReasons.map((reason) => {
            const isSelected = selectedReason === reason.id;

            return (
              <label
                className="flex min-h-6 w-full cursor-pointer items-center justify-between gap-3 border-0 text-right ring-0 outline-none focus:ring-0 focus:outline-none focus-visible:outline-none"
                key={reason.id}
              >
                <input
                  checked={isSelected}
                  className="sr-only"
                  name="sim-card-ownership-reason"
                  onChange={() => setSelectedReason(reason.id)}
                  type="radio"
                  value={reason.id}
                />

                <Typography
                  as="span"
                  variant="body"
                  size="large"
                  weight="regular"
                  className="text-on-surface"
                >
                  {reason.label}
                </Typography>

                <RadioIndicator checked={isSelected} />
              </label>
            );
          })}
        </div>
      </section>

      <div className="bg-surface-container-lowest absolute inset-x-0 bottom-0 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-4px_16px_rgba(77,77,77,0.08)]">
        <Button fullWidth onClick={onSubmit} size="x-medium" type="button" variant="primary">
          ثبت
        </Button>
      </div>
    </>
  );
}
