import { FormTextField } from "../../../../shared/form/FormControls";
import { formatBigNumber } from "../../../../shared/lib/MoneyHandler";
import { formatGroupedNumber, normalizeNumber } from "./quickFilterHelpers";

type PriceFilterSectionProps = {
  onPriceMaximumChange: (val: string) => void;
  onPriceMinimumChange: (val: string) => void;
  priceMaximum: string;
  priceMinimum: string;
};

export function PriceFilterSection({
  onPriceMaximumChange,
  onPriceMinimumChange,
  priceMaximum,
  priceMinimum,
}: PriceFilterSectionProps) {
  return (
    <div className="space-y-4" dir="rtl">
      <FormTextField
        badge="تومان"
        label="حداقل"
        onChange={(event) => onPriceMinimumChange(normalizeNumber(event.target.value))}
        onClear={() => onPriceMinimumChange("")}
        placeholder="حداقل قیمت"
        supportingText={priceMinimum ? `${formatBigNumber(Number(priceMinimum))} تومان` : undefined}
        value={formatGroupedNumber(priceMinimum)}
      />
      <FormTextField
        badge="تومان"
        label="حداکثر"
        onChange={(event) => onPriceMaximumChange(normalizeNumber(event.target.value))}
        onClear={() => onPriceMaximumChange("")}
        placeholder="حداکثر قیمت"
        supportingText={priceMaximum ? `${formatBigNumber(Number(priceMaximum))} تومان` : undefined}
        value={formatGroupedNumber(priceMaximum)}
      />
    </div>
  );
}
