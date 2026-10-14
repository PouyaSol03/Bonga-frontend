import LinearStar from "../../../shared/icons/LinearStar";
import { Link } from "react-router";
import { Typography } from "../../../shared/ui/Typography";
import { SectionHeader } from "./RankingSharedComponents";
import { useV2RankingBadgesQuery } from "../api/v2/ranking-v2.hooks";
import type { V2RankingBadge } from "../api/v2/ranking-v2.service";

const DASHBOARD_BADGES_GUIDE_PATH = "/account/dashboard/ranking/badges";

export const BADGE_IMAGES: Record<string, string> = {
  file_maker: "/vectors/badges/badge-bookmark.webp",
  file: "/vectors/badges/badge-bookmark.webp",
  "record-holder": "/vectors/badges/badge-bookmark.webp",
  market_magnet: "/vectors/badges/badge-cup.webp",
  magnet: "/vectors/badges/badge-cup.webp",
  "golden-team": "/vectors/badges/badge-cup.webp",
  always_active: "/vectors/badges/badge-chat.webp",
  time: "/vectors/badges/badge-chat.webp",
  "fast-team": "/vectors/badges/badge-chat.webp",
  popular: "/vectors/badges/badge-first.webp",
  response: "/vectors/badges/badge-first.webp",
};

const slugToDashboardPath: Record<string, string> = {
  file_maker: "/account/dashboard/ranking/badges/record-holder",
  file: "/account/dashboard/ranking/badges/record-holder",
  "record-holder": "/account/dashboard/ranking/badges/record-holder",
  market_magnet: "/account/dashboard/ranking/badges/golden-team",
  magnet: "/account/dashboard/ranking/badges/golden-team",
  "golden-team": "/account/dashboard/ranking/badges/golden-team",
  always_active: "/account/dashboard/ranking/badges/fast-team",
  time: "/account/dashboard/ranking/badges/fast-team",
  "fast-team": "/account/dashboard/ranking/badges/fast-team",
  popular: "/account/dashboard/ranking/badges/popular",
};

interface AgencyBadge {
  ariaLabel: string;
  detailPath: string;
  id: string;
  label: string;
  level: number;
  progress: number;
  src?: string;
  stars: number;
  tone: "active" | "locked";
}

export function AgencyBadgesPanel() {
  const v2BadgesQuery = useV2RankingBadgesQuery();
  const rawBadges: V2RankingBadge[] = v2BadgesQuery.data?.badges ?? v2BadgesQuery.data?.data ?? [];

  const badges: AgencyBadge[] = rawBadges.map((item: V2RankingBadge, index: number) => {
    const isEarned = Boolean(
      item.is_earned ?? item.earned ?? (item.level && item.level > 0) ?? item.status === "earned",
    );
    const progressVal = Number(item.progress ?? item.progress_value ?? 0);
    const slug = typeof item.slug === "string" ? item.slug.trim().toLowerCase() : "";
    const resolvedSrc = item.src || item.image || (slug ? BADGE_IMAGES[slug] : undefined);
    const detailPath =
      slugToDashboardPath[slug] || `/account/dashboard/ranking/badges/${slug || item.id || index}`;

    return {
      ariaLabel: item.title || item.label || item.name || `نشان ${index + 1}`,
      detailPath,
      id: String(item.id || slug || index),
      label: item.title || item.label || item.name || "نشان",
      level: Number(item.level ?? (isEarned ? 1 : 0)),
      progress: Math.max(0, Math.min(100, progressVal)),
      src: resolvedSrc,
      stars: 3,
      tone: isEarned ? "active" : "locked",
    };
  });

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-4" aria-label="نشان‌ها">
      <SectionHeader guideTo={DASHBOARD_BADGES_GUIDE_PATH} title="نشان‌ها" />
      {v2BadgesQuery.isLoading ? (
        <div className="mt-6 grid animate-pulse grid-cols-2 gap-4 [direction:ltr]">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="border-outline-var bg-surface-container-lowest flex h-[186px] w-full flex-col items-center rounded-lg border pt-6"
            >
              <div className="bg-surface-container-high h-[72px] w-[72px] rounded-full" />
              <div className="bg-surface-container-high mt-2 h-6 w-20 rounded" />
              <div className="bg-surface-container-high mt-2 h-3 w-14 rounded" />
              <div className="bg-surface-container-high mt-4 h-1 w-[92px] rounded-full" />
            </div>
          ))}
        </div>
      ) : null}
      {!v2BadgesQuery.isLoading && badges.length === 0 ? (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-outline m-0 mx-auto w-full py-8 text-center"
        >
          نشانی از سرور دریافت نشده است.
        </Typography>
      ) : null}
      <div className="mt-6 grid grid-cols-2 gap-4 [direction:ltr]">
        {badges.map((badge) => (
          <BadgeCard badge={badge} key={badge.id} />
        ))}
      </div>
    </section>
  );
}

function BadgeCard({ badge }: { badge: AgencyBadge }) {
  const isActive = badge.tone === "active";
  const className = `flex h-[186px] w-full flex-col items-center rounded-lg border border-outline-var bg-surface-container-lowest pt-6 text-inherit no-underline transition active:scale-[0.99] focus-visible:outline-3 focus-visible:outline-primary/40 ${!isActive ? "grayscale" : ""}`;

  return (
    <Link aria-label={badge.ariaLabel} className={className} to={badge.detailPath}>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`grid h-[72px] w-[72px] place-items-center ${isActive ? "text-warning" : "text-outline"}`}
      >
        {badge.src ? (
          <img src={badge.src} className="h-full w-full object-contain" alt="" />
        ) : (
          <LinearStar className="h-10 w-10" innerColor="currentColor" />
        )}
      </Typography>

      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="semibold"
        className={`mt-2 inline-flex h-6 min-w-[92px] items-center justify-center rounded-lg px-2 text-sm leading-5 font-semibold ${
          isActive ? "bg-primary-container text-primary" : "bg-surface-container text-outline"
        }`}
      >
        {badge.label}
      </Typography>

      <div className="mt-0.5 flex h-3 items-center justify-center [direction:ltr]">
        {[0, 1, 2].map((star) => (
          <LinearStar
            className={`h-3 w-3 ${star < badge.level ? "text-warning" : "text-outline"}`}
            innerColor="currentColor"
            key={star}
          />
        ))}
      </div>

      <div className="bg-warning-container/30 mt-4 h-1 w-[92px] rounded-full">
        <div className="bg-warning h-1 rounded-full" style={{ width: `${badge.progress}%` }} />
      </div>
    </Link>
  );
}
