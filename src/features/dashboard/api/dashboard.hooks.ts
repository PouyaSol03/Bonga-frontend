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
  getAgentBadges,
  getAgentBadge,
  getAgentRanking,
  getAgentRankingProgress,
  getAgentWorkSummary,
  getDashboardOverviewByRole,
  getDashboardTasks,
  getDashboardUrgentActions,
  getDashboardRankingBadge,
  getDashboardCredits,
  getDashboardNotifications,
  getDashboardReportsTeaser,
  getDashboardRecentAds,
  getDashboardReportsPublishedAds,
  getDashboardReportsViews,
  getDashboardReportsConsultantsActivity,
  getDashboardReportsRegistrationProgress,
  getDashboardReportsConversionFunnel,
  getDashboardReportsRankingScore,
  getDashboardReportsOverview,
  type DashboardRolePersona,
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

export function useAgentBadgesQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    enabled,
    queryFn: getAgentBadges,
    queryKey: queryKeys.dashboard.agentBadges(),
    refetchOnMount: "always",
  });
}

export function useAgentBadgeDetailQuery(slug: string, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    enabled: enabled && Boolean(slug),
    queryFn: () => getAgentBadge(slug),
    queryKey: queryKeys.dashboard.agentBadgeDetail(slug),
    refetchOnMount: "always",
  });
}

export function useAgentRankingQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    enabled,
    queryFn: getAgentRanking,
    queryKey: queryKeys.dashboard.agentRanking(),
    refetchOnMount: "always",
  });
}

export function useAgentRankingProgressQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    enabled,
    queryFn: getAgentRankingProgress,
    queryKey: queryKeys.dashboard.agentRankingProgress(),
    refetchOnMount: "always",
  });
}

export function useAgentWorkSummaryQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    enabled,
    queryFn: getAgentWorkSummary,
    queryKey: queryKeys.dashboard.agentWorkSummary(),
    refetchOnMount: "always",
  });
}

export function useDashboardOverviewByRoleQuery(
  role: DashboardRolePersona,
  { enabled = true, period = "30d" }: DashboardQueryOptions = {},
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
  period = "30d",
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

export function useDashboardReportsOverviewQuery(
  role: DashboardRolePersona,
  { enabled = true, period = "month" }: DashboardQueryOptions = {},
) {
  return useQuery({
    enabled,
    queryFn: () => getDashboardReportsOverview(role, period),
    queryKey: queryKeys.dashboard.reportsOverview(role, period),
    refetchOnMount: "always",
  });
}

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
  period = "30d",
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
