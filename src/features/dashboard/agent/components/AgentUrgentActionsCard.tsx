import {
  DashboardUrgentActionsCard,
  type DashboardUrgentActionItem,
} from "../../components/DashboardUrgentActionsCard";

export type AgentUrgentActionItem = DashboardUrgentActionItem;

export interface AgentUrgentActionsCardProps {
  items?: AgentUrgentActionItem[];
  viewAllTo?: string;
}

export function AgentUrgentActionsCard(props: AgentUrgentActionsCardProps) {
  return <DashboardUrgentActionsCard {...props} />;
}

