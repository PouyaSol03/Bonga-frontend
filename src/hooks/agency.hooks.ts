import { useInfiniteQuery } from "@tanstack/react-query";

import { queryKeys } from "../api/query-keys";
import {
  getPublicAgencies,
  type AgencySort,
  type PublicAgencyPage,
} from "../services/agency.service";

export type AgencyInfiniteQueryParams = {
  enabled?: boolean;
  neighborhoodId?: string;
  perPage?: number;
  search?: string;
  sort?: AgencySort;
};

export function useAgencyInfiniteQuery({
  enabled = true,
  neighborhoodId,
  perPage = 20,
  search = "",
  sort,
}: AgencyInfiniteQueryParams) {
  return useInfiniteQuery<
    PublicAgencyPage,
    Error,
    { pages: PublicAgencyPage[]; pageParams: number[] },
    ReturnType<typeof queryKeys.agencies.list>,
    number
  >({
    enabled,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getPublicAgencies({
        neighborhoodId,
        page: pageParam,
        perPage,
        search,
        sort,
      }),
    queryKey: queryKeys.agencies.list({
      neighborhoodId,
      perPage,
      search,
      sort,
    }),
  });
}
