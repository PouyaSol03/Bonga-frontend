import LinearRanking from "../../../shared/icons/LinearRanking";
import LinearStar from "../../../shared/icons/LinearStar";
import LinearTag from "../../../shared/icons/LinearTag";
import type { MyAgencyProfile } from "../../account/api/account.service";
import type {
  PublicAgencyDetailDto,
  PublicAgentDetailDto,
} from "../../agencies/api/agency.service";
import type { DashboardOverview } from "../api/dashboard.service";
import { toPersianDigits } from "./profileHelpers";
import { getPreviewSearchParam } from "./urlHelpers";

interface UseAgencyPreviewStatsParams {
  dashboard?: DashboardOverview;
  isAgentPreview: boolean;
  isPublicPreview: boolean;
  profile?: MyAgencyProfile | null;
  publicActiveAds?: number;
  publicAgency?: PublicAgencyDetailDto | null;
  publicAgent?: PublicAgentDetailDto | null;
  publicRank?: number;
  publicScore?: number;
}

export function useAgencyPreviewStats({
  dashboard,
  isAgentPreview,
  isPublicPreview,
  profile,
  publicActiveAds,
  publicAgency,
  publicAgent,
  publicRank,
  publicScore,
}: UseAgencyPreviewStatsParams) {
  const entityLevel = isAgentPreview ? publicAgent?.level_slug : publicAgency?.level_slug;
  const workingHours = isAgentPreview
    ? ""
    : (publicAgency?.working_hours ?? profile?.working_hours ?? "");

  const entityStats = [
    {
      icon: <LinearStar className="h-4 w-4" />,
      label: "امتیاز",
      value: isPublicPreview
        ? toPersianDigits(publicScore ?? null)
        : dashboard
          ? toPersianDigits(dashboard.ranking.current.totalScore)
          : toPersianDigits(getPreviewSearchParam("score") || null),
    },
    {
      icon: <LinearRanking className="h-4 w-4" />,
      label: "رتبه",
      value: isPublicPreview
        ? toPersianDigits(publicRank ?? null)
        : dashboard
          ? toPersianDigits(dashboard.ranking.rank)
          : toPersianDigits(getPreviewSearchParam("rank") || null),
    },
    {
      icon: <LinearTag className="h-4 w-4" />,
      label: "آگهی فعال",
      value: isPublicPreview
        ? toPersianDigits(publicActiveAds ?? null)
        : dashboard
          ? toPersianDigits(dashboard.publishedAdvertises.total)
          : toPersianDigits(getPreviewSearchParam("active_ads") || null),
    },
  ];

  return { entityLevel, entityStats, workingHours };
}
