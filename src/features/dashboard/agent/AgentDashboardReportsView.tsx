import {
  DashboardReportsView,
  type DashboardReportsViewProps,
} from "../components/DashboardReportsView";
import type { AgentRoleType } from "./types";

export interface AgentDashboardReportsViewProps
  extends Omit<DashboardReportsViewProps, "role"> {
  role?: AgentRoleType;
}

export function AgentDashboardReportsView({
  role = "REAL_ESTATE_CONSULTANT",
  ...props
}: AgentDashboardReportsViewProps) {
  return <DashboardReportsView role={role} {...props} />;
}
