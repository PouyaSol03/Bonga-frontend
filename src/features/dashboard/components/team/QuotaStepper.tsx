import type { Dispatch, SetStateAction } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";

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
  const isMaxReached = max !== undefined && value >= max;
  const isZeroQuota = max !== undefined && max <= 0;

  return (
    <div className={isZeroQuota ? "opacity-60" : ""}>
      <Typography as="h2" variant="title" size="medium" weight="semibold" className="m-0 text-right text-base font-semibold leading-6 text-on-surface">
        {label}
      </Typography>
      <div
        className={`mt-3 grid h-14 grid-cols-[80px_1fr_80px] overflow-hidden rounded-xl border border-outline-var transition-colors ${
          isZeroQuota
            ? "bg-surface-container/40 opacity-75 cursor-not-allowed"
            : "bg-surface-container-lowest"
        }`}
      >
        <Button
          unstyled
          className="grid place-items-center border-r border-outline-var bg-surface-container text-2xl font-normal text-on-surface-var disabled:cursor-not-allowed disabled:opacity-40"
          disabled={value <= 0 || isZeroQuota}
          onClick={() => setValue((current) => Math.max(0, current - 1))}
          type="button"
        >
          -
        </Button>
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="medium"
          className="grid place-items-center text-base font-medium leading-6 text-on-surface"
        >
          {new Intl.NumberFormat("fa-IR").format(value)}
        </Typography>
        <Button
          unstyled
          className="grid place-items-center border-l border-outline-var bg-surface-container text-2xl font-normal text-on-surface-var disabled:cursor-not-allowed disabled:opacity-40"
          disabled={isMaxReached || isZeroQuota}
          onClick={() =>
            setValue((current) =>
              max !== undefined ? Math.min(max, current + 1) : current + 1,
            )
          }
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
      {isMaxReached && !isZeroQuota ? (
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-1 pr-3 text-xs text-warning">
          حداکثر سهمیه قابل تخصیص انتخاب شده است.
        </Typography>
      ) : null}
    </div>
  );
}
