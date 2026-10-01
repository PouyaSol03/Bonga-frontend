import { RouteLink } from "../../../../shared/navigation/RouteLink";
import LinearArrowLeft1 from "../../../../shared/icons/LinearArrowLeft1";
import LinearRanking from "../../../../shared/icons/LinearRanking";
import LinearStar from "../../../../shared/icons/LinearStar";
import { toPersianNumber } from "../../../../shared/lib/numberUtils";

export interface AgentRankScoreCardProps {
  rank?: number;
  score?: number;
  deltaRank?: number;
  pointsNeeded?: number;
  targetRank?: number;
  badgeName?: string;
  badgesTo?: string;
}

export function AgentRankScoreCard({
  rank = 67,
  score = 85,
  deltaRank = 8,
  pointsNeeded = 12,
  targetRank = 50,
  badgeName = "ستاره بی‌رقیب",
  badgesTo = "/account/dashboard/ranking",
}: AgentRankScoreCardProps) {
  return (
    <section className="w-full rounded-[16px] bg-white p-4 shadow-sm [direction:rtl]">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#1A1A1A]">
          رتبه و امتیاز من
        </h2>
        <RouteLink
          className="flex items-center gap-1 text-[12px] font-medium text-[#0048C4] hover:underline"
          to={badgesTo}
        >
          <span>صفحه نشان‌ها</span>
          <LinearArrowLeft1 className="h-3.5 w-3.5" />
        </RouteLink>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Card 1: Rank */}
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#F3F4F6] bg-white p-2">
          <LinearRanking className="h-6 w-6 text-[#0048C4]" />
          <span className="mt-1 text-[16px] font-extrabold text-[#10B981]">
            {toPersianNumber(rank)}
          </span>
          <span className="text-[11px] text-[#757575]">رتبه</span>
        </div>

        {/* Card 2: Badge */}
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#F3F4F6] bg-white p-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FFF9E6]">
            <LinearStar className="h-4 w-4 text-[#FFB100]" />
          </div>
          <span className="mt-1.5 inline-block rounded-full bg-[#E8F0FE] px-1.5 py-0.5 text-[9px] font-semibold text-[#0048C4] line-clamp-1">
            {badgeName}
          </span>
        </div>

        {/* Card 3: Score */}
        <div className="flex flex-col items-center justify-center rounded-[12px] border border-[#F3F4F6] bg-white p-2">
          <LinearStar className="h-6 w-6 text-[#F59E0B]" />
          <span className="mt-1 text-[16px] font-extrabold text-[#1A1A1A]">
            {toPersianNumber(score)}
          </span>
          <span className="text-[11px] text-[#757575]">امتیاز</span>
        </div>
      </div>

      {/* Delta indicator */}
      <div className="mt-3 flex items-center justify-center gap-1 text-xs text-[#10B981]">
        <span>{toPersianNumber(deltaRank)} رتبه نسبت به ماه گذشته</span>
        <span>↗</span>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
        <div
          className="h-full rounded-full bg-[#0048C4]"
          style={{ width: "70%" }}
        />
      </div>

      {/* Target hint */}
      <p className="mt-2 text-center text-[11px] text-[#0048C4]">
        برای ورود به {toPersianNumber(targetRank)} مشاور برتر به{" "}
        {toPersianNumber(pointsNeeded)} امتیاز نیاز دارید
      </p>
    </section>
  );
}
