import type { NewAdFieldErrors, NewAdFormValues } from "../../types";
import { InputBox, Toggle } from "../../components/NewAdControls";

type ProjectSaleTermsFieldsProps = {
  errors?: NewAdFieldErrors;
  values: NewAdFormValues;
  setField: <T extends keyof NewAdFormValues>(
    key: T,
    value: NewAdFormValues[T],
  ) => void;
};

export function ProjectSaleTermsFields({
  errors = {},
  values,
  setField,
}: ProjectSaleTermsFieldsProps) {
  return (
    <>
      <Toggle
        checked={values.saleTermsEnabled}
        label="شرایط فروش"
        onChange={(checked) => setField("saleTermsEnabled", checked)}
      />

      {values.saleTermsEnabled ? (
        <div className="space-y-3">
          <InputBox
            error={errors.saleTermsPercent}
            numeric
            leftText="درصد"
            onChange={(value) => setField("saleTermsPercent", value)}
            placeholder="درصد شرایط"
            value={values.saleTermsPercent}
          />

          <InputBox
            error={errors.saleTermsInstallmentMonths}
            numeric
            leftText="ماه"
            onChange={(value) => setField("saleTermsInstallmentMonths", value)}
            placeholder="تعداد اقساط"
            value={values.saleTermsInstallmentMonths}
          />
        </div>
      ) : null}
    </>
  );
}