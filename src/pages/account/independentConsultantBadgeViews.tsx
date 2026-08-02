import { PageFrame } from "../../app/layout/PageFrame";
import { TopBar } from "../../shared/components/TopBar";
import { Typography } from "../../shared/ui/Typography";
import { useMyBadgesQuery } from "../../core/hooks/account.hooks";
import {
  badgeProgressNumber,
  formatBadgeProgressNumber,
  readBadgeLevelCount,
  readBadgeProgressLevels,
  type BadgeProgressLevel,
} from "../../shared/utils/badgeProgress";

type BadgeKey = "file" | "magnet" | "response" | "time";

type BadgeDefinition = {
  image: string;
  name: string;
};

const badgeDefinitions: Record<BadgeKey, BadgeDefinition> = {
  file: {
    image: "/figma/account/ranking-badge-detail-file.png",
    name: "فایل ساز",
  },
  magnet: {
    image: "/figma/account/ranking-badge-detail-magnet.png",
    name: "مغناطیس بازار",
  },
  response: {
    image: "/figma/account/ranking-badge-detail-response.png",
    name: "ساعقه پاسخ",
  },
  time: {
    image: "/figma/account/ranking-badge-detail-time.png",
    name: "همیشگی",
  },
};

export function IndependentConsultantBadgeDetailsPage({ badgeKey }: { badgeKey: BadgeKey }) {
  const badgesQuery = useMyBadgesQuery();
  const definition = badgeDefinitions[badgeKey];
  const badge = (badgesQuery.data ?? []).find(
    (item) => typeof item.slug === "string" && item.slug.trim().toLowerCase() === badgeKey,
  );
  const badgeName =
    typeof badge?.name === "string" && badge.name.trim()
      ? badge.name.trim()
      : definition.name;
  const badgeImage =
    typeof badge?.image === "string" && badge.image.trim()
      ? badge.image
      : typeof badge?.logo === "string" && badge.logo.trim()
        ? badge.logo
        : definition.image;
  const progress = badgeProgressNumber(badge?.progress);
  const metricValue =
    progress === null
      ? "—"
      : `${formatBadgeProgressNumber(Math.max(0, Math.min(100, progress)))}٪`;
  const levels = readBadgeProgressLevels(badge);
  const starCount = readBadgeLevelCount(badge);

  return (
    <PageFrame
      className="flex min-h-0 flex-col overflow-hidden bg-white text-[#1a1a1a] [direction:rtl]"
      variant="flush"
    >
      <TopBar backTo="/account/ranking" className="[&_a]:text-[#1a1a1a]" title="جزییات نشان" />

      <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden bg-white px-6 pt-6">
        <div className="mx-auto flex w-[152px] flex-col items-center">
          <img alt="" className="h-[120px] w-[120px] object-contain" src={badgeImage} />
          <Typography as="span" variant="label" size="medium" weight="semibold" className="mt-2 inline-flex h-7 items-center justify-center rounded-lg bg-[#0048c41f] px-3 text-sm font-semibold leading-5 text-[#0048c4]">
            {badgeName}
          </Typography>
          <div className="mt-2 flex h-6 items-center justify-center">
            {[0, 1, 2].map((star) => (
              <DetailStarIcon
                className={`h-6 w-6 ${star < starCount ? "text-[#ffb100]" : "text-[#d8d8d8]"}`}
                key={star}
              />
            ))}
          </div>
        </div>

        <Typography as="p" variant="body" size="large" weight="regular" className="mt-4 flex h-7 items-center justify-center gap-2 text-base leading-6 [direction:rtl]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#4d4d4d]">پیشرفت نشان:</Typography>
          <strong className="font-semibold text-[#1a1a1a]">{metricValue}</strong>
        </Typography>

        {badgesQuery.isLoading ? (
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 py-8 text-center text-[#808080]">
            در حال دریافت جزئیات نشان...
          </Typography>
        ) : levels.length > 0 ? (
          <div className="mt-4 space-y-4">
            {levels.map((level) => (
              <BadgeLevelCard key={level.title} {...level} />
            ))}
          </div>
        ) : (
          <Typography as="p" variant="body" size="small" weight="regular" className="m-0 mt-6 rounded-2xl border border-[#f0f0f0] px-4 py-6 text-center text-[#808080]">
            جزئیات پیشرفت این نشان از سرور دریافت نشده است.
          </Typography>
        )}
      </main>
    </PageFrame>
  );
}

function BadgeLevelCard({
  done,
  total,
  progress,
  title,
  variant,
}: BadgeProgressLevel) {
  const progressClassName =
    variant === "complete"
      ? "bg-[#11a366]"
      : variant === "current"
        ? "bg-[#ffb100]"
        : "bg-[#a6a6a6]";
  const trackClassName =
    variant === "complete"
      ? "bg-[#11a36629]"
      : variant === "current"
        ? "bg-[#ff8d0029]"
        : "bg-[#e5e5e5]";
  const amountClassName =
    variant === "complete"
      ? "text-[#11a366]"
      : variant === "locked"
        ? "text-[#a6a6a6]"
        : "text-[#4d4d4d]";

  return (
    <section className="h-[72px] rounded-2xl border border-[#f0f0f0] bg-[#f5f5f5] px-4 py-4">
      <div className="flex h-5 items-center justify-between text-sm font-medium leading-5 [direction:ltr]">
        <Typography as="span" variant="body" size="medium" weight="regular" className={`flex items-center gap-1 ${amountClassName}`}>
          {done}
          {total ? (
            <>
              <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#808080]">/</Typography>
              <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#808080]">{total}</Typography>
            </>
          ) : null}
        </Typography>
        <Typography as="span" variant="body" size="medium" weight="regular" className="text-[#4d4d4d] [direction:rtl]">{title}</Typography>
      </div>
      <div className={`mt-4 h-1 w-full rounded-full ${trackClassName}`}>
        <div className={`h-1 rounded-full ${progressClassName}`} style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}

function DetailStarIcon({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="m12 2.6 2.9 5.86 6.47.94-4.68 4.56 1.11 6.44L12 17.35 6.2 20.4l1.11-6.44L2.63 9.4l6.47-.94L12 2.6Z" />
    </svg>
  );
}
