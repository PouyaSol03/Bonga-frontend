import { useMutation, useQuery } from "@tanstack/react-query";

import { queryKeys } from "../api/query-keys";
import { getPackages, payAgencyPackage } from "../services/package.service";

export function usePackagesQuery() {
  return useQuery({
    queryFn: getPackages,
    queryKey: queryKeys.packages.list(),
  });
}


export function useAgencyPackagePaymentMutation() {
  return useMutation({
    mutationFn: payAgencyPackage,
  });
}
