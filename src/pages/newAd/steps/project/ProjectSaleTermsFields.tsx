import type { NewAdFormValues } from "../../types";
import { InputBox, Toggle } from "../../components/NewAdControls";

type ProjectSaleTermsFieldsProps = {
  values: NewAdFormValues;
  setField: <T extends keyof NewAdFormValues>(
    key: T,
    value: NewAdFormValues[T],
  ) => void;
};

export function ProjectSaleTermsFields({
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
            numeric
            leftText="درصد"
            onChange={(value) => setField("saleTermsPercent", value)}
            placeholder="درصد"
            value={values.saleTermsPercent}
          />

          <InputBox
            numeric
            leftText="ماه"
            onChange={(value) => setField("saleTermsInstallmentMonths", value)}
            placeholder="تعداد قسط"
            value={values.saleTermsInstallmentMonths}
          />
        </div>
      ) : null}
    </>
  );
}