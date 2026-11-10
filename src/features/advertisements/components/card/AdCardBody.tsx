import { Typography } from "../../../../shared/ui/Typography";
import type { AdCardData } from "./types";
import { resolveAdCategory } from "./category";
import { truncateAdCardText } from "./text";
import { AdCardPriceRow } from "./AdCardPriceRow";
import { PropertyRow } from "./PropertyRow";

export function AdCardBody({
  ad,
  className = "",
  hasSecondaryPrice,
  showBadges,
}: {
  ad: AdCardData;
  className?: string;
  hasSecondaryPrice: boolean;
  showBadges: boolean;
}) {
  const category = resolveAdCategory(ad);

  return (
    <div className={`flex flex-col pt-3 ${className}`}>
      <AdCardPriceRow ad={ad} hasSecondaryPrice={hasSecondaryPrice} category={category} />

      <PropertyRow className="mt-3 h-5 gap-[22px] text-sm" ad={ad} />

      <Typography
        as="p"
        variant="body"
        size="medium"
        weight="medium"
        className="text-on-surface mt-3"
      >
        {truncateAdCardText(ad.title)}
      </Typography>

      <div className="mt-2 flex items-center justify-start gap-2">
        {showBadges && Array.isArray(ad.badges)
          ? ad.badges.map((badge) => (
              <Typography
                as="span"
                variant="body"
                size="small"
                weight="medium"
                className={`rounded-lg border px-2 py-1 whitespace-nowrap ${badge === "فوری" || badge === "ویژه" ? "border-on-warning-container bg-warning-container text-on-warning-container" : "border-tertiary bg-tertiary-container text-tertiary"}`}
                key={badge}
              >
                {badge}
              </Typography>
            ))
          : null}
        {showBadges && Array.isArray(ad.badges) && ad.badges.length > 0 ? (
          <Typography
            as="span"
            variant="body"
            size="medium"
            weight="regular"
            className="bg-outline-var h-4 w-px"
            aria-hidden="true"
          />
        ) : null}
        <Typography
          as="span"
          variant="body"
          size="medium"
          weight="regular"
          className="text-outline"
        >
          {ad.timeAndLocation}
        </Typography>
      </div>
    </div>
  );
}
