import { type AdvertisementItem } from "./item-types";
import { publicApi } from "../../../../shared/api/api";
import {
  type TopViewedAdvertisementsResponse,
  type AdvertisementListParams,
  type AdvertisementListResponse,
  type AdvertisementPage,
  type AdvertisementMapParams,
  type AdvertisementMapResponse,
} from "./listing-types";
import {
  compactSearchParams,
  buildAdvertiseSearchParams,
} from "./search-params";
import { buildAdvertisementMapRequestPath } from "../advertisement-map-query";
import { extractAdvertisementItems } from "./list-response";

export const defaultPerPage = 10;

export async function getTopViewedAdvertisements(): Promise<
  AdvertisementItem[]
> {
  const response = await publicApi
    .get("public/advertise/top-viewed")
    .json<TopViewedAdvertisementsResponse>();

  return Array.isArray(response) ? response : (response.data ?? []);
}

export async function getAdvertisementList({
  cityId,
  filters,
  page = 1,
  perPage = defaultPerPage,
}: AdvertisementListParams) {
  const response = await publicApi
    .get("public/advertise", {
      searchParams: compactSearchParams({
        ...buildAdvertiseSearchParams(filters),
        city_id: cityId,
        page,
        per_page: perPage,
      }),
    })
    .json<AdvertisementListResponse>();
  const rawResponse = Array.isArray(response) ? undefined : response;
  const data = Array.isArray(response) ? response : (response.data ?? []);
  const meta = rawResponse?.meta ?? rawResponse?.pagination;
  const currentPage =
    rawResponse?.page ?? meta?.current_page ?? meta?.page ?? page;
  const lastPage = meta?.last_page ?? meta?.total_pages;
  const rawTotal = rawResponse?.total ?? meta?.total;
  const total = typeof rawTotal === "number" ? rawTotal : data.length;
  const resolvedPerPage = rawResponse?.per_page ?? meta?.per_page ?? perPage;

  return {
    data,
    hasNextPage:
      typeof rawResponse?.has_more === "boolean"
        ? rawResponse.has_more
        : typeof lastPage === "number"
          ? currentPage < lastPage
          : typeof total === "number"
            ? currentPage * resolvedPerPage < total
            : data.length >= perPage,
    page: currentPage,
    total,
  } satisfies AdvertisementPage;
}

export async function getAdvertisementMap({
  cityId,
  east,
  filters,
  geofence,
  limit = 100,
  north,
  south,
  west,
}: AdvertisementMapParams) {
  const searchParams = compactSearchParams({
    ...buildAdvertiseSearchParams(filters),
    ...(cityId ? { city_id: cityId } : {}),
    east,
    geofence,
    limit,
    north,
    south,
    west,
  });
  const response = await publicApi
    .get(buildAdvertisementMapRequestPath(searchParams))
    .json<AdvertisementMapResponse>();

  return extractAdvertisementItems(response);
}
