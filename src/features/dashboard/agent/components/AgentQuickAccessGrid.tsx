import { DashboardQuickAccessGrid } from "../../components/DashboardQuickAccessGrid";
import type { AgentRoleType } from "../types";

export interface AgentQuickAccessGridProps {
  role?: AgentRoleType;
}

export function AgentQuickAccessGrid({
  role = "REAL_ESTATE_CONSULTANT",
}: AgentQuickAccessGridProps) {
  return <DashboardQuickAccessGrid role={role} />;
}
