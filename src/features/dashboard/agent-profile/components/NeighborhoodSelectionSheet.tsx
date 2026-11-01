import { useEffect, useMemo, useState } from "react";
import { BottomSheet } from "../../../../shared/components/BottomSheet";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import { FormChoiceChip } from "../../../../shared/form/FormControls";
import { useDebouncedValue } from "../../../../shared/hooks/useDebouncedValue";
import LinearArrowLeft2 from "../../../../shared/icons/LinearArrowLeft2";
import { Button } from "../../../../shared/ui/Button";
import { SearchInputBar } from "../../../../shared/ui/SearchBar";
import { Typography } from "../../../../shared/ui/Typography";
import { useNeighborhoodListQuery } from "../../../locations/api/neighborhood.hooks";
import type { NeighborhoodDto } from "../../../locations/api/neighborhood.service";
import { getNeighborhoodId, toSelectedNeighborhood } from "../agentProfileHelpers";
import { neighborhoodSearchDebounceMs, type SelectedNeighborhood } from "../types";
import { NeighborhoodListItem } from "./NeighborhoodListItem";

export function NeighborhoodSelectionSheet({
  cityId,
  cityName,
  isOpen,
  onChange,
  onClose,
  selectedNeighborhoods,
}: {
  cityId: string;
  cityName: string;
  isOpen: boolean;
  onChange: (neighborhoods: SelectedNeighborhood[]) => void;
  onClose: () => void;
  selectedNeighborhoods: SelectedNeighborhood[];
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), neighborhoodSearchDebounceMs);
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isOpen && Boolean(cityId),
    page: 1,
    perPage: 100,
    q: debouncedQuery,
  });
  const neighborhoods = neighborhoodsQuery.data ?? [];
  const selectedIds = useMemo(
    () => new Set(selectedNeighborhoods.map((item) => item.id)),
    [selectedNeighborhoods],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!isOpen) setQuery("");
  }, [isOpen]);

  const toggleNeighborhood = (neighborhood: NeighborhoodDto) => {
    const selectedNeighborhood = toSelectedNeighborhood(neighborhood);
    const isSelected = selectedIds.has(selectedNeighborhood.id);

    onChange(
      isSelected
        ? selectedNeighborhoods.filter((item) => item.id !== selectedNeighborhood.id)
        : [...selectedNeighborhoods, selectedNeighborhood],
    );
  };

  return (
    <BottomSheet
      ariaLabel="محدوده فعالیت"
      contentClassName="flex min-h-0 flex-1 flex-col"
      heightClassName="h-[min(100dvh,640px)]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="flex flex-col"
      showHandle={false}
      showHeader={false}
    >
      <div className="shrink-0 px-3 pt-3 pb-2">
        <div className="flex h-11 items-center gap-2 [direction:ltr]">
          <SearchInputBar
            containerClassName="flex-1 border-outline"
            debounceMs={300}
            onClear={() => setQuery("")}
            onDebouncedChange={setQuery}
            onValueChange={setQuery}
            placeholder="جستجوی محله"
            size="dense"
            value={query}
          />
          <Button
            unstyled
            aria-label="بازگشت"
            className="text-on-surface-var grid h-10 w-10 shrink-0 place-items-center"
            onClick={onClose}
            type="button"
          >
            <LinearArrowLeft2 className="h-6 w-6 rotate-180" />
          </Button>
        </div>

        <div className="mt-3 flex items-center justify-between px-1">
          <Typography
            as="h2"
            variant="title"
            size="medium"
            weight="semibold"
            className="text-on-surface m-0 text-base leading-6 font-semibold"
          >
            محدوده فعالیت
          </Typography>
          {selectedNeighborhoods.length > 0 ? (
            <Typography
              as="span"
              variant="label"
              size="medium"
              weight="medium"
              className="text-primary text-sm leading-5 font-medium"
            >
              {selectedNeighborhoods.length} انتخاب
            </Typography>
          ) : null}
        </div>

        {selectedNeighborhoods.length > 0 ? (
          <div className="-mx-3 mt-2 flex [scrollbar-width:none] gap-2 overflow-x-auto px-3 pb-1 [direction:rtl] [&::-webkit-scrollbar]:hidden">
            {selectedNeighborhoods.map((neighborhood) => (
              <FormChoiceChip
                key={neighborhood.id}
                label={neighborhood.name}
                onClick={() =>
                  onChange(selectedNeighborhoods.filter((item) => item.id !== neighborhood.id))
                }
                removable
                selected
              />
            ))}
          </div>
        ) : null}
      </div>

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
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div className="bg-surface-container-high h-12 rounded-[10px]" key={index} />
            ))}
          </div>
        ) : neighborhoods.length > 0 ? (
          <div className="space-y-1">
            {neighborhoods.map((neighborhood) => (
              <NeighborhoodListItem
                cityName={cityName}
                isSelected={selectedIds.has(getNeighborhoodId(neighborhood))}
                key={getNeighborhoodId(neighborhood)}
                neighborhood={neighborhood}
                onToggle={toggleNeighborhood}
              />
            ))}
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

      <footer className="border-outline-var bg-surface-container-lowest shrink-0 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
        <Button
          unstyled
          className="bg-primary text-on-primary flex h-10 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium"
          onClick={onClose}
          type="button"
        >
          تایید
        </Button>
      </footer>
    </BottomSheet>
  );
}
