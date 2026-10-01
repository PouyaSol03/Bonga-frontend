import {
  DashboardRankScoreCard,
  type DashboardRankScoreCardProps,
} from "../../components/reports/DashboardRankScoreCard";

export interface AgencyRankScoreCardProps extends DashboardRankScoreCardProps {}

export function AgencyRankScoreCard(props: AgencyRankScoreCardProps) {
  return <DashboardRankScoreCard {...props} />;
}
