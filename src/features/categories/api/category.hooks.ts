import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/query-keys";
import { getCategoryList } from "./category.service";

export function useCategoryListQuery() {
  return useQuery({
    queryFn: getCategoryList,
    queryKey: queryKeys.categories.list(),
  });
}
