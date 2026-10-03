import {
  DashboardRegistrationProgressLineCard,
  type DashboardRegistrationProgressLineCardProps,
} from "../../components/reports/DashboardRegistrationProgressLineCard";

export interface AgentRegistrationProgressLineCardProps
  extends DashboardRegistrationProgressLineCardProps {}

export function AgentRegistrationProgressLineCard(
  props: AgentRegistrationProgressLineCardProps,
) {
  return <DashboardRegistrationProgressLineCard {...props} />;
}
