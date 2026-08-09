import { useEffect, useMemo, useState } from "react";

import { getStoredBackTarget, replaceRoute } from "../../../app/router/navigation";
import { useNeighborhoodListQuery } from "../../../core/hooks/neighborhood.hooks";
import {
  getNeighborhoodHierarchyDescription,
  type NeighborhoodDto,
} from "../../../core/services/neighborhood.service";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import LinearArrowRight2 from "../../../shared/icons/LinearArrowRight2";
import LinearCancelSmall from "../../../shared/icons/LinearCancelSmall";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { ChoiceIndicator } from "../../../shared/ui/Choice";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import {
  readAgencyCreationDraft,
  writeAgencyCreationDraft,
} from "../agencyCreationDraft";
import { getNeighborhoodId } from "../businessCreationViews";

const AGENCY_CREATE_PATH = "/account/business/create/agency";
const SEARCH_DEBOUNCE_MS = 250;

function useDebouncedValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [delay, value]);

  return debouncedValue;
}

function returnToAgencyForm() {
  const storedBackTarget = getStoredBackTarget();

  if (
    storedBackTarget?.backTo === AGENCY_CREATE_PATH &&
    window.history.length > 1
  ) {
    window.history.back();
    return;
  }

  replaceRoute(AGENCY_CREATE_PATH, undefined, { rememberCurrent: false });
}

function NeighborhoodSkeleton() {
  return (
    <div className="px-9">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          className="flex min-h-[88px] items-center gap-5 py-3 [direction:ltr]"
          key={index}
        >
          <div className="h-[18px] w-[18px] shrink-0 animate-pulse rounded bg-[#eeeeee]" />
          <div className="min-w-0 flex-1 space-y-2 [direction:rtl]">
            <div className="mr-auto h-5 w-28 animate-pulse rounded bg-[#eeeeee]" />
            <div className="mr-auto h-4 w-4/5 animate-pulse rounded bg-[#f3f3f3]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AgencyNeighborhoodSelectionPage() {
  const initialDraft = useMemo(() => readAgencyCreationDraft(), []);
  const [query, setQuery] = useState("");
  const [pendingNeighborhoods, setPendingNeighborhoods] = useState<NeighborhoodDto[]>(
    initialDraft.selectedNeighborhoods,
  );
  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";
  const debouncedQuery = useDebouncedValue(query.trim(), SEARCH_DEBOUNCE_MS);
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: Boolean(cityId),
    page: 1,
    perPage: 100,
    q: debouncedQuery,
  });
  const neighborhoods = neighborhoodsQuery.data ?? [];
  const selectedIds = useMemo(
    () => new Set(pendingNeighborhoods.map(getNeighborhoodId)),
    [pendingNeighborhoods],
  );

  const toggleNeighborhood = (neighborhood: NeighborhoodDto) => {
    const neighborhoodId = getNeighborhoodId(neighborhood);

    setPendingNeighborhoods((current) => {
      if (current.some((item) => getNeighborhoodId(item) === neighborhoodId)) {
        return current.filter((item) => getNeighborhoodId(item) !== neighborhoodId);
      }

      return [...current, neighborhood];
    });
  };

  const removeNeighborhood = (neighborhoodId: string) => {
    setPendingNeighborhoods((current) =>
      current.filter((item) => getNeighborhoodId(item) !== neighborhoodId),
    );
  };

  const handleConfirm = () => {
    writeAgencyCreationDraft({
      agencyName: initialDraft.agencyName,
      selectedNeighborhoods: pendingNeighborhoods,
    });
    returnToAgencyForm();
  };

  return (
    <div
      className="relative flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-white text-[#1a1a1a]"
      dir="rtl"
    >
      <header className="shrink-0 bg-[#f0f0f0]">
        <div className="flex h-14 items-center gap-2 pl-4 pr-2 [direction:ltr]">
          <label className="flex h-12 min-w-0 flex-1 items-center rounded-xl border border-[#808080] bg-white px-4 focus-within:border-[#0048c4] focus-within:outline-3 focus-within:outline-offset-[-3px] focus-within:outline-[#0048c426]">
            <input
              className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-base font-normal leading-6 text-[#1a1a1a] outline-none placeholder:text-[#a6a6a6]"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجو محله"
              type="search"
              value={query}
            />
          </label>

          <Button
            unstyled
            aria-label="بازگشت"
            className="grid h-12 w-8 shrink-0 place-items-center text-[#4d4d4d] active:bg-[#1a1a1a0a]"
            onClick={returnToAgencyForm}
            type="button"
          >
            <LinearArrowRight2 aria-hidden="true" className="h-7 w-7" />
          </Button>
        </div>

        <div className="flex h-14 items-center overflow-hidden px-4">
          <div
            className="flex w-full items-center gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            dir="rtl"
          >
            {pendingNeighborhoods.map((neighborhood) => {
              const neighborhoodId = getNeighborhoodId(neighborhood);

              return (
                <Button
                  unstyled
                  className="inline-flex h-8 max-w-[152px] shrink-0 items-center gap-2 rounded-lg border border-[#0048c4] bg-[#f3f6ff] px-3 text-sm font-medium leading-5 text-[#0048c4] active:bg-[#e9effd]"
                  key={neighborhoodId}
                  onClick={() => removeNeighborhood(neighborhoodId)}
                  type="button"
                >
                  <Typography
                    as="span"
                    variant="label"
                    size="medium"
                    weight="medium"
                    className="min-w-0 truncate"
                  >
                    {neighborhood.name}
                  </Typography>
                  <LinearCancelSmall aria-hidden="true" className="h-4 w-4 shrink-0" />
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-20 [-webkit-overflow-scrolling:touch]">
        {!cityId ? (
          <div className="mx-auto flex min-h-[320px] w-full items-center justify-center px-8 text-center text-sm leading-7 text-[#808080]">
            ابتدا شهر خود را از صفحه خانه انتخاب کنید.
          </div>
        ) : neighborhoodsQuery.isLoading ? (
          <NeighborhoodSkeleton />
        ) : neighborhoodsQuery.isError ? (
          <div className="mx-auto flex min-h-[320px] w-full flex-col items-center justify-center px-8 text-center text-sm leading-7 text-[#a43232]">
            دریافت محله‌ها با خطا مواجه شد.
            <Button
              unstyled
              className="mt-3 font-semibold text-[#0048c4]"
              onClick={() => void neighborhoodsQuery.refetch()}
              type="button"
            >
              تلاش دوباره
            </Button>
          </div>
        ) : neighborhoods.length === 0 ? (
          query.trim() ? (
            <SearchEmptyState />
          ) : (
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="mx-auto m-0 w-full px-8 py-10 text-center text-sm leading-7 text-[#808080]"
            >
              محله‌ای برای این شهر ثبت نشده است.
            </Typography>
          )
        ) : (
          <div>
            {neighborhoods.map((neighborhood) => {
              const neighborhoodId = getNeighborhoodId(neighborhood);
              const isSelected = selectedIds.has(neighborhoodId);
              const description = getNeighborhoodHierarchyDescription(neighborhood);

              return (
                <Button
                  unstyled
                  aria-pressed={isSelected}
                  className="flex min-h-[88px] w-full items-center gap-5 px-9 py-3 text-right active:bg-[#fafafa] [direction:ltr]"
                  key={neighborhoodId}
                  onClick={() => toggleNeighborhood(neighborhood)}
                  type="button"
                >
                  <ChoiceIndicator checked={isSelected} className="h-[18px] w-[18px] rounded-[4px]" />

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
                      className="block truncate text-right text-base font-medium leading-6 text-[#1a1a1a]"
                    >
                      {neighborhood.name}
                    </Typography>
                    {description ? (
                      <Typography
                        as="span"
                        variant="body"
                        size="small"
                        weight="regular"
                        className="mt-1 block line-clamp-2 text-right text-sm font-normal leading-5 text-[#a6a6a6]"
                      >
                        {description}
                      </Typography>
                    ) : null}
                  </Typography>
                </Button>
              );
            })}
          </div>
        )}
      </main>

      <footer className="absolute inset-x-0 bottom-0 z-20 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-6px_16px_rgba(26,26,26,0.06)]">
        <Button
          unstyled
          className="flex h-10 w-full items-center justify-center rounded-lg bg-[#0048c4] text-sm font-medium leading-5 text-white active:bg-[#003fae]"
          onClick={handleConfirm}
          type="button"
        >
          تایید
        </Button>
      </footer>
    </div>
  );
}
