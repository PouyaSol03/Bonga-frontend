import { apiRequest, getApiAssetUrl } from "./apiClient";

export type CityDto = {
  _id?: string;
  code?: string;
  country_id?: string;
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

export async function getCityList() {
  const response = await apiRequest<CityListResponse>("/city/list", {
    authenticated: false,
    method: "GET",
  });

  return response.data;
}

export async function getMostVisitedCityList() {
  const response = await apiRequest<CityListResponse>("/city/mostVisitedList", {
    authenticated: false,
    method: "GET",
  });

  return response.data.map((city) => ({
    ...city,
    logo: city.logo ? getApiAssetUrl(city.logo) : city.logo,
  }));
}
