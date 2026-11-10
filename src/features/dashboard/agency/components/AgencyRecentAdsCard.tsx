import {
  DashboardRecentAdsCard,
  type DashboardRecentAdsCardProps,
} from "../../components/DashboardRecentAdsCard";

type AgencyRecentAdsCardProps = DashboardRecentAdsCardProps;

export function AgencyRecentAdsCard({
  title = "آخرین آگهی‌ها آژانس",
  ...props
}: AgencyRecentAdsCardProps) {
  return <DashboardRecentAdsCard title={title} {...props} />;
}
