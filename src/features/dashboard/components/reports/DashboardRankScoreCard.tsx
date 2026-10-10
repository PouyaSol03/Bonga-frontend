import { RouteLink } from "../../../../shared/navigation/RouteLink";
import { Typography } from "../../../../shared/ui/Typography";
import { DashboardChartEmptyState } from "./DashboardChartEmptyState";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearChartDown from "../../../../shared/icons/LinearChartDown";
import LinearChartUp from "../../../../shared/icons/LinearChartUp";
import LinearRanking from "../../../../shared/icons/LinearRanking";
import LinearStar from "../../../../shared/icons/LinearStar";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";
import type { DashboardRole } from "../DashboardQuickAccessGrid";
import {
  getAgencyRankingLevel,
  getConsultantRankingLevel,
} from "../../utils/rankingLevels";

export interface DashboardRankScoreCardProps {
  role?: DashboardRole;
  rank?: number;
  score?: number;
  deltaRank?: number;
  pointsNeeded?: number;
  targetRank?: number;
  badgeName?: string;
  badgesTo?: string;
  title?: string;
}

export function DashboardRankScoreCard({
  role = "REAL_ESTATE_CONSULTANT",
  rank,
  score,
  deltaRank = 0,
  pointsNeeded,
  targetRank,
  badgeName,
  badgesTo = "/account/dashboard/ranking",
  title,
}: DashboardRankScoreCardProps) {
  const isManager = role === "REAL_ESTATE_MANAGER";
  const levelAsset = isManager
    ? getAgencyRankingLevel({ score, levelTitle: badgeName })
    : getConsultantRankingLevel({ score, levelTitle: badgeName });

  const displayTitle =
    title ?? (isManager ? "رتبه و امتیاز آژانس" : "رتبه و امتیاز من");
  const displayBadgeName = badgeName ?? levelAsset.title;
  const entityLabel = isManager ? "آژانس" : "مشاور";
  const centerImage = levelAsset.image;

  const isRankImproved = deltaRank >= 0;
  const DeltaIcon = isRankImproved ? LinearChartUp : LinearChartDown;

  if (rank === undefined && score === undefined) {
    return (
      <section className="w-full bg-surface-container-lowest p-4 pb-3 [direction:rtl]">
        <div className="flex items-center justify-between">
          <Typography
            as="h2"
            variant="title"
            size="small"
            weight="semibold"
            className="text-on-surface font-bold"
          >
            {displayTitle}
          </Typography>
        </div>
        <DashboardChartEmptyState
          title="اطلاعات رتبه و امتیاز در دسترس نیست"
          description="با فعالیت و ثبت معاملات در سامانه بونگا، امتیاز و رتبه شما محاسبه خواهد شد."
        />
      </section>
    );
  }

  return (
    <section className="w-full bg-surface-container-lowest p-4 pb-3 [direction:rtl]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="semibold"
          className="text-on-surface"
        >
          {displayTitle}
        </Typography>
        <RouteLink
          className="flex items-center gap-1 text-primary"
          to={badgesTo}
        >
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-primary text-xs"
          >
            صفحه نشان‌ها
          </Typography>
          <LinearArrowLeft1 className="h-3.5 w-3.5 text-primary" />
        </RouteLink>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Card 1: Rank */}
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-surface-container-low bg-surface-container-lowest p-2">
          <LinearRanking className="h-5 w-5 text-primary" innerColor="currentColor" />
          <Typography
            as="span"
            variant="title"
            size="large"
            weight="semibold"
            className="mt-1 text-tertiary"
          >
            {rank !== undefined ? toPersianNumber(rank) : "—"}
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="medium"
            className="text-on-surface-var"
          >
            رتبه
          </Typography>
        </div>

        {/* Card 2: Center Badge Graphic - No border */}
        <div className="flex flex-col items-center justify-between rounded-[12px] bg-surface-container-lowest p-2">
          <img
            src={centerImage}
            alt="رتبه و سطح"
            className="h-10 w-auto object-contain my-auto"
          />
          <span className="mt-1 inline-block w-full rounded-full bg-primary-container px-1.5 py-0.5 text-center">
            <Typography
              as="span"
              variant="label"
              size="small"
              weight="semibold"
              className="text-primary text-[10px] line-clamp-1"
            >
              {displayBadgeName}
            </Typography>
          </span>
        </div>

        {/* Card 3: Score */}
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-surface-container-low bg-surface-container-lowest p-2">
          <LinearStar className="h-5 w-5 text-warning" innerColor="currentColor" />
          <Typography
            as="span"
            variant="title"
            size="large"
            weight="semibold"
            className="mt-1 text-tertiary"
          >
            {score !== undefined ? toPersianNumber(score) : "—"}
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="medium"
            className="text-on-surface-var"
          >
            امتیاز
          </Typography>
        </div>
      </div>

      {/* Delta Stat - Centered */}
      {deltaRank !== 0 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          <DeltaIcon
            className={`h-4 w-4 shrink-0 ${isRankImproved ? "text-tertiary" : "text-error"}`}
          />
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="medium"
            className={isRankImproved ? "text-tertiary font-bold" : "text-error font-bold"}
          >
            {toPersianNumber(Math.abs(deltaRank))}
          </Typography>
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="medium"
            className="text-on-surface-var"
          >
            رتبه نسبت به ماه گذشته
          </Typography>
        </div>
      )}

      {/* Dual Tone Progress Bar */}
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-container-high">
        <div className="h-full w-[65%] rounded-full bg-primary" />
      </div>

      {/* Target points note - Centered, body small medium, flush bottom */}
      {pointsNeeded !== undefined && targetRank !== undefined && (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="medium"
          className="mt-2 text-center text-primary mb-0"
        >
          برای ورود به {toPersianNumber(targetRank)} {entityLabel} برتر به{" "}
          {toPersianNumber(pointsNeeded)} امتیاز نیاز دارید
        </Typography>
      )}
    </section>
  );
}
