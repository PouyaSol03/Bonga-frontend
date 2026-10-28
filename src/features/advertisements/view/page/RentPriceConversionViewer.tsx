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
    limitMortgagePrice < baseMortgage
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
  const [liveMortgage, setLiveMortgage] = useState(baseMortgage);

  useEffect(() => {
    setLiveMortgage(baseMortgage);
  }, [baseMortgage, baseRent, limitMortgage]);

  const currentMortgage = liveMortgage;
  const currentRent = Math.max(
    0,
    baseRent +
      Math.round(
        ((baseMortgage - currentMortgage) / RENT_CONVERSION_MORTGAGE_UNIT) *
          RENT_CONVERSION_RENT_PER_UNIT,
      ),
  );
  const range = baseMortgage - limitMortgage;
  const sliderPercent =
    range > 0 ? Math.min(100, Math.max(0, ((currentMortgage - limitMortgage) / range) * 100)) : 100;

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
      <RentConversionSlider baseMortgage={baseMortgage} limitMortgage={limitMortgage} currentMortgage={currentMortgage} sliderPercent={sliderPercent} onChange={setLiveMortgage} />
      <RentConversionEndpoints baseMortgage={baseMortgage} baseRent={baseRent} limitMortgage={limitMortgage} limitRent={limitRent} />
    </div>
  );
}
