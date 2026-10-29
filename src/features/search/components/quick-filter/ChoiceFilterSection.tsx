import { FormChoiceChip } from "../../../../shared/form/FormControls";
import { normalizeChoiceValue } from "./quickFilterHelpers";
import type { SearchMapQuickFilterId } from "./types";

type ChoiceFilterSectionProps = {
  choiceOptions: string[];
  filterId: SearchMapQuickFilterId | null;
  onSelectChoices: (updater: (current: string[]) => string[]) => void;
  selectedChoices: string[];
};

export function ChoiceFilterSection({
  choiceOptions,
  filterId,
  onSelectChoices,
  selectedChoices,
}: ChoiceFilterSectionProps) {
  return (
    <div className="flex flex-wrap justify-start gap-2" dir="rtl">
      {choiceOptions.map((option) => {
        const normalizedOption = normalizeChoiceValue(option);
        const isSelected = selectedChoices.some(
          (value) => normalizeChoiceValue(value) === normalizedOption,
        );

        return (
          <FormChoiceChip
            key={option}
            label={option}
            onClick={() => {
              if (filterId === "building_age") {
                onSelectChoices(() => (isSelected ? [] : [normalizedOption]));
                return;
              }

              onSelectChoices((current) =>
                isSelected
                  ? current.filter((value) => normalizeChoiceValue(value) !== normalizedOption)
                  : [...current, normalizedOption],
              );
            }}
            selected={isSelected}
          />
        );
      })}
    </div>
  );
}
