import { useState, useMemo } from "react";
import { BottomSheet } from "../../../../shared/components/BottomSheet";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { useDebouncedValue } from "../../../../shared/hooks/useDebouncedValue";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import { readStoredSelectedCity } from "../../../../shared/lib/selectedCityStorage";
import { useNeighborhoodListQuery } from "../../../locations/api/neighborhood.hooks";
import type { NeighborhoodDto } from "../../../locations/api/neighborhood.service";
import {
  getNeighborhoodId,
  toSelectedNeighborhood,
  neighborhoodSearchDebounceMs,
} from "./neighborhoodHelpers";
import { NeighborhoodListItem, NeighborhoodSkeleton } from "./NeighborhoodListItem";
import { NeighborhoodSheetHeader } from "./NeighborhoodSheetHeader";
import type { NeighborhoodSelectionSheetProps, SelectedNeighborhood } from "./types";

export function NeighborhoodSelectionSheet(props: NeighborhoodSelectionSheetProps) {
  const { isOpen, mode = "multiple", onClose } = props;
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), neighborhoodSearchDebounceMs);

  const selectedCity = readStoredSelectedCity();
  const cityId = props.cityId ?? selectedCity?.id ?? "";
  const cityName = props.cityName ?? selectedCity?.name;
  const title = props.title ?? (mode === "single" ? "انتخاب محله" : "محدوده فعالیت");

  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isOpen && Boolean(cityId),
    page: 1,
    perPage: 100,
    q: debouncedQuery,
  });
  const neighborhoods = neighborhoodsQuery.data ?? [];

  const selectedItems: SelectedNeighborhood[] =
    props.mode === "single"
      ? props.selectedNeighborhood
        ? [props.selectedNeighborhood]
        : []
      : props.selectedNeighborhoods;

  const selectedIds = useMemo(
    () => new Set(selectedItems.map((neighborhood) => neighborhood.id)),
    [selectedItems],
  );

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  const toggleNeighborhood = (neighborhood: NeighborhoodDto) => {
    const selectedNeighborhood = toSelectedNeighborhood(neighborhood);
    const isSelected = selectedIds.has(selectedNeighborhood.id);

    if (props.mode === "single") {
      props.onChange(isSelected ? null : selectedNeighborhood);
      handleClose();
      return;
    }

    const current = props.selectedNeighborhoods;
    props.onChange(
      isSelected
        ? current.filter((item) => item.id !== selectedNeighborhood.id)
        : [...current, selectedNeighborhood],
    );
  };

  const removeSelectedItem = (id: string) => {
    if (props.mode === "single") {
      props.onChange(null);
      return;
    }

    const current = props.selectedNeighborhoods;
    props.onChange(current.filter((item) => item.id !== id));
  };

  return (
    <BottomSheet
      ariaLabel={title}
      contentClassName="flex min-h-0 flex-1 flex-col"
      heightClassName="h-[min(100dvh,640px)]"
      isOpen={isOpen}
      onClose={handleClose}
      panelPaddingClassName="flex flex-col"
      showHandle={false}
      showHeader={false}
    >
      <NeighborhoodSheetHeader
        mode={mode}
        onClose={handleClose}
        onQueryChange={setQuery}
        onRemoveItem={removeSelectedItem}
        query={query}
        selectedItems={selectedItems}
        title={title}
      />

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-2 pb-3" dir="rtl">
        {!cityId ? (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-outline m-0 mx-auto w-full px-2 py-3 text-center text-sm leading-6 font-normal"
          >
            برای انتخاب محله، ابتدا شهر را انتخاب کنید.
          </Typography>
        ) : neighborhoodsQuery.isLoading ? (
          <NeighborhoodSkeleton />
        ) : neighborhoods.length > 0 ? (
          <div className="space-y-1">
            {neighborhoods.map((neighborhood) => {
              const neighborhoodId = getNeighborhoodId(neighborhood);
              return (
                <NeighborhoodListItem
                  cityName={cityName}
                  isSelected={selectedIds.has(neighborhoodId)}
                  key={neighborhoodId}
                  mode={mode}
                  neighborhood={neighborhood}
                  onToggle={toggleNeighborhood}
                />
              );
            })}
          </div>
        ) : query.trim() ? (
          <SearchEmptyState compact />
        ) : (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-outline m-0 mx-auto w-full px-2 py-3 text-center text-sm leading-6 font-normal"
          >
            محله‌ای برای این شهر ثبت نشده است.
          </Typography>
        )}
      </div>

      {mode === "multiple" ? (
        <footer className="border-outline-var bg-surface-container-lowest shrink-0 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
          <Button
            unstyled
            className="bg-primary text-on-primary flex h-10 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium"
            onClick={handleClose}
            type="button"
          >
            تایید
          </Button>
        </footer>
      ) : null}
    </BottomSheet>
  );
}
