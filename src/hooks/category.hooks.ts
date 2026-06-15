import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../api/query-keys";
import { getCategoryList } from "../services/category.service";

export function useCategoryListQuery() {
  return useQuery({
    queryFn: getCategoryList,
    queryKey: queryKeys.categories.list(),
  });
}
