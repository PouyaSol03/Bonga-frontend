import { useEffect, useState } from "react";
import { Typography } from "../../../../shared/ui/Typography";
import { RENT_CONVERSION_MORTGAGE_UNIT, RENT_CONVERSION_RENT_PER_UNIT } from "../../create/rentPriceConversion";
import { RentConversionAmounts } from "./RentConversionAmounts";
import { RentConversionEndpoints } from "./RentConversionEndpoints";
import { RentConversionSlider } from "./RentConversionSlider";

export function RentPriceConversionViewer({
  limitMortgagePrice,
  mortgagePrice,
  rentPrice,
}: {
  limitMortgagePrice?: number;
  mortgagePrice: number;
  rentPrice: number;
}) {
  const baseMortgage = Math.max(0, mortgagePrice);
  const baseRent = Math.max(0, rentPrice);

  const defaultLimit = Math.max(
    0,
    baseMortgage >= 200_000_000 ? baseMortgage - 200_000_000 : Math.round(baseMortgage * 0.5),
  );
  const limitMortgage =
    typeof limitMortgagePrice === "number" &&
    limitMortgagePrice >= 0 &&
    limitMortgagePrice !== baseMortgage
      ? limitMortgagePrice
      : defaultLimit;

  const mortgageDifference = baseMortgage - limitMortgage;
  const limitRent = Math.max(
    0,
    baseRent +
      Math.round(
        (mortgageDifference / RENT_CONVERSION_MORTGAGE_UNIT) * RENT_CONVERSION_RENT_PER_UNIT,
      ),
  );

  const totalSteps = Math.max(
    0,
    Math.round(Math.abs(baseMortgage - limitMortgage) / RENT_CONVERSION_MORTGAGE_UNIT),
  );

  const [step, setStep] = useState(totalSteps);

  useEffect(() => {
    setStep(totalSteps);
  }, [totalSteps]);

  const currentMortgage =
    totalSteps > 0
      ? Math.round(limitMortgage + (step / totalSteps) * (baseMortgage - limitMortgage))
      : baseMortgage;

  const currentRent = Math.max(
    0,
    baseRent +
      Math.round(
        ((baseMortgage - currentMortgage) / RENT_CONVERSION_MORTGAGE_UNIT) *
          RENT_CONVERSION_RENT_PER_UNIT,
      ),
  );

  const sliderPercent = totalSteps > 0 ? (step / totalSteps) * 100 : 100;

  return (
    <div className="bg-surface-container-lowest rounded-2xl [direction:rtl]">
      <div className="bg-surface-container-highest mb-4 h-px w-full"></div>
      <Typography
        as="p"
        variant="label"
        size="medium"
        weight="medium"
        className="text-on-surface-var mb-3 text-right"
      >
        رهن و اجاره قابل تبدیل است
      </Typography>

      
      <RentConversionAmounts currentMortgage={currentMortgage} currentRent={currentRent} />
      <RentConversionSlider
        totalSteps={totalSteps}
        step={step}
        sliderPercent={sliderPercent}
        onStepChange={setStep}
      />
      <RentConversionEndpoints baseMortgage={baseMortgage} baseRent={baseRent} limitMortgage={limitMortgage} limitRent={limitRent} />
    </div>
  );
}
