import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../shared/api/query-keys";
import { getAgencyDashboard, getDashboardOverviewByRole, getDashboardTasks, getDashboardUrgentActions, getDashboardRankingBadge, getDashboardCredits, getDashboardNotifications, getDashboardReportsTeaser, getDashboardRecentAds, getDashboardReportsPublishedAds, getDashboardReportsViews, getDashboardReportsConsultantsActivity, getDashboardReportsRegistrationProgress, getDashboardReportsConversionFunnel, getDashboardReportsRankingScore, type DashboardRolePersona, type DashboardPeriod } from "./dashboard.service";

type DashboardQueryOptions = {
  enabled?: boolean;
  period?: DashboardPeriod;
};

export function useAgencyDashboardQuery({
  enabled = true,
  period = "month",
}: DashboardQueryOptions = {}) {
  return useQuery({
    enabled,
    queryFn: () => getAgencyDashboard(period),
    queryKey: queryKeys.dashboard.agency(period),
    refetchOnMount: "always",
  });
}

export function useDashboardOverviewByRoleQuery(
  role: DashboardRolePersona,
  { enabled = true, period = "month" }: DashboardQueryOptions = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardOverviewByRole(role, period),
    queryKey: ["dashboard", "overview", role, period],
    refetchOnMount: "always",
  });
}

export function useDashboardTasksQuery(
  role: DashboardRolePersona,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardTasks(role),
    queryKey: ["dashboard", "tasks", role],
    refetchOnMount: "always",
  });
}

export function useDashboardUrgentActionsQuery(
  role: DashboardRolePersona,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardUrgentActions(role),
    queryKey: queryKeys.dashboard.urgentActions(role),
    refetchOnMount: "always",
  });
}

export function useDashboardRankingBadgeQuery(
  role: DashboardRolePersona,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardRankingBadge(role),
    queryKey: queryKeys.dashboard.rankingBadge(role),
    refetchOnMount: "always",
  });
}

export function useDashboardCreditsQuery(
  role: DashboardRolePersona,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardCredits(role),
    queryKey: queryKeys.dashboard.credits(role),
    refetchOnMount: "always",
  });
}

export function useDashboardNotificationsQuery(
  role: DashboardRolePersona,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardNotifications(role),
    queryKey: queryKeys.dashboard.notifications(role),
    refetchOnMount: "always",
  });
}

export function useDashboardReportsTeaserQuery(
  role: DashboardRolePersona,
  period = "month",
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardReportsTeaser(role, period),
    queryKey: queryKeys.dashboard.reportsTeaser(role, period),
    refetchOnMount: "always",
  });
}

export function useDashboardRecentAdsQuery(
  role: DashboardRolePersona,
  limit = 5,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardRecentAds(role, limit),
    queryKey: queryKeys.dashboard.recentAds(role, limit),
    refetchOnMount: "always",
  });
}

// -------------------------------------------------------------
// Reports Queries (dashboard-reports-charts-api-contract.md)
// -------------------------------------------------------------

export function useDashboardReportsPublishedAdsQuery(
  role: DashboardRolePersona,
  period = "month",
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardReportsPublishedAds(role, period),
    queryKey: queryKeys.dashboard.reportsPublishedAds(role, period),
    refetchOnMount: "always",
  });
}

export function useDashboardReportsViewsQuery(
  role: DashboardRolePersona,
  period = "year",
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardReportsViews(role, period),
    queryKey: queryKeys.dashboard.reportsViews(role, period),
    refetchOnMount: "always",
  });
}

export function useDashboardReportsConsultantsActivityQuery(
  period = "month",
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardReportsConsultantsActivity(period),
    queryKey: queryKeys.dashboard.reportsConsultantsActivity(period),
    refetchOnMount: "always",
  });
}

export function useDashboardReportsRegistrationProgressQuery(
  role: DashboardRolePersona,
  period = "month",
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardReportsRegistrationProgress(role, period),
    queryKey: queryKeys.dashboard.reportsRegistrationProgress(role, period),
    refetchOnMount: "always",
  });
}

export function useDashboardReportsConversionFunnelQuery(
  role: DashboardRolePersona,
  period = "month",
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardReportsConversionFunnel(role, period),
    queryKey: queryKeys.dashboard.reportsConversionFunnel(role, period),
    refetchOnMount: "always",
  });
}

export function useDashboardReportsRankingScoreQuery(
  role: DashboardRolePersona,
  { enabled = true }: { enabled?: boolean } = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardReportsRankingScore(role),
    queryKey: queryKeys.dashboard.reportsRankingScore(role),
    refetchOnMount: "always",
  });
}
