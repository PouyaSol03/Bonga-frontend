import {
  DashboardConversionFunnelCard,
  type DashboardConversionFunnelCardProps,
} from "../../components/reports/DashboardConversionFunnelCard";

export interface AgentConversionFunnelCardProps
  extends DashboardConversionFunnelCardProps {}

export function AgentConversionFunnelCard(
  props: AgentConversionFunnelCardProps,
) {
  return <DashboardConversionFunnelCard {...props} />;
}
