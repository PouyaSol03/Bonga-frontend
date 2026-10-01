import {
  DashboardRankScoreCard,
  type DashboardRankScoreCardProps,
} from "../../components/reports/DashboardRankScoreCard";

export interface AgentRankScoreCardProps extends DashboardRankScoreCardProps {}

export function AgentRankScoreCard(props: AgentRankScoreCardProps) {
  return <DashboardRankScoreCard {...props} />;
}
