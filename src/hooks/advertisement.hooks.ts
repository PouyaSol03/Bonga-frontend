import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { queryKeys } from "../api/query-keys";
import {
  getAdvertisementDetail,
  getAdvertisementList,
  type AdvertisementListParams,
  type AdvertisementPage,
} from "../services/advertisement.service";

export function useAdvertisementInfiniteQuery({
  categoryId,
  cityId,
  perPage = 10,
}: Pick<AdvertisementListParams, "categoryId" | "cityId" | "perPage">) {
  return useInfiniteQuery<
    AdvertisementPage,
    Error,
    { pages: AdvertisementPage[]; pageParams: number[] },
    ReturnType<typeof queryKeys.advertisements.list>,
    number
  >({
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getAdvertisementList({
        categoryId,
        cityId,
        page: pageParam,
        perPage,
      }),
    queryKey: queryKeys.advertisements.list({ categoryId, cityId, perPage }),
  });
}

export function useAdvertisementDetailQuery(id: string | null) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: () => getAdvertisementDetail(id ?? ""),
    queryKey: queryKeys.advertisements.detail(id ?? ""),
  });
}
