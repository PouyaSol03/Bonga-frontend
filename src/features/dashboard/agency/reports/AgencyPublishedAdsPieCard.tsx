import {
  DashboardPublishedAdsPieCard,
  type DashboardPublishedAdsPieCardProps,
} from "../../components/reports/DashboardPublishedAdsPieCard";

export interface AgencyPublishedAdsPieCardProps
  extends DashboardPublishedAdsPieCardProps {}

export function AgencyPublishedAdsPieCard(props: AgencyPublishedAdsPieCardProps) {
  return <DashboardPublishedAdsPieCard role="REAL_ESTATE_MANAGER" {...props} />;
}
