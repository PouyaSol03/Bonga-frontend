import { Typography } from "../../../../../shared/ui/Typography";
import type { ConsultantAd } from "../../adManagementData";

export function CompactAdSummary({ ad }: { ad: ConsultantAd }) {
  return (
    <section
      aria-label={ad.title}
      className="border-outline-var bg-surface-container-low mt-4 flex h-[68px] items-center justify-between gap-2 rounded-2xl border px-3 py-2 shadow-[0_2px_8px_rgba(26,26,26,0.04)] [direction:ltr]"
    >
      <div className="min-w-0 flex-1 text-right [direction:rtl]">
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var m-0 text-xs leading-4 font-normal"
        >
          فروش مسکونی / فروش آپارتمان
        </Typography>
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="semibold"
          className="text-on-surface m-0 mt-1 truncate text-sm leading-5 font-semibold"
        >
          {ad.title}
        </Typography>
      </div>
      <div
        aria-hidden="true"
        className={`ad-card__image ${ad.imageClassName} h-[52px] w-[78px] shrink-0 rounded-lg bg-cover bg-center`}
        style={ad.imageUrl ? { backgroundImage: `url(${ad.imageUrl})` } : undefined}
      />
    </section>
  );
}

export function ActionDivider() {
  return <div className="bg-outline-var h-px" aria-hidden="true" />;
}
