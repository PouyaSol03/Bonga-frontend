import {
  DashboardReportsTeaserCard,
  type DashboardReportsTeaserCardProps,
} from "../../components/DashboardReportsTeaserCard";

export interface AgencyReportsTeaserCardProps extends DashboardReportsTeaserCardProps {}

export function AgencyReportsTeaserCard(props: AgencyReportsTeaserCardProps) {
  return <DashboardReportsTeaserCard {...props} />;
}
