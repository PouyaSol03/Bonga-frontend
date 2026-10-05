import { useEffect, useState } from "react";
import { BottomSheet } from "../../../../../shared/components/BottomSheet";
import { SelectionCheckIndicator } from "../../../../../shared/components/SelectionCheckIndicator";
import { SearchEmptyState } from "../../../../../shared/components/SearchEmptyState";
import { readStoredSelectedCity } from "../../../../../shared/lib/selectedCityStorage";
import LinearArrowLeft1 from "../../../../../shared/icons/LinearArrowLeft1";
import LinearSearch from "../../../../../shared/icons/LinearSearch";
import LinearCancelCircle from "../../../../../shared/icons/LinearCancelCircle";
import { Button } from "../../../../../shared/ui/Button";
import { Typography } from "../../../../../shared/ui/Typography";
import { useNeighborhoodListQuery } from "../../../../locations/api/neighborhood.hooks";
import {
  getNeighborhoodHierarchyDescription,
  type NeighborhoodDto,
} from "../../../../locations/api/neighborhood.service";

export function ConsultantAdsNeighborhoodSheet({
  isOpen,
  onClose,
  onToggle,
  selectedIds,
}: {
  isOpen: boolean;
  onClose: () => void;
  onToggle: (item: NeighborhoodDto) => void;
  selectedIds: Set<string>;
}) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 250);
    return () => clearTimeout(timer);
  }, [query]);

  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: isOpen && Boolean(cityId),
    page: 1,
    perPage: 100,
    q: debouncedQuery,
  });

  const neighborhoods = neighborhoodsQuery.data ?? [];

  return (
    <BottomSheet
      ariaLabel="انتخاب محله"
      contentClassName="flex min-h-0 flex-1 flex-col"
      heightClassName="max-h-[50svh]"
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="flex flex-col"
      showHandle={false}
      showHeader={false}
    >
      <div className="shrink-0 px-3 pb-2 pt-3">
        <div className="flex h-11 items-center gap-2 [direction:ltr]">
          <label
            className="flex min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-outline bg-surface-container-lowest px-3 focus-within:border-primary"
            dir="rtl"
          >
            <LinearSearch className="h-5 w-5 shrink-0 text-outline" />
            <input
              className="h-9 min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm font-normal text-on-surface outline-none placeholder:text-outline"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو محله"
              type="search"
              value={query}
            />
            {query ? (
              <Button
                unstyled
                aria-label="پاک کردن"
                className="grid h-6 w-6 shrink-0 place-items-center text-on-surface-var"
                onClick={() => setQuery("")}
                type="button"
              >
                <LinearCancelCircle className="h-5 w-5 text-outline" />
              </Button>
            ) : null}
          </label>
          <Button
            unstyled
            aria-label="بازگشت"
            className="grid h-10 w-10 shrink-0 place-items-center text-on-surface-var"
            onClick={onClose}
            type="button"
          >
            <LinearArrowLeft1 className="h-6 w-6 rotate-180" />
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-2" dir="rtl">
        {!cityId ? (
          <Typography variant="body" size="medium" weight="regular" className="py-3 text-center text-outline">
            برای انتخاب محله، ابتدا شهر را انتخاب کنید.
          </Typography>
        ) : neighborhoodsQuery.isLoading ? (
          <div className="space-y-2">
            <div className="h-12 rounded-[10px] bg-surface-container" />
            <div className="h-12 rounded-[10px] bg-surface-container" />
          </div>
        ) : neighborhoods.length > 0 ? (
          <div className="space-y-1">
            {neighborhoods.map((item) => {
              const id = String(item.id ?? item._id ?? item.name);
              const isSelected = selectedIds.has(id);
              return (
                <Button
                  unstyled
                  aria-pressed={isSelected}
                  className="flex min-h-[56px] w-full items-center justify-between gap-4 rounded-[10px] bg-surface-container-lowest py-2 pl-3 pr-2 text-right transition-colors active:bg-primary-container/20 [direction:ltr]"
                  key={id}
                  onClick={() => onToggle(item)}
                  type="button"
                >
                  <SelectionCheckIndicator checked={isSelected} />
                  <div className="min-w-0 flex-1 [direction:rtl]">
                    <Typography variant="label" size="medium" weight="medium" className="block truncate text-on-surface">
                      {item.name}
                    </Typography>
                    <Typography variant="body" size="small" weight="regular" className="mt-0.5 block truncate text-outline">
                      {getNeighborhoodHierarchyDescription(item) || selectedCity?.name || "شهر انتخاب‌شده"}
                    </Typography>
                  </div>
                </Button>
              );
            })}
          </div>
        ) : (
          <SearchEmptyState compact />
        )}
      </div>

      <footer className="shrink-0 bg-surface-container-lowest px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-6px_16px_rgba(26,26,26,0.06)]">
        <Button
          variant="primary"
          size="x-medium"
          radius="small"
          fullWidth
          onClick={onClose}
          type="button"
        >
          تایید
        </Button>
      </footer>
    </BottomSheet>
  );
}
