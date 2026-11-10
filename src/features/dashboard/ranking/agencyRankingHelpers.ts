import LinearClockAlarm from "../../../shared/icons/LinearClockAlarm";
import LinearLike from "../../../shared/icons/LinearLike";
import LinearPercenTeam from "../../../shared/icons/LinearPercenTeam";
import type { AgencyIndicator } from "./RankingIndicatorsPanel";
import type { V2LeaderboardItem, V2RankingSummary } from "../api/v2/ranking-v2.service";

export function formatOptionalNumber(value: number | null | undefined) {
  return value === null || value === undefined
    ? "—"
    : new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(value);
}

export function mapLeaderboard(
  rawLeaderboard?: V2LeaderboardItem[],
  fallbackEntities?: V2RankingSummary["topEntities"],
) {
  if (!rawLeaderboard) {
    return fallbackEntities ?? [];
  }

  return rawLeaderboard.map((item: V2LeaderboardItem, idx: number) => {
    const name = item.agency_name || item.agent_name || item.name || `آژانس ${idx + 1}`;
    const score = item.score ?? item.total_score ?? item.totalScore ?? 0;
    const rank = item.rank ?? idx + 1;
    const entityId = String(item.agency_id || item.agent_id || idx);

    return {
      entityId,
      levelSlug: item.level_slug || "",
      levelTitle: item.level_title || "",
      name,
      rank,
      totalScore: score,
    };
  });
}

export function buildAgencyIndicators(
  rawMetrics?: Record<string, number>,
  workSummary?: V2RankingSummary["workSummary"],
): AgencyIndicator[] {
  return [
    {
      Icon: LinearClockAlarm,
      id: "published-ads",
      label: "آگهی‌های منتشرشده",
      value: formatOptionalNumber(rawMetrics?.published_ads ?? workSummary?.publishedAdvertises),
    },
    {
      Icon: LinearPercenTeam,
      id: "active-consultants",
      label: "مشاوران دارای فعالیت",
      value: formatOptionalNumber(rawMetrics?.active_consultants ?? workSummary?.activeConsultants),
    },
    {
      Icon: LinearLike,
      id: "renewed-ads",
      label: "بروزرسانی آگهی‌ها",
      value: formatOptionalNumber(rawMetrics?.updated_ads ?? workSummary?.renewedAdvertises),
    },
    {
      Icon: LinearPercenTeam,
      id: "special-ads",
      label: "آگهی‌های ویژه",
      value: formatOptionalNumber(rawMetrics?.special_ads ?? workSummary?.specialAdvertises),
    },
  ];
}
