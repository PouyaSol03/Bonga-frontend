import type { ReactNode } from "react";
import { Link } from "react-router";
import { Typography } from "../../../../shared/ui/Typography";
import { GuidePill } from "./GuidePill";

export function LevelSummaryCard({
  image,
  levelTitle,
  score,
}: {
  image: string;
  levelTitle: string;
  score: string;
}) {
  return (
    <Link
      aria-label="سطح پیشرفت مشاور"
      className="bg-surface-container-lowest text-on-surface flex h-20 items-center justify-between rounded-2xl px-4 no-underline [direction:ltr]"
      to="/account/ranking/levels"
    >
      <div className="h-12 w-[232px]">
        <div className="flex h-6 items-center justify-between [direction:ltr]">
          <GuidePill />
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-on-surface-var text-sm font-medium [direction:rtl]"
          >
            {levelTitle}
          </Typography>
        </div>
        <div className="mt-2 flex h-4 items-center justify-end gap-1 text-xs [direction:ltr]">
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline [direction:rtl]"
          >
            امتیاز فعلی
          </Typography>
          <Typography
            as="span"
            variant="label"
            size="small"
            weight="medium"
            className="text-primary font-medium [direction:rtl]"
          >
            {score}
          </Typography>
        </div>
      </div>
      <img alt={levelTitle} className="h-12 w-12 shrink-0 object-contain" src={image} />
    </Link>
  );
}

export function MetricSummaryCard({
  icon,
  iconClassName,
  label,
  value,
}: {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
}) {
  return (
    <section
      className="bg-surface-container-lowest flex h-20 items-center justify-end gap-x-4 rounded-2xl px-4 [direction:ltr]"
      aria-label={label}
    >
      <div className="h-12 w-[232px] flex-1">
        <div className="flex h-6 items-center justify-between [direction:ltr]">
          <Typography variant="title" size="medium" weight="semibold" className="text-on-surface">
            {value}
          </Typography>
          <Typography
            as="span"
            variant="label"
            size="medium"
            weight="medium"
            className="text-on-surface-var text-sm font-medium [direction:rtl]"
          >
            {label}
          </Typography>
        </div>
        <div className="mt-2 flex h-4 items-center justify-end [direction:ltr]">
          <Typography
            as="span"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline [direction:rtl]"
          >
            اطلاعات مقایسه‌ای از سرور دریافت نشده است
          </Typography>
        </div>
      </div>
      <Typography
        as="span"
        variant="body"
        size="medium"
        weight="regular"
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconClassName}`}
      >
        {icon}
      </Typography>
    </section>
  );
}
