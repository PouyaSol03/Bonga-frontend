import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { TopBar } from "../../../shared/components/TopBar";
import SearchErrors from "./SearchErrors";
import { useCitySearchQuery } from "../../cities/api/city.hooks";
import type { CityDto } from "../../cities/api/city.service";
import { getRequestErrorState } from "../../../shared/components/ErrorState";
import { readStoredSelectedCity, saveSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

export type CitySelectionScreenProps = {
  currentCity: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (city: { id?: string; latitude?: number; longitude?: number; name: string }) => void;
  openSearchOnOpen?: boolean;
};

type UiCityOption = {
  id: string;
  latitude?: number;
  longitude?: number;
  name: string;
  count: string;
};

function mapCityDtoToOption(city: CityDto): UiCityOption {
  return {
    id: String(city.id ?? city._id ?? ""),
    latitude: city.lat,
    longitude: city.lng,
    name: city.name,
    count: "0",
  };
}

function getStoredCityId() {
  return readStoredSelectedCity()?.id ?? "";
}

export function CitySelectionScreen({
  currentCity,
  isOpen,
  onClose,
  onConfirm,
  openSearchOnOpen = false,
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
    if (!isOpen) return;

    setSelectedCityId(getStoredCityId());

    if (openSearchOnOpen) {
      setIsSearching(true);
      setQuery("");
    }
  }, [isOpen, openSearchOnOpen]);

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
      saveSelectedCity({
        id: selectedCity.id,
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
        name: selectedCity.name,
      });
      onConfirm({
        id: selectedCity.id,
        latitude: selectedCity.latitude,
        longitude: selectedCity.longitude,
        name: selectedCity.name,
      });
    } else {
      onConfirm({ name: currentCity });
    }

    setIsSearching(false);
    setQuery("");
  };

  if (isError) {
    return (
      <section
        className={"absolute inset-0 z-40 overflow-hidden bg-surface-container-lowest " + (isOpen ? "visible" : "invisible")}
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
      className={"absolute inset-0 z-40 flex min-h-0 flex-col overflow-hidden bg-surface-container-lowest text-on-surface [direction:rtl] transition-all duration-200 " + (isOpen ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-3 opacity-0")}
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

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-surface-container-lowest">
        {isSearching ? (
          isLoading ? (
            <div className="flex flex-col gap-4 px-4 py-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  className="h-12 w-full rounded-xl bg-surface-container"
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
            <div className="h-full bg-surface-container-lowest" />
          )
        ) : (
          <div className="flex flex-col gap-2 px-4 pt-4">
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  className="h-14 w-full rounded-xl bg-surface-container"
                  key={index}
                />
              ))}

            {!isLoading &&
              isError && (
                <Typography as="p" variant="body" size="small" weight="medium" className="px-2 py-3 text-right text-xs font-medium text-error">
                  دریافت شهرها با خطا مواجه شد.
                </Typography>
              )}

            {!isLoading &&
              cityList.map((city) => (
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

      <footer className="shrink-0 border-t border-outline-var bg-surface-container-lowest px-4 py-3 shadow-[0_-12px_24px_rgba(26,26,26,0.06)] min-[390px]:py-3.5">
        <Button
          unstyled
          className="h-10 w-full rounded-[10px] bg-primary text-sm font-medium leading-5 text-on-primary active:opacity-80 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary/40"
          type="button"
          tabIndex={isOpen ? 0 : -1}
          onClick={confirmCity}
        >
          تایید
        </Button>
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
      className="home-search-input h-12 w-full appearance-none border-0 bg-transparent px-2 text-right text-base font-semibold leading-6 text-on-surface caret-primary outline-none placeholder:text-outline"
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
    <Button
      unstyled
      aria-pressed={isSelected}
      className="flex h-14 w-full shrink-0 cursor-pointer items-center justify-between rounded-xl bg-surface-container-lowest pb-2 pl-5 pr-4 pt-2 text-right [direction:ltr] hover:bg-surface-container/50"
      type="button"
      onClick={onSelect}
    >
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={"home-city-radio " + (isSelected ? "home-city-radio--selected" : "")}
        aria-hidden="true"
      />

      <Typography as="span" variant="body" size="large" weight="regular" className="text-base font-normal leading-6 text-on-surface [direction:rtl]">
        {city.name}
      </Typography>
    </Button>
  );
}
