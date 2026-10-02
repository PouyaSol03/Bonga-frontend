import {
  DashboardBadgeBanner,
  type DashboardBadgeBannerProps,
} from "../../components/DashboardBadgeBanner";
import { getAgencyRankingLevel } from "../../utils/rankingLevels";

export interface AgencyBadgeBannerProps extends DashboardBadgeBannerProps {}

export function AgencyBadgeBanner(props: AgencyBadgeBannerProps) {
  const level = getAgencyRankingLevel({ levelTitle: props.badgeName });
  return (
    <DashboardBadgeBanner
      categoryLabel="سطح آژانس"
      badgeName={props.badgeName ?? level.title}
      imageSrc={props.imageSrc ?? level.image}
      to="/account/dashboard/ranking"
      {...props}
    />
  );
}
