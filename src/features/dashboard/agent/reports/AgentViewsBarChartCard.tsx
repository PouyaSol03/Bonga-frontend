import {
  DashboardViewsBarChartCard,
  type DashboardViewsBarChartCardProps,
} from "../../components/reports/DashboardViewsBarChartCard";

interface AgentViewsBarChartCardProps extends DashboardViewsBarChartCardProps {}

export function AgentViewsBarChartCard(props: AgentViewsBarChartCardProps) {
  return <DashboardViewsBarChartCard {...props} />;
}
