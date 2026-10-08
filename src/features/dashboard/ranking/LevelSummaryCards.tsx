import type { ReactNode } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { GuidePill } from "./RankingSharedComponents";

const DASHBOARD_LEVELS_GUIDE_PATH = "/account/dashboard/ranking/levels/guide";

interface LevelSummaryCardProps {
  image: string;
  levelTitle: string;
  score: string;
}

export function LevelSummaryCard({ image, levelTitle, score }: LevelSummaryCardProps) {
  return (
    <section
      aria-label="سطح پیشرفت آژانس"
      className="flex min-h-22 items-center justify-between gap-3 rounded-2xl bg-surface-container-lowest px-4 py-4 [direction:ltr]"
    >
      <div className="min-w-0 flex-1">
        <div className="flex h-6 items-center justify-between gap-2 [direction:ltr]">
          <GuidePill ariaLabel="راهنمای سطح پیشرفت آژانس" to={DASHBOARD_LEVELS_GUIDE_PATH} />
          <Typography as="span" variant="label" size="medium" weight="semibold" className="truncate text-right text-sm font-semibold leading-5 text-on-surface-var [direction:rtl]">
            {levelTitle}
          </Typography>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-end gap-x-1 gap-y-1 text-xs leading-4 [direction:ltr]">
          <Typography as="span" variant="body" size="medium" weight="regular" className="text-outline [direction:rtl]">
            امتیاز فعلی
          </Typography>
          <Typography as="span" variant="label" size="medium" weight="semibold" className="font-semibold text-primary [direction:rtl]">
            {score}
          </Typography>
        </div>
      </div>
      <img alt="" className="h-14 w-14 shrink-0 object-contain" src={image} />
    </section>
  );
}

interface MetricSummaryCardProps {
  icon: ReactNode;
  iconClassName: string;
  label: string;
  value: string;
}

export function MetricSummaryCard({ icon, iconClassName, label, value }: MetricSummaryCardProps) {
  return (
    <section className="flex h-20 items-center justify-between gap-3 rounded-2xl bg-surface-container-lowest px-4 py-3 [direction:ltr]">
      <strong className="text-base font-semibold leading-6 text-on-surface [direction:rtl]">
        {value}
      </strong>
      <div className="flex min-w-0 items-center gap-2 [direction:ltr]">
        <Typography as="span" variant="label" size="medium" weight="semibold" className="truncate text-sm font-semibold leading-5 text-on-surface-var [direction:rtl]">
          {label}
        </Typography>
        <Typography as="span" variant="body" size="medium" weight="regular" className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${iconClassName}`}>
          {icon}
        </Typography>
      </div>
    </section>
  );
}
