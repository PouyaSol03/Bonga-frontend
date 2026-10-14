import { useNavigate } from "react-router";
import { useEffect, useMemo, useState } from "react";

import { useNeighborhoodListQuery } from "../../locations/api/neighborhood.hooks";
import {
  getNeighborhoodHierarchyDescription,
  type NeighborhoodDto,
} from "../../locations/api/neighborhood.service";
import { SearchEmptyState } from "../../../shared/components/SearchEmptyState";
import { FormChoiceChip } from "../../../shared/form/FormControls";
import LinearArrowRight2 from "../../../shared/icons/LinearArrowRight2";
import { readStoredSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { Button } from "../../../shared/ui/Button";
import { ChoiceIndicator } from "../../../shared/ui/Choice";
import { SearchInputBar } from "../../../shared/ui/SearchBar";
import { Typography } from "../../../shared/ui/Typography";
import { useToast } from "../../../shared/hooks/useToast";
import { readAgencyCreationDraft, writeAgencyCreationDraft } from "../agencyCreationDraft";
import { getNeighborhoodId } from "../businessCreationShared";

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

function NeighborhoodSkeleton() {
  return (
    <div className="pt-2">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="flex min-h-[88px] items-center gap-5 px-9 py-2 [direction:ltr]" key={index}>
          <div className="bg-surface-container-high h-[18px] w-[18px] shrink-0 animate-pulse rounded-[4px]" />
          <div className="min-w-0 flex-1 space-y-2 [direction:rtl]">
            <div className="bg-surface-container-high mr-auto h-5 w-28 animate-pulse rounded" />
            <div className="bg-surface-container mr-auto h-4 w-4/5 animate-pulse rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AgencyNeighborhoodSelectionPage() {
  const navigate = useNavigate();

  const returnToAgencyForm = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
      return;
    }
    navigate(AGENCY_CREATE_PATH, { replace: true });
  };
  const { showToast } = useToast();
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
    if (pendingNeighborhoods.length === 0) {
      showToast("حداقل یک محله باید انتخاب شود.", "خطا", "error");
      return;
    }
    writeAgencyCreationDraft({
      agencyName: initialDraft.agencyName,
      selectedNeighborhoods: pendingNeighborhoods,
    });
    showToast(`${pendingNeighborhoods.length} محله ذخیره شد.`, "ثبت شد", "success");
    returnToAgencyForm();
  };

  return (
    <div
      className="bg-surface-container-lowest text-on-surface relative flex h-full min-h-0 flex-1 flex-col overflow-hidden"
      dir="rtl"
    >
      <header
        className={`${pendingNeighborhoods.length > 0 ? "h-28" : "h-14"} bg-surface-container shrink-0`}
      >
        <div className="flex h-14 items-end gap-2 pr-2 pl-4 [direction:ltr]">
          <SearchInputBar
            aria-label="جستجو محله"
            containerClassName="h-12 flex-1 border-outline px-4 [&_input::placeholder]:text-outline"
            onValueChange={setQuery}
            placeholder="جستجو محله"
            showSearchIcon={false}
            size="compact"
            value={query}
          />

          <Button
            unstyled
            aria-label="بازگشت"
            className="text-on-surface grid h-12 w-8 shrink-0 place-items-center [-webkit-tap-highlight-color:transparent]"
            onClick={returnToAgencyForm}
            type="button"
          >
            <LinearArrowRight2 aria-hidden="true" className="h-6 w-6" />
          </Button>
        </div>

        {pendingNeighborhoods.length > 0 ? (
          <div className="flex h-14 items-start overflow-hidden px-4 pt-3">
            <div
              className="flex w-full [scrollbar-width:none] items-center gap-2 overflow-x-auto overscroll-x-contain [&::-webkit-scrollbar]:hidden"
              dir="rtl"
            >
              {pendingNeighborhoods.map((neighborhood) => {
                const neighborhoodId = getNeighborhoodId(neighborhood);

                return (
                  <FormChoiceChip
                    key={neighborhoodId}
                    label={neighborhood.name}
                    onClick={() => removeNeighborhood(neighborhoodId)}
                    removable
                    selected
                  />
                );
              })}
            </div>
          </div>
        ) : null}
      </header>

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pt-2 pb-[68px] [-webkit-overflow-scrolling:touch]">
        {!cityId ? (
          <Typography
            as="p"
            variant="body"
            size="medium"
            weight="regular"
            className="text-outline mx-auto flex min-h-[320px] w-full items-center justify-center px-8 text-center"
          >
            ابتدا شهر خود را از صفحه خانه انتخاب کنید.
          </Typography>
        ) : neighborhoodsQuery.isLoading ? (
          <NeighborhoodSkeleton />
        ) : neighborhoodsQuery.isError ? (
          <div className="mx-auto flex min-h-[320px] w-full flex-col items-center justify-center px-8 text-center">
            <Typography
              as="p"
              variant="body"
              size="medium"
              weight="regular"
              className="text-error m-0"
            >
              دریافت محله‌ها با خطا مواجه شد.
            </Typography>
            <Button
              unstyled
              className="text-primary mt-3"
              onClick={() => void neighborhoodsQuery.refetch()}
              type="button"
            >
              <Typography as="span" variant="label" size="medium" weight="medium">
                تلاش دوباره
              </Typography>
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
              className="text-outline m-0 mx-auto w-full px-8 py-10 text-center"
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
                  className="active:bg-surface-container flex min-h-[88px] w-full items-center gap-5 px-9 py-2 text-right [-webkit-tap-highlight-color:transparent] [direction:ltr]"
                  key={neighborhoodId}
                  onClick={() => toggleNeighborhood(neighborhood)}
                  type="button"
                >
                  <ChoiceIndicator
                    checked={isSelected}
                    className="h-[18px] w-[18px] rounded-[4px]"
                  />

                  <span className="min-w-0 flex-1 [direction:rtl]">
                    <Typography
                      as="span"
                      variant="body"
                      size="large"
                      weight="regular"
                      className="text-on-surface block truncate text-right"
                    >
                      {neighborhood.name}
                    </Typography>
                    {description ? (
                      <Typography
                        as="span"
                        variant="body"
                        size="medium"
                        weight="regular"
                        className="text-outline mt-1 line-clamp-2 block text-right"
                      >
                        {description}
                      </Typography>
                    ) : null}
                  </span>
                </Button>
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-surface-container-lowest absolute inset-x-0 bottom-0 z-20 h-[68px] px-4 py-[14px] shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <Button fullWidth onClick={handleConfirm} size="x-medium" type="button" variant="primary">
          تایید
        </Button>
      </footer>
    </div>
  );
}
