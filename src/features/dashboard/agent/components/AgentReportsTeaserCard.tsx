import {
  DashboardReportsTeaserCard,
  type DashboardReportsTeaserCardProps,
} from "../../components/DashboardReportsTeaserCard";

interface AgentReportsTeaserCardProps extends DashboardReportsTeaserCardProps {}

export function AgentReportsTeaserCard(props: AgentReportsTeaserCardProps) {
  return <DashboardReportsTeaserCard {...props} />;
}
