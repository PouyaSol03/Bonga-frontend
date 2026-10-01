import {
  DashboardViewsBarChartCard,
  type DashboardViewsBarChartCardProps,
} from "../../components/reports/DashboardViewsBarChartCard";

export interface AgencyViewsBarChartCardProps
  extends DashboardViewsBarChartCardProps {}

export function AgencyViewsBarChartCard(props: AgencyViewsBarChartCardProps) {
  return <DashboardViewsBarChartCard {...props} />;
}
