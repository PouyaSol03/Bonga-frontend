import { readText } from "../../../shared/lib/textUtils";
import { Typography } from "../../../shared/ui/Typography";
import type { AdCardData } from "../../advertisements/components/AdCard";
import "../../advertisements/components/AdCard.css";

export function ManagerAdSummary({ ad, card }: { ad?: Record<string, unknown>; card: AdCardData }) {
  const subtitle =
    readText(
      ad?.category ??
        ad?.category_title ??
        ad?.categoryTitle ??
        ad?.category_name ??
        ad?.categoryName,
    ) || "—";

  return (
    <div className="bg-surface mt-4 flex h-[68px] items-center rounded-2xl px-3 shadow-[0_2px_8px_rgba(26,26,26,0.04)] [direction:ltr]">
      <div className="min-w-0 flex-1 text-right [direction:rtl]">
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var m-0 truncate text-xs leading-4 font-normal"
        >
          {subtitle}
        </Typography>
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="medium"
          className="text-on-surface m-0 mt-1 truncate text-sm leading-5 font-medium"
        >
          {card.title}
        </Typography>
      </div>
      <div
        aria-hidden="true"
        className={`ad-card__image ${card.imageClassName} h-[52px] w-[78px] shrink-0 rounded-lg bg-cover bg-center`}
        style={card.imageUrl ? { backgroundImage: `url(${card.imageUrl})` } : undefined}
      />
    </div>
  );
}
