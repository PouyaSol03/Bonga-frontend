import type { ViewAdDetails } from ".././viewAdTypes";
import { AdCardTomanIcon } from "../../components/AdCardIcons";
import { Typography } from "../../../../shared/ui/Typography";
import { RentPriceConversionViewer } from "./RentPriceConversionViewer";

export function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-container flex items-center justify-between rounded-lg p-4 [direction:ltr]">
      <div className="flex items-center gap-1">
        <AdCardTomanIcon className="text-on-surface-var h-6 w-6" />
        <Typography
          as="p"
          variant="label"
          size="large"
          weight="semibold"
          className="text-on-surface [direction:rtl]"
        >
          {value}
        </Typography>
      </div>
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="medium"
        className="text-on-surface-var"
      >
        {label}
      </Typography>
    </div>
  );
}

export function AdvertisementPriceBlock({ details }: { details: ViewAdDetails }) {
  const showSlider = details.rentConvertible && (details.rentMortgagePriceRaw ?? 0) > 0;
  return (
    <div className="mt-4 space-y-2">
      {!showSlider && (
        <>
          <PriceRow label={details.pricePrimaryLabel} value={details.totalPrice} />
          <PriceRow label={details.priceSecondaryLabel} value={details.pricePerMeter} />
        </>
      )}
      {showSlider ? (
        <RentPriceConversionViewer
          limitMortgagePrice={details.rentConversionMortgagePriceRaw}
          mortgagePrice={details.rentMortgagePriceRaw ?? 0}
          rentPrice={details.rentMonthlyPriceRaw ?? 0}
        />
      ) : null}
    </div>
  );
}
