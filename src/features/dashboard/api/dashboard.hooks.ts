import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/query-keys";
import {
  getAgencyDashboard,
  getAgencyDashboardAdvertiseRegistrationProgress,
  getAgencyDashboardConsultantActivity,
  getAgencyDashboardCredits,
  getAgencyDashboardPublishedAdvertises,
  getAgencyDashboardRanking,
  getAgencyDashboardRankingProgress,
  getAgentDashboard,
  type DashboardPeriod,
} from "./dashboard.service";

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

export function useAgencyDashboardCreditsQuery({
  enabled = true,
  period = "month",
}: DashboardQueryOptions = {}) {
  return useQuery({
    enabled,
    queryFn: () => getAgencyDashboardCredits(period),
    queryKey: queryKeys.dashboard.agencyCredits(period),
    refetchOnMount: "always",
  });
}

export function useAgencyDashboardConsultantActivityQuery({
  enabled = true,
  period = "month",
}: DashboardQueryOptions = {}) {
  return useQuery({
    enabled,
    queryFn: () => getAgencyDashboardConsultantActivity(period),
    placeholderData: (previousData) => previousData,
    queryKey: queryKeys.dashboard.agencyConsultantActivity(period),
    refetchOnMount: "always",
  });
}

export function useAgencyDashboardPublishedAdvertisesQuery({
  enabled = true,
  period = "month",
}: DashboardQueryOptions = {}) {
  return useQuery({
    enabled,
    queryFn: () => getAgencyDashboardPublishedAdvertises(period),
    placeholderData: (previousData) => previousData,
    queryKey: queryKeys.dashboard.agencyPublishedAdvertises(period),
    refetchOnMount: "always",
  });
}

export function useAgencyDashboardAdvertiseRegistrationProgressQuery({
  enabled = true,
  period = "month",
}: DashboardQueryOptions = {}) {
  return useQuery({
    enabled,
    queryFn: () => getAgencyDashboardAdvertiseRegistrationProgress(period),
    placeholderData: (previousData) => previousData,
    queryKey: queryKeys.dashboard.agencyAdvertiseRegistrationProgress(period),
    refetchOnMount: "always",
  });
}

export function useAgencyDashboardRankingProgressQuery({
  enabled = true,
  period = "month",
}: DashboardQueryOptions = {}) {
  return useQuery({
    enabled,
    queryFn: () => getAgencyDashboardRankingProgress(period),
    placeholderData: (previousData) => previousData,
    queryKey: queryKeys.dashboard.agencyRankingProgress(period),
    refetchOnMount: "always",
  });
}

export function useAgencyDashboardRankingQuery({
  enabled = true,
}: Pick<DashboardQueryOptions, "enabled"> = {}) {
  return useQuery({
    enabled,
    queryFn: getAgencyDashboardRanking,
    queryKey: queryKeys.dashboard.agencyRanking(),
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
