import { useMemo } from "react";
import { useMostVisitedCityListQuery } from "../../../hooks/city.hooks";
import type { CityDto } from "../../../services/city.service";
import { RouteLink } from "../../../routes/RouteLink";
import TehranIcon from "../../../assets/icons/TehranIcon.svg";
import MashhadIcon from "../../../assets/icons/MashhadIcon.svg";
import IsfahanIcon from "../../../assets/icons/IsfahanIcon.svg";
import ShirazIcon from "../../../assets/icons/ShirazIcon.svg";
import { getRequestErrorState } from "../../../components/ErrorState";

type UiCity = {
  id: string;
  code?: string;
  name: string;
  icon?: string;
};

function getCityIcon(city: CityDto) {
  const code = city.code?.toLowerCase();
  const name = city.name.trim();

  switch (code) {
    case "mashhad":
      return MashhadIcon;

    case "tehran":
      return TehranIcon;

    case "isfahan":
      return IsfahanIcon;

    case "shiraz":
      return ShirazIcon;

    default:
      switch (name) {
        case "مشهد":
          return MashhadIcon;

        case "تهران":
          return TehranIcon;

        case "اصفهان":
          return IsfahanIcon;

        case "شیراز":
          return ShirazIcon;

        default:
          return city.logo || "";
      }
  }
}

function mapCityDtoToUiCity(city: CityDto): UiCity {
  return {
    id: String(city.id ?? city._id ?? city.code ?? ""),
    code: city.code,
    name: city.name,
    icon: getCityIcon(city),
  };
}

export function CitySelectorSection() {
  const {
    data: apiCities = [],
    error,
    isError,
    isLoading,
    refetch,
  } = useMostVisitedCityListQuery();
  const CityErrorState = getRequestErrorState(error);

  const cityList = useMemo<UiCity[]>(() => {
    if (isError) {
      return [];
    }

    return apiCities
      .map(mapCityDtoToUiCity)
      .filter((city) => city.id && city.name)
      .slice(0, 4);
  }, [apiCities, isError]);

  const openHomeSearch = () => {
    window.history.pushState({}, "", "/home");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleCitySelect = (city: UiCity) => {
    window.localStorage.setItem("bonga-selected-city", city.name);

    if (city.id) {
      window.localStorage.setItem("bonga-selected-city-id", city.id);
    }
  };

  return (
    <section
      className="relative z-10 mx-0 -mt-12 rounded-b-3xl rounded-t-3xl bg-white px-3 pb-5 pt-4 shadow-[0_4px_28px_rgba(77,77,77,0.08)] min-[390px]:px-4 min-[390px]:pb-6 min-[390px]:pt-5"
      aria-labelledby="city-title"
    >
      <h2
        className="m-0 text-center text-sm font-semibold leading-5 text-[#1a1a1a] min-[390px]:text-base min-[390px]:leading-6"
        id="city-title"
      >
        شهر مورد نظرت رو انتخاب کن:
      </h2>

      <label
        className="relative mt-6 flex h-11 items-center rounded-xl bg-[#f0f0f0] min-[390px]:mt-8 min-[390px]:h-[48px]"
        aria-label="جستجو در شهر"
      >
        <input
          className="h-full w-full rounded-[inherit] border-0 bg-transparent py-0 pl-12 pr-4 text-right text-sm font-normal leading-5 text-[#1a1a1a] outline-none placeholder:text-[#808080] min-[390px]:text-base min-[390px]:leading-6"
          type="search"
          placeholder="جستجو در شهر"
          onClick={openHomeSearch}
          onFocus={openHomeSearch}
          readOnly
        />

        <span className="home-search-icon" aria-hidden="true" />
      </label>

      {isError ? (
        <div className="fixed inset-0 z-[999] bg-white">
          <CityErrorState
            className="h-full"
            onRetry={() => void refetch()}
          />
        </div>
      ) : null}

      <div
        className={`${isError ? "hidden " : ""}mt-6 grid grid-cols-4 gap-2 min-[390px]:mt-8 min-[390px]:gap-4`}
        aria-label="شهرهای پیشنهادی"
      >
        {cityList.map((city) => (
          <RouteLink
            className="flex min-h-[60px] min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl bg-transparent px-1 py-1.5 text-[#1a1a1a] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#0048c440] min-[390px]:min-h-[72px] min-[390px]:py-2"
            key={city.id ?? city.name}
            onClick={() => handleCitySelect(city)}
            to="/home"
          >
            {city.icon ? (
              <img
                src={city.icon}
                alt=""
                className="h-8 w-8 shrink-0 object-contain min-[390px]:h-10 min-[390px]:w-10"
                aria-hidden="true"
              />
            ) : (
              <span className="h-8 w-8 shrink-0 rounded-full bg-[#f0f0f0] min-[390px]:h-10 min-[390px]:w-10" />
            )}

            <span className="text-xs font-medium leading-4">{city.name}</span>
          </RouteLink>
        ))}
      </div>

      {isLoading && (
        <p className="mt-4 text-center text-xs font-medium text-[#808080]">
          در حال دریافت شهرها...
        </p>
      )}
    </section>
  );
}
