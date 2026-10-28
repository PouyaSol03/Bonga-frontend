import { Typography } from "../../../../shared/ui/Typography";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";
import { RENT_CONVERSION_MORTGAGE_UNIT } from "../../create/rentPriceConversion";

export function RentConversionSlider({baseMortgage,limitMortgage,currentMortgage,sliderPercent,onChange}: {baseMortgage:number;limitMortgage:number;currentMortgage:number;sliderPercent:number;onChange:(value:number)=>void}) { return (
      <div className="relative mx-1 mt-4 h-9 select-none [direction:ltr]">
        
        <div className="bg-primary-container absolute top-1/2 right-0 left-0 flex h-3 -translate-y-1/2 items-center justify-between overflow-hidden rounded-full px-2.5">
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className="bg-surface-container-lowest/70 h-1 w-1 shrink-0 rounded-full"
            />
          ))}
        </div>

        
        <div
          aria-hidden="true"
          className="border-outline-var bg-surface-container-lowest text-on-surface pointer-events-none absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-lg border px-3 py-1 text-xs font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
          style={{ left: `${12 + sliderPercent * 0.76}%` }}
        >
          <LinearArrowLeft1 className="text-on-surface-var h-4 w-4" />
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-on-surface"
          >
            تبدیل
          </Typography>
          <LinearArrowRight1 className="text-on-surface-var h-4 w-4" />
        </div>

        
        <input
          aria-label="تبدیل مبلغ رهن و اجاره"
          className="absolute z-20 h-full cursor-ew-resize opacity-0"
          style={{ left: "12%", width: "76%" }}
          max={baseMortgage}
          min={limitMortgage}
          onInput={(event) => {
            const raw = Number(event.currentTarget.value);
            const stepped =
              Math.round(raw / RENT_CONVERSION_MORTGAGE_UNIT) * RENT_CONVERSION_MORTGAGE_UNIT;
            const halfStep = RENT_CONVERSION_MORTGAGE_UNIT / 2;
            const snapped =
              Math.abs(stepped - baseMortgage) < halfStep
                ? baseMortgage
                : Math.abs(stepped - limitMortgage) < halfStep
                  ? limitMortgage
                  : stepped;
            const clamped = Math.min(baseMortgage, Math.max(limitMortgage, snapped));
            onChange(clamped);
          }}
          step={RENT_CONVERSION_MORTGAGE_UNIT}
          type="range"
          value={currentMortgage}
        />
      </div>

      

); }
