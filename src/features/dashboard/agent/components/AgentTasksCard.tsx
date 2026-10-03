import {
  DashboardTasksCard,
  type DashboardTaskItem,
} from "../../components/DashboardTasksCard";
import type { AgentRoleType } from "../types";

export interface AgentTaskItemData extends DashboardTaskItem {}

export interface AgentTasksCardProps {
  role?: AgentRoleType;
  totalCount?: number;
  items?: AgentTaskItemData[];
}

export function AgentTasksCard({
  role = "REAL_ESTATE_CONSULTANT",
  totalCount = 46,
  items,
}: AgentTasksCardProps) {
  return (
    <DashboardTasksCard
      role={role}
      totalCount={totalCount}
      items={items}
    />
  );
}
