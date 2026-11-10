import { InputBox, Section } from "../../components/NewAdControls";
import type { NewAdFieldErrors } from "../../types";
import { moneySupportingText } from "./formatters";
import type { PricingValues, SetDetailsField } from "./types";

import { RentPriceConversion } from "../../components/RentPriceConversion";

export function RentPricing({ values, errors, setField, desktop, allowRentConversion }: {
  values: PricingValues;
  errors: NewAdFieldErrors;
  setField: SetDetailsField;
  desktop: boolean; allowRentConversion: boolean;
}) {
  return (
    <Section icon="money.svg" title="اطلاعات قیمت">
      <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
        <div data-field-key="mortgagePrice">
          <InputBox
            error={errors.mortgagePrice}
            formatNumeric
            numeric
            leftText="تومان"
            onChange={(value) => setField("mortgagePrice", value)}
            placeholder="رهن *"
            supportingText={moneySupportingText(values.mortgagePrice)}
            value={values.mortgagePrice}
          />
        </div>
        <div data-field-key="rentPrice">
          <InputBox
            error={errors.rentPrice}
            formatNumeric
            numeric
            leftText="تومان"
            onChange={(value) => setField("rentPrice", value)}
            placeholder="اجاره *"
            supportingText={moneySupportingText(values.rentPrice)}
            value={values.rentPrice}
          />
        </div>
      </div>

      {allowRentConversion ? (
        <div data-field-key="rentConversionMortgagePrice" className="mt-4">
          <RentPriceConversion
            enabled={values.rentConversionEnabled}
            mortgagePrice={values.mortgagePrice}
            onEnabledChange={(checked) => setField("rentConversionEnabled", checked)}
            onSelectedMortgageChange={(value) => setField("rentConversionMortgagePrice", value)}
            rentPrice={values.rentPrice}
            selectedMortgagePrice={values.rentConversionMortgagePrice}
          />
        </div>
      ) : null}
    </Section>
  );
}
