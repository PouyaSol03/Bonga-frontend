import {
  DashboardNotificationsCard,
  type DashboardNotificationItem,
  type DashboardNotificationsCardProps,
} from "../../components/DashboardNotificationsCard";

export interface AgentNotificationItemData extends DashboardNotificationItem {}
export interface AgentNotificationsCardProps extends DashboardNotificationsCardProps {}

export function AgentNotificationsCard(props: AgentNotificationsCardProps) {
  return <DashboardNotificationsCard {...props} />;
}
