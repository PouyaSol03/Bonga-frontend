import {
  DashboardUrgentActionsCard,
  type DashboardUrgentActionItem,
} from "../../components/DashboardUrgentActionsCard";

type AgentUrgentActionItem = DashboardUrgentActionItem;

interface AgentUrgentActionsCardProps {
  items?: AgentUrgentActionItem[];
  viewAllTo?: string;
}

export function AgentUrgentActionsCard(props: AgentUrgentActionsCardProps) {
  return <DashboardUrgentActionsCard {...props} />;
}
