import { type ReactNode } from "react";
import { type SelectedNeighborhood } from "./filterTypes";
import { useNeighborhoodListQuery } from "../../locations/api/neighborhood.hooks";
import { type NeighborhoodDto } from "../../locations/api/neighborhood.service";
import { PageFrame } from "../../../shared/layout/PageFrame";
import { TopBar } from "../../../shared/components/TopBar";
import { FormChoiceChip } from "../../../shared/form/FormControls";
import { NeighborhoodResults } from "./NeighborhoodResults";
import { Button } from "../../../shared/ui/Button";

export function NeighborhoodPicker({
  applyButtonLabel,
  onApply,
  onClose,
  query,
  setQuery,
  selectedNeighborhoods,
  removeNeighborhood,
  cityId,
  neighborhoodsQuery,
  neighborhoods,
  selectedIds,
  toggleNeighborhood,
}: {
  applyButtonLabel: ReactNode;
  onApply: () => void;
  onClose: () => void;
  query: string;
  setQuery: (value: string) => void;
  selectedNeighborhoods: SelectedNeighborhood[];
  removeNeighborhood: (id: string) => void;
  cityId: string;
  neighborhoodsQuery: ReturnType<typeof useNeighborhoodListQuery>;
  neighborhoods: NeighborhoodDto[];
  selectedIds: Set<string>;
  toggleNeighborhood: (neighborhood: NeighborhoodDto) => void;
}) {
  return (
    <div className="bg-surface-container fixed inset-0 z-[1100] flex justify-center">
      <PageFrame
        className="bg-surface-container text-on-surface relative flex min-h-0 max-w-[500px] flex-col overflow-hidden [direction:rtl]"
        variant="flush"
      >
        <div className="bg-surface-container shrink-0">
          <TopBar
            centerClassName="px-0"
            centerSlot={
              <label
                className="border-outline bg-surface-container-lowest focus-within:border-primary flex h-12 w-full min-w-0 items-center rounded-xl border px-4"
                dir="rtl"
              >
                <input
                  autoFocus
                  className="text-on-surface placeholder:text-outline h-full min-w-0 flex-1 appearance-none border-0 bg-transparent p-0 text-right text-base leading-6 font-normal outline-none [&::-webkit-search-cancel-button]:hidden"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="جستجو محله"
                  type="search"
                  value={query}
                />
              </label>
            }
            className="bg-surface-container"
            contentClassName="pl-4 pr-2"
            onBack={onClose}
            placement="inline"
          />

          {selectedNeighborhoods.length > 0 ? (
            <div
              className="bg-surface-container flex min-h-12 shrink-0 [scrollbar-width:none] items-center justify-start gap-2 overflow-x-auto px-4 pb-2 [&::-webkit-scrollbar]:hidden"
              dir="rtl"
            >
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
        </div>

        <main
          className="bg-surface-container-lowest min-h-0 flex-1 overflow-y-auto overscroll-contain px-4"
          dir="rtl"
        >
          <NeighborhoodResults
            cityId={cityId}
            isLoading={neighborhoodsQuery.isLoading}
            isError={neighborhoodsQuery.isError}
            onRetry={() => void neighborhoodsQuery.refetch()}
            neighborhoods={neighborhoods}
            selectedIds={selectedIds}
            toggleNeighborhood={toggleNeighborhood}
            query={query}
          />
        </main>

        <footer className="bg-surface-container-lowest shrink-0 px-4 py-3 shadow-[0_-4px_10px_rgba(26,26,26,0.04)]">
          <Button
            unstyled
            className="bg-primary text-on-primary flex h-10 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium no-underline"
            onClick={onApply}
            type="button"
          >
            {applyButtonLabel}
          </Button>
        </footer>
      </PageFrame>
    </div>
  );
}
