import {
  DashboardNotificationsCard,
  type DashboardNotificationsCardProps,
} from "../../components/DashboardNotificationsCard";
import type { AgencyNotificationItem } from "../types";

export interface AgencyNotificationsCardProps extends DashboardNotificationsCardProps {
  items?: AgencyNotificationItem[];
}

export function AgencyNotificationsCard(props: AgencyNotificationsCardProps) {
  return <DashboardNotificationsCard {...(props as DashboardNotificationsCardProps)} />;
}
