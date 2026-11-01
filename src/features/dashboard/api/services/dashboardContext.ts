import { getV2RoleSegment, type V2RoleSegment } from "../../../../shared/api/api";
import { getActiveAuthRole, getStoredAuthSession } from "../../../../shared/auth/auth-storage";
import type { DashboardPeriod, DashboardRolePersona } from "./dashboard.types";

export function toV2OverviewPeriod(period: DashboardPeriod): "week" | "month" | "year" {
  if (period === "7d" || period === "week") return "week";
  if (period === "year") return "year";
  return "month";
}

export function toV2Context(role?: DashboardRolePersona | string | null): V2RoleSegment {
  if (role === "agency" || role === "real_estate_manager") return "agency";
  if (
    role === "agent" ||
    role === "agent_in_agency" ||
    role === "agency-consultant" ||
    role === "real_estate_consultant"
  ) {
    const session = getStoredAuthSession();
    const active = session ? getActiveAuthRole(session) : null;
    if (active === "independent_consultant") {
      return "independent-consultant";
    }
    return "agency-consultant";
  }
  if (role === "independent-consultant" || role === "independent_consultant") {
    return "independent-consultant";
  }
  if (role === "superadmin" || role === "super-admin") return "superadmin";
  if (role === "personal" || role === "user") return "personal";
  return getV2RoleSegment(role);
}
