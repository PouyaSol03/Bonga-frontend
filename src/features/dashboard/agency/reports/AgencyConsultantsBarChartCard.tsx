import {
  DashboardConsultantsBarChartCard,
  type DashboardConsultantsBarChartCardProps,
} from "../../components/reports/DashboardConsultantsBarChartCard";

export interface AgencyConsultantsBarChartCardProps
  extends DashboardConsultantsBarChartCardProps {}

export function AgencyConsultantsBarChartCard(
  props: AgencyConsultantsBarChartCardProps,
) {
  return <DashboardConsultantsBarChartCard {...props} />;
}
