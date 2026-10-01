import {
  DashboardRegistrationProgressLineCard,
  type DashboardRegistrationProgressLineCardProps,
} from "../../components/reports/DashboardRegistrationProgressLineCard";

export interface AgencyRegistrationProgressLineCardProps
  extends DashboardRegistrationProgressLineCardProps {}

export function AgencyRegistrationProgressLineCard(
  props: AgencyRegistrationProgressLineCardProps,
) {
  return <DashboardRegistrationProgressLineCard {...props} />;
}
