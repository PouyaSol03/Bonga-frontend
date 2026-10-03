import {
  DashboardConversionFunnelCard,
  type DashboardConversionFunnelCardProps,
} from "../../components/reports/DashboardConversionFunnelCard";

export interface AgencyConversionFunnelCardProps
  extends DashboardConversionFunnelCardProps {}

export function AgencyConversionFunnelCard(
  props: AgencyConversionFunnelCardProps,
) {
  return <DashboardConversionFunnelCard {...props} />;
}
