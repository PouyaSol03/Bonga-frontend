import {
  DashboardPublishedAdsPieCard,
  type DashboardPublishedAdsPieCardProps,
} from "../../components/reports/DashboardPublishedAdsPieCard";

export interface AgentPublishedAdsPieCardProps
  extends DashboardPublishedAdsPieCardProps {}

export function AgentPublishedAdsPieCard(props: AgentPublishedAdsPieCardProps) {
  return <DashboardPublishedAdsPieCard role="REAL_ESTATE_CONSULTANT" {...props} />;
}
