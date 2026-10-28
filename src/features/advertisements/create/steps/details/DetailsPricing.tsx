import { InputBox, Section } from "../../components/NewAdControls";
import type { NewAdFieldErrors, NewAdFormValues } from "../../types";
import type { SetDetailsField } from "./types";
import { ProjectPricing } from "./ProjectPricing";
import { DailyPricing } from "./DailyPricing";
import { RentPricing } from "./RentPricing";
import { DesktopSalePricing } from "./DesktopSalePricing";
import { MobileSalePricing } from "./MobileSalePricing";

export function DetailsPricing({ values, errors, setField, desktop, isPartnership, isProject,
  isDailyRent, isDailyHotelRent, isRent, allowLoan, allowExchange, allowRentConversion,
  onOpenExchange, handleLoanToggle,
}: {
  values: NewAdFormValues;
  errors: NewAdFieldErrors;
  setField: SetDetailsField;
  desktop: boolean;
  isPartnership: boolean;
  isProject: boolean;
  isDailyRent: boolean;
  isDailyHotelRent: boolean;
  isRent: boolean;
  allowLoan: boolean;
  allowExchange: boolean;
  allowRentConversion: boolean;
  onOpenExchange: () => void;
  handleLoanToggle: (checked: boolean) => void;
}) {
  if (isPartnership) {
    return (
      <Section icon="money.svg" title="شرایط مشارکت">
        <InputBox
          error={errors.builderSharePercent}
          numeric
          leftText="درصد"
          onChange={(value) => {
            const normalizedPercent = value.replace(/,/g, "");

            if (normalizedPercent === "" || Number(normalizedPercent) <= 100) {
              setField("builderSharePercent", normalizedPercent);
            }
          }}
          placeholder="درصد مشارکت / درصد سهم"
          value={values.builderSharePercent}
        />
      </Section>
    );
  }
  if (isProject) return <ProjectPricing values={values} errors={errors} setField={setField} desktop={desktop} onOpenExchange={onOpenExchange} />;
  if (isDailyRent) return <DailyPricing values={values} errors={errors} setField={setField} desktop={desktop} isDailyHotelRent={isDailyHotelRent} />;
  if (isRent) return <RentPricing values={values} errors={errors} setField={setField} desktop={desktop} allowRentConversion={allowRentConversion} />;
  const SalePricing = desktop ? DesktopSalePricing : MobileSalePricing;
  return <SalePricing values={values} errors={errors} setField={setField} allowLoan={allowLoan} allowExchange={allowExchange} onOpenExchange={onOpenExchange} handleLoanToggle={handleLoanToggle} />;
}
