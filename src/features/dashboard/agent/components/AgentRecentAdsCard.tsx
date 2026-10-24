import {
  DashboardRecentAdsCard,
  type DashboardRecentAdItem,
} from "../../components/DashboardRecentAdsCard";

type AgentRecentAdItem = DashboardRecentAdItem;

interface AgentRecentAdsCardProps {
  ad?: AgentRecentAdItem;
  viewAllTo?: string;
}

export function AgentRecentAdsCard(props: AgentRecentAdsCardProps) {
  return <DashboardRecentAdsCard {...props} />;
}
