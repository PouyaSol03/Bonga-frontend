import {
  DashboardUrgentActionsCard,
  type DashboardUrgentActionsCardProps,
} from "../../components/DashboardUrgentActionsCard";

type AgencyUrgentActionsCardProps = DashboardUrgentActionsCardProps;

export function AgencyUrgentActionsCard(props: AgencyUrgentActionsCardProps) {
  return <DashboardUrgentActionsCard {...props} />;
}
