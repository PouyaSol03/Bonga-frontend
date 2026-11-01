import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router";
import LinearActivity from "../../../shared/icons/LinearActivity";
import LinearCommentClock from "../../../shared/icons/LinearCommentClock";
import LinearLike from "../../../shared/icons/LinearLike";
import LinearTimeQuarter from "../../../shared/icons/LinearTimeQuarter";
import { getApiErrorMessage } from "../../../shared/api/api";
import type { ToastItem } from "../../../shared/components/Toast";
import { useV2RankingSummaryQuery } from "../../dashboard/api/v2/ranking-v2.hooks";
import {
  formatRankingLevelTitle,
  getConsultantRankingLevel,
} from "../../dashboard/utils/rankingLevels";
import { formatOptionalNumber } from "./rankingHelpers";
import type { RankIndicator, RankingPeriod } from "./types";

export function useConsultantRankingState(explicitBackTo?: string) {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const isFromDashboard =
    searchParams.get("from") === "dashboard" ||
    (location.state as { from?: string } | null)?.from === "dashboard" ||
    (location.state as { from?: string } | null)?.from === "/account/dashboard";

  const resolvedBackTo = explicitBackTo ?? (isFromDashboard ? "/account/dashboard" : "/account");
  const [period, setPeriod] = useState<RankingPeriod>("ماه");
  const rankingQuery = useV2RankingSummaryQuery(period === "هفته" ? "week" : "month");
  const ranking = rankingQuery.data?.data;
  const workSummary = ranking?.workSummary;
  const [toast, setToast] = useState<ToastItem | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (rankingQuery.isError) {
        setToast({
          variant: "error",
          message: getApiErrorMessage(
            rankingQuery.error,
            "دریافت اطلاعات رتبه‌بندی با خطا مواجه شد.",
          ),
          title: "خطا",
        });
      } else if (rankingQuery.isSuccess && rankingQuery.data?.message) {
        setToast({
          variant: "info",
          message: rankingQuery.data.message,
        });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [
    rankingQuery.error,
    rankingQuery.isError,
    rankingQuery.isSuccess,
    rankingQuery.data?.message,
  ]);

  const indicators: RankIndicator[] = [
    {
      icon: <LinearActivity className="h-6 w-6" />,
      label: "آگهی منتشرشده",
      value: formatOptionalNumber(workSummary?.publishedAdvertises),
    },
    {
      icon: <LinearLike className="h-6 w-6" />,
      label: "آگهی ثبت‌شده",
      value: formatOptionalNumber(workSummary?.createdAdvertises),
    },
    {
      icon: <LinearCommentClock className="h-6 w-6" />,
      label: "در انتظار بررسی",
      value: formatOptionalNumber(workSummary?.pendingReview),
    },
    {
      icon: <LinearTimeQuarter className="h-6 w-6" />,
      label: "ردشده",
      value: formatOptionalNumber(workSummary?.rejected),
    },
  ];

  const currentLevel = getConsultantRankingLevel({
    score: ranking?.current?.totalScore,
    levelTitle: ranking?.current?.levelTitle,
    levelSlug: ranking?.current?.levelSlug,
  });

  const displayLevelTitle = formatRankingLevelTitle({
    isAgency: false,
    score: ranking?.current?.totalScore,
    levelTitle: ranking?.current?.levelTitle,
    levelSlug: ranking?.current?.levelSlug,
  });

  return {
    currentLevel,
    displayLevelTitle,
    indicators,
    isFromDashboard,
    period,
    ranking,
    rankingQuery,
    resolvedBackTo,
    setPeriod,
    setToast,
    toast,
  };
}
