import { useState } from "react";
import { useNavigate } from "react-router";

import { PageFrame } from "../../shared/layout/PageFrame";
import { RadioIndicator } from "../../shared/components/RadioIndicator";
import { SearchEmptyState } from "../../shared/components/SearchEmptyState";
import { TopBar } from "../../shared/components/TopBar";
import { useNeighborhoodListQuery } from "../locations/api/neighborhood.hooks";
import { useDebouncedValue } from "../../shared/hooks/useDebouncedValue";
import { readStoredSelectedCity } from "../../shared/lib/selectedCityStorage";
import {
  getNeighborhoodDescription,
  type NeighborhoodDto,
} from "../locations/api/neighborhood.service";
import {
  readConsultantsSelectedNeighborhood,
  saveConsultantsSelectedNeighborhood,
} from "./consultantsNeighborhoodSelection";
import { SearchInputBar } from "../../shared/ui/SearchBar";
import { Typography } from "../../shared/ui/Typography";
import { Button } from "../../shared/ui/Button";

function getNeighborhoodId(neighborhood: NeighborhoodDto) {
  return String(neighborhood.id ?? neighborhood._id ?? "");
}

function NeighborhoodSearchField({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <SearchInputBar
      autoFocus
      compact
      containerClassName="border-outline"
      onClear={() => onChange("")}
      onValueChange={onChange}
      placeholder="جستجو محله"
      showSearchIcon={false}
      value={value}
    />
  );
}

function NeighborhoodListSkeleton() {
  return (
    <div className="px-4">
      {Array.from({ length: 7 }, (_, index) => (
        <div
          className="border-outline-var flex min-h-[88px] animate-pulse items-center justify-between gap-5 border-b py-3"
          key={index}
        >
          <div className="min-w-0 flex-1 space-y-3">
            <div className="bg-surface-container mr-auto h-5 w-28 rounded" />
            <div className="bg-surface-container mr-auto h-4 w-4/5 rounded" />
          </div>
          <div className="bg-surface-container h-5 w-5 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function ConsultantsNeighborhoodPage() {
  const navigate = useNavigate();
  const selectedCity = readStoredSelectedCity();
  const cityId = selectedCity?.id ?? "";
  const [search, setSearch] = useState("");
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodDto | null>(() =>
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
  const selectedId = selectedNeighborhood ? getNeighborhoodId(selectedNeighborhood) : "";

  const leaveNeighborhoodPage = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/consultants", { replace: true });
    }
  };

  const confirmSelection = () => {
    if (!selectedNeighborhood) return;

    saveConsultantsSelectedNeighborhood(selectedNeighborhood, cityId);
    leaveNeighborhoodPage();
  };

  return (
    <PageFrame
      className="bg-surface-container-lowest text-on-surface relative flex min-h-0 flex-col overflow-hidden [direction:rtl]"
      variant="flush"
    >
      <TopBar
        centerClassName="px-0"
        centerSlot={<NeighborhoodSearchField onChange={setSearch} value={search} />}
        className="bg-surface-container"
        contentClassName="pl-4 pr-2"
        onBack={leaveNeighborhoodPage}
        placement="inline"
      />

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto pb-3 [-webkit-overflow-scrolling:touch]">
        {!cityId ? (
          <div className="text-outline mx-auto flex min-h-[320px] w-full items-center justify-center px-8 text-center text-sm leading-7">
            ابتدا شهر خود را از صفحه خانه انتخاب کنید.
          </div>
        ) : neighborhoodsQuery.isLoading ? (
          <NeighborhoodListSkeleton />
        ) : neighborhoodsQuery.isError ? (
          <div className="text-error mx-auto flex min-h-[320px] w-full flex-col items-center justify-center px-8 text-center text-sm leading-7">
            دریافت محله‌ها با خطا مواجه شد.
            <Button
              unstyled
              className="text-primary mt-3 font-semibold"
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
          <div className="flex flex-col gap-2 px-8 py-4" dir="rtl">
            {neighborhoods.map((neighborhood) => {
              const neighborhoodId = getNeighborhoodId(neighborhood);
              const description = getNeighborhoodDescription(neighborhood);
              const checked = neighborhoodId === selectedId;

              return (
                <Button
                  unstyled
                  aria-pressed={checked}
                  className="flex w-full items-center justify-between gap-5 py-3.5 text-right [-webkit-tap-highlight-color:transparent]"
                  key={neighborhoodId}
                  onClick={() => setSelectedNeighborhood(neighborhood)}
                  type="button"
                >
                  <Typography
                    as="span"
                    variant="body"
                    size="medium"
                    weight="regular"
                    className="min-w-0 flex-1"
                  >
                    <strong className="text-on-surface block text-base font-normal">
                      {neighborhood.name}
                    </strong>
                    {description ? (
                      <Typography
                        as="span"
                        variant="body"
                        size="medium"
                        weight="regular"
                        className="text-outline mt-0.5 line-clamp-2 block text-sm leading-6 font-normal"
                      >
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

      <footer className="border-outline-var bg-surface-container-lowest shrink-0 border-t px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom,0px))]">
        <Button
          unstyled
          className="bg-primary text-on-primary disabled:bg-surface-container-high disabled:text-outline h-12 w-full rounded-xl text-base font-semibold active:opacity-80"
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
