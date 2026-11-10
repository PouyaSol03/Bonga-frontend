import { useMemo, useState } from "react";
import { FormChoiceChip } from "../../../../../shared/form/FormControls";
import { useDebouncedValue } from "../../../../../shared/hooks/useDebouncedValue";
import LinearArrowLeft1 from "../../../../../shared/icons/LinearArrowLeft1";
import LinearLocation from "../../../../../shared/icons/LinearLocation";
import { readStoredSelectedCity } from "../../../../../shared/lib/selectedCityStorage";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import { useNeighborhoodListQuery } from "../../../../locations/api/neighborhood.hooks";
import type { NeighborhoodDto } from "../../../../locations/api/neighborhood.service";
import {
  neighborhoodSearchDebounceMs,
  toSelectedNeighborhood,
} from "../filterHelpers";
import type { NeighborhoodPickerRowProps } from "../types";
import { NeighborhoodPickerBottomSheet } from "./NeighborhoodPickerBottomSheet";

export function NeighborhoodPickerRow({
  onChange,
  selectedNeighborhoods,
}: NeighborhoodPickerRowProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), neighborhoodSearchDebounceMs);
  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isPickerOpen && Boolean(cityId),
    page: 1,
    perPage: 100,
    q: debouncedQuery,
  });
  const neighborhoods = neighborhoodsQuery.data ?? [];
  const selectedIds = useMemo(
    () => new Set(selectedNeighborhoods.map((neighborhood) => neighborhood.id)),
    [selectedNeighborhoods],
  );
  const selectionLabel = selectedNeighborhoods.length
    ? `${selectedNeighborhoods.length} انتخاب`
    : "انتخاب";

  const toggleNeighborhood = (neighborhood: NeighborhoodDto) => {
    const selectedNeighborhood = toSelectedNeighborhood(neighborhood);

    onChange(
      selectedIds.has(selectedNeighborhood.id)
        ? selectedNeighborhoods.filter((item) => item.id !== selectedNeighborhood.id)
        : [...selectedNeighborhoods, selectedNeighborhood],
    );
  };

  const removeNeighborhood = (id: string) => {
    onChange(selectedNeighborhoods.filter((item) => item.id !== id));
  };

  return (
    <section className="bg-surface-container-lowest mt-2 p-4" aria-label="محله">
      <Button
        unstyled
        className="flex w-full items-center justify-between gap-4 text-right [direction:ltr]"
        onClick={() => setIsPickerOpen(true)}
        type="button"
      >
        <Typography
          as="span"
          variant="label"
          size="medium"
          weight="medium"
          className="text-primary flex items-center gap-1 text-sm font-medium"
        >
          <LinearArrowLeft1 className="h-5 w-5" />
          <Typography as="span" variant="label" size="medium" weight="medium">
            {selectionLabel}
          </Typography>
        </Typography>
        <Typography
          as="span"
          variant="label"
          size="large"
          weight="medium"
          className="text-on-surface flex items-center gap-2 text-base font-medium"
        >
          <Typography as="span" variant="label" size="large" weight="medium">
            محله
          </Typography>
          <LinearLocation className="text-on-surface-var h-6 w-6 shrink-0" />
        </Typography>
      </Button>

      {selectedNeighborhoods.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2" dir="rtl">
          {selectedNeighborhoods.map((neighborhood) => (
            <FormChoiceChip
              key={neighborhood.id}
              label={neighborhood.name}
              onClick={() => removeNeighborhood(neighborhood.id)}
              removable
              selected
            />
          ))}
        </div>
      ) : null}

      <NeighborhoodPickerBottomSheet
        cityId={cityId}
        cityName={selectedCity?.name}
        isLoading={neighborhoodsQuery.isLoading}
        isOpen={isPickerOpen}
        neighborhoods={neighborhoods}
        onClose={() => setIsPickerOpen(false)}
        onRemove={removeNeighborhood}
        onToggle={toggleNeighborhood}
        query={query}
        selectedIds={selectedIds}
        selectedNeighborhoods={selectedNeighborhoods}
        setQuery={setQuery}
      />
    </section>
  );
}
