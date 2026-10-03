import {
  DashboardTasksCard,
  type DashboardTaskItem,
} from "../../components/DashboardTasksCard";
import type { AgencyTaskItem } from "../types";

export interface AgencyTasksCardProps {
  totalCount?: number;
  items?: AgencyTaskItem[];
}

export function AgencyTasksCard({
  totalCount = 46,
  items,
}: AgencyTasksCardProps) {
  return (
    <DashboardTasksCard
      role="REAL_ESTATE_MANAGER"
      totalCount={totalCount}
      items={items as DashboardTaskItem[]}
    />
  );
}
