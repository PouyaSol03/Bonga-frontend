import type { Dispatch, SetStateAction } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { toEnglishDigits, toPersianNumber } from "../../../../shared/lib/numberUtils";

export function QuotaStepper({
  label,
  remaining,
  remainingClassName,
  setValue,
  value,
}: {
  label: string;
  max?: number;
  remaining: string;
  remainingClassName: string;
  setValue: Dispatch<SetStateAction<number>>;
  value: number;
}) {
  return (
    <div>
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold leading-6 text-on-surface">
        {label}
      </Typography>
      <div className="mt-3 grid h-14 grid-cols-[80px_1fr_80px] overflow-hidden rounded-xl border border-outline-var transition-colors bg-surface-container-lowest">
        <Button
          unstyled
          className="grid place-items-center border-r border-outline-var bg-surface-container text-2xl font-normal text-on-surface-var disabled:cursor-not-allowed disabled:opacity-40"
          disabled={value <= 0}
          onClick={() => setValue((current) => Math.max(0, current - 1))}
          type="button"
        >
          -
        </Button>
        <input
          aria-label={label}
          className="w-full bg-transparent text-center text-base font-medium leading-6 text-on-surface outline-none"
          inputMode="numeric"
          onChange={(e) => {
            const raw = toEnglishDigits(e.target.value).replace(/\D/g, "");
            setValue(raw ? Number(raw) : 0);
          }}
          type="text"
          value={value === 0 ? "۰" : toPersianNumber(value)}
        />
        <Button
          unstyled
          className="grid place-items-center border-l border-outline-var bg-surface-container text-2xl font-normal text-on-surface-var"
          onClick={() => setValue((current) => current + 1)}
          type="button"
        >
          +
        </Button>
      </div>
      <Typography as="p" variant="body" size="small" weight="medium" className="m-0 mt-2 pr-3 text-xs font-medium leading-5 text-outline">
        <Typography as="span" variant="body" size="medium" weight="regular">باقیمانده سهمیه آژانس: </Typography>
        <Typography as="span" variant="body" size="medium" weight="regular" className={remainingClassName}>
          {remaining.split(": ")[1]}
        </Typography>
      </Typography>
    </div>
  );
}
