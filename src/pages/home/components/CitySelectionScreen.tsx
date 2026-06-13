import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { TopBar } from "../../../components/TopBar";
import { cityOptions as fallbackCityOptions } from "../homeData";
import type { CityOption } from "../homeTypes";
import { getCityList, type CityDto } from "../../../api/cityApi";

type CitySelectionScreenProps = {
  currentCity: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (city: string) => void;
};

type UiCityOption = CityOption & {
  id?: string;
};

function mapCityDtoToOption(city: CityDto): UiCityOption {
  return {
    id: city.id ?? city._id,
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

  const [cityList, setCityList] = useState<UiCityOption[]>(fallbackCityOptions);
  const [selectedCityId, setSelectedCityId] = useState(getStoredCityId);
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim();

  const visibleSearchResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return cityList.filter((city) => city.name.includes(normalizedQuery));
  }, [cityList, normalizedQuery]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    let isActive = true;

    async function fetchCities() {
      try {
        const response = await getCityList();

        if (!isActive) {
          return;
        }

        const mappedCities = response.map(mapCityDtoToOption);
        setCityList(mappedCities.length > 0 ? mappedCities : fallbackCityOptions);
      } catch (error) {
        if (!isActive) {
          return;
        }

        console.error("city list fetch error:", error);
        setCityList(fallbackCityOptions);
      }
    }

    void fetchCities();

    return () => {
      isActive = false;
    };
  }, [isOpen]);

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
      onConfirm(selectedCity.name);
    } else {
      onConfirm(currentCity);
    }

    setIsSearching(false);
    setQuery("");
  };

  return (
    <section
      className={`absolute inset-0 z-40 flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] transition-[opacity,transform,visibility] duration-300 ease-out [direction:rtl] ${
        isOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-3 opacity-0"
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
          normalizedQuery.length === 0 ? (
            <div className="h-full bg-white" />
          ) : visibleSearchResults.length > 0 ? (
            <div className="flex flex-col pt-2">
              {visibleSearchResults.map((city) => (
                <CitySearchResultRow
                  city={city}
                  key={city.id ?? city.name}
                  onSelect={() => selectCity(city)}
                />
              ))}
            </div>
          ) : (
            <CityEmptyState />
          )
        ) : (
          <div className="flex flex-col gap-2 px-4 pt-4">
            {cityList.map((city) => (
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
      className={`flex h-14 w-full shrink-0 cursor-pointer items-center justify-between rounded-xl pb-2 pl-5 pr-4 pt-2 text-right transition-colors [direction:ltr] ${
        isSelected ? "h-[58px] bg-[#e6ebf6]" : "bg-white"
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

function CitySearchResultRow({
  city,
  onSelect,
}: {
  city: UiCityOption;
  onSelect: () => void;
}) {
  return (
    <button
      className="flex h-11 w-full cursor-pointer items-center justify-between border-b border-[#cccccc] bg-white px-4 text-right [direction:ltr] min-[390px]:h-12"
      type="button"
      onClick={onSelect}
    >
      <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-normal leading-4 text-[#1a1a1a] [direction:ltr]">
        <span>آگهی</span>
        <span className="[direction:rtl]">{city.count}</span>
      </span>

      <span className="min-w-0 text-sm font-normal leading-5 text-[#1a1a1a] [direction:rtl] min-[390px]:text-base min-[390px]:leading-6">
        {city.name}
      </span>
    </button>
  );
}

function CityEmptyState() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-8 pb-16 pt-8 text-center">
      <span className="home-city-empty-illustration mb-6 min-[390px]:mb-8" aria-hidden="true" />

      <h3 className="m-0 text-base font-semibold leading-6 text-[#1a1a1a] min-[390px]:text-lg min-[390px]:leading-7">
        هیچ نتیجه‌ای یافت نشد!
      </h3>

      <p className="m-0 mt-4 text-sm font-normal leading-5 text-[#4d4d4d]">
        مجدد امتحان کنید
      </p>
    </div>
  );
}