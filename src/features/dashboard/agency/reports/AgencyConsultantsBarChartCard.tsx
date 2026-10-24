import {
  DashboardConsultantsBarChartCard,
  type DashboardConsultantsBarChartCardProps,
} from "../../components/reports/DashboardConsultantsBarChartCard";

interface AgencyConsultantsBarChartCardProps extends DashboardConsultantsBarChartCardProps {}

export function AgencyConsultantsBarChartCard(props: AgencyConsultantsBarChartCardProps) {
  return <DashboardConsultantsBarChartCard {...props} />;
}
