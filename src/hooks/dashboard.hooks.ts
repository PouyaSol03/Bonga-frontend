import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../api/query-keys";
import {
  getAgencyDashboard,
  getAgentDashboard,
  type DashboardPeriod,
} from "../services/dashboard.service";

type DashboardQueryOptions = {
  enabled?: boolean;
  period?: DashboardPeriod;
};

export function useAgencyDashboardQuery({
  enabled = true,
  period = "30d",
}: DashboardQueryOptions = {}) {
  return useQuery({
    enabled,
    queryFn: () => getAgencyDashboard(period),
    queryKey: queryKeys.dashboard.agency(period),
    refetchOnMount: "always",
  });
}

export function useAgentDashboardQuery({
  enabled = true,
  period = "30d",
}: DashboardQueryOptions = {}) {
  return useQuery({
    enabled,
    queryFn: () => getAgentDashboard(period),
    queryKey: queryKeys.dashboard.agent(period),
    refetchOnMount: "always",
  });
}
