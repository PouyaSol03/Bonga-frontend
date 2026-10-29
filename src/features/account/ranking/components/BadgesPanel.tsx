import { Link } from "react-router";
import LinearStar from "../../../../shared/icons/LinearStar";
import { Typography } from "../../../../shared/ui/Typography";
import { useV2RankingBadgesQuery } from "../../../dashboard/api/v2/ranking-v2.hooks";
import type { V2RankingBadge } from "../../../dashboard/api/v2/ranking-v2.service";
import { BADGE_IMAGES } from "../../../dashboard/ranking/AgencyBadgesPanel";
import { slugToConsultantPath } from "../rankingHelpers";
import { SectionHeader } from "./GuidePill";

export function BadgeCard({ badge }: { badge: V2RankingBadge }) {
  const isEarned = Boolean(
    badge.earned ??
    badge.is_earned ??
    (badge.level && badge.level > 0) ??
    badge.status === "earned",
  );
  const levelCount = Number(badge.level ?? (isEarned ? 1 : 0));
  const progressVal = Math.max(
    0,
    Math.min(100, Number(badge.progress ?? badge.progress_value ?? 0)),
  );
  const slug = typeof badge.slug === "string" ? badge.slug.trim().toLowerCase() : "";
  const badgeSrc = badge.src || badge.image || (slug ? BADGE_IMAGES[slug] : undefined);
  const title = badge.title || badge.label || badge.name || "نشان";
  const detailPath = slugToConsultantPath[slug] || `/account/ranking/badges/${slug || badge.id}`;

  return (
    <Link
      aria-label={`جزییات نشان ${title}`}
      className={`border-outline-var flex h-[186px] w-full flex-col items-center rounded-lg border pt-6 text-inherit no-underline transition active:scale-[0.99] ${!isEarned ? "grayscale" : ""}`}
      to={detailPath}
    >
      {badgeSrc ? (
        <img alt="" className="h-[72px] w-[72px] object-contain" src={badgeSrc} />
      ) : (
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="bg-surface-container text-outline grid h-[72px] w-[72px] place-items-center rounded-full"
        >
          <LinearStar className="h-8 w-8" />
        </Typography>
      )}
      <Typography
        as="span"
        variant="label"
        size="medium"
        weight="semibold"
        className={`mt-2 inline-flex h-6 min-w-[92px] items-center justify-center rounded-lg px-2 text-sm font-semibold ${isEarned ? "bg-primary-container text-primary" : "bg-surface-container-high text-outline"}`}
      >
        {title}
      </Typography>
      <div className="mt-0.5 flex h-3 items-center justify-center">
        {[0, 1, 2].map((star) => (
          <LinearStar
            className={`h-3 w-3 ${star < levelCount ? "text-warning" : "text-outline-var"}`}
            key={star}
          />
        ))}
      </div>
      <div className="bg-warning-container/30 mt-4 h-1 w-[92px] rounded-full">
        <div className="bg-warning h-1 rounded-full" style={{ width: `${progressVal}%` }} />
      </div>
    </Link>
  );
}

export function BadgesPanel() {
  const { data, isError, isLoading } = useV2RankingBadgesQuery();
  const rawBadges: V2RankingBadge[] =
    data?.badges ?? data?.data ?? (Array.isArray(data) ? data : []);

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-4" aria-label="نشان‌ها">
      <SectionHeader title="نشان‌ها" />
      {isLoading ? (
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
      {isError ? (
        <div className="text-outline py-8 text-center text-sm">خطا در دریافت نشان‌ها</div>
      ) : null}
      {!isLoading && !isError && rawBadges.length === 0 ? (
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
        {!isLoading &&
          !isError &&
          rawBadges.map((badge, index) => (
            <BadgeCard badge={badge} key={`${badge.slug ?? badge.id ?? index}`} />
          ))}
      </div>
    </section>
  );
}
