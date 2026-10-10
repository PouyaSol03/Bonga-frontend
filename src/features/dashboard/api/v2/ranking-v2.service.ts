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
  workSummary?: {
    publishedAdvertises: number | null;
    createdAdvertises: number | null;
    pendingReview: number | null;
    rejected: number | null;
    activeConsultants: number | null;
    renewedAdvertises: number | null;
    specialAdvertises: number | null;
  };
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

function rankingRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function rankingCount(value: unknown): number | null {
  if (value === null || value === undefined || (typeof value === "string" && !value.trim())) return null;
  if (typeof value !== "number" && typeof value !== "string") return null;
  const count = Number(value);
  return Number.isFinite(count) ? Math.max(0, count) : null;
}

export function normalizeV2RankingSummary(response: unknown): V2RankingSummary {
  const envelope = rankingRecord(response);
  const payload = rankingRecord(envelope.data ?? envelope.ranking ?? envelope);
  const ranking = rankingRecord(payload.ranking ?? payload);
  const sections = rankingRecord(payload.sections);
  const badge = rankingRecord(sections["ranking-badge"]);
  const current = rankingRecord(ranking.current ?? badge);
  const work = rankingRecord(payload.work_summary ?? ranking.work_summary ?? sections["work-summary"] ?? ranking.workSummary);
  const reports = rankingRecord(sections["reports-teaser"]);
  const tasks = rankingRecord(sections.tasks);
  const items = Array.isArray(tasks.items) ? tasks.items.map(rankingRecord) : [];
  const taskCounts = items.flatMap(item => [item, ...(Array.isArray(item.breakdown) ? item.breakdown.map(rankingRecord) : [])]);
  const taskCount = (id: string) => {
    const item = taskCounts.find(item => item.id === id);
    return item?.available === false ? null : rankingCount(item?.count);
  };

  return {
    ...ranking as V2RankingSummary,
    current: {
      ...current,
      totalScore: rankingCount(current.total_score ?? current.totalScore ?? current.current_score) ?? undefined,
      levelTitle: typeof (current.level_title ?? current.levelTitle ?? current.badge_title) === "string"
        ? String(current.level_title ?? current.levelTitle ?? current.badge_title) : undefined,
      levelSlug: typeof (current.level_slug ?? current.levelSlug) === "string"
        ? String(current.level_slug ?? current.levelSlug) : undefined,
      rank: rankingCount(ranking.rank ?? current.rank),
    },
    rank: rankingCount(ranking.rank ?? current.rank),
    workSummary: {
      publishedAdvertises: rankingCount(work.published_advertises ?? work.publishedAdvertises ?? reports.published_ads_count),
      createdAdvertises: rankingCount(work.created_advertises ?? work.createdAdvertises),
      pendingReview: rankingCount(work.pending_review ?? work.pendingReview) ?? taskCount("pending_review"),
      rejected: rankingCount(work.rejected) ?? taskCount("rejected"),
      activeConsultants: rankingCount(work.active_consultants ?? work.activeConsultants),
      renewedAdvertises: rankingCount(work.renewed_advertises ?? work.renewedAdvertises),
      specialAdvertises: rankingCount(work.special_advertises ?? work.specialAdvertises),
    },
  };
}

export const getV2RankingSummary = async (period: "week" | "month" = "month") => {
  const response = await apiV2.get("ranking", { searchParams: { period } }).json<unknown>();
  return { data: normalizeV2RankingSummary(response) };
};

export const getV2RankingLeaderboard = (limit = 10) =>
  apiV2.get("ranking/leaderboard", { searchParams: { limit } }).json<{ status?: boolean; data?: V2LeaderboardItem[]; list?: V2LeaderboardItem[] }>();

export const getV2RankingProgress = (period = "12m") =>
  apiV2.get("ranking/progress", { searchParams: { period } }).json<{ status?: boolean; data?: V2RankingProgressPoint[]; points?: V2RankingProgressPoint[] }>();

export const getV2RankingBadges = () =>
  apiV2.get("ranking/badges").json<{ status?: boolean; badges?: V2RankingBadge[]; data?: V2RankingBadge[] }>();
