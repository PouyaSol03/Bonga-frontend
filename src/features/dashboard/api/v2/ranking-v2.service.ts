import { apiV2 } from "../../../../shared/api/api";
import type { DashboardRankingEntity } from "../dashboard.service";

export interface V2RankingSummary {
  current?: {
    agency_id?: string | number;
    agent_id?: string | number;
    totalScore?: number;
    total_score?: number;
    levelTitle?: string;
    level_title?: string;
    levelSlug?: string;
    level_slug?: string;
    rank?: number | null;
    raw_metrics?: {
      published_ads?: number | null;
      active_consultants?: number | null;
      updated_ads?: number | null;
      special_ads?: number | null;
      registered_ads?: number | null;
      pending_review_ads?: number | null;
      rejected_ads?: number | null;
      [key: string]: number | null | undefined;
    };
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
  id?: string | number;
  title?: string;
  label?: string;
  name?: string;
  slug?: string;
  status?: string;
  level?: number;
  is_earned?: boolean;
  earned?: boolean;
  image?: string;
  src?: string;
  progress?: number;
  progress_value?: number;
  current_value?: number;
  next_target?: number;
  thresholds?: number[];
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
  const rawMetrics = rankingRecord(current.raw_metrics ?? current.rawMetrics ?? ranking.raw_metrics ?? ranking.rawMetrics);
  const work = rankingRecord(payload.work_summary ?? ranking.work_summary ?? sections["work-summary"] ?? ranking.workSummary);
  const reports = rankingRecord(sections["reports-teaser"]);
  const tasks = rankingRecord(sections.tasks);
  const items = Array.isArray(tasks.items) ? tasks.items.map(rankingRecord) : [];
  const taskCounts = items.flatMap(item => [item, ...(Array.isArray(item.breakdown) ? item.breakdown.map(rankingRecord) : [])]);
  const taskCount = (id: string) => {
    const item = taskCounts.find(item => item.id === id);
    return item?.available === false ? null : rankingCount(item?.count);
  };

  const publishedAds = rankingCount(
    rawMetrics.published_ads ??
    rawMetrics.publishedAds ??
    work.published_advertises ??
    work.publishedAdvertises ??
    reports.published_ads_count
  );

  const activeConsultants = rankingCount(
    rawMetrics.active_consultants ??
    rawMetrics.activeConsultants ??
    work.active_consultants ??
    work.activeConsultants
  );

  const updatedAds = rankingCount(
    rawMetrics.updated_ads ??
    rawMetrics.updatedAds ??
    rawMetrics.renewed_advertises ??
    rawMetrics.renewedAdvertises ??
    work.renewed_advertises ??
    work.renewedAdvertises
  );

  const specialAds = rankingCount(
    rawMetrics.special_ads ??
    rawMetrics.specialAds ??
    work.special_advertises ??
    work.specialAdvertises
  );

  const registeredAds = rankingCount(
    rawMetrics.registered_ads ??
    rawMetrics.registeredAds ??
    work.created_advertises ??
    work.createdAdvertises
  );

  const pendingReviewAds = rankingCount(
    rawMetrics.pending_review_ads ??
    rawMetrics.pendingReviewAds ??
    work.pending_review ??
    work.pendingReview
  ) ?? taskCount("pending_review");

  const rejectedAds = rankingCount(
    rawMetrics.rejected_ads ??
    rawMetrics.rejectedAds ??
    work.rejected
  ) ?? taskCount("rejected");

  return {
    ...ranking as V2RankingSummary,
    current: {
      ...current,
      agency_id: current.agency_id as string | number | undefined,
      agent_id: current.agent_id as string | number | undefined,
      totalScore: rankingCount(current.total_score ?? current.totalScore ?? current.current_score) ?? 0,
      total_score: rankingCount(current.total_score ?? current.totalScore ?? current.current_score) ?? 0,
      levelTitle: typeof (current.level_title ?? current.levelTitle ?? current.badge_title) === "string"
        ? String(current.level_title ?? current.levelTitle ?? current.badge_title) : undefined,
      level_title: typeof (current.level_title ?? current.levelTitle ?? current.badge_title) === "string"
        ? String(current.level_title ?? current.levelTitle ?? current.badge_title) : undefined,
      levelSlug: typeof (current.level_slug ?? current.levelSlug) === "string"
        ? String(current.level_slug ?? current.levelSlug) : undefined,
      level_slug: typeof (current.level_slug ?? current.levelSlug) === "string"
        ? String(current.level_slug ?? current.levelSlug) : undefined,
      rank: rankingCount(ranking.rank ?? current.rank),
      raw_metrics: {
        published_ads: publishedAds,
        active_consultants: activeConsultants,
        updated_ads: updatedAds,
        special_ads: specialAds,
        registered_ads: registeredAds ?? 0,
        pending_review_ads: pendingReviewAds ?? 0,
        rejected_ads: rejectedAds ?? 0,
      },
    },
    rank: rankingCount(ranking.rank ?? current.rank),
    workSummary: {
      publishedAdvertises: publishedAds,
      createdAdvertises: registeredAds,
      pendingReview: pendingReviewAds,
      rejected: rejectedAds,
      activeConsultants,
      renewedAdvertises: updatedAds,
      specialAdvertises: specialAds,
    },
  };
}

export const getV2RankingSummary = async (period: "week" | "month" = "month") => {
  const response = await apiV2.get("ranking", { searchParams: { period } }).json<unknown>();
  const env = rankingRecord(response);
  return {
    status: Boolean(env.status ?? true),
    message: typeof env.message === "string" ? env.message : undefined,
    data: normalizeV2RankingSummary(response),
  };
};

export const getV2RankingLeaderboard = (limit = 10) =>
  apiV2.get("ranking/leaderboard", { searchParams: { limit } }).json<{ status?: boolean; data?: V2LeaderboardItem[]; list?: V2LeaderboardItem[] }>();

export const getV2RankingProgress = (period = "12m") =>
  apiV2.get("ranking/progress", { searchParams: { period } }).json<{ status?: boolean; data?: V2RankingProgressPoint[]; points?: V2RankingProgressPoint[] }>();

export const getV2RankingBadges = () =>
  apiV2.get("ranking/badges").json<{ status?: boolean; badges?: V2RankingBadge[]; data?: V2RankingBadge[] }>();
