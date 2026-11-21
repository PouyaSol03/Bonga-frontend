import type { NewAdFieldErrors, NewAdFormValues } from "../../types";
import { InputBox } from "../../components/NewAdControls";
import { PriceToggleRow } from "../details/PriceToggleRow";
import { toPersianDigits } from "../../../../../shared/lib/numberUtils";

type ProjectSaleTermsFieldsProps = {
  errors?: NewAdFieldErrors;
  values: NewAdFormValues;
  setField: <T extends keyof NewAdFormValues>(key: T, value: NewAdFormValues[T]) => void;
};

export function getSaleTermsSupportingText(value?: string): string | undefined {
  if (!value) return undefined;
  const cleaned = value.replace(/,/g, "").trim();
  if (!cleaned) return undefined;
  const num = Number(cleaned);
  if (!Number.isFinite(num) || num < 0 || num > 100) return undefined;
  const installment = num;
  const cash = 100 - num;
  return `${toPersianDigits(installment)} درصد اقساط، ${toPersianDigits(cash)} درصد نقد`;
}

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
            supportingText={getSaleTermsSupportingText(values.saleTermsPercent)}
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
