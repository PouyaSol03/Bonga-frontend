import { InputBox, Section, Toggle } from "../../components/NewAdControls";
import type { NewAdFieldErrors } from "../../types";
import { moneySupportingText } from "./formatters";
import type { PricingValues, SetDetailsField } from "./types";

import { DesktopExchangeField } from "./DesktopExchangeField";

export function DesktopSalePricing({ values, errors, setField, allowLoan, allowExchange, onOpenExchange, handleLoanToggle }: {
  values: PricingValues;
  errors: NewAdFieldErrors;
  setField: SetDetailsField;
  allowLoan: boolean; allowExchange: boolean; onOpenExchange: () => void; handleLoanToggle: (checked: boolean) => void;
}) {
  const isLoanActive = Boolean(values.loanEnabled);
  return (
    <Section icon="money.svg" title="اطلاعات قیمت">
      <div className="space-y-2">
        <div data-field-key="price">
          <InputBox
            error={errors.price}
            formatNumeric
            numeric
            leftText="تومان"
            onChange={(value) => setField("price", value)}
            placeholder="قیمت *"
            supportingText={moneySupportingText(values.price)}
            value={values.price}
          />
        </div>

        {allowLoan ? (
          <>
            <Toggle checked={isLoanActive} label="وام دارد" onChange={handleLoanToggle} />

            {isLoanActive ? (
              <div className="space-y-3">
                <div data-field-key="loanAmount">
                  <InputBox
                    error={errors.loanAmount}
                    formatNumeric
                    numeric
                    leftText="تومان"
                    onChange={(value) => setField("loanAmount", value)}
                    placeholder="مبلغ وام"
                    supportingText={moneySupportingText(values.loanAmount)}
                    value={values.loanAmount}
                  />
                </div>

                <div data-field-key="loanInstallment">
                  <InputBox
                    error={errors.loanInstallment}
                    formatNumeric
                    numeric
                    leftText="تومان"
                    onChange={(value) => setField("loanInstallment", value)}
                    placeholder="قسط وام"
                    supportingText={moneySupportingText(values.loanInstallment)}
                    value={values.loanInstallment}
                  />
                </div>
              </div>
            ) : null}
          </>
        ) : null}

        {allowExchange ? (
          <Toggle
            checked={values.exchangeEnabled}
            label="معاوضه می‌شود"
            onChange={(checked) => setField("exchangeEnabled", checked)}
          />
        ) : null}

        {allowExchange && values.exchangeEnabled ? (
          <DesktopExchangeField values={values} errors={errors} setField={setField} onOpenExchange={onOpenExchange} />
        ) : null}
      </div>
    </Section>
  );
}
