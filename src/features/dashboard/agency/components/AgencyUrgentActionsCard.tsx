import {
  DashboardUrgentActionsCard,
  type DashboardUrgentActionsCardProps,
} from "../../components/DashboardUrgentActionsCard";

export type AgencyUrgentActionsCardProps = DashboardUrgentActionsCardProps;

export function AgencyUrgentActionsCard(props: AgencyUrgentActionsCardProps) {
  return <DashboardUrgentActionsCard {...props} />;
}


