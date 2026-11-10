import type { RefObject } from "react";
import { Button } from "../../../../shared/ui/Button";
import { Typography } from "../../../../shared/ui/Typography";
import { SearchEmptyState } from "../../../../shared/components/SearchEmptyState";
import LinearCancelCircle from "../../../../shared/icons/LinearCancelCircle";
import type { NeighborhoodDto } from "../../../locations/api/neighborhood.service";
import { getNeighborhoodSubNeighborhoodNames } from "../../../locations/api/neighborhood.service";
import { getNeighborhoodId } from "./newAdLocationStorage";
import { SearchIcon } from "./NewAdLocationIcons";

type LocationSearchDrawerProps = {
  canSearchNeighborhoods: boolean;
  isCrmSource: boolean;
  isLoading: boolean;
  isResolvingLocation: boolean;
  isSearchExpanded: boolean;
  locations: NeighborhoodDto[];
  onConfirm: () => void;
  onQueryChange: (q: string) => void;
  onSearchFocus: () => void;
  onSelectNeighborhood: (item: NeighborhoodDto) => void;
  query: string;
  searchInputRef: RefObject<HTMLInputElement | null>;
  selectedNeighborhood: NeighborhoodDto | null;
  submitDisabled: boolean;
};

export function LocationSearchDrawer({
  canSearchNeighborhoods,
  isCrmSource,
  isLoading,
  isSearchExpanded,
  locations,
  onConfirm,
  onQueryChange,
  onSearchFocus,
  onSelectNeighborhood,
  query,
  searchInputRef,
  selectedNeighborhood,
  submitDisabled,
}: LocationSearchDrawerProps) {
  return (
    <section
      className={
        isCrmSource
          ? "border-outline-var bg-surface-container-lowest absolute right-6 bottom-6 z-30 flex w-[420px] max-w-[calc(100%_-_48px)] flex-col rounded-xl border px-5 pt-4 pb-5 shadow-[0_18px_50px_rgba(26,26,26,0.2)]"
          : isSearchExpanded
            ? "bg-surface-container-lowest absolute inset-x-0 top-0 bottom-0 z-30 flex min-h-0 flex-col rounded-t-[24px] px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
            : "bg-surface-container-lowest absolute inset-x-0 bottom-0 z-30 flex flex-col rounded-t-[24px] px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom,0px))] shadow-[0_-12px_28px_rgba(26,26,26,0.14)]"
      }
    >
      <div className="bg-outline-var mx-auto mb-4 h-1 w-[42px] rounded-full" />

      <label
        className="border-outline-var bg-surface-container-lowest focus-within:border-primary flex h-12 items-center gap-3 rounded-[10px] border px-3 text-right"
        dir="rtl"
      >
        <input
          ref={searchInputRef}
          className="text-on-surface placeholder:text-outline min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-sm leading-5 font-normal outline-none"
          onFocus={onSearchFocus}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="جستجوی محله، خیابان..."
          type="search"
          value={query}
        />
        {query ? (
          <Button
            unstyled
            aria-label="پاک کردن"
            onClick={() => onQueryChange("")}
            type="button"
          >
            <LinearCancelCircle aria-hidden="true" className="text-on-surface-var h-6 w-6" />
          </Button>
        ) : (
          <SearchIcon />
        )}
      </label>

      {canSearchNeighborhoods ? (
        <div
          className={`${
            isSearchExpanded && !isCrmSource
              ? "min-h-0 flex-1"
              : isLoading || locations.length
                ? "max-h-40"
                : "max-h-[280px]"
          } overflow-y-auto pt-3`}
        >
          {isLoading ? (
            <div className="bg-surface-container h-12 rounded-[10px]" />
          ) : locations.length ? (
            <div className="space-y-1">
              {locations.map((item) => {
                const isSelected =
                  getNeighborhoodId(selectedNeighborhood) === getNeighborhoodId(item);

                return (
                  <Button
                    unstyled
                    className={`w-full rounded-[10px] px-3 py-2 text-right ${
                      isSelected ? "bg-primary-container" : "bg-surface-container-lowest"
                    }`}
                    key={`${getNeighborhoodId(item)}:${item.lat ?? ""}:${item.lng ?? ""}:${item.name}`}
                    onClick={() => onSelectNeighborhood(item)}
                    type="button"
                  >
                    <Typography
                      as="span"
                      variant="label"
                      size="medium"
                      weight="semibold"
                      className={`block text-sm leading-5 font-semibold ${
                        isSelected ? "text-primary" : "text-on-surface"
                      }`}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      as="span"
                      variant="body"
                      size="small"
                      weight="regular"
                      className="text-outline mt-1 block text-xs leading-5 font-normal"
                    >
                      {getNeighborhoodSubNeighborhoodNames(item).join("، ") || "\u00A0"}
                    </Typography>
                  </Button>
                );
              })}
            </div>
          ) : (
            <SearchEmptyState compact className="px-2" />
          )}
        </div>
      ) : null}

      <Button
        unstyled
        className={`${
          isSearchExpanded && !isCrmSource ? "mt-auto" : "mt-4"
        } bg-primary text-on-primary disabled:bg-surface-container-high disabled:text-outline h-12 w-full shrink-0 rounded-[10px] text-base leading-6 font-medium`}
        disabled={submitDisabled}
        onClick={onConfirm}
        type="button"
      >
        تایید موقعیت
      </Button>
    </section>
  );
}
