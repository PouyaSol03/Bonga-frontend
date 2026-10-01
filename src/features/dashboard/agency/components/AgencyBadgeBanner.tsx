import {
  DashboardBadgeBanner,
  type DashboardBadgeBannerProps,
} from "../../components/DashboardBadgeBanner";

export interface AgencyBadgeBannerProps extends DashboardBadgeBannerProps {}

export function AgencyBadgeBanner(props: AgencyBadgeBannerProps) {
  return (
    <DashboardBadgeBanner
      categoryLabel="سطح آژانس"
      badgeName="آژانس تازه‌کار"
      to="/account/dashboard/ranking"
      {...props}
    />
  );
}
