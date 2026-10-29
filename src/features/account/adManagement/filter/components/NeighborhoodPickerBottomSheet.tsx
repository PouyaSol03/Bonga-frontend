import { BottomSheet } from "../../../../../shared/components/BottomSheet";
import { FormChoiceChip } from "../../../../../shared/form/FormControls";
import { SearchEmptyState } from "../../../../../shared/components/SearchEmptyState";
import { SelectionCheckIndicator } from "../../../../../shared/components/SelectionCheckIndicator";
import LinearArrowLeft1 from "../../../../../shared/icons/LinearArrowLeft1";
import { Button } from "../../../../../shared/ui/Button";
import { SearchInputBar } from "../../../../../shared/ui/SearchBar";
import { Typography } from "../../../../../shared/ui/Typography";
import {
  getNeighborhoodHierarchyDescription,
  type NeighborhoodDto,
} from "../../../../locations/api/neighborhood.service";
import type { AdManagementSelectedNeighborhood } from "../../adManagementData";
import { getNeighborhoodId } from "../filterHelpers";
import { NeighborhoodSkeleton } from "./FilterIcons";

export function NeighborhoodPickerBottomSheet({
  cityId,
  cityName,
  isLoading,
  isOpen,
  neighborhoods,
  onClose,
  onRemove,
  onToggle,
  query,
  selectedIds,
  selectedNeighborhoods,
  setQuery,
}: {
  cityId: string;
  cityName?: string;
  isLoading: boolean;
  isOpen: boolean;
  neighborhoods: NeighborhoodDto[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onToggle: (neighborhood: NeighborhoodDto) => void;
  query: string;
  selectedIds: Set<string>;
  selectedNeighborhoods: AdManagementSelectedNeighborhood[];
  setQuery: (q: string) => void;
}) {
  return (
    <BottomSheet
      ariaLabel="انتخاب محله"
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
            placeholder="جستجو محله"
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
            <LinearArrowLeft1 className="h-6 w-6 rotate-180" />
          </Button>
        </div>

        {selectedNeighborhoods.length > 0 ? (
          <div className="-mx-3 mt-2 flex [scrollbar-width:none] gap-2 overflow-x-auto px-3 pb-1 [direction:rtl] [&::-webkit-scrollbar]:hidden">
            {selectedNeighborhoods.map((neighborhood) => (
              <FormChoiceChip
                key={neighborhood.id}
                label={neighborhood.name}
                onClick={() => onRemove(neighborhood.id)}
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
        ) : isLoading ? (
          <NeighborhoodSkeleton />
        ) : neighborhoods.length > 0 ? (
          <div className="space-y-1">
            {neighborhoods.map((neighborhood) => {
              const neighborhoodId = getNeighborhoodId(neighborhood);
              const isSelected = selectedIds.has(neighborhoodId);

              return (
                <Button
                  unstyled
                  aria-pressed={isSelected}
                  className="bg-surface-container-lowest active:bg-primary-container/20 flex min-h-[72px] w-full items-center justify-between gap-4 rounded-[10px] py-2 pr-0 pl-3 text-right transition-colors [direction:ltr]"
                  key={neighborhoodId}
                  onClick={() => onToggle(neighborhood)}
                  type="button"
                >
                  <SelectionCheckIndicator checked={isSelected} />
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="min-w-0 flex-1 [direction:rtl]"
                  >
                    <Typography
                      as="span"
                      variant="label"
                      size="medium"
                      weight="medium"
                      className="text-on-surface block truncate text-sm leading-5 font-medium"
                    >
                      {neighborhood.name}
                    </Typography>
                    <Typography
                      as="span"
                      variant="body"
                      size="small"
                      weight="regular"
                      className="text-outline mt-1 line-clamp-2 block text-xs leading-5 font-normal"
                    >
                      {getNeighborhoodHierarchyDescription(neighborhood) ||
                        cityName ||
                        "شهر انتخاب‌شده"}
                    </Typography>
                  </Typography>
                </Button>
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

      <footer className="bg-surface-container-lowest shrink-0 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] shadow-[0_-6px_16px_rgba(26,26,26,0.06)]">
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
