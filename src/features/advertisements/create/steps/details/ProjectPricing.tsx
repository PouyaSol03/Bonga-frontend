import { InputBox, Section } from "../../components/NewAdControls";
import type { NewAdFieldErrors, NewAdFormValues } from "../../types";
import { moneySupportingText } from "./formatters";
import type { SetDetailsField } from "./types";
import { PriceToggleRow } from "./PriceToggleRow";
import { ProjectSaleTermsFields } from "../project/ProjectSaleTermsFields";

import { ProjectExchangeField } from "./ProjectExchangeField";

export function ProjectPricing({ values, errors, setField, desktop, onOpenExchange }: {
  values: NewAdFormValues;
  errors: NewAdFieldErrors;
  setField: SetDetailsField;
  desktop: boolean; onOpenExchange: () => void;
}) {
  return (
    <Section icon="money.svg" title="اطلاعات قیمت">
      <div className={desktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
        <InputBox
          error={errors.minPrice}
          formatNumeric
          numeric
          leftText="تومان"
          onChange={(value) => setField("minPrice", value)}
          placeholder="حداقل قیمت(متری) *"
          supportingText={moneySupportingText(values.minPrice)}
          value={values.minPrice}
        />
        <InputBox
          error={errors.maxPrice}
          formatNumeric
          numeric
          leftText="تومان"
          onChange={(value) => setField("maxPrice", value)}
          placeholder="حداکثر قیمت(متری) *"
          supportingText={moneySupportingText(values.maxPrice)}
          value={values.maxPrice}
        />
      </div>

      <div className="border-outline-var mt-4 border-t">
        <ProjectSaleTermsFields errors={errors} values={values} setField={setField} />
      </div>

      <div className="border-outline-var border-t">
        <PriceToggleRow
          checked={values.exchangeEnabled}
          label="معاوضه"
          onChange={(checked) => setField("exchangeEnabled", checked)}
        />
      </div>

      {values.exchangeEnabled ? (
        <div className="mt-2">
          <ProjectExchangeField
            values={values}
            errors={errors}
            setField={setField}
            onOpenExchange={onOpenExchange}
          />
        </div>
      ) : null}
    </Section>
  );
}
