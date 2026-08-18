import type { BadgeItem } from "../api/account.service";

export type BadgeProgressVariant = "complete" | "current" | "locked";

export type BadgeProgressLevel = {
  done: string;
  total?: string;
  progress: number;
  title: string;
  variant: BadgeProgressVariant;
};

export function badgeProgressNumber(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

export function formatBadgeProgressNumber(value: number) {
  return new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(value);
}

function badgeProgressText(value: unknown) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return "";
}

export function readBadgeLevelCount(badge?: BadgeItem) {
  if (!badge) return 0;
  const level = badgeProgressNumber(badge.level ?? badge.stars ?? badge.star_count);
  return level === null ? 0 : Math.max(0, Math.min(3, Math.floor(level)));
}

function normalizeLevelVariant(value: unknown, progress: number): BadgeProgressVariant {
  const status = badgeProgressText(value).toLowerCase();
  if (["complete", "completed", "done", "active"].includes(status) || progress >= 100) {
    return "complete";
  }
  if (["locked", "inactive", "disabled"].includes(status)) return "locked";
  return "current";
}

export function readBadgeProgressLevels(badge?: BadgeItem): BadgeProgressLevel[] {
  if (!badge) return [];
  const rawLevels = Array.isArray(badge.levels)
    ? badge.levels
    : Array.isArray(badge.badge_levels)
      ? badge.badge_levels
      : [];

  const levels = rawLevels.flatMap((value, index) => {
    if (!value || typeof value !== "object" || Array.isArray(value)) return [];
    const item = value as Record<string, unknown>;
    const progressValue = badgeProgressNumber(item.progress ?? item.percent ?? item.percentage);
    const progress = progressValue === null ? 0 : Math.max(0, Math.min(100, progressValue));
    const done = badgeProgressText(item.done ?? item.current ?? item.value ?? item.completed) || "—";
    const total = badgeProgressText(item.total ?? item.target ?? item.required) || undefined;
    const title =
      badgeProgressText(item.title ?? item.name ?? item.label) ||
      `سطح ${formatBadgeProgressNumber(index + 1)}`;

    return [{
      done,
      progress,
      title,
      total,
      variant: normalizeLevelVariant(item.status ?? item.state, progress),
    } satisfies BadgeProgressLevel];
  });

  if (levels.length > 0) return levels;

  const progressValue = badgeProgressNumber(badge.progress);
  if (progressValue === null) return [];
  const progress = Math.max(0, Math.min(100, progressValue));

  return [{
    done: `${formatBadgeProgressNumber(progress)}٪`,
    progress,
    title: "پیشرفت کلی",
    total: "۱۰۰٪",
    variant: progress >= 100 ? "complete" : "current",
  }];
}
