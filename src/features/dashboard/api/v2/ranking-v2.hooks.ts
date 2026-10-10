import { useQuery } from "@tanstack/react-query";
import {
  getV2RankingBadges,
  getV2RankingLeaderboard,
  getV2RankingProgress,
  getV2RankingSummary,
} from "./ranking-v2.service";

export const rankingV2QueryKeys = {
  all: ["ranking-v2"] as const,
  summary: (period: "week" | "month") => [...rankingV2QueryKeys.all, "summary", period] as const,
  leaderboard: (limit: number) => [...rankingV2QueryKeys.all, "leaderboard", limit] as const,
  progress: (period: string) => [...rankingV2QueryKeys.all, "progress", period] as const,
  badges: () => [...rankingV2QueryKeys.all, "badges"] as const,
};

export function useV2RankingSummaryQuery(period: "week" | "month" = "month") {
  return useQuery({
    queryKey: rankingV2QueryKeys.summary(period),
    queryFn: () => getV2RankingSummary(period),
  });
}

export function useV2RankingLeaderboardQuery(limit = 10) {
  return useQuery({
    queryKey: rankingV2QueryKeys.leaderboard(limit),
    queryFn: () => getV2RankingLeaderboard(limit),
  });
}

export function useV2RankingProgressQuery(period = "12m") {
  return useQuery({
    queryKey: rankingV2QueryKeys.progress(period),
    queryFn: () => getV2RankingProgress(period),
  });
}

export function useV2RankingBadgesQuery() {
  return useQuery({
    queryKey: rankingV2QueryKeys.badges(),
    queryFn: getV2RankingBadges,
  });
}
