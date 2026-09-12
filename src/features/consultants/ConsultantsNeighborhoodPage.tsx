import { useState } from "react";

import { PageFrame } from "../../shared/layout/PageFrame";
import { RadioIndicator } from "../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { TopBar } from "../../shared/components/TopBar";
import { useNeighborhoodListQuery } from "../locations/api/neighborhood.hooks";
import { useDebouncedValue } from "../../shared/hooks/useDebouncedValue";
import { readStoredSelectedCity } from "../../shared/lib/selectedCityStorage";
import { getStoredBackTarget, pushRoute } from "../../shared/navigation/navigation";
import { getNeighborhoodDescription, type NeighborhoodDto } from "../locations/api/neighborhood.service";
import {
  readConsultantsSelectedNeighborhood,
  saveConsultantsSelectedNeighborhood,
} from "./consultantsNeighborhoodSelection";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

function getNeighborhoodId(neighborhood: NeighborhoodDto) {
  return String(neighborhood.id ?? neighborhood._id ?? "");
}

function leaveNeighborhoodPage() {
  if (getStoredBackTarget()) {
    window.history.back();
    return;
  }

  pushRoute("/consultants", undefined, { rememberCurrent: false });
}

function NeighborhoodSearchField({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="flex py-2 w-full min-w-0 items-center rounded-xl border border-outline bg-surface-container-lowest px-4 focus-within:border-primary">
      <input
        autoFocus
        className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-base font-normal text-on-surface outline-none placeholder:font-normal! placeholder:text-outline"
        onChange={(event) => onChange(event.target.value)}
        placeholder="جستجو محله"
        type="search"
        value={value}
      />
    </label>
  );
}

function NeighborhoodListSkeleton() {
  return (
    <div className="px-4">
      {Array.from({ length: 7 }, (_, index) => (
        <div
          className="flex min-h-[88px] animate-pulse items-center justify-between gap-5 border-b border-outline-var py-3"
          key={index}
        >
          <div className="min-w-0 flex-1 space-y-3">
            <div className="mr-auto h-5 w-28 rounded bg-surface-container" />
            <div className="mr-auto h-4 w-4/5 rounded bg-surface-container" />
          </div>
          <div className="h-5 w-5 rounded-full bg-surface-container" />
        </div>
      ))}
    </div>
  );
}

export function ConsultantsNeighborhoodPage() {
  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";
  const [search, setSearch] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<NeighborhoodDto | null>(() =>
      readConsultantsSelectedNeighborhood(cityId),
    );
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const neighborhoodsQuery = useNeighborhoodListQuery({
    cityId,
    enabled: Boolean(cityId),
    page: 1,
    perPage: 100,
    q: debouncedSearch,
  });
  const neighborhoods = neighborhoodsQuery.data ?? [];
  const selectedId = selectedNeighborhood
    ? getNeighborhoodId(selectedNeighborhood)
    : "";
  const confirmSelection = () => {
    if (!selectedNeighborhood) return;

    saveConsultantsSelectedNeighborhood(selectedNeighborhood, cityId);
    leaveNeighborhoodPage();
  };

  return (
    <PageFrame
      className="relative flex min-h-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl]"
      variant="flush"
    >
      <TopBar
        centerClassName="px-0"
        centerSlot={
          <NeighborhoodSearchField onChange={setSearch} value={search} />
        }
        className="bg-surface-container"
        contentClassName="pl-4 pr-2"
        onBack={leaveNeighborhoodPage}
        placement="inline"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container-lowest pb-3 [-webkit-overflow-scrolling:touch]">
        {!cityId ? (
          <div className="mx-auto flex min-h-[320px] w-full items-center justify-center px-8 text-center text-sm leading-7 text-outline">
            ابتدا شهر خود را از صفحه خانه انتخاب کنید.
          </div>
        ) : neighborhoodsQuery.isLoading ? (
          <NeighborhoodListSkeleton />
        ) : neighborhoodsQuery.isError ? (
          <div className="mx-auto flex min-h-[320px] w-full flex-col items-center justify-center px-8 text-center text-sm leading-7 text-error">
            دریافت محله‌ها با خطا مواجه شد.
            <Button unstyled
              className="mt-3 font-semibold text-primary"
              onClick={() => void neighborhoodsQuery.refetch()}
              type="button"
            >
              تلاش دوباره
            </Button>
          </div>
        ) : neighborhoods.length === 0 ? (
          <SearchEmptyState
            className="min-h-[320px]"
            description="عبارت جستجوی محله را تغییر دهید و دوباره تلاش کنید."
          />
        ) : (
          <div className="py-4 px-8 flex flex-col gap-2" dir="rtl">
            {neighborhoods.map((neighborhood) => {
              const neighborhoodId = getNeighborhoodId(neighborhood);
              const description = getNeighborhoodDescription(neighborhood);
              const checked = neighborhoodId === selectedId;

              return (
                <Button unstyled
                  aria-pressed={checked}
                  className="flex w-full items-center justify-between gap-5 py-3.5 text-right active:bg-surface-container"
                  key={neighborhoodId}
                  onClick={() => setSelectedNeighborhood(neighborhood)}
                  type="button"
                >
                  <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1">
                    <strong className="block text-base font-normal text-on-surface">
                      {neighborhood.name}
                    </strong>
                    {description ? (
                      <Typography as="span" variant="body" size="medium" weight="regular" className="mt-0.5 block line-clamp-2 text-sm font-normal leading-6 text-outline">
                        {description}
                      </Typography>
                    ) : null}
                  </Typography>
                  <RadioIndicator checked={checked} />
                </Button>
              );
            })}
          </div>
        )}
      </main>

      <footer className="shrink-0 border-t border-outline-var bg-surface-container-lowest px-4 pb-[max(12px,env(safe-area-inset-bottom,0px))] pt-3">
        <Button unstyled
          className="h-12 w-full rounded-xl bg-primary text-base font-semibold text-on-primary active:opacity-80 disabled:bg-surface-container-high disabled:text-outline"
          disabled={!selectedNeighborhood}
          onClick={confirmSelection}
          type="button"
        >
          تایید
        </Button>
      </footer>
    </PageFrame>
  );
}
