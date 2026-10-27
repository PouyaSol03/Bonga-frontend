import { Typography } from "../../../../shared/ui/Typography";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearArrowRight1 from "../../../../shared/icons/LinearArrowRight1";
import { RENT_CONVERSION_MORTGAGE_UNIT } from "../../create/rentPriceConversion";

export function RentConversionSlider({
  totalSteps,
  step,
  sliderPercent,
  onStepChange,
}: {
  totalSteps: number;
  step: number;
  sliderPercent: number;
  onStepChange: (step: number) => void;
}) {
  return (
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
        className="absolute z-20 h-full cursor-ew-resize opacity-0 disabled:cursor-not-allowed"
        style={{ left: "12%", width: "76%" }}
        disabled={totalSteps === 0}
        max={totalSteps}
        min={0}
        onInput={(event) => {
          onStepChange(Number(event.currentTarget.value));
        }}
        step={1}
        type="range"
        value={step}
      />
    </div>
  );
}
