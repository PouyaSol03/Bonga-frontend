import {
  DashboardReportsView,
  type DashboardReportsViewProps,
} from "../components/DashboardReportsView";

export interface AgencyDashboardReportsViewProps
  extends Omit<DashboardReportsViewProps, "role"> {}

export function AgencyDashboardReportsView(
  props: AgencyDashboardReportsViewProps,
) {
  return <DashboardReportsView role="REAL_ESTATE_MANAGER" {...props} />;
}
