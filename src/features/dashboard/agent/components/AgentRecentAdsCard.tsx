import {
  DashboardRecentAdsCard,
  type DashboardRecentAdItem,
} from "../../components/DashboardRecentAdsCard";

export type AgentRecentAdItem = DashboardRecentAdItem;

export interface AgentRecentAdsCardProps {
  ad?: AgentRecentAdItem;
  viewAllTo?: string;
}

export function AgentRecentAdsCard(props: AgentRecentAdsCardProps) {
  return <DashboardRecentAdsCard {...props} />;
}

