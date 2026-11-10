import {
  DashboardReportsTeaserCard,
  type DashboardReportsTeaserCardProps,
} from "../../components/DashboardReportsTeaserCard";

interface AgencyReportsTeaserCardProps extends DashboardReportsTeaserCardProps {}

export function AgencyReportsTeaserCard(props: AgencyReportsTeaserCardProps) {
  return <DashboardReportsTeaserCard {...props} />;
}
