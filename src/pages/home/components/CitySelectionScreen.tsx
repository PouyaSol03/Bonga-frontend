import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { TopBar } from "../../../components/TopBar";
import SearchErrors from "./SearchErrors";
import { useCitySearchQuery } from "../../../hooks/city.hooks";
import type { CityDto } from "../../../services/city.service";
import { getRequestErrorState } from "../../../components/ErrorState";

type CitySelectionScreenProps = {
  currentCity: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (city: { id?: string; name: string }) => void;
};

type UiCityOption = {
  id: string;
  name: string;
  count: string;
};

function mapCityDtoToOption(city: CityDto): UiCityOption {
  return {
    id: String(city.id ?? city._id ?? ""),
    name: city.name,
    count: "0",
  };
}

function getStoredCityId() {
  return window.localStorage.getItem("bonga-selected-city-id") ?? "";
}

export function CitySelectionScreen({
  currentCity,
  isOpen,
  onClose,
  onConfirm,
}: CitySelectionScreenProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedCityId, setSelectedCityId] = useState(getStoredCityId);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  const { data: apiCities = [], error, isError, isLoading, refetch } = useCitySearchQuery({
    enabled: isOpen,
    q: isSearching ? query.trim() : "",
  });
  const CityErrorState = getRequestErrorState(error);
  const cityList = useMemo<UiCityOption[]>(() => {
    if (isError) {
      return [];
    }

    return apiCities
      .map(mapCityDtoToOption)
      .filter((city) => city.id && city.name);
  }, [apiCities, isError]);

  const normalizedQuery = query.trim();

  const visibleSearchResults = cityList;

  useEffect(() => {
    if (!isOpen || !isSearching) {
      return;
    }

    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [isOpen, isSearching]);

  const selectCity = (city: UiCityOption) => {
    setSelectedCityId(city.id ?? "");
  };

  const closeCityScreen = () => {
    setSelectedCityId(getStoredCityId());
    setIsSearching(false);
    setQuery("");
    onClose();
  };

  const confirmCity = () => {
    const selectedCity = cityList.find((city) => city.id === selectedCityId);

    if (selectedCity) {
      window.localStorage.setItem("bonga-selected-city-id", selectedCity.id ?? "");
      window.localStorage.setItem("bonga-selected-city", selectedCity.name);
      onConfirm({ id: selectedCity.id, name: selectedCity.name });
    } else {
      onConfirm({ name: currentCity });
    }

    setIsSearching(false);
    setQuery("");
  };

  if (isError) {
    return (
      <section
        className={`absolute inset-0 z-40 overflow-hidden bg-white ${isOpen ? "visible" : "invisible"}`}
        aria-hidden={!isOpen}
      >
        <CityErrorState
          className="h-full"
          onRetry={() => void refetch()}
        />
      </section>
    );
  }

  return (
    <section
      className={`absolute inset-0 z-40 flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl] ${isOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"
        }`}
      aria-hidden={!isOpen}
    >
      <TopBar
        actions={
          isSearching
            ? []
            : [
              {
                icon: <CitySearchIcon />,
                id: "city-search",
                label: "جستجوی شهر",
                onClick: () => setIsSearching(true),
              },
            ]
        }
        centerSlot={
          isSearching ? (
            <CitySearchField
              inputRef={searchInputRef}
              isOpen={isOpen}
              query={query}
              onQueryChange={setQuery}
            />
          ) : undefined
        }
        onBack={closeCityScreen}
        reserveStartSpace={isSearching}
        title={isSearching ? undefined : "انتخاب شهر"}
      />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white">
        {isSearching ? (
          isLoading ? (
            <div className="flex flex-col gap-4 px-4 py-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  className="h-12 w-full rounded-xl bg-[#f0f0f0]"
                  key={index}
                />
              ))}
            </div>
          ) : visibleSearchResults.length > 0 ? (
            <div className="flex flex-col gap-2 px-4 pt-4">
              {visibleSearchResults.map((city) => (
                <CityOptionRow
                  city={city}
                  isSelected={selectedCityId === city.id}
                  key={city.id ?? city.name}
                  onSelect={() => selectCity(city)}
                />
              ))}
            </div>
          ) : normalizedQuery.length > 0 ? (
            <SearchErrors variant="not-found" />
          ) : (
            <div className="h-full bg-white" />
          )
        ) : (
          <div className="flex flex-col gap-2 px-4 pt-4">
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="h-14 w-full rounded-xl bg-[#f0f0f0]"
                  key={index}
                />
              ))}

            {!isLoading &&
              isError && (
                <p className="px-2 py-3 text-right text-xs font-medium text-red-600">
                  دریافت شهرها با خطا مواجه شد.
                </p>
              )}

            {!isLoading && cityList.map((city) => (
              <CityOptionRow
                city={city}
                isSelected={selectedCityId === city.id}
                key={city.id ?? city.name}
                onSelect={() => selectCity(city)}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="shrink-0 bg-white px-4 py-3 shadow-[0_-12px_24px_rgba(26,26,26,0.06)] min-[390px]:py-3.5">
        <button
          className="h-10 w-full rounded-[10px] bg-[#0048c4] text-sm font-medium leading-5 text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440]"
          type="button"
          tabIndex={isOpen ? 0 : -1}
          onClick={confirmCity}
        >
          تایید
        </button>
      </footer>
    </section>
  );
}

function CitySearchField({
  inputRef,
  isOpen,
  query,
  onQueryChange,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  isOpen: boolean;
  query: string;
  onQueryChange: (query: string) => void;
}) {
  return (
    <input
      ref={inputRef}
      aria-label="جستجوی شهر"
      className="home-search-input h-12 w-full appearance-none border-0 bg-transparent px-2 text-right text-base font-semibold leading-6 text-[#1a1a1a] caret-[#0048c4] outline-none"
      type="search"
      value={query}
      tabIndex={isOpen ? 0 : -1}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}

function CitySearchIcon() {
  return (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" viewBox="0 0 24 24">
      <path
        d="M10.75 18.5a7.75 7.75 0 1 0 0-15.5 7.75 7.75 0 0 0 0 15.5ZM16.5 16.5 21 21"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function CityOptionRow({
  city,
  isSelected,
  onSelect,
}: {
  city: UiCityOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={`flex h-14 w-full shrink-0 cursor-pointer items-center justify-between rounded-xl pb-2 pl-5 pr-4 pt-2 text-right [direction:ltr] ${isSelected ? "h-[58px] bg-[#e6ebf6]" : "bg-white"
        }`}
      type="button"
      onClick={onSelect}
    >
      <span
        className={`home-city-radio ${isSelected ? "home-city-radio--selected" : ""}`}
        aria-hidden="true"
      />

      <span className="text-base font-normal leading-6 text-[#1a1a1a] [direction:rtl]">
        {city.name}
      </span>
    </button>
  );
}
