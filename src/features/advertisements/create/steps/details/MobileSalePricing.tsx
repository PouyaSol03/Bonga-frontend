import { InputBox, Section } from "../../components/NewAdControls";
import type { NewAdFieldErrors } from "../../types";
import { moneySupportingText } from "./formatters";
import type { PricingValues, SetDetailsField } from "./types";
import { PriceToggleRow } from "./PriceToggleRow";

import { MobileExchangeField } from "./MobileExchangeField";

export function MobileSalePricing({ values, errors, setField, allowLoan, allowExchange, onOpenExchange, handleLoanToggle }: {
  values: PricingValues;
  errors: NewAdFieldErrors;
  setField: SetDetailsField;
  allowLoan: boolean; allowExchange: boolean; onOpenExchange: () => void; handleLoanToggle: (checked: boolean) => void;
}) {
  const isLoanActive = Boolean(values.loanEnabled);
  const priceSupportingText = moneySupportingText(values.price);
  const priceHasSupportingText = Boolean(errors.price || priceSupportingText);
  return (
    <Section
      contentClassName={values.exchangeEnabled ? "pt-3 pb-6" : "pt-3 pb-1"}
      icon="money.svg"
      title="اطلاعات قیمت"
    >
      <div data-field-key="price">
        <InputBox
          error={errors.price}
          floatingLabel="قیمت *"
          formatNumeric
          highlightWhenFilled={false}
          numeric
          leftText="تومان"
          onChange={(value) => setField("price", value)}
          placeholder="قیمت *"
          supportingText={priceSupportingText}
          value={values.price}
        />
      </div>

      {allowLoan ? (
        <>
          <div
            className={`${priceHasSupportingText ? "mt-4" : "mt-5"} border-outline-var border-t`}
          >
            <PriceToggleRow checked={isLoanActive} label="وام دارد" onChange={handleLoanToggle} />
          </div>

          {isLoanActive ? (
            <div className="mt-3 space-y-4">
              <div data-field-key="loanAmount">
                <InputBox
                  error={errors.loanAmount}
                  floatingLabel="مبلغ وام"
                  formatNumeric
                  highlightWhenFilled={false}
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
                  floatingLabel="قسط وام"
                  formatNumeric
                  highlightWhenFilled={false}
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
        <div
          className={`${
            !allowLoan ? (priceHasSupportingText ? "mt-4" : "mt-5") : isLoanActive ? "mt-4" : ""
          } border-outline-var border-t`}
        >
          <PriceToggleRow
            checked={values.exchangeEnabled}
            label="معاوضه می‌شود"
            onChange={(checked) => setField("exchangeEnabled", checked)}
          />
        </div>
      ) : null}

      {allowExchange && values.exchangeEnabled ? (
        <MobileExchangeField values={values} errors={errors} setField={setField} onOpenExchange={onOpenExchange} />
      ) : null}
    </Section>
  );
}
