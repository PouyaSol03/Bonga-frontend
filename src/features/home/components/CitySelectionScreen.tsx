import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue";
import { TopBar } from "../../../shared/components/TopBar";
import SearchErrors from "./SearchErrors";
import { useCitySearchQuery } from "../../cities/api/city.hooks";
import type { CityDto } from "../../cities/api/city.service";
import { RequestErrorState } from "../../../shared/components/ErrorState";
import { readStoredSelectedCity, saveSelectedCity } from "../../../shared/lib/selectedCityStorage";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";

type CitySelectionScreenProps = {
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
  const debouncedQuery = useDebouncedValue(query.trim(), 300);

  const {
    data: apiCities = [],
    error,
    isError,
    isLoading,
    refetch,
  } = useCitySearchQuery({
    enabled: isOpen,
    q: isSearching ? debouncedQuery : "",
  });
  const cityList = useMemo<UiCityOption[]>(() => {
    if (isError) {
      return [];
    }

    return apiCities.map(mapCityDtoToOption).filter((city) => city.id && city.name);
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
        className={
          "bg-surface-container-lowest absolute inset-0 z-40 overflow-hidden " +
          (isOpen ? "visible" : "invisible")
        }
        aria-hidden={!isOpen}
      >
        <RequestErrorState error={error} className="h-full" onRetry={() => void refetch()} />
      </section>
    );
  }

  return (
    <section
      className={
        "bg-surface-container-lowest text-on-surface absolute inset-0 z-40 flex min-h-0 flex-col overflow-hidden transition-all duration-200 [direction:rtl] " +
        (isOpen
          ? "visible translate-y-0 opacity-100"
          : "pointer-events-none invisible translate-y-3 opacity-0")
      }
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

      <main className="bg-surface-container-lowest min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        {isSearching ? (
          isLoading ? (
            <div className="flex flex-col gap-4 px-4 py-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div className="bg-surface-container h-12 w-full rounded-xl" key={index} />
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
            <div className="bg-surface-container-lowest h-full" />
          )
        ) : (
          <div className="flex flex-col gap-2 px-4 pt-4">
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div className="bg-surface-container h-14 w-full rounded-xl" key={index} />
              ))}

            {!isLoading && isError && (
              <Typography
                as="p"
                variant="body"
                size="small"
                weight="medium"
                className="text-error px-2 py-3 text-right text-xs font-medium"
              >
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

      <footer className="border-outline-var bg-surface-container-lowest shrink-0 border-t px-4 py-3 shadow-[0_-12px_24px_rgba(26,26,26,0.06)] min-[390px]:py-3.5">
        <Button
          unstyled
          className="bg-primary text-on-primary focus-visible:outline-primary/40 h-10 w-full rounded-[10px] text-sm leading-5 font-medium focus-visible:outline-3 focus-visible:outline-offset-2 active:opacity-80"
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
      className="home-search-input text-on-surface caret-primary placeholder:text-outline h-12 w-full appearance-none border-0 bg-transparent px-2 text-right text-base leading-6 font-semibold outline-none"
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
      className="bg-surface-container-lowest flex h-14 w-full shrink-0 cursor-pointer items-center justify-between rounded-xl pt-2 pr-4 pb-2 pl-5 text-right [direction:ltr]"
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

      <Typography
        as="span"
        variant="body"
        size="large"
        weight="regular"
        className="text-on-surface text-base leading-6 font-normal [direction:rtl]"
      >
        {city.name}
      </Typography>
    </Button>
  );
}
