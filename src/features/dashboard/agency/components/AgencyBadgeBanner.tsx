import {
  DashboardBadgeBanner,
  type DashboardBadgeBannerProps,
} from "../../components/DashboardBadgeBanner";

export interface AgencyBadgeBannerProps extends DashboardBadgeBannerProps {}

export function AgencyBadgeBanner(props: AgencyBadgeBannerProps) {
  return (
    <DashboardBadgeBanner
      categoryLabel="نشان آژانس"
      badgeName="آژانس ممتاز"
      to="/account/dashboard/ranking"
      {...props}
    />
  );
}
