import { DashboardView, type DashboardViewProps } from "../components/DashboardView";

export interface AgencyDashboardViewProps extends Omit<DashboardViewProps, "role"> {}

export function AgencyDashboardView(props: AgencyDashboardViewProps) {
  return <DashboardView role="REAL_ESTATE_MANAGER" {...props} />;
}
