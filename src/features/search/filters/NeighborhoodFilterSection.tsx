import { type ReactNode, useState, useMemo } from "react";
import { type SelectedNeighborhood } from "./filterTypes";
import { useOpenOnFilterFocus } from "./useOpenOnFilterFocus";
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";
import {
  neighborhoodSearchDebounceMs,
  minNeighborhoodSearchLength,
  toSelectedNeighborhood,
} from "./neighborhoodValues";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { useNeighborhoodListQuery } from "../../locations/api/neighborhood.hooks";
import { type NeighborhoodDto } from "../../locations/api/neighborhood.service";
import { Button } from "../../../shared/ui/Button";
import LinearLocation from "../../../shared/icons/LinearLocation";
import { Typography } from "../../../shared/ui/Typography";
import LinearArrowLeft1 from "../../../shared/icons/LinearArrowLeft1";
import { FormChoiceChip } from "../../../shared/form/FormControls";
import { NeighborhoodPicker } from "./NeighborhoodPicker";

export type NeighborhoodFilterSectionProps = {
  applyButtonLabel: ReactNode;
  focusTarget?: string | null;
  onApply: () => void;
  onChange: (neighborhoods: SelectedNeighborhood[]) => void;
  sectionId?: string;
  selectedNeighborhoods: SelectedNeighborhood[];
};

export function NeighborhoodFilterSection({
  applyButtonLabel,
  focusTarget,
  onApply,
  onChange,
  sectionId,
  selectedNeighborhoods,
}: NeighborhoodFilterSectionProps) {
  const shouldAutoOpen = useOpenOnFilterFocus(sectionId, focusTarget);
  const [isPickerOpen, setIsPickerOpen] = useState(shouldAutoOpen);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), neighborhoodSearchDebounceMs);
  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";
  const canSearch = debouncedQuery.length >= minNeighborhoodSearchLength;
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isPickerOpen && Boolean(cityId),
    page: 1,
    perPage: 30,
    q: canSearch ? debouncedQuery : "",
  });
  const neighborhoods = neighborhoodsQuery.data ?? [];
  const selectedIds = useMemo(
    () => new Set(selectedNeighborhoods.map((item) => item.id)),
    [selectedNeighborhoods],
  );

  const toggleNeighborhood = (neighborhood: NeighborhoodDto) => {
    const nextNeighborhood = toSelectedNeighborhood(neighborhood);

    onChange(
      selectedIds.has(nextNeighborhood.id)
        ? selectedNeighborhoods.filter((item) => item.id !== nextNeighborhood.id)
        : [...selectedNeighborhoods, nextNeighborhood],
    );
  };

  const removeNeighborhood = (id: string) => {
    onChange(selectedNeighborhoods.filter((item) => item.id !== id));
  };

  return (
    <section
      className="border-surface-container bg-surface-container-lowest scroll-mt-4 border-b-8 px-4 py-2"
      data-filter-section={sectionId}
      dir="rtl"
    >
      <Button
        unstyled
        className="flex min-h-10 w-full items-center justify-between gap-3 text-right"
        onClick={() => setIsPickerOpen(true)}
        type="button"
      >
        <div className="text-on-surface flex min-w-0 items-center gap-2 text-base leading-6 font-medium">
          <LinearLocation className="h-6 w-6" />
          <Typography as="span" variant="label" size="large" weight="medium">
            محله
          </Typography>
        </div>
        <div className="text-primary flex shrink-0 items-center gap-1 text-sm leading-5 font-medium">
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-primary"
          >
            انتخاب
          </Typography>
          <LinearArrowLeft1 className="text-primary h-5 w-5" />
        </div>
      </Button>

      {selectedNeighborhoods.length > 0 ? (
        <div className="mt-3 flex flex-wrap justify-start gap-2">
          {selectedNeighborhoods.map((item) => (
            <FormChoiceChip
              key={item.id}
              label={item.name}
              onClick={() => removeNeighborhood(item.id)}
              removable
              selected
            />
          ))}
        </div>
      ) : null}

      {isPickerOpen ? (
        <NeighborhoodPicker
          applyButtonLabel={applyButtonLabel}
          onApply={onApply}
          onClose={() => setIsPickerOpen(false)}
          query={query}
          setQuery={setQuery}
          selectedNeighborhoods={selectedNeighborhoods}
          removeNeighborhood={removeNeighborhood}
          cityId={cityId}
          neighborhoodsQuery={neighborhoodsQuery}
          neighborhoods={neighborhoods}
          selectedIds={selectedIds}
          toggleNeighborhood={toggleNeighborhood}
        />
      ) : null}
    </section>
  );
}
