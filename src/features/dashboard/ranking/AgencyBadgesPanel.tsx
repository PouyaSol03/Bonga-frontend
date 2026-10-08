import LinearStar from "../../../shared/icons/LinearStar";
import { RouteLink } from "../../../shared/navigation/RouteLink";
import { Button } from "../../../shared/ui/Button";
import { Typography } from "../../../shared/ui/Typography";
import { SectionHeader } from "./RankingSharedComponents";
import { useV2RankingBadgesQuery } from "../api/v2/ranking-v2.hooks";

import type { V2RankingBadge } from "../api/v2/ranking-v2.service";

const DASHBOARD_BADGES_GUIDE_PATH = "/account/dashboard/ranking/badges";

interface AgencyBadge {
  ariaLabel: string;
  detailPath: string;
  id: string;
  label: string;
  progress: number;
  src?: string;
  stars: number;
  tone: "active" | "locked";
}

export function AgencyBadgesPanel() {
  const v2BadgesQuery = useV2RankingBadgesQuery();
  const rawBadges: V2RankingBadge[] = v2BadgesQuery.data?.badges ?? v2BadgesQuery.data?.data ?? [];

  const badges: AgencyBadge[] = rawBadges.map((item: V2RankingBadge, index: number) => {
    const isEarned = Boolean(item.is_earned ?? item.earned ?? item.status === "earned");
    const progressVal = Number(item.progress ?? item.progress_value ?? 0);
    return {
      ariaLabel: item.title || item.label || item.name || `نشان ${index + 1}`,
      detailPath: `/account/dashboard/ranking/badges/${item.slug || item.id}`,
      id: String(item.id || item.slug || index),
      label: item.title || item.label || item.name || "نشان",
      progress: Math.max(0, Math.min(100, progressVal)),
      src: item.src || item.image,
      stars: 3,
      tone: isEarned ? "active" : "locked",
    };
  });

  return (
    <section className="rounded-2xl bg-surface-container-lowest p-4" aria-label="نشان‌ها">
      <SectionHeader guideTo={DASHBOARD_BADGES_GUIDE_PATH} title="نشان‌ها" />
      {v2BadgesQuery.isLoading ? (
        <Typography as="p" variant="body" size="small" weight="regular" className="m-0 py-8 text-center text-outline">
          در حال دریافت نشان‌ها...
        </Typography>
      ) : null}
      {!v2BadgesQuery.isLoading && badges.length === 0 ? (
        <Typography as="p" variant="body" size="small" weight="regular" className="mx-auto m-0 w-full py-8 text-center text-outline">
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
  const className = `flex h-[186px] flex-col items-center rounded-lg border border-outline-var bg-surface-container-lowest pt-6 text-inherit no-underline transition active:scale-[0.99] focus-visible:outline-3 focus-visible:outline-primary/40 ${!isActive ? "grayscale" : ""}`;

  const content = (
    <>
      <Typography as="span" variant="body" size="medium" weight="regular"
        className={`grid h-[72px] w-[72px] place-items-center ${isActive ? "text-warning" : "text-outline"}`}
      >
        {badge.src ? (
          <img src={badge.src} className="h-full w-full object-contain" alt="" />
        ) : (
          <LinearStar className="h-10 w-10" innerColor="currentColor" />
        )}
      </Typography>

      <Typography as="span" variant="label" size="medium" weight="semibold"
        className={`mt-2 inline-flex h-6 min-w-[92px] items-center justify-center rounded-lg px-2 text-sm font-semibold leading-5 ${
          isActive ? "bg-primary-container text-primary" : "bg-surface-container text-outline"
        }`}
      >
        {badge.label}
      </Typography>

      <div className="mt-0.5 flex h-3 items-center justify-center [direction:ltr]">
        {[0, 1, 2].map((star) => (
          <LinearStar
            className={`h-3 w-3 ${isActive && star === 0 ? "text-warning" : "text-outline"}`}
            innerColor="currentColor"
            key={star}
          />
        ))}
      </div>

      <div className="mt-4 h-1 w-[92px] rounded-full bg-warning-container/30">
        <div
          className="h-1 rounded-full bg-warning"
          style={{ width: `${badge.progress}%` }}
        />
      </div>
    </>
  );

  if (isActive) {
    return (
      <RouteLink aria-label={badge.ariaLabel} className={className} to={badge.detailPath}>
        {content}
      </RouteLink>
    );
  }

  return (
    <Button unstyled aria-disabled="true" aria-label={badge.ariaLabel} className={className} type="button">
      {content}
    </Button>
  );
}
