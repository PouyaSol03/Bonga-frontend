import { useEffect, useRef, useState } from "react";

import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import { Typography } from "../../../../shared/ui/Typography";
import { SwitchButton } from "./NewAdControls";
import {
  calculateRentPriceConversion,
  parseRentPriceValue,
  RENT_CONVERSION_MORTGAGE_UNIT,
} from "../rentPriceConversion";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";

const faNumber = new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 0 });

function formatMoney(value: number) {
  return faNumber.format(Math.max(0, Math.round(value)));
}

function formatSignedAmount(value: number) {
  const rounded = Math.round(value);
  const sign = rounded > 0 ? "+" : rounded < 0 ? "−" : "";
  const absolute = Math.abs(rounded);

  if (absolute >= 1_000_000_000 && absolute % 1_000_000_000 === 0) {
    return {
      value: `${sign}${faNumber.format(absolute / 1_000_000_000)}`,
      unit: "میلیارد تومان",
    };
  }

  if (absolute >= 1_000_000 && absolute % 1_000_000 === 0) {
    return {
      value: `${sign}${faNumber.format(absolute / 1_000_000)}`,
      unit: "میلیون تومان",
    };
  }

  if (absolute >= 1_000 && absolute % 1_000 === 0) {
    return {
      value: `${sign}${faNumber.format(absolute / 1_000)}`,
      unit: "هزار تومان",
    };
  }

  return {
    value: `${sign}${faNumber.format(absolute)}`,
    unit: "تومان",
  };
}

function ConversionSummaryCard({
  amount,
  label,
  tone,
}: {
  amount: number;
  label: string;
  tone: "mortgage" | "rent";
}) {
  const formatted = formatSignedAmount(amount);
  const isMortgage = tone === "mortgage";

  return (
    <div className="min-w-0 text-center">
      <Typography
        as="p"
        variant="label"
        size="medium"
        weight="medium"
        className="mb-2 text-[#1a1a1a]"
      >
        {label}
      </Typography>

      <div
        className={`flex flex-col items-center justify-center rounded-2xl py-2 ${
          isMortgage ? "bg-[#eaf8f1]" : "bg-[#fff5e8]"
        }`}
      >
        <Typography
          as="strong"
          variant="label"
          size="large"
          weight="semibold"
          dir="ltr"
          className={`${isMortgage ? "text-[#11a366]" : "text-[#ff7200]"} [unicode-bidi:isolate]`}
        >
          {formatted.value}
        </Typography>
        <Typography
          as="span"
          variant="label"
          size="small"
          weight="medium"
          className="mt-2 text-[#4d4d4d]"
        >
          {formatted.unit}
        </Typography>
      </div>
    </div>
  );
}

type ConversionBaseline = {
  mortgage: number;
  rent: number;
};

export function RentPriceConversion({
  enabled,
  mortgagePrice,
  onEnabledChange,
  onSelectedMortgageChange,
  rentPrice,
  selectedMortgagePrice,
}: {
  enabled: boolean;
  mortgagePrice: string;
  onEnabledChange: (checked: boolean) => void;
  onMortgagePriceChange?: (value: string) => void;
  onRentPriceChange?: (value: string) => void;
  onSelectedMortgageChange: (value: string) => void;
  rentPrice: string;
  selectedMortgagePrice: string;
}) {
  const sourceMortgage = parseRentPriceValue(mortgagePrice);
  const sourceRent = parseRentPriceValue(rentPrice);
  const sourceHasPrice = sourceMortgage > 0 && sourceRent > 0;

  const [baseline, setBaseline] = useState<ConversionBaseline>(() => ({
    mortgage: sourceMortgage,
    rent: sourceRent,
  }));
  const [liveMortgage, setLiveMortgage] = useState(() =>
    parseRentPriceValue(selectedMortgagePrice) || sourceMortgage,
  );

  const draggingRef = useRef(false);

  const activeBaseline = enabled
    ? baseline
    : { mortgage: sourceMortgage, rent: sourceRent };
  const activeMortgage = enabled
    ? liveMortgage
    : parseRentPriceValue(selectedMortgagePrice) || sourceMortgage;

  const conversion = calculateRentPriceConversion(
    activeBaseline.mortgage,
    activeBaseline.rent,
    activeMortgage,
  );
  const hasPrice = conversion.maximumMortgage > 0;
  const mortgageDelta = formatSignedAmount(conversion.mortgageDelta);
  const rentDelta = formatSignedAmount(conversion.rentDelta);

  useEffect(() => {
    if (enabled && !sourceHasPrice) {
      draggingRef.current = false;
      onEnabledChange(false);
      onSelectedMortgageChange("");
      return;
    }

    if (enabled) return;

    setBaseline({ mortgage: sourceMortgage, rent: sourceRent });
    setLiveMortgage(parseRentPriceValue(selectedMortgagePrice) || sourceMortgage);
  }, [
    enabled,
    onEnabledChange,
    onSelectedMortgageChange,
    selectedMortgagePrice,
    sourceHasPrice,
    sourceMortgage,
    sourceRent,
  ]);

  useEffect(() => {
    if (!enabled || draggingRef.current) return;

    const sourceChangedOutsideSlider =
      sourceMortgage !== baseline.mortgage || sourceRent !== baseline.rent;

    if (!sourceChangedOutsideSlider) return;

    setBaseline({ mortgage: sourceMortgage, rent: sourceRent });
    setLiveMortgage(sourceMortgage);

    const normalized = String(sourceMortgage);
    if (normalized !== selectedMortgagePrice) {
      onSelectedMortgageChange(normalized);
    }
  }, [
    baseline.mortgage,
    baseline.rent,
    enabled,
    onSelectedMortgageChange,
    selectedMortgagePrice,
    sourceMortgage,
    sourceRent,
  ]);

  const handleToggle = (checked: boolean) => {
    if (checked && !sourceHasPrice) return;

    draggingRef.current = false;

    if (checked) {
      const initialMortgage = parseRentPriceValue(selectedMortgagePrice) || sourceMortgage;
      setBaseline({ mortgage: sourceMortgage, rent: sourceRent });
      setLiveMortgage(initialMortgage);
      onSelectedMortgageChange(String(initialMortgage));
    }

    onEnabledChange(checked);
  };

  const updateLiveConversion = (value: string | number) => {
    const next = calculateRentPriceConversion(
      baseline.mortgage,
      baseline.rent,
      value,
    );

    setLiveMortgage(next.convertedMortgage);
    return next;
  };

  const commitConversion = (value: string | number) => {
    const next = updateLiveConversion(value);
    // Sets only the limit without touching base mortgagePrice or rentPrice
    onSelectedMortgageChange(String(next.convertedMortgage));
  };

  return (
    <div className="mt-5 border-t border-[#cccccc] pt-1">
      <div className="flex h-16 items-center justify-between [direction:ltr]">
        <SwitchButton checked={enabled} disabled={!sourceHasPrice} onChange={handleToggle} />

        <Typography
          as="span"
          variant="title"
          size="medium"
          weight="semibold"
          className="text-right text-[#1a1a1a] [direction:rtl]"
        >
          تبدیل رهن و اجاره
        </Typography>
      </div>

      {enabled ? (
        <div className="pb-2 pt-2 [direction:rtl]">
          <div className="flex items-start gap-2 rounded-2xl bg-[#edf3ff] px-4 py-3 text-[#0048c4]">
            <LinearInfoCircle aria-hidden="true" className="mt-0.5 h-6 w-6 shrink-0" />
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="m-0 text-right"
            >
              به ازای هر یک میلیون تومان رهن، ۳۰ هزار تومان اجاره محاسبه می‌شود.
            </Typography>
          </div>

          <div className="mt-4 py-4">
            <div className="flex items-center justify-between gap-4 px-0.5">
              <Typography as="span" variant="label" size="medium" weight="medium" className="text-[#4d4d4d]">
                رهن <span className="text-[#11a366]">{formatMoney(conversion.convertedMortgage)}</span>
              </Typography>
              <Typography as="span" variant="label" size="medium" weight="medium" className="text-[#4d4d4d]">
                اجاره <span className="text-[#ff7200]">{formatMoney(conversion.convertedRent)}</span>
              </Typography>
            </div>

            <div className="relative mx-2 mt-1 h-[28px] select-none [direction:ltr]">
              <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-[#f2f2f2]">
                <div
                  className="absolute bottom-0 left-0 top-0 bg-warning"
                  style={{ width: `${conversion.positionPercent}%` }}
                />
                <div
                  className="absolute bottom-0 right-0 top-0 bg-tertiary"
                  style={{ width: `${100 - conversion.positionPercent}%` }}
                />
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white" />
              </div>

              <div className="absolute left-0 top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-warning">
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </div>
              <div className="absolute right-0 top-1/2 z-10 h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-tertiary">
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </div>

              {hasPrice ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-lg border border-outline-var bg-white px-4 py-1.5 text-[#4d4d4d] shadow-[0_2px_8px_rgba(26,26,26,0.08)]"
                  style={{ left: `${12 + conversion.positionPercent * 0.76}%` }}
                >
                  <LinearArrowLeft1 className="h-4 w-4" />
                  <Typography as="span" variant="label" size="small" weight="medium" className="text-on-surface">تبدیل</Typography>
                  <LinearArrowRight1 className="h-4 w-4" />
                </div>
              ) : null}

              <input
                aria-label="تبدیل مبلغ رهن و اجاره"
                className="absolute z-20 h-full cursor-ew-resize touch-pan-y opacity-0 disabled:cursor-not-allowed"
                style={{ left: '12%', width: '76%' }}
                disabled={!hasPrice}
                max={Math.max(0, Math.round(conversion.maximumMortgage))}
                min={0}
                onChange={(event) => {
                  if (!draggingRef.current) {
                    commitConversion(event.target.value);
                  }
                }}
                onInput={(event) => {
                  const raw = Number(event.currentTarget.value);
                  const max = Math.max(0, Math.round(conversion.maximumMortgage));
                  const halfStep = RENT_CONVERSION_MORTGAGE_UNIT / 2;
                  const snapped = Math.abs(raw - max) < halfStep ? max : raw;
                  updateLiveConversion(snapped);
                }}
                onPointerCancel={(event) => {
                  draggingRef.current = false;
                  commitConversion(event.currentTarget.value);
                }}
                onPointerDown={() => {
                  draggingRef.current = true;
                }}
                onPointerUp={(event) => {
                  draggingRef.current = false;
                  commitConversion(event.currentTarget.value);
                }}
                step={RENT_CONVERSION_MORTGAGE_UNIT}
                type="range"
                value={Math.round(conversion.convertedMortgage)}
              />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4" dir="rtl">
              <ConversionSummaryCard
                amount={conversion.mortgageDelta}
                label="رهن تبدیل شده"
                tone="mortgage"
              />
              <ConversionSummaryCard
                amount={conversion.rentDelta}
                label="اجاره تبدیل شده"
                tone="rent"
              />
            </div>

            <span className="sr-only">
              تغییر رهن {mortgageDelta.value} {mortgageDelta.unit}، تغییر اجاره {rentDelta.value} {rentDelta.unit}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
