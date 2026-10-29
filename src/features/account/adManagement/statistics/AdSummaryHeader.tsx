import { Typography } from "../../../../shared/ui/Typography";
import type { AdSummary } from "./types";

export function AdSummaryHeader({ summary }: { summary: AdSummary }) {
  return (
    <section className="bg-surface-container-lowest h-[104px] px-4 py-4" aria-label={summary.title}>
      <div className="flex h-[72px] items-center justify-between gap-4 [direction:ltr]">
        <div className="min-w-0 flex-1 text-right [direction:rtl]">
          <Typography
            as="h2"
            variant="title"
            size="small"
            weight="medium"
            className="text-on-surface m-0 truncate text-sm leading-5 font-medium"
          >
            {summary.title}
          </Typography>
          <Typography
            as="p"
            variant="body"
            size="small"
            weight="regular"
            className="text-outline m-0 mt-2 truncate text-xs leading-4 font-normal"
          >
            {summary.timeAndLocation || summary.category}
          </Typography>
        </div>
        <div
          aria-hidden="true"
          className={`ad-card__image ${summary.imageClassName} h-[72px] w-[108px] shrink-0 rounded-lg bg-cover bg-center`}
          style={summary.imageUrl ? { backgroundImage: `url(${summary.imageUrl})` } : undefined}
        />
      </div>
    </section>
  );
}
