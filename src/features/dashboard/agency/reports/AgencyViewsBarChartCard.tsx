import {
  DashboardViewsBarChartCard,
  type DashboardViewsBarChartCardProps,
} from "../../components/reports/DashboardViewsBarChartCard";

interface AgencyViewsBarChartCardProps extends DashboardViewsBarChartCardProps {}

export function AgencyViewsBarChartCard(props: AgencyViewsBarChartCardProps) {
  return <DashboardViewsBarChartCard {...props} />;
}
