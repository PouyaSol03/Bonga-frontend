import { useMutation, useQuery } from "@tanstack/react-query";
import { getActiveV2Role, type V2RoleSegment } from "../../../shared/api/api";

import { queryClient } from "../../../shared/api/query-client";
import { queryKeys } from "../../../shared/api/query-keys";
import {
  getAgentEntitlements,
  getPackages,
  payPackage,
  type PackagePaymentPayload,
  type PackageQueryParams,
} from "./package.service";

export function usePackagesQuery(params?: PackageQueryParams) {
  const scopeKey = params?.role ?? params?.scope;
  return useQuery({
    queryFn: () => getPackages(params),
    queryKey: queryKeys.packages.list(scopeKey),
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
export function useAgentEntitlementsQuery({
  enabled = true,
  context = getActiveV2Role(),
}: {
  enabled?: boolean;
  context?: V2RoleSegment;
} = {}) {
  return useQuery({
    enabled: enabled && ["agency", "agency-consultant", "independent-consultant"].includes(context),
    queryFn: () => getAgentEntitlements(context),
    queryKey: queryKeys.packages.agentEntitlements(context),
  });
}