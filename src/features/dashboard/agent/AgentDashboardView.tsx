import { DashboardView, type DashboardViewProps } from "../components/DashboardView";
import type { AgentRoleType } from "./types";

export interface AgentDashboardViewProps extends Omit<DashboardViewProps, "role"> {
  role?: AgentRoleType;
}

export function AgentDashboardView({
  role = "REAL_ESTATE_CONSULTANT",
  ...props
}: AgentDashboardViewProps) {
  return <DashboardView role={role} {...props} />;
}
