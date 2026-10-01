import {
  DashboardViewsBarChartCard,
  type DashboardViewsBarChartCardProps,
} from "../../components/reports/DashboardViewsBarChartCard";

export interface AgentViewsBarChartCardProps
  extends DashboardViewsBarChartCardProps {}

export function AgentViewsBarChartCard(props: AgentViewsBarChartCardProps) {
  return <DashboardViewsBarChartCard {...props} />;
}
