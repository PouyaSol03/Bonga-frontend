import { readText } from "../../../shared/lib/textUtils";
import { Typography } from "../../../shared/ui/Typography";
import type { AdCardData } from "../../advertisements/components/AdCard";
import "../../advertisements/components/AdCard.css";

export function StateAdSummary({ ad, card }: { ad?: Record<string, unknown>; card: AdCardData }) {
  const subtitle =
    readText(
      ad?.category ??
        ad?.category_title ??
        ad?.categoryTitle ??
        ad?.category_name ??
        ad?.categoryName,
    ) || "—";

  return (
    <div className="border-surface-container-high bg-surface-container-low mt-4 flex h-[80px] items-center gap-3 rounded-2xl border px-4 [direction:rtl]">
      <div
        aria-hidden="true"
        className={`ad-card__image ${card.imageClassName} h-[52px] w-[70px] shrink-0 rounded-lg bg-cover bg-center`}
        style={
          card.imageUrl
            ? { backgroundImage: `url(${card.imageUrl})` }
            : { backgroundColor: "#E0E0E0" }
        }
      />

      <div className="min-w-0 flex-1 text-right">
        <Typography
          as="p"
          variant="body"
          size="small"
          weight="regular"
          className="text-on-surface-var m-0 truncate text-xs leading-5 font-normal"
        >
          {subtitle}
        </Typography>
        <Typography
          as="h2"
          variant="title"
          size="small"
          weight="medium"
          className="text-on-surface m-0 mt-1 truncate text-sm leading-5 font-semibold"
        >
          {card.title}
        </Typography>
      </div>
    </div>
  );
}
