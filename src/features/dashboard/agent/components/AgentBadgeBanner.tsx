import {
  DashboardBadgeBanner,
  type DashboardBadgeBannerProps,
} from "../../components/DashboardBadgeBanner";

export interface AgentBadgeBannerProps extends DashboardBadgeBannerProps {}

export function AgentBadgeBanner(props: AgentBadgeBannerProps) {
  return <DashboardBadgeBanner {...props} />;
}
