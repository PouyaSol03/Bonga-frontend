import { FormChoiceChip } from "../../../../../shared/form/FormControls";
import LinearApartment from "../../../../../shared/icons/LinearApartment";
import LinearArrowLeft1 from "../../../../../shared/icons/LinearArrowLeft1";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import {
  adManagementPropertyTypeLabels,
  adManagementTransactionOptions,
  type AdManagementPropertyType,
  type AdManagementTransaction,
} from "../../adManagementData";

export function TransactionSection({
  onOpenPropertyTypePicker,
  onRemovePropertyType,
  onSelectTransaction,
  propertyTypes,
  transaction,
}: {
  onOpenPropertyTypePicker: () => void;
  onRemovePropertyType: (type: AdManagementPropertyType) => void;
  onSelectTransaction: (next: AdManagementTransaction) => void;
  propertyTypes: AdManagementPropertyType[];
  transaction?: AdManagementTransaction;
}) {
  return (
    <section
      className="bg-surface-container-lowest mt-2 px-4 pt-4 pb-4"
      aria-label="نوع معامله"
    >
      <div className="text-on-surface mb-4 flex items-center justify-start gap-2 text-base leading-6 font-medium">
        <LinearApartment className="text-on-surface-var h-6 w-6 shrink-0" />
        <Typography as="p" variant="label" size="large" className="m-0">
          نوع معامله
        </Typography>
      </div>

      <div className="grid grid-cols-3 gap-2" dir="rtl">
        {adManagementTransactionOptions.map((option) => {
          const isSelected = transaction === option.id;

          return (
            <Button
              unstyled
              aria-pressed={isSelected}
              className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-primary bg-primary/16 text-primary"
                  : "border-outline-var bg-surface-container-lowest text-on-surface"
              }`}
              key={option.id}
              onClick={() => onSelectTransaction(option.id)}
              type="button"
              size="x-medium"
            >
              <Typography variant="label" size="medium" weight="medium">
                {option.label}
              </Typography>
            </Button>
          );
        })}
      </div>

      <div className="bg-outline-var mt-4 h-px" />

      <Button
        unstyled
        className="mt-4 flex h-10 w-full items-center justify-between active:bg-primary-container/20 [direction:ltr]"
        onClick={onOpenPropertyTypePicker}
        type="button"
      >
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="flex min-w-0 items-center gap-1 text-sm leading-5 font-medium text-primary"
        >
          <LinearArrowLeft1 className="text-on-surface-var h-6 w-6" />
        </Typography>
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="medium"
          className="text-on-surface flex shrink-0 items-center gap-2 text-base leading-6 font-medium [direction:rtl]"
        >
          <Typography as="span" variant="label" size="large" weight="medium">
            نوع ملک
          </Typography>
        </Typography>
      </Button>

      {propertyTypes.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2" dir="rtl">
          {propertyTypes.map((selectedPropertyType) => (
            <FormChoiceChip
              key={selectedPropertyType}
              label={adManagementPropertyTypeLabels[selectedPropertyType]}
              onClick={() => onRemovePropertyType(selectedPropertyType)}
              removable
              selected
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
