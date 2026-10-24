import {
  DashboardNotificationsCard,
  type DashboardNotificationsCardProps,
} from "../../components/DashboardNotificationsCard";
import type { AgencyNotificationItem } from "../types";

interface AgencyNotificationsCardProps extends Omit<
  DashboardNotificationsCardProps,
  "items"
> {
  items?: AgencyNotificationItem[];
}

export function AgencyNotificationsCard(props: AgencyNotificationsCardProps) {
  return <DashboardNotificationsCard {...(props as DashboardNotificationsCardProps)} />;
}
