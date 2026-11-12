import type { NewAdFieldErrors, NewAdFormValues } from "../../types";
import { InputBox } from "../../components/NewAdControls";
import { PriceToggleRow } from "../details/PriceToggleRow";

type ProjectSaleTermsFieldsProps = {
  errors?: NewAdFieldErrors;
  values: NewAdFormValues;
  setField: <T extends keyof NewAdFormValues>(key: T, value: NewAdFormValues[T]) => void;
};

export function ProjectSaleTermsFields({
  errors = {},
  values,
  setField,
}: ProjectSaleTermsFieldsProps) {
  return (
    <>
      <PriceToggleRow
        checked={values.saleTermsEnabled}
        label="شرایط فروش"
        onChange={(checked) => setField("saleTermsEnabled", checked)}
      />

      {values.saleTermsEnabled ? (
        <div className="space-y-3 pb-4">
          <InputBox
            error={errors.saleTermsPercent}
            numeric
            leftText="درصد"
            onChange={(value) => {
              const normalizedPercent = value.replace(/,/g, "");

              if (
                normalizedPercent === "" ||
                (Number.isFinite(Number(normalizedPercent)) && Number(normalizedPercent) <= 100)
              ) {
                setField("saleTermsPercent", normalizedPercent);
              }
            }}
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
