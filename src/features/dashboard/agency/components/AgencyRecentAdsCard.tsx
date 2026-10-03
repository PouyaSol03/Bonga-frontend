import {
  DashboardRecentAdsCard,
  type DashboardRecentAdsCardProps,
} from "../../components/DashboardRecentAdsCard";

export type AgencyRecentAdsCardProps = DashboardRecentAdsCardProps;

export function AgencyRecentAdsCard({
  title = "آخرین آگهی‌ها آژانس",
  ...props
}: AgencyRecentAdsCardProps) {
  return <DashboardRecentAdsCard title={title} {...props} />;
}


