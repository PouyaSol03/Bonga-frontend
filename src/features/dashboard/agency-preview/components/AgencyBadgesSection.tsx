import LinearStar from "../../../../shared/icons/LinearStar";
import { Typography } from "../../../../shared/ui/Typography";
import type { BadgeDetailItem } from "../../components/BadgeDetailBottomSheet";
import { BADGE_IMAGES } from "../../ranking/AgencyBadgesPanel";

interface AgencyBadgesSectionProps {
  badges?: Array<{
    current_value?: number;
    earned?: boolean;
    level?: number;
    next_target?: number;
    progress?: number;
    slug?: string;
    thresholds?: number[];
    title?: string;
  }>;
  onBadgeClick?: (badge: BadgeDetailItem) => void;
}

export function AgencyBadgesSection({ badges, onBadgeClick }: AgencyBadgesSectionProps) {
  return (
    <section className="bg-surface-container-lowest px-4 py-4">
      <Typography
        as="h3"
        variant="title"
        size="medium"
        weight="semibold"
        className="m-0 text-right"
      >
        نشان‌ها
      </Typography>
      {badges && badges.length > 0 ? (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {badges.map((b, idx) => {
            const slug = (b.slug ?? "").trim().toLowerCase();
            const badgeImage =
              BADGE_IMAGES[slug] ||
              BADGE_IMAGES[slug.replace(/_/g, "-")] ||
              "/vectors/badges/badge-cup.webp";
            return (
              <button
                key={b.slug ?? idx}
                onClick={() => onBadgeClick?.(b)}
                type="button"
                className={`border-outline-var bg-surface-container-lowest flex flex-col items-center rounded-xl border p-3 text-center transition active:scale-[0.98] ${
                  !b.earned ? "opacity-60 grayscale" : ""
                }`}
              >
                <div className="grid h-12 w-12 place-items-center">
                  <img
                    alt={b.title || "نشان"}
                    className="h-10 w-10 object-contain"
                    src={badgeImage}
                  />
                </div>
                <Typography
                  as="span"
                  variant="label"
                  size="small"
                  weight="medium"
                  className="text-on-surface mt-1 truncate text-xs font-medium"
                >
                  {b.title || "نشان"}
                </Typography>
                <div className="mt-1 flex h-3 items-center justify-center [direction:ltr]">
                  {[0, 1, 2].map((star) => (
                    <LinearStar
                      className={`h-2.5 w-2.5 ${(b.level ?? 0) > star ? "text-warning" : "text-outline"}`}
                      innerColor="currentColor"
                      key={star}
                    />
                  ))}
                </div>
                <div className="bg-warning-container/30 mt-2 h-1 w-full rounded-full">
                  <div
                    className="bg-warning h-1 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, b.progress ?? 0))}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-outline m-0 mt-4 text-center"
        >
          اطلاعات نشان‌ها از سرور دریافت نشده است.
        </Typography>
      )}
    </section>
  );
}
