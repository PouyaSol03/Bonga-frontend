import { useMutation, useQuery } from "@tanstack/react-query";

import { queryClient } from "../api/query-client";
import { queryKeys } from "../api/query-keys";
import {
  getAgentEntitlementLedger,
  getAgentEntitlements,
  getPackages,
  payAgencyPackage,
  payAgentPackage,
  payPackage,
  type PackagePaymentPayload,
} from "../services/package.service";

export function usePackagesQuery() {
  return useQuery({
    queryFn: getPackages,
    queryKey: queryKeys.packages.list(),
  });
}

function invalidatePackagePaymentQueries() {
  void queryClient.invalidateQueries({ queryKey: queryKeys.account.all });
  void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
  void queryClient.invalidateQueries({
    queryKey: queryKeys.packages.agentEntitlements(),
  });
  void queryClient.invalidateQueries({
    queryKey: queryKeys.packages.agentEntitlementLedgerRoot(),
  });
}

export function usePackagePaymentMutation() {
  return useMutation({
    mutationFn: (payload: PackagePaymentPayload) => payPackage(payload),
    onSuccess: (result) => {
      if (result.paymentType === 1) invalidatePackagePaymentQueries();
    },
  });
}

export function useAgencyPackagePaymentMutation() {
  return useMutation({
    mutationFn: (packageId: string) => payAgencyPackage(packageId),
  });
}

export function useAgentPackagePaymentMutation() {
  return useMutation({
    mutationFn: (packageId: string) => payAgentPackage(packageId),
  });
}

export function useAgentEntitlementsQuery({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) {
  return useQuery({
    enabled,
    queryFn: getAgentEntitlements,
    queryKey: queryKeys.packages.agentEntitlements(),
  });
}

export function useAgentEntitlementLedgerQuery({
  enabled = true,
  page = 1,
  perPage = 20,
}: {
  enabled?: boolean;
  page?: number;
  perPage?: number;
} = {}) {
  return useQuery({
    enabled,
    queryFn: () => getAgentEntitlementLedger({ page, perPage }),
    queryKey: queryKeys.packages.agentEntitlementLedger(page, perPage),
  });
}
