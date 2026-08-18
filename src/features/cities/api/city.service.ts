import { getApiAssetUrl, publicApi } from "../../../shared/api/api";

export type CityDto = {
  _id?: string;
  code?: string;
  country_id?: number;
  id?: string;
  lat?: number;
  lng?: number;
  logo?: string;
  name: string;
};

type CityListResponse = {
  data: CityDto[];
  status: boolean;
};

function normalizeCityLogo(city: CityDto): CityDto {
  return {
    ...city,
    logo: city.logo ? getApiAssetUrl(city.logo) : city.logo,
  };
}

export async function searchCities(q = "") {
  const response = await publicApi
    .get("public/city/search", { searchParams: { q } })
    .json<CityListResponse>();

  return response.data.map(normalizeCityLogo);
}

export async function getMostVisitedCityList() {
  const response = await publicApi
    .get("public/city/mostVisitedList")
    .json<CityListResponse>();

  return response.data.map(normalizeCityLogo);
}
