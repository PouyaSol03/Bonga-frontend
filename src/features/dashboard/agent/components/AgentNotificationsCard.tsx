import { DashboardNotificationsCard, type DashboardNotificationsCardProps } from "../../components/DashboardNotificationsCard";

interface AgentNotificationsCardProps extends DashboardNotificationsCardProps {}

export function AgentNotificationsCard(props: AgentNotificationsCardProps) {
  return <DashboardNotificationsCard {...props} />;
}
