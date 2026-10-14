import type { Dispatch, SetStateAction } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { toEnglishDigits, toPersianNumber } from "../../../../shared/lib/numberUtils";

export function QuotaStepper({
  label,
  max,
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
      <Typography
        as="h2"
        variant="title"
        size="medium"
        weight="semibold"
        className="text-on-surface m-0 text-right text-base leading-6 font-semibold"
      >
        {label}
      </Typography>
      <div className="border-outline-var bg-surface-container-lowest mt-3 grid h-14 grid-cols-[80px_1fr_80px] overflow-hidden rounded-xl border transition-colors">
        <Button
          unstyled
          className="border-outline-var bg-surface-container text-on-surface-var grid place-items-center border-r text-2xl font-normal disabled:cursor-not-allowed disabled:opacity-40"
          disabled={value <= 0}
          onClick={() => setValue((current) => Math.max(0, current - 1))}
          type="button"
        >
          -
        </Button>
        <input
          aria-label={label}
          className="text-on-surface w-full bg-transparent text-center text-base leading-6 font-medium outline-none"
          inputMode="numeric"
          onChange={(e) => {
            const raw = toEnglishDigits(e.target.value).replace(/\D/g, "");
            const num = raw ? Number(raw) : 0;
            setValue(max !== undefined ? Math.min(max, num) : num);
          }}
          type="text"
          value={value === 0 ? "۰" : toPersianNumber(value)}
        />
        <Button
          unstyled
          className="border-outline-var bg-surface-container text-on-surface-var grid place-items-center border-l text-2xl font-normal disabled:cursor-not-allowed disabled:opacity-40"
          disabled={max !== undefined && value >= max}
          onClick={() =>
            setValue((current) => (max !== undefined ? Math.min(max, current + 1) : current + 1))
          }
          type="button"
        >
          +
        </Button>
      </div>
      <Typography
        as="p"
        variant="body"
        size="small"
        weight="medium"
        className="text-outline m-0 mt-2 pr-3 text-xs leading-5 font-medium"
      >
        <Typography as="span" variant="body" size="medium" weight="regular">
          باقیمانده سهمیه آژانس:{" "}
        </Typography>
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className={remainingClassName}
        >
          {remaining.split(": ")[1]}
        </Typography>
      </Typography>
    </div>
  );
}
