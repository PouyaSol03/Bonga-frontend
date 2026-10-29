import { BottomSheet } from "../../../shared/components/BottomSheet";
import { Button } from "../../../shared/ui/Button";
import LinearMoney from "../../../shared/icons/LinearMoney";
import { ageOptions, floorOptions, roomOptions } from "../../advertisements/create/data";
import { toPersianNumber as toPersianDigits } from "../../../shared/lib/numberUtils";
import { CategoryFilterSection } from "./quick-filter/CategoryFilterSection";
import { NeighborhoodFilterSection } from "./quick-filter/NeighborhoodFilterSection";
import { AreaFilterSection } from "./quick-filter/AreaFilterSection";
import { PriceFilterSection } from "./quick-filter/PriceFilterSection";
import { ChoiceFilterSection } from "./quick-filter/ChoiceFilterSection";
import { getSheetTitle } from "./quick-filter/quickFilterHelpers";
import { useSearchMapQuickFilterDraft } from "./quick-filter/useSearchMapQuickFilterDraft";
import type { SearchMapQuickFilterBottomSheetProps, SearchMapQuickFilterId } from "./quick-filter/types";

export type { SearchMapQuickFilterId, SearchMapQuickFilterBottomSheetProps };

export function SearchMapQuickFilterBottomSheet(props: SearchMapQuickFilterBottomSheetProps) {
  const { filterId, isOpen, onClose } = props;
  const draft = useSearchMapQuickFilterDraft(props);

  const choiceOptions =
    filterId === "rooms"
      ? roomOptions
      : filterId === "floor"
        ? floorOptions.filter((option) => !option.includes("بیشتر"))
        : filterId === "building_age"
          ? ageOptions
          : [];

  const isAreaSheet = filterId === "area";
  const isAreaValueListOpen = isAreaSheet && draft.activeAreaBound !== null;

  return (
    <BottomSheet
      ariaLabel={getSheetTitle(filterId)}
      className={`flex flex-col ${
        isAreaSheet
          ? "rounded-t-[24px] transition-[height] duration-300 ease-out motion-reduce:transition-none"
          : ""
      }`}
      contentClassName="flex min-h-0 flex-1 flex-col"
      handleClassName={isAreaSheet ? "h-1 w-[56px] rounded-full bg-outline-var" : undefined}
      heightClassName={
        isAreaSheet
          ? isAreaValueListOpen
            ? "h-[min(85svh,681px)]"
            : "h-[220px]"
          : filterId === "category"
            ? "h-[min(82svh,680px)]"
            : filterId === "neighborhood"
              ? "h-[min(76svh,640px)]"
              : undefined
      }
      isOpen={isOpen}
      onClose={onClose}
      panelPaddingClassName="pt-3"
      showBackButton={false}
      showHeader={!isAreaSheet}
      showHeaderDivider={!isAreaSheet}
      title={getSheetTitle(filterId)}
      titleIcon={
        filterId === "price" ? <LinearMoney aria-hidden="true" className="h-6 w-6" /> : undefined
      }
      variant="form"
    >
      <div
        className={
          isAreaSheet
            ? "min-h-0 flex-1 overflow-hidden px-4 pt-[14px]"
            : "min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4"
        }
      >
        {filterId === "category" ? (
          <CategoryFilterSection
            category={draft.category}
            onCategoryChange={draft.setCategory}
            onTransactionChange={(t) => {
              draft.setTransaction(t);
              draft.setCategory(undefined);
            }}
            transaction={draft.transaction}
          />
        ) : null}

        {filterId === "neighborhood" ? (
          <NeighborhoodFilterSection
            cityId={draft.cityId}
            isError={draft.neighborhoodsQuery.isError}
            isLoading={draft.neighborhoodsQuery.isLoading}
            neighborhoodQuery={draft.neighborhoodQuery}
            neighborhoods={draft.neighborhoods}
            onNeighborhoodQueryChange={draft.setNeighborhoodQuery}
            onRefetch={() => void draft.neighborhoodsQuery.refetch()}
            onRemoveNeighborhood={(id) =>
              draft.setSelectedNeighborhoodIds((curr) => curr.filter((item) => item !== id))
            }
            onToggleNeighborhood={(id) =>
              draft.setSelectedNeighborhoodIds((curr) =>
                curr.includes(id) ? curr.filter((item) => item !== id) : [...curr, id],
              )
            }
            selectedNeighborhoodIds={draft.selectedNeighborhoodIds}
          />
        ) : null}

        {filterId === "area" ? (
          <AreaFilterSection
            activeAreaBound={draft.activeAreaBound}
            areaMaximum={draft.areaMaximum}
            areaMinimum={draft.areaMinimum}
            customAreaBound={draft.customAreaBound}
            maximumAreaInputRef={draft.maximumAreaInputRef}
            minimumAreaInputRef={draft.minimumAreaInputRef}
            onActiveAreaBoundChange={draft.setActiveAreaBound}
            onAreaMaximumChange={draft.setAreaMaximum}
            onAreaMinimumChange={draft.setAreaMinimum}
            onCustomAreaBoundChange={draft.setCustomAreaBound}
          />
        ) : null}

        {filterId === "price" ? (
          <PriceFilterSection
            onPriceMaximumChange={draft.setPriceMaximum}
            onPriceMinimumChange={draft.setPriceMinimum}
            priceMaximum={draft.priceMaximum}
            priceMinimum={draft.priceMinimum}
          />
        ) : null}

        {filterId === "rooms" || filterId === "floor" || filterId === "building_age" ? (
          <ChoiceFilterSection
            choiceOptions={choiceOptions}
            filterId={filterId}
            onSelectChoices={draft.setSelectedChoices}
            selectedChoices={draft.selectedChoices}
          />
        ) : null}
      </div>

      <footer
        className={`bg-surface-container-lowest shrink-0 px-4 ${
          isAreaSheet ? "pt-0 pb-3" : "border-outline-var border-t py-3"
        }`}
      >
        <Button
          unstyled
          className="bg-primary text-on-primary flex h-10 w-full items-center justify-center rounded-[10px] text-sm font-medium transition-colors active:opacity-90"
          onClick={draft.applyCurrentFilter}
          type="button"
        >
          {draft.isCalculating ? (
            <span className="inline-flex items-center justify-center gap-1.5">
              <span>نمایش</span>
              <span className="inline-flex animate-pulse items-center font-bold tracking-widest">
                ...
              </span>
              <span>آگهی</span>
            </span>
          ) : (
            <span>
              نمایش {toPersianDigits(new Intl.NumberFormat("en-US").format(draft.dynamicCount))} آگهی
            </span>
          )}
        </Button>
      </footer>
    </BottomSheet>
  );
}
