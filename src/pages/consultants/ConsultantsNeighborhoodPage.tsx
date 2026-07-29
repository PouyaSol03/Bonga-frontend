import { useState } from "react";

import { PageFrame } from "../../app/PageFrame";
import { RadioIndicator } from "../../components/RadioIndicator";
import { SearchEmptyState } from "../../components/SearchEmptyState";
import { TopBar } from "../../components/TopBar";
import { useNeighborhoodListQuery } from "../../hooks/neighborhood.hooks";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { readStoredSelectedCity } from "../../lib/selectedCityStorage";
import { getStoredBackTarget, pushRoute } from "../../routes/navigation";
import type { NeighborhoodDto } from "../../services/neighborhood.service";
import {
  readConsultantsSelectedNeighborhood,
  saveConsultantsSelectedNeighborhood,
} from "./consultantsNeighborhoodSelection";
import { Typography } from "../../components/ui/Typography";

function getNeighborhoodId(neighborhood: NeighborhoodDto) {
  return String(neighborhood.id ?? neighborhood._id ?? "");
}

function getChildName(value: unknown) {
  if (typeof value === "string") return value.trim();
  if (!value || typeof value !== "object") return "";

  const record = value as Record<string, unknown>;
  const name = record.name ?? record.title ?? record.label;

  return typeof name === "string" ? name.trim() : "";
}

function getNeighborhoodDescription(neighborhood: NeighborhoodDto) {
  const value = neighborhood.sub_neighbors;

  if (Array.isArray(value)) {
    return value.map(getChildName).filter(Boolean).join("، ");
  }

  if (typeof value === "string") {
    return value
      .split(/[،,|]/)
      .map((part) => part.trim())
      .filter(Boolean)
      .join("، ");
  }

  return "";
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
    <label className="flex py-2 w-full min-w-0 items-center rounded-xl border border-[#808080] bg-white px-4 focus:border-[#0048C4]">
      <input
        autoFocus
        className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-right text-base font-normal text-[#1a1a1a] outline-none placeholder:font-normal! placeholder:text-[#a6a6a6]"
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
          className="flex min-h-[88px] animate-pulse items-center justify-between gap-5 border-b border-[#f0f0f0] py-3"
          key={index}
        >
          <div className="min-w-0 flex-1 space-y-3">
            <div className="mr-auto h-5 w-28 rounded bg-[#f0f0f0]" />
            <div className="mr-auto h-4 w-4/5 rounded bg-[#f4f4f4]" />
          </div>
          <div className="h-5 w-5 rounded-full bg-[#eeeeee]" />
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
      className="relative flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar
        centerClassName="px-0"
        centerSlot={
          <NeighborhoodSearchField onChange={setSearch} value={search} />
        }
        className="bg-[#f0f0f0]"
        contentClassName="pl-4 pr-2"
        onBack={leaveNeighborhoodPage}
        placement="inline"
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white pb-3 [-webkit-overflow-scrolling:touch]">
        {!cityId ? (
          <div className="flex min-h-[320px] items-center justify-center px-8 text-center text-sm leading-7 text-[#808080]">
            ابتدا شهر خود را از صفحه خانه انتخاب کنید.
          </div>
        ) : neighborhoodsQuery.isLoading ? (
          <NeighborhoodListSkeleton />
        ) : neighborhoodsQuery.isError ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center px-8 text-center text-sm leading-7 text-[#a43232]">
            دریافت محله‌ها با خطا مواجه شد.
            <button
              className="mt-3 font-semibold text-[#0048c4]"
              onClick={() => void neighborhoodsQuery.refetch()}
              type="button"
            >
              تلاش دوباره
            </button>
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
                <button
                  aria-pressed={checked}
                  className="flex w-full items-center justify-between gap-5 py-3.5 text-right active:bg-[#fafafa]"
                  key={neighborhoodId}
                  onClick={() => setSelectedNeighborhood(neighborhood)}
                  type="button"
                >
                  <Typography as="span" variant="body" size="medium" weight="regular" className="min-w-0 flex-1">
                    <strong className="block text-base font-normal text-[#1a1a1a]">
                      {neighborhood.name}
                    </strong>
                    {description ? (
                      <Typography as="span" variant="body" size="medium" weight="regular" className="mt-0.5 block line-clamp-2 text-sm font-normal leading-6 text-[#a6a6a6]">
                        {description}
                      </Typography>
                    ) : null}
                  </Typography>
                  <RadioIndicator checked={checked} />
                </button>
              );
            })}
          </div>
        )}
      </main>

      <footer className="shrink-0 bg-white px-4 pb-[max(12px,env(safe-area-inset-bottom,0px))] pt-3">
        <button
          className="h-12 w-full rounded-xl bg-[#0048c4] text-base font-semibold text-white active:bg-[#003fae] disabled:bg-[#e3e3e3] disabled:text-[#b3b3b3]"
          disabled={!selectedNeighborhood}
          onClick={confirmSelection}
          type="button"
        >
          تایید
        </button>
      </footer>
    </PageFrame>
  );
}
