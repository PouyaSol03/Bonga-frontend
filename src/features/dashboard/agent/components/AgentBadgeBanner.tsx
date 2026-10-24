import {
  DashboardBadgeBanner,
  type DashboardBadgeBannerProps,
} from "../../components/DashboardBadgeBanner";

interface AgentBadgeBannerProps extends DashboardBadgeBannerProps {}

export function AgentBadgeBanner(props: AgentBadgeBannerProps) {
  return <DashboardBadgeBanner {...props} />;
}
