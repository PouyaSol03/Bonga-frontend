import { useEffect } from "react";

import LinearInfoCircle from "../../../../shared/icons/LinearInfoCircle";
import { Typography } from "../../../../shared/ui/Typography";
import { SwitchButton } from "./NewAdControls";
import {
  calculateRentPriceConversion,
  parseRentPriceValue,
  RENT_CONVERSION_MORTGAGE_UNIT,
} from "../rentPriceConversion";

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
        className="mb-3 text-[#1a1a1a]"
      >
        {label}
      </Typography>

      <div
        className={`flex min-h-[112px] flex-col items-center justify-center rounded-[28px] px-3 py-4 ${
          isMortgage ? "bg-[#eaf8f1]" : "bg-[#fff5e8]"
        }`}
      >
        <Typography
          as="strong"
          variant="title"
          size="large"
          weight="semibold"
          className={isMortgage ? "text-[#11a366]" : "text-[#ff7200]"}
        >
          {formatted.value}
        </Typography>
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="medium"
          className="mt-2 text-[#4d4d4d]"
        >
          {formatted.unit}
        </Typography>
      </div>
    </div>
  );
}

export function RentPriceConversion({
  enabled,
  mortgagePrice,
  onEnabledChange,
  onMortgagePriceChange,
  onRentPriceChange,
  onSelectedMortgageChange,
  rentPrice,
  selectedMortgagePrice,
}: {
  enabled: boolean;
  mortgagePrice: string;
  onEnabledChange: (checked: boolean) => void;
  onMortgagePriceChange: (value: string) => void;
  onRentPriceChange: (value: string) => void;
  onSelectedMortgageChange: (value: string) => void;
  rentPrice: string;
  selectedMortgagePrice: string;
}) {
  const baseMortgage = parseRentPriceValue(mortgagePrice);
  const baseRent = parseRentPriceValue(rentPrice);
  const selected = selectedMortgagePrice || String(baseMortgage || 0);
  const conversion = calculateRentPriceConversion(mortgagePrice, rentPrice, selected);
  const hasPrice = conversion.maximumMortgage > 0;
  const mortgageDelta = formatSignedAmount(conversion.mortgageDelta);
  const rentDelta = formatSignedAmount(conversion.rentDelta);

  useEffect(() => {
    if (enabled && !hasPrice) {
      onEnabledChange(false);
      onSelectedMortgageChange("");
      return;
    }

    if (!enabled) return;

    const normalized = String(conversion.convertedMortgage);
    if (normalized !== selectedMortgagePrice) {
      onSelectedMortgageChange(normalized);
    }
  }, [conversion.convertedMortgage, enabled, hasPrice, onEnabledChange, onSelectedMortgageChange, selectedMortgagePrice]);

  const handleToggle = (checked: boolean) => {
    if (checked && !hasPrice) return;

    if (checked && !selectedMortgagePrice) {
      onSelectedMortgageChange(String(baseMortgage || 0));
    }
    onEnabledChange(checked);
  };

  return (
    <div className="mt-5 border-t border-[#cccccc] pt-1">
      <div className="flex h-16 items-center justify-between [direction:ltr]">
        <SwitchButton checked={enabled} disabled={!hasPrice} onChange={handleToggle} />

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
              className="m-0 text-right leading-7"
            >
              به ازای هر یک میلیون تومان رهن، ۳۰ هزار تومان اجاره محاسبه می‌شود.
            </Typography>
          </div>

          <div className="mt-7">
            <div className="flex items-center justify-between gap-4 px-0.5">
              <Typography as="span" variant="label" size="medium" weight="medium" className="text-[#4d4d4d]">
                رهن <span className="text-[#11a366]">{formatMoney(conversion.convertedMortgage)}</span>
              </Typography>
              <Typography as="span" variant="label" size="medium" weight="medium" className="text-[#4d4d4d]">
                اجاره <span className="text-[#ff7200]">{formatMoney(conversion.convertedRent)}</span>
              </Typography>
            </div>

            <div className="relative mt-2 h-[70px] select-none [direction:ltr]">
              <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 overflow-hidden rounded-full bg-[#f2f2f2]">
                <div
                  className="absolute bottom-0 left-0 top-0 bg-[#ffb100]"
                  style={{ width: `${conversion.positionPercent}%` }}
                />
                <div
                  className="absolute bottom-0 right-0 top-0 bg-[#11a366]"
                  style={{ width: `${100 - conversion.positionPercent}%` }}
                />
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-white" />
              </div>

              <div className="absolute left-0 top-1/2 z-10 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#ffb100] shadow-[0_0_0_1px_#ffb100]">
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </div>
              <div className="absolute right-0 top-1/2 z-10 h-5 w-5 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#11a366] shadow-[0_0_0_1px_#11a366]">
                <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
              </div>

              {hasPrice ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 z-10 flex h-[54px] w-[112px] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-3 rounded-[14px] border border-[#cccccc] bg-white text-[#4d4d4d] shadow-[0_2px_8px_rgba(26,26,26,0.08)]"
                  style={{ left: `${Math.min(88, Math.max(12, conversion.positionPercent))}%` }}
                >
                  <span className="text-2xl leading-none">‹</span>
                  <Typography as="span" variant="title" size="medium" weight="medium">تبدیل</Typography>
                  <span className="text-2xl leading-none">›</span>
                </div>
              ) : null}

              <input
                aria-label="تبدیل مبلغ رهن و اجاره"
                className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0 disabled:cursor-not-allowed"
                disabled={!hasPrice}
                max={Math.max(0, Math.round(conversion.maximumMortgage))}
                min={0}
                onChange={(event) => {
                  const next = calculateRentPriceConversion(
                    mortgagePrice,
                    rentPrice,
                    event.target.value,
                  );

                  onSelectedMortgageChange(String(next.convertedMortgage));
                  onMortgagePriceChange(String(next.convertedMortgage));
                  onRentPriceChange(String(next.convertedRent));
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
