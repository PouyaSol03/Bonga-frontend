import { type ReactNode, useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { type FilterState } from "./filters/filterTypes";
import { readInitialFiltersFromUrl } from "./filters/readInitialFilters";
import { type CategoryKey, type TransactionType } from "./filters/categories";
import { getFilterBlocks } from "./filters/filterBlocks";
import { groupFilterBlocks } from "./filters/blockGrouping";
import { useFilterCountLabel } from "./filters/useFilterCountLabel";
import { initialFilters } from "./filters/filterState";
import { useFilterValues } from "./filters/useFilterValues";
import { buildSearchUrl } from "./filters/buildSearchUrl";
import { CategorySelectionScreen } from "./filters/CategorySelectionScreen";
import { PageFrame } from "../../shared/layout/PageFrame";
import { FilterPageHeader } from "./filters/FilterPageHeader";
import { FilterBlockRenderer } from "./filters/FilterBlockRenderer";
import { Button } from "../../shared/ui/Button";

export {
  categoryGroupsByTransaction,
  categoryLabels,
  getAdvertiseFormCode,
  getListingFromFormCode,
  transactionTabs,
  type CategoryKey,
  type TransactionType,
} from "./filters/categories";

type AdvertisementFilterPageProps = {
  applyBasePath?: string;
  applyButtonLabel?: ReactNode;
  backBasePath?: string;
  title?: string;
};

export function SearchMapFilterPage() {
  return <AdvertisementFilterPage />;
}

function AdvertisementFilterPage({
  applyBasePath = "/search",
  applyButtonLabel: customApplyButtonLabel,
  backBasePath = "/search",
  title = "فیلترها",
}: AdvertisementFilterPageProps) {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterState>(readInitialFiltersFromUrl);
  const [categoryPickerInitial, setCategoryPickerInitial] = useState<CategoryKey | undefined>(
    filters.category,
  );
  const focusTarget = useMemo(() => new URLSearchParams(window.location.search).get("focus"), []);
  const contentRef = useRef<HTMLElement | null>(null);

  const filterBlocks = useMemo(() => {
    const rawBlocks = getFilterBlocks(filters.transaction, filters.category);
    return groupFilterBlocks(rawBlocks);
  }, [filters.transaction, filters.category]);

  const resolvedApplyButtonLabel = useFilterCountLabel(
    filters,
    applyBasePath,
    customApplyButtonLabel,
  );

  useEffect(() => {
    if (!filters.category || !contentRef.current) return;

    const target = new URLSearchParams(window.location.search).get("focus");
    if (!target) return;

    const timer = window.setTimeout(() => {
      const container = contentRef.current;
      const targetSection = container?.querySelector<HTMLElement>(
        `[data-filter-section="${target}"]`,
      );

      if (!container || !targetSection) return;

      container.scrollTo({
        behavior: "smooth",
        top: Math.max(targetSection.offsetTop - 8, 0),
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [filterBlocks, filters.category]);

  const changeCategory = (transaction: TransactionType, category: CategoryKey) => {
    setCategoryPickerInitial(category);
    setFilters({
      ...initialFilters,
      transaction,
      category,
    });
  };

  const openCategoryPicker = () => {
    setCategoryPickerInitial(filters.category);
    setFilters((current) => ({
      ...current,
      category: undefined,
    }));
  };

  const { setRangeValue, setSingleValue, toggleMultiValue, setToggleValue } =
    useFilterValues(setFilters);

  const applyFilters = () => {
    navigate(buildSearchUrl(filters, applyBasePath), {
      replace: true,
      state: window.history.state ?? {},
    });
  };

  if (!filters.category) {
    return (
      <CategorySelectionScreen
        backBasePath={backBasePath}
        initialCategory={categoryPickerInitial}
        initialTransaction={filters.transaction}
        onConfirm={changeCategory}
      />
    );
  }

  return (
    <PageFrame
      className="bg-surface-container text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <FilterPageHeader
        backBasePath={backBasePath}
        title={title}
        transaction={filters.transaction}
        category={filters.category}
        openCategoryPicker={openCategoryPicker}
      />

      <main
        ref={contentRef}
        className="bg-surface-container min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-0"
      >
        {filterBlocks.map((block, index) => (
          <FilterBlockRenderer
            key={"id" in block ? `${block.kind}-${block.id}` : block.kind}
            applyButtonLabel={resolvedApplyButtonLabel}
            block={block}
            filters={filters}
            nextBlock={filterBlocks[index + 1]}
            onApply={applyFilters}
            previousBlock={filterBlocks[index - 1]}
            setFilters={setFilters}
            setRangeValue={setRangeValue}
            setSingleValue={setSingleValue}
            setToggleValue={setToggleValue}
            toggleMultiValue={toggleMultiValue}
            focusTarget={focusTarget}
          />
        ))}
      </main>

      <footer className="bg-surface-container-lowest shrink-0 px-4 py-3 shadow-[0_-4px_10px_rgba(26,26,26,0.04)]">
        <div dir="rtl">
          <Button
            unstyled
            className="bg-primary text-on-primary flex h-10 w-full items-center justify-center rounded-lg text-sm leading-5 font-medium no-underline transition-colors active:opacity-90"
            onClick={applyFilters}
            type="button"
          >
            {resolvedApplyButtonLabel}
          </Button>
        </div>
      </footer>
    </PageFrame>
  );
}
