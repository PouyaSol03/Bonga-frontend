import {
  DashboardRankScoreCard,
  type DashboardRankScoreCardProps,
} from "../../components/reports/DashboardRankScoreCard";

interface AgencyRankScoreCardProps extends DashboardRankScoreCardProps {}

export function AgencyRankScoreCard(props: AgencyRankScoreCardProps) {
  return <DashboardRankScoreCard {...props} />;
}
