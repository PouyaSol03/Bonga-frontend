import LinearRanking from "../../../../../shared/icons/LinearRanking";
import LinearStar from "../../../../../shared/icons/LinearStar";
import { Typography } from "../../../../../shared/ui/Typography";
import { toPersianNumber } from "../../../../../shared/lib/numberUtils";
import type { RankingLevel } from "../../../utils/rankingLevels";

export function ConsultantRankingsRow({
  rankingScore,
  rankingLevel,
  rank,
}: {
  rankingScore: number;
  rankingLevel: RankingLevel;
  rank?: number | null;
}) {
  return (
    <div className="bg-surface-container-lowest w-full px-4 py-3">
      <div className="grid grid-cols-3 gap-2.5">
        <article className="border-outline-var/40 bg-surface-container-lowest flex h-[119px] flex-col items-center justify-between rounded-2xl border p-3">
          <LinearRanking className="text-primary h-6 w-6" innerColor="currentColor" />
          <Typography
            as="span"
            variant="title"
            size="large"
            weight="semibold"
            className="text-tertiary"
          >
            {rank !== undefined && rank !== null ? toPersianNumber(rank) : "—"}
          </Typography>
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-outline"
          >
            رتبه
          </Typography>
        </article>

        <article className="flex h-[119px] flex-col items-center justify-between p-2.5">
          <img
            src={rankingLevel.image}
            alt={rankingLevel.title}
            className="h-16 w-auto max-w-[54px] object-contain"
          />
          <span className="bg-primary/12 text-primary inline-flex h-6 items-center justify-center rounded-full px-2.5 text-xs font-semibold">
            {rankingLevel.title}
          </span>
        </article>

        <article className="border-outline-var/40 bg-surface-container-lowest flex h-[119px] flex-col items-center justify-between rounded-2xl border p-3">
          <LinearStar className="text-warning h-6 w-6" innerColor="currentColor" />
          <Typography
            as="span"
            variant="title"
            size="large"
            weight="semibold"
            className="text-tertiary"
          >
            {toPersianNumber(rankingScore)}
          </Typography>
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-outline"
          >
            امتیاز
          </Typography>
        </article>
      </div>
    </div>
  );
}
