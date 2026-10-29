import { apiV2 } from "../../../../shared/api/api";
import { toV2Context, toV2OverviewPeriod } from "./dashboardContext";
import type {
  AgencyDashboardApiResponse,
  AgentDashboardApiResponse,
  DashboardOverview,
  DashboardPeriod,
  DashboardRolePersona,
  DashboardTaskItemPayload,
  DashboardUrgentActionItem,
} from "./dashboard.types";
import {
  normalizeTasks,
  normalizeUrgentActions,
  toNumber,
} from "./dashboardNormalizers";
import {
  normalizeAgencyDashboard,
  normalizeAgentDashboard,
} from "./dashboardOverviewNormalizer";

export async function getAgencyDashboard(
  period: DashboardPeriod = "month",
): Promise<DashboardOverview> {
  const v2Period = toV2OverviewPeriod(period);
  const response = await apiV2
    .get("agency/dashboard/overview", {
      searchParams: { period: v2Period },
    })
    .json<AgencyDashboardApiResponse>();

  return normalizeAgencyDashboard(response, period);
}

export async function getAgentDashboard(
  period: DashboardPeriod = "month",
): Promise<DashboardOverview> {
  const context = toV2Context("agent");
  const v2Period = toV2OverviewPeriod(period);
  const response = await apiV2
    .get(`${context}/dashboard/overview`, {
      searchParams: { period: v2Period },
    })
    .json<AgentDashboardApiResponse>();

  return normalizeAgentDashboard(response, period);
}

export async function getDashboardOverviewByRole(
  role: DashboardRolePersona,
  period: DashboardPeriod = "month",
): Promise<DashboardOverview> {
  const context = toV2Context(role);
  const v2Period = toV2OverviewPeriod(period);
  try {
    const response = await apiV2
      .get(`${context}/dashboard/overview`, {
        searchParams: { period: v2Period },
      })
      .json<AgencyDashboardApiResponse & AgentDashboardApiResponse>();

    return role === "agency"
      ? normalizeAgencyDashboard(response, period)
      : normalizeAgentDashboard(response, period);
  } catch {
    if (role === "agency") {
      return getAgencyDashboard(period);
    }
    return getAgentDashboard(period);
  }
}

export async function getDashboardTasks(
  role: DashboardRolePersona,
): Promise<{ totalCount: number; items: DashboardTaskItemPayload[] }> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/tasks`)
      .json<{ data?: { total_count?: number; items?: unknown[] } }>();
    const items = normalizeTasks(res.data?.items);
    return {
      totalCount: toNumber(
        res.data?.total_count,
        items.reduce((acc, i) => acc + i.count, 0),
      ),
      items,
    };
  } catch {
    return { totalCount: 0, items: [] };
  }
}

export async function getDashboardUrgentActions(
  role: DashboardRolePersona,
): Promise<DashboardUrgentActionItem[]> {
  const context = toV2Context(role);
  try {
    const res = await apiV2
      .get(`${context}/dashboard/urgent-actions`)
      .json<{ data?: { items?: unknown[] } }>();
    return normalizeUrgentActions(res.data?.items);
  } catch {
    return [];
  }
}
