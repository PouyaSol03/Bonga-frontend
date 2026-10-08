import { apiV2 } from "../../../../shared/api/api";
import type { DashboardRankingEntity } from "../dashboard.service";

export interface V2RankingSummary {
  current?: {
    totalScore?: number;
    total_score?: number;
    levelTitle?: string;
    level_title?: string;
    levelSlug?: string;
    level_slug?: string;
    rank?: number | null;
  };
  rank?: number | null;
  top_agencies?: unknown[];
  topEntities?: DashboardRankingEntity[];
}

export interface V2LeaderboardItem {
  agency_id?: string | number;
  agency_name?: string;
  agent_id?: string | number;
  agent_name?: string;
  name?: string;
  logo?: string | null;
  rank?: number;
  score?: number;
  total_score?: number;
  totalScore?: number;
  level_slug?: string;
  level_title?: string;
}

export interface V2RankingProgressPoint {
  month?: string;
  score?: number;
  level_slug?: string;
}

export interface V2RankingBadge {
  id: string | number;
  title?: string;
  label?: string;
  name?: string;
  slug?: string;
  status?: string;
  is_earned?: boolean;
  earned?: boolean;
  image?: string;
  src?: string;
  progress?: number;
  progress_value?: number;
}

export const getV2RankingSummary = () =>
  apiV2.get("ranking").json<{ status?: boolean; ranking?: V2RankingSummary; data?: V2RankingSummary }>();

export const getV2RankingLeaderboard = (limit = 10) =>
  apiV2.get("ranking/leaderboard", { searchParams: { limit } }).json<{ status?: boolean; data?: V2LeaderboardItem[]; list?: V2LeaderboardItem[] }>();

export const getV2RankingProgress = (period = "12m") =>
  apiV2.get("ranking/progress", { searchParams: { period } }).json<{ status?: boolean; data?: V2RankingProgressPoint[]; points?: V2RankingProgressPoint[] }>();

export const getV2RankingBadges = () =>
  apiV2.get("ranking/badges").json<{ status?: boolean; badges?: V2RankingBadge[]; data?: V2RankingBadge[] }>();
