import type { RankingLevel } from "../../../utils/rankingLevels";
import type { TeamConsultant } from "../teamTypes";
import { ConsultantRankingsRow } from "./ConsultantRankingsRow";
import { ConsultantActivityCard } from "./ConsultantActivityCard";
import { ConsultantQuotasCard } from "./ConsultantQuotasCard";

export function ConsultantInfoTab({
  consultant,
  rankingLevel,
}: {
  consultant: TeamConsultant;
  rankingLevel: RankingLevel;
}) {
  return (
    <div className="space-y-2.5">
      <ConsultantRankingsRow
        rankingScore={consultant.rankingScore ?? 0}
        rankingLevel={rankingLevel}
        rank={consultant.metrics?.rank}
      />
      <ConsultantActivityCard
        activeAds={consultant.metrics?.activeAds ?? consultant.scores.ads ?? 0}
        activeRequests={consultant.metrics?.activeRequest ?? consultant.metrics?.calls}
        recentAds={consultant.metrics?.recentAds}
        views={consultant.metrics?.views}
        calls={consultant.metrics?.calls}
      />
      <ConsultantQuotasCard consultant={consultant} />
    </div>
  );
}
